(() => {
  const mobile = window.matchMedia('(max-width: 900px)');
  const compactNavigation = window.matchMedia('(max-width: 1200px)');
  const header = document.querySelector('header');
  const container = header?.querySelector('.header-container');
  const nav = container?.querySelector('nav');
  if (header && container && nav) {
    nav.id ||= 'primary-navigation';
    const menu = document.createElement('button');
    menu.type = 'button';
    menu.className = 'mobile-menu-toggle';
    menu.setAttribute('aria-controls', nav.id);
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open menu');
    menu.innerHTML = '<span aria-hidden="true">☰</span><span>Menu</span>';
    container.insertBefore(menu, nav);

    const closeMenu = (focus = false) => {
      header.classList.remove('mobile-menu-open');
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Open menu');
      menu.firstElementChild.textContent = '☰';
      if (focus) menu.focus();
    };
    menu.addEventListener('click', () => {
      const open = !header.classList.contains('mobile-menu-open');
      header.classList.toggle('mobile-menu-open', open);
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.firstElementChild.textContent = open ? '×' : '☰';
    });
    nav.querySelectorAll('.dropdown').forEach((item, index) => {
      const link = item.querySelector(':scope > a');
      const panel = item.querySelector(':scope > .dropdown-content');
      if (!link || !panel) return;
      panel.id ||= `navigation-submenu-${index}`;
      const label = link.textContent.trim();
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'mobile-submenu-toggle';
      toggle.textContent = '⌄';
      toggle.setAttribute('aria-label', `${label} submenu`);
      toggle.setAttribute('aria-controls', panel.id);
      toggle.setAttribute('aria-expanded', 'false');
      item.insertBefore(toggle, panel);
      const toggleSubmenu = () => {
        const open = item.classList.toggle('mobile-submenu-open');
        toggle.setAttribute('aria-expanded', String(open));
        toggle.textContent = open ? '⌃' : '⌄';
      };
      toggle.addEventListener('click', toggleSubmenu);
      if (link.getAttribute('href') === '#') {
        link.addEventListener('click', event => {
          if (compactNavigation.matches) { event.preventDefault(); toggleSubmenu(); }
        });
      }
    });
    container.querySelectorAll('.nav-icons a, .nav-icons button').forEach(action => {
      const label = action.title || action.getAttribute('aria-label');
      if (!label) return;
      action.setAttribute('aria-label', label);
      const text = document.createElement('span');
      text.className = 'mobile-action-label';
      text.textContent = label === 'Toggle Theme' ? 'Theme' : label;
      action.append(text);
    });
    nav.addEventListener('click', event => {
      const link = event.target.closest('a');
      if (link && link.getAttribute('href') !== '#') closeMenu();
    });
    document.addEventListener('click', event => {
      if (compactNavigation.matches && !header.contains(event.target)) closeMenu();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && header.classList.contains('mobile-menu-open')) closeMenu(true);
    });
    compactNavigation.addEventListener('change', () => closeMenu());
    header.classList.add('mobile-nav-ready');
  }

  // Native controls support play/pause, mute, seeking and full screen on phones.
  document.querySelectorAll('.mobile-video-media').forEach(video => {
    const desktopControls = video.hasAttribute('controls');
    const update = () => { video.controls = mobile.matches || desktopControls; };
    update();
    mobile.addEventListener('change', update);
  });
})();
