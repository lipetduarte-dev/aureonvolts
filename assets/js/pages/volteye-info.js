/* ==========================================================================
   VOLTEYE-INFO (volteye-info.html) — lógica específica desta página:
   números ao vivo do dispositivo, gráfico de demonstração e o fluxo de
   abertura da demo interativa do VoltEye X.
   ========================================================================== */

// ── LIVE DEVICE NUMBERS ──
function rnd(min, max, dec) { return (Math.random() * (max - min) + min).toFixed(dec); }

function updateDevice() {
  const values = [
    ['d-tensao', rnd(218, 222, 1) + '<span class="metric-unit">V</span>'],
    ['d-corrente', rnd(17, 20, 1) + '<span class="metric-unit">A</span>'],
    ['d-potencia', rnd(3.8, 4.5, 2) + '<span class="metric-unit">kW</span>'],
    ['d-efic', rnd(97.5, 99.5, 1) + '<span class="metric-unit">%</span>']
  ];
  values.forEach(function (entry) {
    const el = document.getElementById(entry[0]);
    if (el) el.innerHTML = entry[1];
  });
}
setInterval(updateDevice, 3500);

// ── DEMO PANEL ──
function buildChart() {
  const bars = document.getElementById('chartBars');
  if (!bars) return;
  bars.innerHTML = '';
  const heights = [38, 52, 45, 68, 55, 72, 60, 83, 70, 65, 55, 48];
  heights.forEach((h, i) => {
    const bar = document.createElement('div');
    bar.className = 'chart-bar';
    bar.style.height = h + '%';
    bar.style.animationDelay = (i * 0.05) + 's';
    if (h > 70) bar.style.background = 'linear-gradient(180deg, var(--gold), rgba(240,165,0,0.2))';
    bars.appendChild(bar);
  });
}
buildChart();

function randomizeDemo() {
  const values = {
    'dm-pot': rnd(3.2, 5.1, 2) + ' kW',
    'dm-dia': rnd(15, 24, 1) + ' kWh',
    'dm-mes': Math.round(rnd(280, 380, 0)) + ' kWh',
    'dm-circ': [3, 4, 5, 6][Math.floor(Math.random() * 4)] + ' Ativos'
  };
  Object.keys(values).forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.textContent = values[id];
  });
  buildChart();
}

function openVoltEyeDemo() {

  const btn =
    document.querySelector('.launch-btn');

  btn.innerHTML =
    'CONECTANDO AO VOLTEYE X...';

  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = 'AUTENTICANDO...';
  }, 700);

  setTimeout(() => {
    btn.innerHTML = 'ABRINDO DASHBOARD...';
  }, 1400);

  setTimeout(() => {

    window.open(
      'volteye-x.html',
      '_blank'
    );

    btn.innerHTML =
      '⚡ DEMONSTRAÇÃO ATIVA ⚡';

    btn.disabled = false;

  }, 2200);
}
