// Progressive enhancement: content remains visible without JavaScript.
(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const targets = document.querySelectorAll('.proj-card, .sf-card, .cert-row, .hero-grid > div');
  const active = new Set();
  const reveal = entry => {
    if (motion.matches || typeof entry.animate !== 'function') return;
    const animation = entry.animate([
      { opacity: .3, transform: 'translateY(20px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 600, easing: 'cubic-bezier(.22,1,.36,1)' });
    active.add(animation);
    animation.onfinish = () => active.delete(animation);
  };
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      reveal(entry.target);
      observer.unobserve(entry.target);
    }), { threshold: .12 });
    targets.forEach(target => observer.observe(target));
  }
  document.querySelectorAll('.proj-card, .sf-card').forEach(card => {
    let frame = 0;
    const reset = () => {
      cancelAnimationFrame(frame); frame = 0;
      card.classList.remove('pointer-active');
      ['--spot-x', '--spot-y', '--tilt-x', '--tilt-y'].forEach(key => card.style.removeProperty(key));
    };
    card.addEventListener('pointermove', event => {
      if (motion.matches || !pointer.matches || event.pointerType === 'touch') return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        card.style.setProperty('--spot-x', `${x * 100}%`);
        card.style.setProperty('--spot-y', `${y * 100}%`);
        card.style.setProperty('--tilt-x', `${(0.5 - y) * 3}deg`);
        card.style.setProperty('--tilt-y', `${(x - 0.5) * 3}deg`);
        card.classList.add('pointer-active');
        frame = 0;
      });
    });
    card.addEventListener('pointerleave', reset);
    card.addEventListener('pointercancel', reset);
    motion.addEventListener('change', reset);
    pointer.addEventListener('change', reset);
  });
  motion.addEventListener('change', () => {
    if (motion.matches) { active.forEach(animation => animation.cancel()); active.clear(); }
  });
})();
