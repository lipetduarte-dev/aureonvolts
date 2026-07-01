/* ==========================================================================
   THEME — alternância dark/light persistida em localStorage.
   ========================================================================== */
function initTheme() {
  const themeButtons = document.querySelectorAll('[data-theme-toggle]');
  if (themeButtons.length === 0) return;

  function applyTheme(light) {
    document.body.classList.toggle('light-theme', light);
    themeButtons.forEach(button => {
      const state = button.querySelector('.theme-state');
      const icon = button.querySelector('.theme-icon');
      button.setAttribute('aria-pressed', String(light));
      button.setAttribute('aria-label', light ? 'Desativar tema claro' : 'Ativar tema claro');
      if (state) state.textContent = light ? 'Ativado' : 'Desativado';
      if (icon) icon.textContent = light ? '◐' : '☀';
    });
  }

  let savedTheme = 'dark';
  try {
    savedTheme = localStorage.getItem('aureon-theme') || 'dark';
  } catch (error) { /* localStorage indisponível */ }

  applyTheme(savedTheme === 'light');

  themeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const next = !document.body.classList.contains('light-theme');
      try { localStorage.setItem('aureon-theme', next ? 'light' : 'dark'); } catch (error) { }
      applyTheme(next);
    });
  });
}
