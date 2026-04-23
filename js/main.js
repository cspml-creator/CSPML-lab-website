/* ===========================================
   main.js — Scroll Reveal + Form Handler
   CSPML Website · IIT Dharwad
   =========================================== */

/* ── Scroll Reveal ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── Mailing List Form ── */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('mailing-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.form-input');
      const btn   = form.querySelector('.form-btn');
      if (!input.value || !input.value.includes('@')) {
        input.style.borderColor = '#ff6b6b';
        return;
      }
      btn.textContent = '✓ Subscribed!';
      btn.style.background = '#22c55e';
      input.value = '';
      input.style.borderColor = '';
      setTimeout(() => {
        btn.textContent = 'Subscribe';
        btn.style.background = '';
      }, 3000);
    });
  }
});

/* ── People Tab Switching ── */
document.querySelectorAll('.people-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    document.querySelectorAll('.people-tab').forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    document.querySelectorAll('.people-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById('people-panel-' + target);
    if (panel) panel.classList.add('active');
  });
});

/* ── Active Nav Link — set via class="active" in each page's HTML ── */

/* ── Hero Signal Animation ── */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* ── Sine waves ── */
  const waves = [
    { freq: 0.010, amp: 42,  speed: 0.016, phase: 0.0, rgb: '0,194,255',  a: 0.22, lw: 1.5, y: 0.38 },
    { freq: 0.007, amp: 65,  speed: 0.009, phase: 1.8, rgb: '0,194,255',  a: 0.10, lw: 1.2, y: 0.50 },
    { freq: 0.017, amp: 28,  speed: 0.023, phase: 3.5, rgb: '91,141,238', a: 0.18, lw: 1.5, y: 0.58 },
    { freq: 0.005, amp: 80,  speed: 0.007, phase: 0.9, rgb: '0,194,255',  a: 0.07, lw: 2.0, y: 0.44 },
    { freq: 0.022, amp: 20,  speed: 0.030, phase: 2.7, rgb: '91,141,238', a: 0.12, lw: 1.0, y: 0.64 },
    { freq: 0.013, amp: 35,  speed: 0.013, phase: 5.1, rgb: '0,194,255',  a: 0.08, lw: 1.0, y: 0.30 },
  ];

  /* ── Fog blobs — large drifting radial-gradient clouds ──
     Mix of directions so they naturally cross, merge, and pass. */
  const fogs = [
    { x: 0.10, y: 0.40, rx: 0.38, ry: 0.28, vx:  0.00018, vy:  0.00007, rgb: '0,194,255',  a: 0.10 },
    { x: 0.70, y: 0.55, rx: 0.42, ry: 0.32, vx: -0.00014, vy:  0.00005, rgb: '0,194,255',  a: 0.08 },
    { x: 0.45, y: 0.25, rx: 0.30, ry: 0.22, vx:  0.00010, vy:  0.00012, rgb: '91,141,238', a: 0.09 },
    { x: 0.85, y: 0.70, rx: 0.35, ry: 0.26, vx: -0.00020, vy: -0.00008, rgb: '0,194,255',  a: 0.07 },
    { x: 0.20, y: 0.75, rx: 0.28, ry: 0.20, vx:  0.00016, vy: -0.00010, rgb: '91,141,238', a: 0.08 },
    { x: 0.60, y: 0.15, rx: 0.32, ry: 0.24, vx: -0.00012, vy:  0.00015, rgb: '0,194,255',  a: 0.06 },
    { x: 0.35, y: 0.85, rx: 0.40, ry: 0.30, vx:  0.00008, vy: -0.00006, rgb: '91,141,238', a: 0.07 },
    { x: 0.80, y: 0.35, rx: 0.25, ry: 0.18, vx: -0.00018, vy:  0.00009, rgb: '0,194,255',  a: 0.09 },
  ];

  /* ── Floating network nodes ── */
  const nodes = Array.from({ length: 38 }, () => ({
    x:  Math.random(), y:  Math.random(),
    vx: (Math.random() - 0.5) * 0.00025,
    vy: (Math.random() - 0.5) * 0.00025,
    r:  Math.random() * 1.3 + 0.4,
    a:  Math.random() * 0.22 + 0.06,
  }));

  /* ── Signal packets travelling along first 3 waves ── */
  const packets = [0, 1, 2].map(wi => ({
    wi, t: Math.random(), speed: 0.0014 + Math.random() * 0.001,
  }));

  /* ── Draw functions ── */

  function drawWaves() {
    const W = canvas.width, H = canvas.height;
    waves.forEach(w => {
      w.phase += w.speed;
      /* wide glow */
      ctx.beginPath();
      for (let x = 0; x <= W; x += 3) {
        const y = H * w.y + Math.sin(x * w.freq + w.phase) * w.amp;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${w.rgb},${(w.a * 0.35).toFixed(3)})`;
      ctx.lineWidth   = w.lw * 5;
      ctx.stroke();
      /* sharp core */
      ctx.beginPath();
      for (let x = 0; x <= W; x += 2) {
        const y = H * w.y + Math.sin(x * w.freq + w.phase) * w.amp;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${w.rgb},${w.a.toFixed(3)})`;
      ctx.lineWidth   = w.lw;
      ctx.stroke();
    });
  }

  function drawFog() {
    const W = canvas.width, H = canvas.height;
    fogs.forEach(f => {
      const cx = f.x * W;
      const cy = f.y * H;
      const rx = f.rx * W;
      const ry = f.ry * H;

      /* Stretch canvas vertically so a circle becomes an ellipse */
      ctx.save();
      ctx.scale(1, ry / rx);
      const g = ctx.createRadialGradient(cx, cy * (rx / ry), 0, cx, cy * (rx / ry), rx);
      g.addColorStop(0,   `rgba(${f.rgb},${f.a})`);
      g.addColorStop(0.45,`rgba(${f.rgb},${(f.a * 0.55).toFixed(3)})`);
      g.addColorStop(1,   `rgba(${f.rgb},0)`);
      ctx.beginPath();
      ctx.arc(cx, cy * (rx / ry), rx, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.restore();

      /* drift and wrap */
      f.x += f.vx; f.y += f.vy;
      const pad = Math.max(f.rx, f.ry);
      if (f.x < -pad) f.x = 1 + pad;
      if (f.x > 1 + pad) f.x = -pad;
      if (f.y < -pad) f.y = 1 + pad;
      if (f.y > 1 + pad) f.y = -pad;
    });
  }

  function drawPackets() {
    const W = canvas.width, H = canvas.height;
    packets.forEach(pk => {
      pk.t += pk.speed;
      if (pk.t > 1) pk.t = 0;
      const w  = waves[pk.wi];
      const px = pk.t * W;
      const py = H * w.y + Math.sin(px * w.freq + w.phase) * w.amp;
      const g  = ctx.createRadialGradient(px, py, 0, px, py, 12);
      g.addColorStop(0, 'rgba(0,194,255,0.65)');
      g.addColorStop(1, 'rgba(0,194,255,0)');
      ctx.beginPath();
      ctx.arc(px, py, 12, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px, py, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(220,245,255,0.95)';
      ctx.fill();
    });
  }

  function drawNodes() {
    const W = canvas.width, H = canvas.height;
    nodes.forEach((p, i) => {
      const px = p.x * W, py = p.y * H;
      for (let j = i + 1; j < nodes.length; j++) {
        const q = nodes[j];
        const d = Math.hypot(px - q.x * W, py - q.y * H);
        const threshold = W * 0.13;
        if (d < threshold) {
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(q.x * W, q.y * H);
          ctx.strokeStyle = `rgba(0,194,255,${(0.07 * (1 - d / threshold)).toFixed(3)})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
      ctx.beginPath();
      ctx.arc(px, py, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,194,255,${p.a})`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
      if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
    });
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawNodes();
    drawWaves();
    drawFog();      /* fog sits on top of waves — partially veils & reveals them */
    drawPackets();  /* packets always visible above fog */
    requestAnimationFrame(tick);
  }
  tick();
}());
