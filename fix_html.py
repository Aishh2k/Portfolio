import re

with open('index.html', 'r') as f:
    content = f.read()

# We need to find the <div class="project-links">...</div> and move it.
# We can find each project item and do this.
projects = content.split('<!-- Project ')
for i in range(1, len(projects)):
    proj = projects[i]
    
    # Extract project-links block
    link_match = re.search(r'(\s*<div class="project-links">.*?</svg>\s*</a>\s*</div>)', proj, re.DOTALL)
    if link_match:
        link_block = link_match.group(1)
        # Remove from its original position
        proj = proj.replace(link_block, '', 1)
        
        # Insert before `<div class="project-column-media">` but wait, there's a closing `</div>` for `project-column-info` just before it.
        # Find `<div class="project-column-media">`
        # Insert the link_block before the `</div>` that precedes `<div class="project-column-media">`
        proj = re.sub(r'(\s*</div>\s*)(<div class="project-column-media">)', lambda m: link_block + m.group(1) + m.group(2), proj, count=1)
        
        projects[i] = proj

with open('index.html', 'w') as f:
    f.write('<!-- Project '.join(projects))

print("Fixed index.html")
