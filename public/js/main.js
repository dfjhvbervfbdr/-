(() => {
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (menuButton && nav) {
    const closeMenu = () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Открыть меню');
      nav.classList.remove('is-open');
    };
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Открыть меню' : 'Закрыть меню');
      nav.classList.toggle('is-open', !isOpen);
    });
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 680) closeMenu();
    });
  }

  const canvas = document.querySelector('.network-canvas');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  let width = 0;
  let height = 0;
  let particles = [];
  let frame = 0;
  let lastDraw = 0;
  const mobileQuery = window.matchMedia('(max-width: 680px)');

  function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.min(mobileQuery.matches ? 12 : 25, Math.floor((width * height) / (mobileQuery.matches ? 24000 : 38000)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18
    }));
  }

  function draw(time) {
    frame = window.requestAnimationFrame(draw);
    if (time - lastDraw < 33) return;
    lastDraw = time;
    context.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i += 1) {
      const point = particles[i];
      point.x += point.vx;
      point.y += point.vy;
      if (point.x < 0 || point.x > width) point.vx *= -1;
      if (point.y < 0 || point.y > height) point.vy *= -1;
      context.fillStyle = 'rgba(0, 217, 255, 0.55)';
      context.fillRect(point.x, point.y, 2, 2);

      for (let j = i + 1; j < particles.length; j += 1) {
        const other = particles[j];
        const dx = point.x - other.x;
        const dy = point.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 125) {
          context.strokeStyle = `rgba(0, 217, 255, ${0.12 * (1 - distance / 125)})`;
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(point.x, point.y);
          context.lineTo(other.x, other.y);
          context.stroke();
        }
      }
    }
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });
  frame = window.requestAnimationFrame(draw);
  window.addEventListener('pagehide', () => window.cancelAnimationFrame(frame), { once: true });
})();
