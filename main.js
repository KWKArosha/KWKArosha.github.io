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
});
