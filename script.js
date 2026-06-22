/* ============================================================
   SCRIPT.JS  —  canvas, tilt, typewriter, reveal, filters
   ============================================================ */

// ── AURORA / NEBULA BACKGROUND CANVAS ────────────────────────
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Floating nodes
  const NODES = 90;
  const nodes = Array.from({ length: NODES }, () => ({
    x:  Math.random() * 1000,
    y:  Math.random() * 1000,
    vx: (Math.random() - .5) * .2,
    vy: (Math.random() - .5) * .2,
    r:  Math.random() * 1.5 + .5,
    hue: Math.random() > .5 ? 165 : 210
  }));

  // Orbs
  const orbs = [
    { x:.15, y:.2,  r:500, c:'rgba(0,255,200,' },
    { x:.85, y:.4,  r:400, c:'rgba(14,165,233,' },
    { x:.5,  y:.85, r:350, c:'rgba(129,140,248,' }
  ];

  function drawOrbs() {
    orbs.forEach(o => {
      const grd = ctx.createRadialGradient(o.x*W, o.y*H, 0, o.x*W, o.y*H, o.r);
      grd.addColorStop(0,   o.c + '0.07)');
      grd.addColorStop(0.5, o.c + '0.03)');
      grd.addColorStop(1,   o.c + '0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(o.x*W, o.y*H, o.r, 0, Math.PI*2);
      ctx.fill();
    });
  }

  function drawNodes() {
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    // connections
    for (let i = 0; i < NODES; i++) {
      for (let j = i+1; j < NODES; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.hypot(dx, dy);
        if (d < 110) {
          const alpha = 0.06 * (1 - d/110);
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(0,255,200,${alpha})`;
          ctx.lineWidth = .6;
          ctx.stroke();
        }
      }
    }

    // dots
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
      ctx.fillStyle = n.hue === 165
        ? 'rgba(0,255,200,0.4)'
        : 'rgba(14,165,233,0.35)';
      ctx.fill();
    });
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawOrbs();
    drawNodes();
    requestAnimationFrame(loop);
  }
  loop();
})();

// ── 3D CARD TILT ─────────────────────────────────────────────
(function () {
  const TILT = 9;
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width/2)  / (r.width/2);
      const dy = (e.clientY - r.top  - r.height/2) / (r.height/2);
      card.style.transform = `perspective(800px) rotateX(${-dy*TILT}deg) rotateY(${dx*TILT}deg) translateZ(4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

// ── 3D TILT: PHOTO ───────────────────────────────────────────
(function () {
  const ring = document.querySelector('.holo-ring');
  if (!ring) return;
  ring.addEventListener('mousemove', e => {
    const r  = ring.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width/2)  / (r.width/2);
    const dy = (e.clientY - r.top  - r.height/2) / (r.height/2);
    ring.style.transform = `perspective(900px) rotateX(${-dy*14}deg) rotateY(${dx*14}deg)`;
  });
  ring.addEventListener('mouseleave', () => {
    ring.style.transform = '';
  });
})();

// ── TYPEWRITER ───────────────────────────────────────────────
(function () {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const lines = [
    'I build ML models end-to-end.',
    'I can explain attention mechanisms over coffee.',
    'I wrote a game engine from scratch in C#.',
    'I scored 83.51% AUC on 301K medical records.',
    'I debug at 2am because I actually care.',
  ];

  let li = 0, ci = 0, deleting = false;

  function tick() {
    const line = lines[li];
    if (!deleting) {
      el.textContent = line.slice(0, ++ci);
      if (ci === line.length) {
        deleting = true;
        setTimeout(tick, 2200);
        return;
      }
      setTimeout(tick, 42);
    } else {
      el.textContent = line.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        li = (li + 1) % lines.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 22);
    }
  }
  setTimeout(tick, 800);
})();

// ── SCROLL REVEAL ────────────────────────────────────────────
(function () {
  const els = document.querySelectorAll('.r');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach((e, idx) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('in'), idx * 55);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
})();

// ── PROJECT FILTERS ──────────────────────────────────────────
(function () {
  const btns  = document.querySelectorAll('.fb');
  const cards = document.querySelectorAll('.pcard');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.f;
      btns.forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      cards.forEach(c => {
        const cat = c.dataset.c || '';
        c.classList.toggle('off', f !== 'all' && !cat.split(' ').includes(f));
      });
    });
  });
})();

// ── STAT COUNTER ─────────────────────────────────────────────
(function () {
  const stats = document.querySelectorAll('.v[data-target]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = parseFloat(el.dataset.target);
      const suf = el.dataset.suffix || '';
      const dur = 1800, step = 16;
      let cur = 0;
      const inc = end / (dur / step);
      const fmt = end % 1 !== 0;
      const t = setInterval(() => {
        cur = Math.min(cur + inc, end);
        el.textContent = (fmt ? cur.toFixed(2) : Math.round(cur).toLocaleString()) + suf;
        if (cur >= end) clearInterval(t);
      }, step);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  stats.forEach(s => io.observe(s));
})();

// ── SMOOTH SCROLL ────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior:'smooth', block:'start' }); }
  });
});

// ── ACTIVE NAV ───────────────────────────────────────────────
(function () {
  const secs = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.navlinks a[href^="#"]');
  window.addEventListener('scroll', () => {
    let cur = '';
    secs.forEach(s => { if (window.scrollY >= s.offsetTop - 130) cur = s.id; });
    links.forEach(a => a.classList.toggle('anav', a.getAttribute('href') === '#'+cur));
  }, { passive: true });
})();
