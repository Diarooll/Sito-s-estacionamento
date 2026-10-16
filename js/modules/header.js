/**
 * header.js — header encolhe ao rolar (.is-scrolled) e menu mobile acessível.
 */

import { rafThrottle } from './motion.js';

const SCROLL_THRESHOLD = 24;
const DESKTOP_QUERY = '(min-width: 960px)';

function initScrolled(header) {
  let scrolled = null;

  // Uma leitura (scrollY) e no máximo uma escrita por frame.
  const update = rafThrottle(() => {
    const next = window.scrollY > SCROLL_THRESHOLD;
    if (next !== scrolled) {
      scrolled = next;
      header.classList.toggle('is-scrolled', next);
    }
  });

  window.addEventListener('scroll', update, { passive: true });
  update();
}

function initMenu(header) {
  const toggle = header.querySelector('.site-header__toggle');
  const nav = document.getElementById(toggle?.getAttribute('aria-controls') || 'site-nav');
  if (!toggle || !nav) return;

  const root = document.documentElement;
  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';
  const focusables = () => [toggle, ...nav.querySelectorAll('a[href], button:not([disabled])')];

  function setOpen(open, { restoreFocus = true } = {}) {
    if (open === isOpen()) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('is-open', open);
    root.classList.toggle('menu-open', open);

    if (open) {
      nav.querySelector('a[href]')?.focus({ preventScroll: true });
    } else if (restoreFocus && nav.contains(document.activeElement)) {
      toggle.focus({ preventScroll: true });
    }
  }

  toggle.setAttribute('aria-label', 'Abrir menu');
  toggle.addEventListener('click', () => setOpen(!isOpen()));

  // Clique em link: fecha sem roubar o foco (o scroll suave cuida do destino).
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a[href]')) setOpen(false, { restoreFocus: false });
  });

  // Clique fora do menu e do botão.
  document.addEventListener('click', (e) => {
    if (isOpen() && !nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (!isOpen()) return;
    if (e.key === 'Escape') {
      setOpen(false);
      return;
    }
    // Mantém o Tab circulando entre o botão e os links enquanto aberto.
    if (e.key === 'Tab') {
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Ao virar desktop o menu mobile deixa de existir: garante estado limpo.
  const desktop = window.matchMedia(DESKTOP_QUERY);
  const onDesktop = (e) => e.matches && setOpen(false, { restoreFocus: false });
  if (desktop.addEventListener) desktop.addEventListener('change', onDesktop);
  else desktop.addListener(onDesktop);
}

export function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  initScrolled(header);
  initMenu(header);
}
