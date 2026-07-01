/* ==========================================================================
   SOLUÇÕES (solucoes.html) — acordeão dos cards de solução
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.solucao-card').forEach(card => {
    const btn = card.querySelector('.solucao-toggle');
    btn.addEventListener('click', () => {
      const willOpen = !card.classList.contains('open');
      card.classList.toggle('open');
      btn.innerHTML = willOpen
        ? 'Ocultar detalhes <span class="arrow">▾</span>'
        : 'Ver detalhes completos <span class="arrow">▾</span>';
    });
  });
});
