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

  const sections   = document.querySelectorAll('section[id]');
  const navItems   = document.querySelectorAll('.nav-item[data-section]');

  function highlightNav() {
    const scrollMid = window.scrollY + window.innerHeight * 0.4;
    sections.forEach((section) => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
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

      const navLinks  = document.getElementById('nav-links');
      const navToggle = document.getElementById('nav-toggle');
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });

  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');

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

  const catPupils = document.querySelectorAll('.cat-pupil');
  const catContainer = document.getElementById('cute-cat-container');
  const catHeart = document.getElementById('cat-heart');

  if (catContainer && catPupils.length > 0) {
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

      catContainer.classList.add('clicked');
      catHeart.classList.remove('show');
      // trigger reflow to restart animation
      void catHeart.offsetWidth;
      catHeart.classList.add('show');
      
      setTimeout(() => {
        catContainer.classList.remove('clicked');
      }, 400);
    });
  }

});
