/* ==========================================================================
   PRODUTOS — lógica exclusiva desta página: toast "em desenvolvimento"
   exibido ao clicar nos cards de produtos "Em Breve".
   ========================================================================== */
let toastTimeout;
function showDevToast() {
  const toast = document.getElementById('devToast');
  if (!toast) return;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}
