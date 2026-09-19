// Reference-inspired stories, project filters and clipboard enhancement.
(() => {
  const english = () => document.documentElement.lang === 'en';
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const frame = document.querySelector('.story-frame');
  const slides = [...document.querySelectorAll('.story-slide')];
  const thumbs = [...document.querySelectorAll('[data-slide]')];
  const bars = [...document.querySelectorAll('.story-progress span')];
  const pause = document.getElementById('story-pause');
  let current = 0, elapsed = 0, paused = motion.matches, timer, touchX;
  const updateLabels = () => {
    document.getElementById('story-prev').ariaLabel = english() ? 'Previous image' : 'Image précédente';
    document.getElementById('story-next').ariaLabel = english() ? 'Next image' : 'Image suivante';
    pause.ariaLabel = english() ? (paused ? 'Play slideshow' : 'Pause slideshow') : (paused ? 'Lire le carrousel' : 'Mettre en pause');
    pause.textContent = paused ? '▷' : 'Ⅱ';
    frame.ariaLabel = english() ? 'Portrait and projects' : 'Portrait et projets';
    document.querySelector('.story-thumbs').ariaLabel = english() ? 'Choose an image' : 'Choisir une image';
    document.querySelector('.project-filters').ariaLabel = english() ? 'Filter projects' : 'Filtrer les projets';
  };
  const progress = () => bars.forEach((bar, i) => bar.style.setProperty('--progress', `${i < current ? 100 : i === current ? elapsed / 80 : 0}%`));
  const show = index => {
    current = (index + slides.length) % slides.length;
    elapsed = 0;
    slides.forEach((slide, i) => { slide.hidden = i !== current; });
    thumbs.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === current);
      thumb.setAttribute('aria-pressed', String(i === current));
    });
    progress();
  };
  const manual = index => { paused = true; show(index); updateLabels(); };
  thumbs.forEach(button => button.addEventListener('click', () => manual(Number(button.dataset.slide))));
  document.getElementById('story-prev').addEventListener('click', () => manual(current - 1));
  document.getElementById('story-next').addEventListener('click', () => manual(current + 1));
  pause.addEventListener('click', () => { paused = !paused; updateLabels(); });
  frame.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault(); manual(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  frame.addEventListener('touchstart', event => { touchX = event.changedTouches[0].clientX; }, { passive: true });
  frame.addEventListener('touchend', event => {
    const dx = event.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 45) manual(current + (dx < 0 ? 1 : -1));
  }, { passive: true });
  motion.addEventListener('change', () => { if (motion.matches) paused = true; updateLabels(); });
  const start = () => {
    clearInterval(timer);
    timer = setInterval(() => {
      if (paused || document.hidden || frame.matches(':hover') || frame.contains(document.activeElement)) return;
      elapsed += 100;
      if (elapsed >= 8000) show(current + 1);
      progress();
    }, 100);
  };
  window.addEventListener('pagehide', () => clearInterval(timer));
  window.addEventListener('pageshow', start);
  show(0); updateLabels(); start();

  const cards = [...document.querySelectorAll('.proj-card')];
  let selectedFilter = 'all';
  const count = () => {
    const total = cards.filter(card => !card.hidden).length;
    document.getElementById('project-count').textContent = english() ? `${total} projects` : `${total} projets`;
  };
  const filter = value => {
    selectedFilter = value;
    cards.forEach(card => { card.hidden = value !== 'all' && card.dataset.category !== value; });
    document.querySelectorAll('[data-filter]').forEach(button => {
      const active = button.dataset.filter === value;
      button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active));
    });
    count();
  };
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => filter(button.dataset.filter)));
  filter(selectedFilter);
  document.querySelectorAll('.copy-email').forEach(button => {
    let reset;
    button.setAttribute('aria-live', 'polite');
    button.addEventListener('click', async () => {
      clearTimeout(reset);
      try {
        await navigator.clipboard.writeText('dialloelijahismael@gmail.com');
        button.textContent = english() ? 'Copied ✓' : 'Copié ✓';
      } catch {
        const selection = getSelection();
        const range = document.createRange();
        range.selectNodeContents(button.previousElementSibling);
        selection.removeAllRanges(); selection.addRange(range);
        button.textContent = english() ? 'Select and copy' : 'Sélectionner et copier';
      }
      reset = setTimeout(() => { button.textContent = english() ? 'Copy' : 'Copier'; }, 2500);
    });
  });
  document.addEventListener('portfolio-language', () => { updateLabels(); count(); });
})();
