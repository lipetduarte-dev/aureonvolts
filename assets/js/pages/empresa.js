/* ==========================================================================
   EMPRESA (Sistema em Desenvolvimento) — lógica exclusiva desta página:
   métricas live do dashboard, simulação de boot/progresso, diagnóstico
   energético e o mini-game completo "⚡ Pulso Elétrico Runner".
   ========================================================================== */

/* ════════════════════════════════
   DASHBOARD LIVE METRICS
════════════════════════════════ */
function rnd(a, b, d = 1) { return (Math.random() * (b - a) + a).toFixed(d); }
function updateMetrics() {
  document.getElementById('m-tensao').textContent = rnd(218, 222) + 'V';
  document.getElementById('m-corrente').textContent = rnd(14, 22) + 'A';
  const iotStates = ['OFFLINE', 'SYNC...', 'ONLINE'];
  const si = Math.floor(Math.random() * 3);
  const el = document.getElementById('m-iot');
  el.textContent = iotStates[si];
  el.style.color = si === 2 ? 'var(--green)' : si === 1 ? 'var(--gold)' : 'var(--red)';
}
setInterval(updateMetrics, 2200); updateMetrics();

/* Progress bar simulation */
let progVal = 0;
const steps = [
  'INICIALIZANDO KERNEL...',
  'CARREGANDO DRIVERS ELÉTRICOS...',
  'CALIBRANDO SENSORES...',
  'VERIFICANDO REDE IoT...',
  'MÓDULOS DE IA CARREGANDO...',
  'COMPILANDO ALGORITMOS...',
  'SINCRONIZANDO NUVEM...',
  'AJUSTANDO PARÂMETROS...'
];
let stepIdx = 0;
function advanceProgress() {
  if (progVal >= 73) return;
  const inc = Math.random() * 4 + 1;
  progVal = Math.min(73, progVal + inc);
  document.getElementById('progFill').style.width = progVal + '%';
  document.getElementById('progPct').textContent = Math.round(progVal) + '%';
  stepIdx = (stepIdx + 1) % steps.length;
  const delay = Math.random() * 600 + 300;
  setTimeout(advanceProgress, delay);
}
setTimeout(advanceProgress, 800);

/* ════════════════════════════════
   DIAGNOSTIC ANIMATION
════════════════════════════════ */
function runDiag() {
  const bars = [
    { bar: 'db1', val: 'db1v', target: 94 },
    { bar: 'db2', val: 'db2v', target: 87 },
    { bar: 'db3', val: 'db3v', target: 100 },
    { bar: 'db4', val: 'db4v', target: 78 },
  ];
  bars.forEach((b, i) => {
    setTimeout(() => {
      let v = 0;
      const iv = setInterval(() => {
        v = Math.min(b.target, v + Math.random() * 8 + 2);
        document.getElementById(b.bar).style.width = v + '%';
        document.getElementById(b.val).textContent = Math.round(v) + '%';
        if (v >= b.target) clearInterval(iv);
      }, 40);
    }, i * 350);
  });
}

document.getElementById('startBtn').addEventListener('click', () => {
  document.getElementById('diagOverlay').style.display = 'none';
  startGame();
});

/* ════════════════════════════════
   MINI GAME ENGINE
════════════════════════════════ */
const gc = document.getElementById('gameCanvas');
const gx = gc.getContext('2d');
let GW, GH, GROUND, scale;

function resizeGame() {
  GW = gc.width = gc.offsetWidth;
  GH = gc.height = gc.offsetHeight;
  scale = GW / 900;
  GROUND = GH - 10;
}

let gameRunning = false, gameFrame = 0, score = 0, best = 0, speed = 0, level = 1;
let obstacles = [], powerups = [], particles = [];
let player, lastObs = 0, lastPow = 0;

/* Player */
function initPlayer() {
  const s = Math.max(28, 34 * scale);
  player = {
    x: 80 * scale, y: GROUND - s,
    w: s * 0.7, h: s,
    vy: 0, jumping: false, doubleJump: false,
    trail: [], shieldTime: 0,
    glow: 0
  };
}

function jump() {
  if (!gameRunning) return;
  if (!player.jumping) {
    player.vy = -14 * Math.max(0.8, scale);
    player.jumping = true;
    player.doubleJump = false;
    spawnParticles(player.x + player.w / 2, player.y + player.h, 6, '#00CFFF');
  } else if (!player.doubleJump) {
    player.vy = -11 * Math.max(0.8, scale);
    player.doubleJump = true;
    spawnParticles(player.x + player.w / 2, player.y + player.h, 8, '#00FF99');
  }
}

/* Obstacles — electric themed */
const OBS_TYPES = [
  { id: 'overload', color: '#FF4D6A', color2: '#FF0040', label: '⚠', w: 22, h: 44, pulseColor: 'rgba(255,77,106,0.4)' },
  { id: 'spike', color: '#F0A500', color2: '#FF8C00', label: '▲', w: 18, h: 50, pulseColor: 'rgba(240,165,0,0.4)' },
  { id: 'arc', color: '#00CFFF', color2: '#0080FF', label: '⚡', w: 26, h: 38, pulseColor: 'rgba(0,207,255,0.4)' },
  { id: 'short', color: '#FF4D6A', color2: '#FF8800', label: '💥', w: 34, h: 28, pulseColor: 'rgba(255,77,106,0.3)' },
  { id: 'cable', color: '#F0A500', color2: '#00CFFF', label: '⌇', w: 16, h: 56, pulseColor: 'rgba(0,207,255,0.3)' },
  { id: 'trafo', color: '#8FA8C8', color2: '#445577', label: '▮', w: 40, h: 36, pulseColor: 'rgba(143,168,200,0.2)' },
];
const POW_TYPES = [
  { id: 'stab', color: '#00FF99', label: '⊕', label2: '+ESTAB' },
  { id: 'efic', color: '#00CFFF', label: '★', label2: '+EFIC' },
  { id: 'shield', color: '#F0A500', label: '◈', label2: '+PROT' },
];

function spawnObstacle() {
  const t = OBS_TYPES[Math.floor(Math.random() * OBS_TYPES.length)];
  const sw = t.w * Math.max(0.8, scale);
  const sh = t.h * Math.max(0.8, scale);
  // chance of double obstacle at higher levels
  const count = level >= 3 && Math.random() < 0.25 ? 2 : 1;
  for (let i = 0; i < count; i++) {
    obstacles.push({
      x: GW + i * sw * 1.6,
      y: GROUND - sh,
      w: sw, h: sh,
      type: t, pulse: 0
    });
  }
}

function spawnPowerup() {
  const t = POW_TYPES[Math.floor(Math.random() * POW_TYPES.length)];
  const s = 22 * Math.max(0.8, scale);
  powerups.push({
    x: GW,
    y: GROUND - s - (GROUND * 0.28),
    w: s, h: s, type: t, pulse: 0
  });
}

function spawnParticles(x, y, n, color) {
  for (let i = 0; i < n; i++) {
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 5,
      vy: (Math.random() - 0.5) * 5 - 2,
      life: 1, color,
      size: Math.random() * 3 + 1
    });
  }
}

function startGame() {
  resizeGame();
  initPlayer();
  obstacles = []; powerups = []; particles = [];
  score = 0; gameFrame = 0; speed = 3.5; level = 1;
  lastObs = 0; lastPow = 0;
  gameRunning = true;
  document.getElementById('gameOver').classList.remove('show');
  gameLoop();
}

function endGame() {
  gameRunning = false;
  if (score > best) best = score;
  document.getElementById('finalScore').textContent = score;
  document.getElementById('finalBest').textContent = best;
  document.getElementById('bestDisplay').textContent = best;
  document.getElementById('gameOver').classList.add('show');
}

function aabb(a, b) {
  const pad = 6 * scale;
  return a.x + pad < b.x + b.w - pad &&
    a.x + a.w - pad > b.x + pad &&
    a.y + pad < b.y + b.h - pad &&
    a.y + a.h - pad > b.y + pad;
}

function drawPlayer() {
  const px = player.x, py = player.y, pw = player.w, ph = player.h;
  const cx = px + pw / 2, cy = py + ph / 2;

  // trail
  player.trail.push({ x: cx, y: cy, a: 0.8 });
  if (player.trail.length > 10) player.trail.shift();
  player.trail.forEach((t, i) => {
    t.a *= 0.82;
    const r = (i / player.trail.length) * (pw * 0.35);
    gx.beginPath(); gx.arc(t.x, t.y, r, 0, Math.PI * 2);
    gx.fillStyle = `rgba(0,207,255,${t.a * 0.3})`; gx.fill();
  });

  // body glow
  const glowR = pw * 1.2 + Math.sin(Date.now() * 0.006) * 4;
  const grd = gx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
  grd.addColorStop(0, 'rgba(0,207,255,0.25)');
  grd.addColorStop(1, 'rgba(0,207,255,0)');
  gx.beginPath(); gx.arc(cx, cy, glowR, 0, Math.PI * 2);
  gx.fillStyle = grd; gx.fill();

  // shield
  if (player.shieldTime > 0) {
    gx.beginPath(); gx.arc(cx, cy, pw * 0.9, 0, Math.PI * 2);
    gx.strokeStyle = `rgba(240,165,0,${0.6 + 0.4 * Math.sin(Date.now() * 0.01)})`;
    gx.lineWidth = 2 * scale; gx.stroke();
  }

  // body (lightning bolt shape)
  gx.save();
  gx.translate(cx, cy);
  gx.shadowColor = '#00CFFF'; gx.shadowBlur = 16;
  gx.strokeStyle = '#00CFFF'; gx.lineWidth = 2.5 * scale;
  gx.beginPath();
  const bh = ph * 0.55;
  gx.moveTo(pw * 0.15, -bh);
  gx.lineTo(-pw * 0.1, 0);
  gx.lineTo(pw * 0.12, 0);
  gx.lineTo(-pw * 0.15, bh);
  gx.stroke();

  gx.shadowBlur = 8;
  gx.fillStyle = 'rgba(0,255,153,0.9)';
  gx.beginPath(); gx.arc(0, -bh * 0.85, 2.5 * scale, 0, Math.PI * 2); gx.fill();
  gx.restore();
}

function drawObstacle(o) {
  o.pulse += 0.08;
  const cx = o.x + o.w / 2, cy = o.y + o.h / 2;
  const t = o.type;

  // glow
  const grd = gx.createRadialGradient(cx, cy, 0, cx, cy, o.w);
  grd.addColorStop(0, t.pulseColor);
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  gx.beginPath(); gx.arc(cx, cy, o.w * (1 + 0.2 * Math.sin(o.pulse)), 0, Math.PI * 2);
  gx.fillStyle = grd; gx.fill();

  // body
  gx.save(); gx.shadowColor = t.color; gx.shadowBlur = 12;

  if (t.id === 'spike') {
    gx.fillStyle = t.color;
    gx.beginPath();
    gx.moveTo(cx, o.y);
    gx.lineTo(cx - o.w / 2, o.y + o.h);
    gx.lineTo(cx + o.w / 2, o.y + o.h);
    gx.closePath(); gx.fill();
  } else if (t.id === 'cable') {
    gx.strokeStyle = t.color; gx.lineWidth = 3 * scale;
    for (let i = 0; i < 3; i++) {
      const ox = (i - 1) * 5 * scale;
      gx.beginPath();
      gx.moveTo(cx + ox, o.y);
      for (let fy = 0; fy < o.h; fy += 8) {
        gx.lineTo(cx + ox + (i % 2 === 0 ? 4 : -4) * scale * Math.sin(o.pulse + fy), o.y + fy);
      }
      gx.stroke();
    }
  } else {
    gx.strokeStyle = t.color; gx.lineWidth = 2 * scale;
    gx.fillStyle = `rgba(${hexToRgb(t.color)},0.15)`;
    gx.fillRect(o.x, o.y, o.w, o.h);
    gx.strokeRect(o.x, o.y, o.w, o.h);
  }

  // label
  gx.shadowBlur = 0;
  gx.fillStyle = '#fff'; gx.font = `bold ${Math.round(14 * scale)}px Arial`;
  gx.textAlign = 'center'; gx.textBaseline = 'middle';
  gx.fillText(t.label, cx, cy);
  gx.restore();
}

function drawPowerup(p) {
  p.pulse += 0.07;
  const cx = p.x + p.w / 2, cy = p.y + p.h / 2;
  const t = p.type;
  const bob = Math.sin(p.pulse) * 4;

  gx.save();
  gx.shadowColor = t.color; gx.shadowBlur = 14;
  gx.strokeStyle = t.color; gx.lineWidth = 1.5 * scale;
  gx.fillStyle = `rgba(${hexToRgb(t.color)},0.12)`;
  const s = p.w / 2 + bob * 0.3;
  gx.beginPath();
  gx.arc(cx, cy + bob, s, 0, Math.PI * 2);
  gx.fill(); gx.stroke();

  gx.fillStyle = t.color;
  gx.font = `bold ${Math.round(13 * scale)}px Arial`;
  gx.textAlign = 'center'; gx.textBaseline = 'middle';
  gx.fillText(t.label, cx, cy + bob);
  gx.restore();
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

function drawGround() {
  gx.strokeStyle = 'rgba(0,207,255,0.25)';
  gx.lineWidth = 1;
  gx.setLineDash([6, 8]);
  gx.beginPath(); gx.moveTo(0, GROUND); gx.lineTo(GW, GROUND); gx.stroke();
  gx.setLineDash([]);
}

function drawHUD() {
  // mini oscilloscope bar
  gx.fillStyle = 'rgba(0,207,255,0.08)';
  gx.fillRect(0, GH - 8, GW, 8);
  for (let x = 0; x < GW; x += 4) {
    const h = 2 + Math.sin((x + gameFrame * 3) * 0.06) * 3;
    gx.fillStyle = `rgba(0,207,255,${0.3 + 0.2 * Math.sin((x + gameFrame) * 0.1)})`;
    gx.fillRect(x, GH - h - 1, 3, h);
  }
}

function drawParticlesGame() {
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.vy += 0.2; p.life -= 0.04;
    if (p.life <= 0) return;
    gx.beginPath(); gx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    gx.fillStyle = p.color.replace(')', `,${p.life})`).replace('rgb', 'rgba');
    gx.fill();
  });
  particles = particles.filter(p => p.life > 0);
}

function gameLoop() {
  if (!gameRunning) return;
  gameFrame++;
  score = Math.floor(gameFrame / 6);

  // speed & level
  speed = 3.5 + score * 0.006;
  level = Math.floor(score / 200) + 1;
  document.getElementById('scoreDisplay').textContent = score;
  document.getElementById('levelDisplay').textContent = level;

  // clear
  gx.clearRect(0, 0, GW, GH);

  // bg gradient
  const bgGrd = gx.createLinearGradient(0, 0, 0, GH);
  bgGrd.addColorStop(0, '#030810');
  bgGrd.addColorStop(1, '#050D1A');
  gx.fillStyle = bgGrd; gx.fillRect(0, 0, GW, GH);

  // scrolling bg lines
  for (let i = 0; i < 5; i++) {
    const lineX = ((gameFrame * speed * 0.3 * (i + 1) * 0.5) % (GW + 200)) - 200;
    gx.strokeStyle = `rgba(0,207,255,${0.03 + i * 0.01})`;
    gx.lineWidth = 1;
    gx.setLineDash([20, 40]);
    gx.beginPath(); gx.moveTo(GW - lineX, 0); gx.lineTo(GW - lineX + 80, GH); gx.stroke();
    gx.setLineDash([]);
  }

  // physics
  player.vy += 0.7 * Math.max(0.8, scale);
  player.y += player.vy;
  if (player.y >= GROUND - player.h) {
    player.y = GROUND - player.h;
    player.vy = 0;
    player.jumping = false;
    player.doubleJump = false;
  }
  if (player.shieldTime > 0) player.shieldTime--;

  // spawn
  const obsGap = Math.max(60, 120 - level * 8);
  if (gameFrame - lastObs > obsGap + Math.random() * 60) {
    spawnObstacle(); lastObs = gameFrame;
  }
  if (gameFrame - lastPow > 280 + Math.random() * 120) {
    spawnPowerup(); lastPow = gameFrame;
  }

  // update & draw obstacles
  obstacles.forEach(o => { o.x -= speed; drawObstacle(o); });
  obstacles = obstacles.filter(o => o.x + o.w > -10);

  // update & draw powerups
  powerups.forEach(p => { p.x -= speed; drawPowerup(p); });
  powerups = powerups.filter(p => p.x + p.w > -10);

  // draw ground & player
  drawGround();
  drawParticlesGame();
  drawPlayer();
  drawHUD();

  // collision — obstacles
  let hit = false;
  obstacles.forEach(o => {
    if (aabb(player, o)) {
      if (player.shieldTime > 0) {
        player.shieldTime = 0;
        spawnParticles(o.x + o.w / 2, o.y, 12, '#F0A500');
        o.x = -999;
      } else {
        hit = true;
      }
    }
  });
  if (hit) {
    spawnParticles(player.x + player.w / 2, player.y + player.h / 2, 20, '#FF4D6A');
    setTimeout(endGame, 150);
    gameRunning = false;
    return;
  }

  // collision — powerups
  powerups.forEach(p => {
    if (aabb(player, p)) {
      spawnParticles(p.x + p.w / 2, p.y + p.h / 2, 10, p.type.color);
      if (p.type.id === 'shield') player.shieldTime = 220;
      score += 30;
      p.x = -999;
    }
  });
  powerups = powerups.filter(p => p.x > -900);

  requestAnimationFrame(gameLoop);
}

/* Controls */
function handleJump(e) {
  if (e) { e.preventDefault(); }
  if (!gameRunning && document.getElementById('gameOver').classList.contains('show')) return;
  if (!gameRunning) return;
  jump();
}

document.addEventListener('keydown', e => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault(); handleJump();
  }
});
gc.addEventListener('click', handleJump);
gc.addEventListener('touchstart', e => { e.preventDefault(); handleJump(); }, { passive: false });
document.getElementById('restartBtn').addEventListener('click', () => {
  document.getElementById('gameOver').classList.remove('show');
  document.getElementById('diagOverlay').style.display = 'none';
  startGame();
});

window.addEventListener('resize', () => {
  if (gameRunning) resizeGame();
});

/* ════════════════════════════════
   AUTO-RUN DIAGNOSTIC ON LOAD
════════════════════════════════ */
window.addEventListener('load', () => {
  runDiag();
});
