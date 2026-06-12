document.addEventListener('DOMContentLoaded', () => {

  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item[data-section]');

  function highlightNav() {
    const scrollMid = window.scrollY + window.innerHeight * 0.4;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollMid >= top && scrollMid < top + height) {
        navItems.forEach((item) => {
          item.classList.toggle('active', item.dataset.section === id);
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  navItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(item.dataset.section);
      if (target) target.scrollIntoView({ behavior: 'smooth' });

      const navLinks = document.getElementById('nav-links');
      const navToggle = document.getElementById('nav-toggle');
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });

  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
  }

  document.querySelectorAll('a[href="#projects"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  const footerYear = document.getElementById('footer-year');
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  const catPupils = document.querySelectorAll('.cat-pupil');
  const catContainer = document.getElementById('cute-cat-container');
  const catHeart = document.getElementById('cat-heart');
  const catClickCount = document.getElementById('cat-click-count');

  if (catContainer && catPupils.length > 0) {
    let currentCount = 0;
    const counter = new Counter({ workspace: 'aiswarya-jayachandrans-team' });

    if (catClickCount) {
      counter.get('cat-clicks')
        .then(result => {
          currentCount = result.value || 0;
          catClickCount.innerText = currentCount;
        })
        .catch(err => console.error('Error fetching count:', err));
    }

    document.addEventListener('mousemove', (e) => {
      const catRect = catContainer.getBoundingClientRect();
      const catX = catRect.left + catRect.width / 2;
      const catY = catRect.top + catRect.height / 2;

      const deltaX = e.clientX - catX;
      const deltaY = e.clientY - catY;
      const angle = Math.atan2(deltaY, deltaX);

      const maxDistance = 4;
      const distance = Math.min(Math.hypot(deltaX, deltaY) / 50, maxDistance);

      const moveX = Math.cos(angle) * distance;
      const moveY = Math.sin(angle) * distance;

      catPupils.forEach(pupil => {
        pupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    });

    catContainer.addEventListener('click', () => {
      if (catContainer.classList.contains('clicked')) return;

      currentCount++;
      if (catClickCount) {
        catClickCount.innerText = currentCount;
      }

      catContainer.classList.add('clicked');
      catHeart.classList.remove('show');
      void catHeart.offsetWidth;
      catHeart.classList.add('show');

      if (catClickCount) {
        counter.up('cat-clicks')
          .then(result => {
            if (result && result.value !== undefined) {
              currentCount = result.value;
              catClickCount.innerText = currentCount;
            }
          })
          .catch(err => console.error('Error updating count:', err));
      }

      setTimeout(() => {
        catContainer.classList.remove('clicked');
      }, 400);
    });
  }

});

// --- COLOR CHANGING BACKGROUND ---
var c = document.getElementById("c");
if (c) {
  var ctx = c.getContext("2d");
  var cH;
  var cW;
  var bgColor = "#07101f";
  var animations = [];
  var circles = [];

  var colorPicker = (function () {
    var colors = ["#07101f", "#17175d", "#14328c", "#252438"];
    var index = 0;
    function next() {
      index = index++ < colors.length - 1 ? index : 0;
      return colors[index];
    }
    function current() {
      return colors[index]
    }
    return {
      next: next,
      current: current
    }
  })();

  function removeAnimation(animation) {
    var index = animations.indexOf(animation);
    if (index > -1) animations.splice(index, 1);
  }

  function calcPageFillRadius(x, y) {
    var l = Math.max(x - 0, cW - x);
    var h = Math.max(y - 0, cH - y);
    return Math.sqrt(Math.pow(l, 2) + Math.pow(h, 2));
  }

  function addClickListeners() {
    document.addEventListener("touchstart", handleEvent);
    document.addEventListener("mousedown", handleEvent);
  };

  function handleEvent(e) {
    if (e.target.closest('#cute-cat-container')) {
      return;
    }

    if (e.touches) {
      e = e.touches[0];
    }
    var currentColor = colorPicker.current();
    var nextColor = colorPicker.next();

    var x = e.clientX;
    var y = e.clientY;
    var targetR = calcPageFillRadius(x, y);
    var rippleSize = Math.min(200, (cW * .4));
    var minCoverDuration = 750;

    var pageFill = new Circle({
      x: x,
      y: y,
      r: 0,
      fill: nextColor
    });
    var fillAnimation = anime({
      targets: pageFill,
      r: targetR,
      duration: Math.max(targetR / 2, minCoverDuration),
      easing: "easeOutQuart",
      complete: function () {
        bgColor = pageFill.fill;
        removeAnimation(fillAnimation);
      }
    });

    var ripple = new Circle({
      x: x,
      y: y,
      r: 0,
      fill: currentColor,
      stroke: {
        width: 3,
        color: currentColor
      },
      opacity: 1
    });
    var rippleAnimation = anime({
      targets: ripple,
      r: rippleSize,
      opacity: 0,
      easing: "easeOutExpo",
      duration: 900,
      complete: removeAnimation
    });

    var particles = [];
    for (var i = 0; i < 32; i++) {
      var particle = new Circle({
        x: x,
        y: y,
        fill: currentColor,
        r: anime.random(24, 48)
      })
      particles.push(particle);
    }
    var particlesAnimation = anime({
      targets: particles,
      x: function (particle) {
        return particle.x + anime.random(rippleSize, -rippleSize);
      },
      y: function (particle) {
        return particle.y + anime.random(rippleSize * 1.15, -rippleSize * 1.15);
      },
      r: 0,
      easing: "easeOutExpo",
      duration: anime.random(1000, 1300),
      complete: removeAnimation
    });
    animations.push(fillAnimation, rippleAnimation, particlesAnimation);
  }

  function extend(a, b) {
    for (var key in b) {
      if (b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }
    return a;
  }

  var Circle = function (opts) {
    extend(this, opts);
  }

  Circle.prototype.draw = function () {
    ctx.globalAlpha = this.opacity || 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    if (this.stroke) {
      ctx.strokeStyle = this.stroke.color;
      ctx.lineWidth = this.stroke.width;
      ctx.stroke();
    }
    if (this.fill) {
      ctx.fillStyle = this.fill;
      ctx.fill();
    }
    ctx.closePath();
    ctx.globalAlpha = 1;
  }

  var animate = anime({
    duration: Infinity,
    update: function () {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, cW, cH);
      animations.forEach(function (anim) {
        anim.animatables.forEach(function (animatable) {
          animatable.target.draw();
        });
      });
    }
  });

  var resizeCanvas = function () {
    cW = window.innerWidth;
    cH = window.innerHeight;
    c.width = cW * devicePixelRatio;
    c.height = cH * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
  };

  (function init() {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    addClickListeners();
  })();
}
