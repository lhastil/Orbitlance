// ==========================================================================
// Orbitlance — shared site behaviour (cursor, galaxy background, nav, reveal)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initGalaxyCanvas();
  initNav();
  initScrollReveal();
  initActiveNavLink();
  initContactForm();
  initInvitePopup();
});

/* -------------------------------- Cursor -------------------------------- */
function initCustomCursor() {
  if (window.matchMedia('(hover: none), (max-width: 900px)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let ringX = mouseX, ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  }, { passive: true });

  document.querySelectorAll('a, button, .planet-card, input, textarea').forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('active'));
  });

  (function loop() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();
}

/* ---------------------------- Galaxy background --------------------------- */
function initGalaxyCanvas() {
  const canvas = document.getElementById('galaxy-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.floor((w * h) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.3,
      speed: Math.random() * 0.15 + 0.02,
      twinkle: Math.random() * Math.PI * 2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.twinkle += 0.02;
      const alpha = 0.4 + Math.sin(s.twinkle) * 0.35;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${Math.max(alpha, 0.05)})`;
      ctx.fill();
      s.y -= s.speed;
      if (s.y < -5) { s.y = h + 5; s.x = Math.random() * w; }
    }
    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
}

/* --------------------------------- Nav ----------------------------------- */
function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
    toggle.classList.toggle('is-open');
  });
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    menu.classList.remove('open');
  }));
}

function initActiveNavLink() {
  const normalize = (p) => (p.split('/').pop() || 'index.html').replace(/\.html$/, '') || 'index';
  const current = normalize(window.location.pathname);
  document.querySelectorAll('.nav-link, .mobile-menu a').forEach((link) => {
    const href = normalize(link.getAttribute('href'));
    if (href === current) {
      link.classList.add('active');
    }
  });
}

/* ------------------------------ Scroll reveal ----------------------------- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });
  items.forEach((el) => io.observe(el));
}

/* ------------------------------ Invite popup ------------------------------ */
function initInvitePopup() {
  const popup = document.getElementById('invite-popup');
  if (!popup) return;
  const closeBtn = document.getElementById('invite-close');
  const footer = document.querySelector('.site-footer');
  let shown = false;

  const show = () => {
    if (shown) return;
    shown = true;
    popup.classList.add('show');
  };

  if (footer) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          show();
          io.disconnect();
        }
      });
    }, { threshold: 0.15 });
    io.observe(footer);
  }

  closeBtn.addEventListener('click', () => popup.classList.remove('show'));
}

/* ------------------------------ Contact form ------------------------------ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = document.getElementById('form-status');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.textContent = "Thanks! Your message is on its way — we'll get back to you within 24 hours.";
    status.classList.add('show');
    form.reset();
  });
}
