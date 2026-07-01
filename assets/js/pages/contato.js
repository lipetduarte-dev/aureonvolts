/* ==========================================================================
   CONTATO (contato.html) — acordeão de FAQ e envio do formulário de contato
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // ── FAQ ──
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // ── FORM ──
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  if (form && success) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // simula envio
      success.classList.add('show');

      // limpa campos
      form.reset();

      // esconde depois de 4s
      setTimeout(() => {
        success.classList.remove('show');
      }, 4000);
    });
  }
});
