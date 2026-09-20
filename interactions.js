// Progressive enhancement: content remains visible without JavaScript.
(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const targets = document.querySelectorAll('.proj-card, .sf-card, .cert-row, .hero-grid > div');
  const active = new Set();
  const certificates = document.getElementById('certifications');
  if (certificates) {
    const toggle = certificates.querySelector('summary');
    const panel = certificates.querySelector('.cert-panel');
    let hovering = false, pinned = false, closeTimer;
    certificates.querySelector('.cert-count').textContent = certificates.querySelectorAll('.cert-row').length;
    const setOpen = open => {
      certificates.open = open;
      toggle.setAttribute('aria-expanded', String(open));
    };
    const close = () => {
      clearTimeout(closeTimer);
      pinned = false;
      setOpen(false);
    };
    certificates.addEventListener('pointerenter', event => {
      if (!pointer.matches || event.pointerType === 'touch') return;
      clearTimeout(closeTimer);
      hovering = true;
      setOpen(true);
    });
    certificates.addEventListener('pointerleave', () => {
      hovering = false;
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => {
        if (!pinned && !panel.contains(document.activeElement)) close();
      }, 180);
    });
    toggle.addEventListener('click', event => {
      event.preventDefault();
      clearTimeout(closeTimer);
      pinned = !certificates.open;
      setOpen(pinned);
    });
    certificates.addEventListener('toggle', () => toggle.setAttribute('aria-expanded', String(certificates.open)));
    certificates.addEventListener('focusin', () => clearTimeout(closeTimer));
    certificates.addEventListener('focusout', () => {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => {
        if (!hovering && !certificates.contains(document.activeElement)) close();
      }, 0);
    });
    certificates.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || !certificates.open) return;
      event.preventDefault();
      close();
      toggle.focus({ preventScroll: true });
    });
    document.addEventListener('pointerdown', event => {
      if (!certificates.contains(event.target)) close();
    });
    pointer.addEventListener('change', () => {
      hovering = false;
      if (!pinned && !panel.contains(document.activeElement)) close();
    });
    setOpen(certificates.open);
  }
  const skillEmblem = document.querySelector('.sf-emblem-icon');
  if (skillEmblem && typeof skillEmblem.animate === 'function') {
    const tools = ['javascript', 'python', 'laravel', 'linux', 'figma', 'git'];
    let index = 0, timer, transition, visible = false;
    const animateEmblem = (frames, done) => {
      const animation = skillEmblem.animate(frames, { duration: 400, easing: 'ease-out', fill: 'forwards' });
      transition = animation;
      active.add(animation);
      animation.oncancel = () => {
        active.delete(animation);
        if (transition === animation) transition = null;
      };
      animation.onfinish = () => {
        if (transition !== animation) return;
        transition = null;
        active.delete(animation);
        animation.cancel();
        if (done) done();
      };
    };
    const cycle = () => {
      if (transition || !visible || document.hidden || motion.matches) return;
      animateEmblem([
        { opacity: 1, transform: 'rotateY(0deg) scale(1)' },
        { opacity: 0, transform: 'rotateY(90deg) scale(.8)' }
      ], () => {
        index = (index + 1) % tools.length;
        skillEmblem.dataset.tool = tools[index];
        animateEmblem([
          { opacity: 0, transform: 'rotateY(-90deg) scale(.8)' },
          { opacity: 1, transform: 'rotateY(0deg) scale(1)' }
        ]);
      });
    };
    const stop = () => {
      clearInterval(timer);
      if (transition) {
        transition.onfinish = null;
        transition.cancel();
      }
    };
    const sync = () => {
      stop();
      if (visible && !document.hidden && !motion.matches) timer = setInterval(cycle, 2000);
    };
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        visible = entries.some(entry => entry.isIntersecting);
        sync();
      }, { threshold: .1 });
      observer.observe(document.querySelector('.sf-section'));
    } else {
      visible = true;
      sync();
    }
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', sync);
    window.addEventListener('pagehide', stop);
    window.addEventListener('pageshow', sync);
  }
  let progressFrame = 0;
  const updateProgress = () => {
    const available = document.documentElement.scrollHeight - window.innerHeight;
    const progress = available > 0 ? Math.min(1, Math.max(0, window.scrollY / available)) : 0;
    document.documentElement.style.setProperty('--reading-progress', progress);
    progressFrame = 0;
  };
  const scheduleProgress = () => {
    if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
  };
  window.addEventListener('scroll', scheduleProgress, { passive: true });
  window.addEventListener('resize', scheduleProgress);
  if ('ResizeObserver' in window) new ResizeObserver(scheduleProgress).observe(document.body);
  updateProgress();
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

    // Observe the stationary frame so the rotating card cannot retrigger itself.
    const portrait = document.querySelector('.profile-portrait');
    const portraitCard = portrait?.querySelector('.profile-portrait-card');
    if (portraitCard) {
      let played = false, spin;
      const portraitObserver = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) {
          played = false;
          if (spin) {
            active.delete(spin);
            spin.cancel();
            spin = null;
          }
          return;
        }
        if (entry.intersectionRatio < .35 || played) return;
        played = true;
        if (motion.matches || typeof portraitCard.animate !== 'function') return;
        spin = portraitCard.animate([
          { transform: 'perspective(900px) rotateY(0deg)' },
          { transform: 'perspective(900px) rotateY(720deg)' }
        ], { duration: 2200, easing: 'cubic-bezier(.45,0,.2,1)' });
        const animation = spin;
        active.add(animation);
        const release = () => {
          active.delete(animation);
          if (spin === animation) spin = null;
        };
        animation.onfinish = release;
        animation.oncancel = release;
      }), { threshold: [0, .35], rootMargin: '-80px 0px -20px 0px' });
      portraitObserver.observe(portrait);
    }
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
