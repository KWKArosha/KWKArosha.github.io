// ─── TERMINAL TYPEWRITER ─────────────────────────────────────
const terminalLines = [
  { id: 'tl-1', text: '$ cat about.json', cls: 'cmd', delay: 300 },
  { id: 'tl-2', text: '{ name: "Arosha", interested in: "Full Stack + Game Dev + Database Systems" }', cls: 'out', delay: 900 },
  { id: 'tl-3', text: '$ ls projects/', cls: 'cmd', delay: 1600 },
  { id: 'tl-4', text: 'minigames/   skill-connect/   ceylon-medihub/', cls: 'out', delay: 2200 },
  { id: 'tl-5', text: '[OK] All systems operational. Welcome.', cls: 'success', delay: 2900 },
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
    const idx = terminalLines.indexOf(line);
    const wait = line.delay - (idx > 0 ? terminalLines[idx - 1].delay : 0);
    await new Promise(r => setTimeout(r, wait));
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

  // ─── NAV SCROLL EFFECT ──────────────────────────────────────
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 40
      ? 'rgba(8,11,20,0.97)'
      : 'rgba(8,11,20,0.85)';
  }, { passive: true });

  // ─── HAMBURGER MENU ─────────────────────────────────────────
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

  // ─── SCROLL REVEAL ───────────────────────────────────────────
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

  // ─── ACTIVE NAV LINK HIGHLIGHTING ───────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === '#' + id ? 'var(--cyan)' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  // ─── SKILL PILL ANIMATION DELAYS ────────────────────────────
  document.querySelectorAll('.skill-category').forEach((cat, i) => {
    cat.style.animationDelay = (i * 0.08) + 's';
  });

  // ─── CURSOR TRAIL ────────────────────────────────────────────
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:9998;opacity:0.35;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const dots = [];
  let mx = -999, my = -999;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animTrail() {
    ctx.clearRect(0, 0, W, H);
    dots.push({ x: mx, y: my, life: 1 });
    if (dots.length > 18) dots.shift();
    dots.forEach(d => {
      d.life -= 0.045;
      if (d.life < 0) return;
      const r = 3 * d.life;
      ctx.beginPath();
      ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,217,255,' + (d.life * 0.5) + ')';
      ctx.fill();
    });
    requestAnimationFrame(animTrail);
  }
  if (window.matchMedia('(hover: hover)').matches) animTrail();

  // ─── MEDIHUB GALLERY ─────────────────────────────────────────
  const galleryImages = [
    'assets/medihub1.png',
    'assets/medihub2.png',
    'assets/medihub3.png',
    'assets/medihub4.png',
  ];
  let currentGalleryIndex = 0;

  const mainImg      = document.getElementById('galleryMainImg');
  const currentLabel = document.getElementById('galleryCurrent');
  const thumbs       = document.querySelectorAll('.gallery-thumb');
  const expandBtn    = document.getElementById('galleryExpandBtn');

  if (mainImg) {
    mainImg.style.transition = 'opacity 0.15s ease';

    function switchGalleryTo(index) {
      currentGalleryIndex = (index + galleryImages.length) % galleryImages.length;
      mainImg.style.opacity = '0';
      setTimeout(() => {
        mainImg.src = galleryImages[currentGalleryIndex];
        mainImg.style.opacity = '1';
      }, 150);
      if (currentLabel) currentLabel.textContent = currentGalleryIndex + 1;
      thumbs.forEach((t, i) => t.classList.toggle('active', i === currentGalleryIndex));
      if (!lightbox.classList.contains('open')) return;
      lbGoTo(currentGalleryIndex);
    }

    thumbs.forEach((thumb, i) => {
      thumb.addEventListener('click', () => switchGalleryTo(i));
    });

    // ─── LIGHTBOX ───────────────────────────────────────────────
    const lightbox     = document.getElementById('lightbox');
    const lightboxImg  = document.getElementById('lightboxImg');
    const lightboxDots = document.getElementById('lightboxDots');
    let lbIndex = 0;

    // Build dots
    galleryImages.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'lightbox-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => lbGoTo(i));
      lightboxDots.appendChild(dot);
    });

    function openLightbox(index) {
      lbIndex = (index + galleryImages.length) % galleryImages.length;
      lightboxImg.src = galleryImages[lbIndex];
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
      updateLbDots();
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    function lbGoTo(index) {
      lbIndex = (index + galleryImages.length) % galleryImages.length;
      lightboxImg.style.opacity = '0';
      setTimeout(() => {
        lightboxImg.src = galleryImages[lbIndex];
        lightboxImg.style.opacity = '1';
      }, 120);
      updateLbDots();
    }

    function updateLbDots() {
      document.querySelectorAll('.lightbox-dot').forEach((d, i) =>
        d.classList.toggle('active', i === lbIndex)
      );
    }

    lightboxImg.style.transition = 'opacity 0.12s ease';

    expandBtn.addEventListener('click', () => openLightbox(currentGalleryIndex));

    document.getElementById('galleryPreview').addEventListener('click', e => {
      if (e.target !== expandBtn && !expandBtn.contains(e.target)) {
        openLightbox(currentGalleryIndex);
      }
    });

    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    document.getElementById('lightboxPrev').addEventListener('click', () => lbGoTo(lbIndex - 1));
    document.getElementById('lightboxNext').addEventListener('click', () => lbGoTo(lbIndex + 1));

    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  lbGoTo(lbIndex - 1);
      if (e.key === 'ArrowRight') lbGoTo(lbIndex + 1);
    });
  }

  // ─── AI NAVIGATOR ────────────────────────────────────────────
  (function () {

    const SECTIONS = {
      hero:      { id: 'hero',      label: 'Home / Hero',     keywords: ['home','top','hero','start','beginning','intro','welcome','back to top'] },
      about:     { id: 'about',     label: 'About Arosha',    keywords: ['about','who','person','background','bio','profile','location','sri lanka','name','available','hire','opportunity','gpa'] },
      skills:    { id: 'skills',    label: 'Skills',          keywords: ['skill','tech','technology','language','framework','stack','react','node','express','mern','spring','boot','graphql','android','kotlin','java','javascript','c++','sql','html','css','aws','docker','kubernetes','firebase','ci','cd','linux','mysql','mongodb','database','tool','git','postman','playwright','unreal','godot','game','cloud','mobile','web','devops','vercel','railway'] },
      projects:  { id: 'projects',  label: 'Projects',        keywords: ['project','built','build','create','work','portfolio','minigame','skill connect','ceylon','medihub','healthcare','gaming','multiplayer','mern','distributed','microservice','team lead','godot','screenshot'] },
      education: { id: 'education', label: 'Education',       keywords: ['education','study','university','college','degree','sliit','course','coursework','academic','certification','aws certified','certified','certificate','gpa','grade','bachelor','bsc','information technology'] },
      currently: { id: 'currently', label: 'Current Focus',   keywords: ['current','now','learning','focus','active','status','queued','working on','unreal','algorithm','ai application'] },
      contact:   { id: 'contact',   label: 'Contact',         keywords: ['contact','reach','email','message','linkedin','github','connect','hire','talk','touch','ping','social'] },
    };

    function localMatch(query) {
      const q = query.toLowerCase();
      let best = null, bestScore = 0;
      for (const [key, sec] of Object.entries(SECTIONS)) {
        let score = 0;
        for (const kw of sec.keywords) {
          if (q.includes(kw)) score += kw.split(' ').length;
        }
        if (score > bestScore) { bestScore = score; best = key; }
      }
      return bestScore > 0 ? best : null;
    }

    const REPLIES = {
      hero:      () => 'Taking you to the top of the portfolio!',
      about:     () => 'Arosha is a Full Stack + Game Developer from Sri Lanka, studying Software Engineering at SLIIT. He\'s available for opportunities!',
      skills:    () => 'Arosha knows React, Node.js, Java, Kotlin, C++, AWS, Docker, Kubernetes, Unreal Engine, Godot, and more. Here\'s the full breakdown.',
      projects:  () => 'Arosha has built MiniGames (multiplayer gaming), Skill Connect (Vercel + Railway), and Ceylon MediHub (distributed healthcare). Scrolling to projects!',
      education: () => 'Arosha is studying BSc. IT in Software Engineering at SLIIT (2023–2027, GPA 2.9/4.0) and holds an AWS Cloud Practitioner certification.',
      currently: () => 'Right now Arosha is actively working on Unreal Engine, Android with Kotlin, and AWS cloud architecture.',
      contact:   () => 'You can reach Arosha on LinkedIn or GitHub. Heading to the contact section!',
      unknown:   () => 'I\'m not sure which section covers that — try asking about his projects, skills, education, or how to contact him!',
    };

    const trigger    = document.getElementById('aiTrigger');
    const panel      = document.getElementById('aiPanel');
    const closeBtn   = document.getElementById('aiPanelClose');
    const messages   = document.getElementById('aiMessages');
    const input      = document.getElementById('aiInput');
    const sendBtn    = document.getElementById('aiSend');
    const chips      = document.querySelectorAll('.ai-chip');

    if (!trigger) return;

    function openPanel() {
      panel.hidden = false;
      trigger.classList.add('hidden');
      input.focus();
    }
    function closePanel() {
      panel.hidden = true;
      trigger.classList.remove('hidden');
    }

    trigger.addEventListener('click', openPanel);
    closeBtn.addEventListener('click', closePanel);

    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        panel.hidden ? openPanel() : closePanel();
      }
      if (e.key === 'Escape' && !panel.hidden) closePanel();
    });

    input.addEventListener('input', () => {
      sendBtn.disabled = input.value.trim().length === 0;
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 96) + 'px';
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!sendBtn.disabled) handleQuery(input.value.trim());
      }
    });

    sendBtn.addEventListener('click', () => {
      if (!sendBtn.disabled) handleQuery(input.value.trim());
    });

    chips.forEach(chip => {
      chip.addEventListener('click', () => handleQuery(chip.dataset.q));
    });

    function appendMsg(text, role, sectionKey) {
      const wrap   = document.createElement('div');
      wrap.className = 'ai-msg ai-msg--' + (role === 'user' ? 'user' : 'bot');
      const bubble = document.createElement('div');
      bubble.className = 'ai-msg-bubble';
      bubble.textContent = text;

      if (role === 'bot' && sectionKey && sectionKey !== 'unknown') {
        const br = document.createElement('br');
        const btn = document.createElement('button');
        btn.className = 'ai-nav-btn';
        btn.innerHTML = '&#8594; Go to ' + SECTIONS[sectionKey].label;
        btn.addEventListener('click', () => scrollToSection(sectionKey));
        bubble.appendChild(br);
        bubble.appendChild(btn);
      }

      wrap.appendChild(bubble);
      messages.appendChild(wrap);
      messages.scrollTop = messages.scrollHeight;
    }

    function showTyping() {
      const wrap = document.createElement('div');
      wrap.className = 'ai-msg ai-msg--bot';
      wrap.id = 'aiTypingIndicator';
      const dots = document.createElement('div');
      dots.className = 'ai-typing';
      dots.innerHTML = '<span></span><span></span><span></span>';
      wrap.appendChild(dots);
      messages.appendChild(wrap);
      messages.scrollTop = messages.scrollHeight;
    }

    function removeTyping() {
      const el = document.getElementById('aiTypingIndicator');
      if (el) el.remove();
    }

    function scrollToSection(key) {
      const sec = SECTIONS[key];
      if (!sec) return;
      const el = document.getElementById(sec.id);
      if (!el) return;
      const navH = 64;
      const top = el.getBoundingClientRect().top + window.scrollY - navH - 12;
      window.scrollTo({ top, behavior: 'smooth' });
      el.style.transition = 'outline 0s';
      el.style.outline = '2px solid rgba(0,217,255,0.4)';
      el.style.outlineOffset = '8px';
      setTimeout(() => {
        el.style.outline = '';
        el.style.outlineOffset = '';
      }, 1400);
    }

    async function handleQuery(query) {
      if (!query) return;

      input.value = '';
      input.style.height = 'auto';
      sendBtn.disabled = true;

      // Hide chips after first use
      const chipsEl = document.getElementById('aiChips');
      if (chipsEl) chipsEl.style.display = 'none';

      appendMsg(query, 'user');
      showTyping();

      await new Promise(r => setTimeout(r, 500 + Math.random() * 400));

      let sectionKey = null;
      let replyText  = null;

      try {
        const systemPrompt = `You are a navigation assistant for Arosha's developer portfolio website.
The page has exactly these sections: hero (top/home), about (bio, location, status, GPA), skills (React, Node.js, Java, Kotlin, C++, MERN, Android, AWS, Docker, Kubernetes, Firebase, Unreal Engine, Godot, MySQL, MongoDB, Git, Spring Boot, GraphQL, Vercel, Railway, Playwright, Postman), projects (MiniGames multiplayer MERN+Godot platform, Skill Connect MERN+Vercel+Railway+Playwright+Postman, Ceylon MediHub MERN+Docker+Kubernetes+Playwright+Postman distributed healthcare system with screenshot gallery), education (SLIIT, BSc IT Software Engineering, GPA 2.9, AWS Certified Cloud Practitioner), currently (active: Unreal Engine dev, Android Kotlin, AWS cloud; queued: AI apps, Algorithm design), contact (LinkedIn, GitHub).

Given the user's question, respond ONLY with a valid JSON object — no extra text, no markdown fences:
{"section":"<one of: hero|about|skills|projects|education|currently|contact|unknown>","reply":"<friendly one-sentence reply, 10-20 words, specific to what was asked>"}

Examples: "Does he know Docker?" -> skills. "Can I hire him?" -> contact. "What has he made?" -> projects. "Show me MediHub" -> projects.`;

        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-6',
            max_tokens: 150,
            system: systemPrompt,
            messages: [{ role: 'user', content: query }]
          })
        });

        if (res.ok) {
          const data = await res.json();
          const raw  = (data.content?.[0]?.text || '').trim();
          const clean = raw.replace(/^```[\w]*[\n]?|```$/g, '').trim();
          const parsed = JSON.parse(clean);
          sectionKey = parsed.section || 'unknown';
          replyText  = parsed.reply   || REPLIES[sectionKey]?.() || REPLIES.unknown();
        }
      } catch (_) {
        // fall through to local
      }

      if (!sectionKey) {
        sectionKey = localMatch(query) || 'unknown';
        replyText  = REPLIES[sectionKey]?.() || REPLIES.unknown();
      }

      removeTyping();
      appendMsg(replyText, 'bot', sectionKey);

      if (sectionKey && sectionKey !== 'unknown') {
        setTimeout(() => scrollToSection(sectionKey), 700);
      }
    }

  })();

});