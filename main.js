// ─── TERMINAL TYPEWRITER ─────────────────────────────────────
const terminalLines = [
  { id: 'tl-1', text: '$ cat about.json', cls: 'cmd', delay: 300 },
  { id: 'tl-2', text: '{ name: "Arosha", "Full Stack + Game Dev" }', cls: 'out', delay: 900 },
  { id: 'tl-3', text: '$ ls projects/', cls: 'cmd', delay: 1600 },
  { id: 'tl-4', text: 'minigames/   skill-connect/   ceylon-medihub/', cls: 'out', delay: 2200 },
  { id: 'tl-5', text: 'Welcome.', cls: 'success', delay: 2900 },
];

const typedCmdEl = document.getElementById('typed-cmd');
const promptCommands = ['ping portfolio', 'open --world', 'build --something-great'];
let cmdIndex = 0;

function typeText(el, text, speed = 35) {
  return new Promise(resolve => {
    let i = 0;
    const interval = setInterval(() => {
      el.textContent += text[i++];
      if (i >= text.length) { clearInterval(interval); resolve(); }
    }, speed);
  });
}

async function runTerminal() {
  for (const line of terminalLines) {
    await new Promise(r => setTimeout(r, line.delay - (terminalLines.indexOf(line) > 0 ? terminalLines[terminalLines.indexOf(line)-1].delay : 0)));
    const el = document.getElementById(line.id);
    if (el) {
      el.classList.add('mono', line.cls);
      await typeText(el, line.text, 28);
    }
  }
  cyclePromptCommand();
}

async function cyclePromptCommand() {
  while (true) {
    const cmd = promptCommands[cmdIndex % promptCommands.length];
    typedCmdEl.textContent = '';
    await typeText(typedCmdEl, cmd, 60);
    await new Promise(r => setTimeout(r, 2200));

    // erase
    while (typedCmdEl.textContent.length > 0) {
      typedCmdEl.textContent = typedCmdEl.textContent.slice(0, -1);
      await new Promise(r => setTimeout(r, 30));
    }
    await new Promise(r => setTimeout(r, 400));
    cmdIndex++;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  runTerminal();

  // ─── NAV SCROLL EFFECT ─────────────────────────────────
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 40
      ? 'rgba(8,11,20,0.97)'
      : 'rgba(8,11,20,0.85)';
  }, { passive: true });

  // ─── HAMBURGER MENU ───────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  document.querySelectorAll('.mobile-menu a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  // ─── SCROLL REVEAL ────────────────────────────────────
  const revealEls = document.querySelectorAll(
    '.section-header, .about-text, .about-card-col, .skill-category, .project-card, .edu-block, .certs-row, .status-item, .contact-text, .contact-links'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));

  // ─── ACTIVE NAV LINK HIGHLIGHTING ─────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--cyan)' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  // ─── SKILL PILL HOVER GLOW ────────────────────────────
  document.querySelectorAll('.skill-category').forEach((cat, i) => {
    cat.style.animationDelay = `${i * 0.08}s`;
  });

  // ─── CURSOR TRAIL (subtle) ────────────────────────────
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:9998;opacity:0.35;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  window.addEventListener('resize', () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; });

  const dots = [];
  let mx = -999, my = -999;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animTrail() {
    ctx.clearRect(0, 0, W, H);
    dots.push({ x: mx, y: my, life: 1 });
    if (dots.length > 18) dots.shift();

    dots.forEach((d, i) => {
      d.life -= 0.045;
      if (d.life < 0) return;
      const r = 3 * d.life;
      ctx.beginPath();
      ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,217,255,${d.life * 0.5})`;
      ctx.fill();
    });

    requestAnimationFrame(animTrail);
  }
  // Only run trail on non-touch devices
  if (window.matchMedia('(hover: hover)').matches) animTrail();

  // ─── MEDIHUB GALLERY ─────────────────────────────────────
  const images = [
    'assets/medihub1.png',
    'assets/medihub2.png',
    'assets/medihub3.png',
    'assets/medihub4.png',
  ];
  let currentIndex = 0;

  const mainImg      = document.getElementById('galleryMainImg');
  const currentLabel = document.getElementById('galleryCurrent');
  const thumbs       = document.querySelectorAll('.gallery-thumb');
  const expandBtn    = document.getElementById('galleryExpandBtn');

  function switchTo(index) {
    currentIndex = (index + images.length) % images.length;
    mainImg.style.opacity = '0';
    setTimeout(() => {
      mainImg.src = images[currentIndex];
      mainImg.style.opacity = '1';
    }, 150);
    currentLabel.textContent = currentIndex + 1;
    thumbs.forEach((t, i) => t.classList.toggle('active', i === currentIndex));
    if (lightbox.classList.contains('open')) openLightbox(currentIndex);
  }

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => switchTo(i));
  });

  mainImg.style.transition = 'opacity 0.15s ease';

  // ─── LIGHTBOX ────────────────────────────────────────────
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightboxImg');
  const lightboxDots = document.getElementById('lightboxDots');
  let lbIndex = 0;

  images.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'lightbox-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => lbGoTo(i));
    lightboxDots.appendChild(dot);
  });

  function openLightbox(index) {
    lbIndex = (index + images.length) % images.length;
    lightboxImg.src = images[lbIndex];
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    updateDots();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function lbGoTo(index) {
    lbIndex = (index + images.length) % images.length;
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = images[lbIndex];
      lightboxImg.style.opacity = '1';
    }, 120);
    updateDots();
  }

  function updateDots() {
    document.querySelectorAll('.lightbox-dot').forEach((d, i) =>
      d.classList.toggle('active', i === lbIndex));
  }

  lightboxImg.style.transition = 'opacity 0.12s ease';

  expandBtn.addEventListener('click', () => openLightbox(currentIndex));
  document.getElementById('galleryPreview').addEventListener('click', (e) => {
    if (e.target !== expandBtn && !expandBtn.contains(e.target)) openLightbox(currentIndex);
  });
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrev').addEventListener('click', () => lbGoTo(lbIndex - 1));
  document.getElementById('lightboxNext').addEventListener('click', () => lbGoTo(lbIndex + 1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  lbGoTo(lbIndex - 1);
    if (e.key === 'ArrowRight') lbGoTo(lbIndex + 1);
  });
});