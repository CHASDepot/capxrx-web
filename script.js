/* CapXRx splash — interactions */
(() => {
  'use strict';
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Year */
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* Sticky nav state */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Count-up numbers */
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    if (prefersReduced) { el.textContent = target.toFixed(decimals) + suffix; return; }
    const dur = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(decimals) + suffix;
    };
    requestAnimationFrame(tick);
  };

  /* Gauge fill */
  const animateGauge = (path) => {
    const total = 252;
    const pct = 65;
    if (prefersReduced) { path.style.strokeDashoffset = total - (total * pct / 100); return; }
    path.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.2,.8,.2,1)';
    requestAnimationFrame(() => { path.style.strokeDashoffset = total - (total * pct / 100); });
  };

  /* Mini bar tracks */
  const animateTracks = (root) => {
    root.querySelectorAll('.mini-row .track i').forEach((i, idx) => {
      const w = i.style.getPropertyValue('--w');
      i.style.transition = `width 1.1s cubic-bezier(.2,.8,.2,1) ${idx * 0.1}s`;
      requestAnimationFrame(() => { i.style.width = w; });
    });
  };

  /* Reveal + trigger nested animations once visible */
  const seen = new WeakSet();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting || seen.has(e.target)) return;
      seen.add(e.target);
      e.target.classList.add('in');

      e.target.querySelectorAll('[data-count]').forEach(animateCount);
      const g = e.target.querySelector('.gauge-fill');
      if (g) animateGauge(g);
      if (e.target.querySelector('.mini-row')) animateTracks(e.target);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));

  /* Hero counts fire immediately (above the fold) */
  document.querySelectorAll('.hero [data-count]').forEach(animateCount);

  /* Subtle parallax tilt on the hero device */
  const device = document.getElementById('device');
  if (device && !prefersReduced && window.matchMedia('(pointer:fine)').matches) {
    const wrap = device.parentElement;
    wrap.addEventListener('mousemove', (ev) => {
      const r = wrap.getBoundingClientRect();
      const rx = ((ev.clientY - r.top) / r.height - 0.5) * -5;
      const ry = ((ev.clientX - r.left) / r.width - 0.5) * 7;
      device.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    wrap.addEventListener('mouseleave', () => { device.style.transform = ''; });
  }

  /* CTA form — lightweight demo handler */
  const form = document.querySelector('.cta-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      const btn = form.querySelector('button');
      if (input.value && input.checkValidity()) {
        btn.textContent = "Thanks — we'll be in touch ✓";
        btn.disabled = true;
        input.disabled = true;
      } else {
        input.focus();
      }
    });
  }
})();
