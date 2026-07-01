/* ==========================================================================
   NAVBAR — menu mobile (hamburguer + overlay), comum a todas as páginas.
   Funciona com os dois padrões de marcação usados no site:
   #burger pode ter class="nav-hamburger" OU class="nav-hbg".
   ========================================================================== */
function initNavbar() {
  const navBurger = document.getElementById('burger');
  const navMenu = document.getElementById('mobileMenu');
  const navOverlay = document.getElementById('mobileOverlay');

  if (!navBurger || !navMenu) return;

  function setMenu(open) {
    navBurger.classList.toggle('open', open);
    navMenu.classList.toggle('open', open);
    if (navOverlay) navOverlay.classList.toggle('open', open);
    navBurger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  }

  navBurger.setAttribute('role', 'button');
  navBurger.setAttribute('aria-label', 'Abrir menu');
  navBurger.setAttribute('aria-expanded', 'false');

  navBurger.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    setMenu(!navMenu.classList.contains('open'));
  }, true);

  if (navOverlay) navOverlay.addEventListener('click', () => setMenu(false));

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenu(false));
  });

  window.closeMobile = () => setMenu(false);
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) setMenu(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenu(false);
  });
}
