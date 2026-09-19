// A brief signature animation, shown once per browser-tab session.
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches || document.visibilityState === 'hidden') return;

  try { if (sessionStorage.getItem('portfolio-intro-seen')) return; } catch {}

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return;
  const layer = document.createElement('div');
  layer.className = 'entrance-burst';
  canvas.setAttribute('aria-hidden', 'true');
  const title = document.createElement('span');
  title.className = 'entrance-monogram';
  title.textContent = 'ED';
  title.setAttribute('aria-hidden', 'true');
  const skip = document.createElement('button');
  skip.type = 'button';
  skip.className = 'entrance-skip';
  const translate = () => { skip.textContent = document.documentElement.lang === 'en' ? 'Skip animation' : 'Passer l’animation'; };
  translate();
  layer.append(canvas, title, skip);

  let frame = 0;
  let deadline = 0;
  let finished = false;
  const close = () => {
    if (finished) return;
    finished = true;
    const restoreFocus = document.activeElement === skip;
    cancelAnimationFrame(frame);
    clearTimeout(deadline);
    layer.remove();
    window.removeEventListener('resize', close);
    document.removeEventListener('visibilitychange', onVisibility);
    document.removeEventListener('keydown', onKey);
    document.removeEventListener('portfolio-language', translate);
    reducedMotion.removeEventListener('change', close);
    if (restoreFocus) document.querySelector('.hero .btn')?.focus({ preventScroll: true });
  };
  const onVisibility = () => { if (document.hidden) close(); };
  const onKey = event => { if (event.key === 'Escape') close(); };
  skip.addEventListener('click', close);
  window.addEventListener('resize', close, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  document.addEventListener('keydown', onKey);
  document.addEventListener('portfolio-language', translate);
  reducedMotion.addEventListener('change', close);

  const width = window.innerWidth;
  const height = window.innerHeight;
  const scale = Math.min(window.devicePixelRatio || 1, 1.5);
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  context.scale(scale, scale);
  const center = { x: width / 2, y: height * .43 };
  const reach = Math.min(width, height) * .4;
  const count = width < 600 ? 28 : 44;
  // Soft flame sprites are generated once, then reused for every frame.
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = 96;
  const brush = sprite.getContext('2d');
  if (!brush) { close(); return; }
  const glow = brush.createRadialGradient(48, 48, 0, 48, 48, 48);
  glow.addColorStop(0, '#f1eaff');
  glow.addColorStop(.18, '#d5c0ff');
  glow.addColorStop(.42, '#a985ff');
  glow.addColorStop(.7, '#8058c955');
  glow.addColorStop(1, '#50309a00');
  brush.fillStyle = glow;
  brush.fillRect(0, 0, 96, 96);
  const particles = Array.from({ length: count }, (_, i) => {
    const angle = i / count * Math.PI * 2 + Math.random() * .2;
    return { angle, speed: reach * (.45 + Math.random() * .65), size: 5 + Math.random() * 16, drift: Math.random() * 70, delay: Math.random() * .1 };
  });
  document.body.append(layer);
  try { sessionStorage.setItem('portfolio-intro-seen', '1'); } catch {}
  const start = performance.now();
  const draw = now => {
    if (finished) return;
    const time = (now - start) / 1000;
    if (time >= 1.3) { close(); return; }
    context.clearRect(0, 0, width, height);
    context.globalCompositeOperation = 'source-over';
    context.globalAlpha = Math.max(0, 1 - time / .85) * .8;
    const core = 100 + time * 180;
    context.drawImage(sprite, center.x - core / 2, center.y - core / 2, core, core);
    for (const particle of particles) {
      const age = time - particle.delay;
      if (age < 0) continue;
      const progress = 1 - Math.exp(-age * 2.3);
      const x = center.x + Math.cos(particle.angle) * particle.speed * progress;
      const y = center.y + Math.sin(particle.angle) * particle.speed * progress + age * age * particle.drift;
      const size = particle.size * (1 + age * .35);
      context.globalAlpha = Math.max(0, 1 - age / 1.15) * .9;
      context.drawImage(sprite, x - size / 2, y - size / 2, size, size);
    }
    context.globalAlpha = 1;
    frame = requestAnimationFrame(draw);
  };
  // Independent deadline also removes the overlay if animation frames pause.
  deadline = window.setTimeout(close, 1500);
  frame = requestAnimationFrame(draw);
})();
