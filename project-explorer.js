// Project details and quick navigation use the existing, translated page content.
(() => {
  const $ = selector => document.querySelector(selector);
  const english = () => document.documentElement.lang === 'en';
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const cards = [...document.querySelectorAll('.proj-card')];
  const preview = $('#project-preview');
  const quickNav = $('#quick-nav');
  const search = $('#quick-nav-search');
  const results = $('#quick-nav-results');
  const launcher = $('#quick-nav-open');
  let currentCard, gallery = [], returnTo;

  const syncScrollLock = () => document.body.classList.toggle('preview-open', preview.open || quickNav.open);
  [preview, quickNav].forEach(dialog => {
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    dialog.addEventListener('close', syncScrollLock);
  });

  const renderProject = () => {
    const source = currentCard.querySelector('.proj-preview img');
    const image = $('#preview-image');
    image.src = source.src;
    image.alt = source.alt;
    image.width = source.width;
    image.height = source.height;
    $('#preview-title').textContent = currentCard.querySelector('h3').textContent;
    $('#preview-description').textContent = currentCard.querySelector('p[data-i18n]').textContent;
    $('#preview-role').textContent = currentCard.querySelector('.project-role').textContent;
    const badge = currentCard.querySelector('.proj-badge');
    $('#preview-status').textContent = badge.textContent;
    $('#preview-status').className = badge.className;
    $('#preview-tags').replaceChildren(...[...currentCard.querySelectorAll('.proj-tags span')].map(tag => tag.cloneNode(true)));
    const link = currentCard.querySelector('.project-link');
    const visit = $('#preview-visit');
    visit.hidden = !link;
    if (link) {
      visit.href = link.href;
      visit.textContent = link.textContent;
    } else {
      visit.removeAttribute('href');
      visit.textContent = '';
    }
    const position = gallery.indexOf(currentCard) + 1;
    $('#preview-position').textContent = english() ? `Project ${position} of ${gallery.length}` : `Projet ${position} sur ${gallery.length}`;
    $('#preview-prev').disabled = $('#preview-next').disabled = gallery.length < 2;
  };

  const openProject = (card, source, all = false) => {
    gallery = all ? cards : cards.filter(item => !item.hidden);
    currentCard = card;
    returnTo = source;
    renderProject();
    preview.showModal();
    syncScrollLock();
  };
  const step = direction => {
    if (gallery.length < 2) return;
    currentCard = gallery[(gallery.indexOf(currentCard) + direction + gallery.length) % gallery.length];
    renderProject();
  };
  cards.forEach(card => {
    const button = card.querySelector('.proj-preview');
    button.addEventListener('click', () => openProject(card, button));
  });
  $('#preview-close').addEventListener('click', () => preview.close());
  $('#preview-prev').addEventListener('click', () => step(-1));
  $('#preview-next').addEventListener('click', () => step(1));
  preview.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      step(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  preview.addEventListener('close', () => {
    if (!quickNav.open && returnTo?.isConnected) returnTo.focus({ preventScroll: true });
  });
  // A swipe changes projects, while vertical gestures continue to scroll the dialog.
  let startTouch;
  $('.preview-visual').addEventListener('touchstart', event => {
    startTouch = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
  }, { passive: true });
  $('.preview-visual').addEventListener('touchend', event => {
    if (!startTouch) return;
    const dx = event.changedTouches[0].clientX - startTouch.x;
    const dy = event.changedTouches[0].clientY - startTouch.y;
    startTouch = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
  }, { passive: true });
  $('.preview-visual').addEventListener('touchcancel', () => { startTouch = null; }, { passive: true });

  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const goToSection = id => {
    const section = document.getElementById(id);
    const heading = section.querySelector('h1, h2');
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    section.scrollIntoView({ behavior: motion.matches ? 'instant' : 'smooth', block: 'start' });
  };
  const commands = () => [
    ...[...document.querySelectorAll('.nav-link[data-target]')].map(link => ({
      label: link.textContent.trim(), group: 'Section',
      keywords: link.dataset.target, run: () => goToSection(link.dataset.target)
    })),
    ...cards.map(card => ({
      label: card.querySelector('h3').textContent, group: english() ? 'Project' : 'Projet',
      keywords: `${card.querySelector('.proj-tags').textContent} ${card.querySelector('p[data-i18n]').textContent}`,
      run: () => openProject(card, launcher, true)
    })),
    {
      label: $('#theme-toggle').getAttribute('aria-label'), group: 'Action',
      keywords: 'theme thème nuit jour dark light', run: () => $('#theme-toggle').click()
    },
    {
      label: english() ? 'Passer en français' : 'Switch to English', group: 'Action',
      keywords: 'langue language anglais français english french',
      run: () => $(`.lang-toggle [data-lang="${english() ? 'fr' : 'en'}"]`).click()
    }
  ];
  const renderCommands = () => {
    const query = normalize(search.value);
    const matches = commands().filter(command => normalize(`${command.label} ${command.group} ${command.keywords}`).includes(query));
    results.replaceChildren(...matches.map(command => {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      const label = document.createElement('span');
      label.textContent = command.label;
      const group = document.createElement('span');
      group.className = 'command-kind';
      group.textContent = command.group;
      button.append(label, group);
      button.addEventListener('click', () => {
        quickNav.close();
        // Let the closing dialog restore focus before opening or focusing a destination.
        requestAnimationFrame(command.run);
      });
      item.append(button);
      return item;
    }));
    $('#quick-nav-empty').hidden = matches.length > 0;
    $('#quick-nav-count').textContent = `${matches.length} ${english() ? 'results' : 'résultats'}`;
  };
  const openQuickNav = () => {
    if (preview.open || quickNav.open) return;
    search.value = '';
    renderCommands();
    quickNav.showModal();
    syncScrollLock();
    search.focus();
  };
  launcher.hidden = false;
  const appleKeyboard = /Mac|iPhone|iPad/.test(navigator.platform);
  launcher.querySelector('kbd').textContent = appleKeyboard ? '⌘ K' : 'Ctrl K';
  launcher.setAttribute('aria-keyshortcuts', appleKeyboard ? 'Meta+K' : 'Control+K');
  launcher.addEventListener('click', openQuickNav);
  $('#quick-nav-close').addEventListener('click', () => quickNav.close());
  search.addEventListener('input', renderCommands);
  quickNav.addEventListener('keydown', event => {
    if (event.isComposing) return;
    const buttons = [...results.querySelectorAll('button')];
    const index = buttons.indexOf(document.activeElement);
    if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && buttons.length) {
      event.preventDefault();
      const next = index < 0 ? (event.key === 'ArrowDown' ? 0 : buttons.length - 1) : (index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next].focus();
    } else if (event.key === 'Enter' && event.target === search && buttons.length) {
      event.preventDefault();
      buttons[0].click();
    }
  });
  document.addEventListener('keydown', event => {
    if (event.isComposing || !(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'k') return;
    if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable="true"]') && !quickNav.open) return;
    event.preventDefault();
    if (quickNav.open) quickNav.close(); else openQuickNav();
  });
  const updateLabels = () => {
    cards.forEach(card => card.querySelector('.proj-preview').setAttribute('aria-label', `${english() ? 'Explore' : 'Explorer'} ${card.querySelector('h3').textContent}`));
    if (preview.open) renderProject();
    if (quickNav.open) renderCommands();
  };
  document.addEventListener('portfolio-language', updateLabels);
  updateLabels();
})();
