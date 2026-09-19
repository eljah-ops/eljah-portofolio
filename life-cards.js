// Photo cards: swipe, tap either edge, or use the keyboard.
(() => {
  const deck = document.querySelector('.life-deck');
  if (!deck) return;
  const cards = [...deck.querySelectorAll('.life-card')];
  const dots = [...deck.querySelectorAll('[data-life-card]')];
  const status = deck.querySelector('.life-status');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const title = document.querySelector('#offscreen-title');
  const titleText = title.querySelector('[data-i18n]');
  let current = 0, busy = false, drag = null, suppressClick = false;
  let titleTimer, titleSeen = false, animation;

  const render = (announce = true) => {
    cards.forEach((card, index) => {
      const position = (index - current + cards.length) % cards.length;
      card.hidden = position > 2;
      card.style.setProperty('--position', position);
      card.style.removeProperty('transform');
      card.classList.toggle('is-current', position === 0);
      card.setAttribute('aria-hidden', String(position !== 0));
      card.inert = position !== 0;
      dots[index].setAttribute('aria-pressed', String(position === 0));
      dots[index].setAttribute('aria-label', card.querySelector('h3').textContent);
    });
    deck.querySelector('.life-dots').setAttribute('aria-label',
      document.documentElement.lang === 'en' ? 'Choose a card' : 'Choisir une carte');
    if (announce) status.textContent = `${cards[current].querySelector('h3').textContent} · ${current + 1} / ${cards.length}`;
  };

  const go = async (index, direction = 1) => {
    const next = (index + cards.length) % cards.length;
    if (busy || next === current) return;
    busy = true;
    const card = cards[current];
    if (!motion.matches && typeof card.animate === 'function') {
      const distance = Math.min(deck.clientWidth, 400) * -direction;
      animation = card.animate([
        { transform: getComputedStyle(card).transform, opacity: 1 },
        { transform: `translateX(${distance}px) rotate(${-20 * direction}deg)`, opacity: 0 }
      ], { duration: 240, easing: 'cubic-bezier(.4,0,.2,1)' });
      try { await animation.finished; } catch { /* Reduced motion can cancel the animation. */ }
      animation = null;
    }
    current = next;
    render();
    busy = false;
  };

  deck.querySelector('.life-prev').addEventListener('click', () => go(current - 1, -1));
  deck.querySelector('.life-next').addEventListener('click', () => go(current + 1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => go(index, index < current ? -1 : 1)));
  deck.addEventListener('keydown', event => {
    const destinations = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: cards.length - 1 };
    if (!(event.key in destinations)) return;
    event.preventDefault();
    go(destinations[event.key], event.key === 'ArrowLeft' || event.key === 'Home' ? -1 : 1);
  });
  deck.addEventListener('click', event => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    suppressClick = false;
  }, true);
  deck.addEventListener('pointerdown', event => {
    if (busy || !event.isPrimary || event.button !== 0 || event.target.closest('.life-dots')) return;
    suppressClick = false;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, horizontal: false };
  });
  deck.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    if (!drag.horizontal) {
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { drag = null; return; }
      if (Math.abs(dx) < 10) return;
      drag.horizontal = true;
      deck.setPointerCapture(event.pointerId);
      deck.classList.add('is-dragging');
    }
    drag.dx = dx;
    if (!motion.matches) cards[current].style.transform = `translateX(${dx * .8}px) rotate(${dx / 24}deg)`;
  });
  const endDrag = (event, cancelled = false) => {
    if (!drag || drag.id !== event.pointerId) return;
    const { dx, horizontal } = drag;
    drag = null;
    deck.classList.remove('is-dragging');
    if (deck.hasPointerCapture(event.pointerId)) deck.releasePointerCapture(event.pointerId);
    suppressClick = horizontal;
    if (!cancelled && Math.abs(dx) > Math.min(100, deck.clientWidth * .22)) {
      go(current + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    } else cards[current].style.removeProperty('transform');
  };
  deck.addEventListener('pointerup', event => endDrag(event));
  deck.addEventListener('pointercancel', event => endDrag(event, true));
  deck.addEventListener('lostpointercapture', event => endDrag(event, true));
  deck.addEventListener('pointerleave', event => { if (drag && !drag.horizontal) endDrag(event, true); });

  const typeTitle = () => {
    clearInterval(titleTimer);
    const fullText = document.documentElement.lang === 'en' ? 'Life outside the terminal' : 'La vie hors du terminal';
    title.setAttribute('aria-label', fullText);
    titleText.setAttribute('aria-hidden', 'true');
    titleText.textContent = fullText;
    title.style.removeProperty('width');
    title.style.removeProperty('min-height');
    if (!titleSeen || motion.matches) return;
    // Keep the final line breaks and height while the visible text is typed.
    const bounds = title.getBoundingClientRect();
    title.style.width = `${bounds.width}px`;
    title.style.minHeight = `${bounds.height}px`;
    let length = 0;
    titleText.textContent = '';
    titleTimer = setInterval(() => {
      titleText.textContent = fullText.slice(0, ++length);
      if (length >= fullText.length) {
        clearInterval(titleTimer);
        title.style.removeProperty('width');
        title.style.removeProperty('min-height');
      }
    }, 50);
  };
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      titleSeen = true;
      typeTitle();
      observer.disconnect();
    }, { threshold: .5 });
    observer.observe(title);
  }
  motion.addEventListener('change', () => {
    if (motion.matches) animation?.cancel();
    typeTitle();
  });
  document.addEventListener('portfolio-language', () => { render(); typeTitle(); });
  render(false);
  deck.classList.add('is-ready');
})();
