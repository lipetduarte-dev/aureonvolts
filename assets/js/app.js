/* ==========================================================================
   APP — bootstrap. Injeta a logo nos placeholders e inicializa os módulos
   compartilhados. Cada init() verifica se os elementos da sua página
   existem antes de rodar, então é seguro chamá-los em todas as páginas.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('img[src="LOGO_PLACEHOLDER"]').forEach(img => {
    img.src = LOGO_URL;
  });

  initNavbar();
  initTheme();
  initCanvasParticles();
  initBgCanvas();
  initScrollReveal();
  initCounterAnimation();
});
