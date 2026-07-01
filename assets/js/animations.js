/* ==========================================================================
   ANIMATIONS — fundo em canvas, scroll reveal e contador de números.
   ========================================================================== */

/* ─── Fundo de partículas (#particles-canvas) — index/produtos/volteye-info/contato ─── */
function initCanvasParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  const particles = [];

  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      c: Math.random() > 0.7 ? 'rgba(240,165,0,' : 'rgba(0,207,255,'
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c + '0.6)';
      ctx.fill();
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(0,207,255,' + (0.06 * (1 - dist / 120)) + ')';
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawParticles);
  }

  drawParticles();
  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });
}

/* ─── Fundo "grafo IoT" (#bgCanvas) — solucoes/empresa ─── */
function initBgCanvas() {
  const bgC = document.getElementById('bgCanvas');
  if (!bgC) return;

  const bgX = bgC.getContext('2d');
  let BW, BH;
  function resizeBg() {
    BW = bgC.width = window.innerWidth;
    BH = bgC.height = window.innerHeight;
  }
  resizeBg();
  window.addEventListener('resize', resizeBg);

  const nodeCount = 50;
  const nodes = [];
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * BW,
      y: Math.random() * BH,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 1,
      c: Math.random() > 0.65 ? [240, 165, 0] : [0, 207, 255],
      pulse: Math.random() * Math.PI * 2
    });
  }

  function drawBg() {
    bgX.clearRect(0, 0, BW, BH);
    bgX.strokeStyle = 'rgba(0,207,255,0.04)';
    bgX.lineWidth = 1;
    for (let x = 0; x < BW; x += 60) { bgX.beginPath(); bgX.moveTo(x, 0); bgX.lineTo(x, BH); bgX.stroke(); }
    for (let y = 0; y < BH; y += 60) { bgX.beginPath(); bgX.moveTo(0, y); bgX.lineTo(BW, y); bgX.stroke(); }

    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy; n.pulse += 0.04;
      if (n.x < 0) n.x = BW; if (n.x > BW) n.x = 0;
      if (n.y < 0) n.y = BH; if (n.y > BH) n.y = 0;
      const alpha = 0.4 + 0.3 * Math.sin(n.pulse);
      bgX.beginPath(); bgX.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      bgX.fillStyle = `rgba(${n.c[0]},${n.c[1]},${n.c[2]},${alpha})`;
      bgX.fill();
    });
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          bgX.strokeStyle = `rgba(0,207,255,${0.12 * (1 - dist / 130)})`;
          bgX.lineWidth = 1;
          bgX.beginPath();
          bgX.moveTo(nodes[i].x, nodes[i].y);
          bgX.lineTo(nodes[j].x, nodes[j].y);
          bgX.stroke();
        }
      }
    }
    requestAnimationFrame(drawBg);
  }
  drawBg();
}

/* ─── Scroll reveal (IntersectionObserver) ─── */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(r => observer.observe(r));
}

/* ─── Contador animado (.stat-num) ─── */
function initCounterAnimation() {
  const nums = document.querySelectorAll('.stat-num');
  if (nums.length === 0) return;

  function animateCounter(el) {
    if (el.dataset.static) return;
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const dec = target % 1 !== 0 ? 1 : 0;
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      el.textContent = (target * ease).toFixed(dec) + suffix;
      if (t < 1) requestAnimationFrame(update);
      else el.textContent = target.toFixed(dec) + suffix;
    }
    requestAnimationFrame(update);
  }

  const statObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        statObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  nums.forEach(n => statObs.observe(n));
}
