/**
 * reveal.js — revela [data-reveal] ao entrar na tela (.is-visible, uma única vez).
 * [data-reveal-stagger] no pai escalona os filhos via --reveal-delay (i × 90ms).
 */

const STAGGER_STEP = 90;
const SETTLE_MARGIN = 1200; // garantia caso o transitionend não dispare (>= --dur-slow)

/**
 * Depois de revelado, o elemento não deve mais herdar o atraso da cascata
 * (ex.: tilt/hover dos cards voltariam atrasados). Remove --reveal-delay e
 * marca .is-revealed, que o CSS usa para zerar o transition-delay.
 */
function settle(el) {
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    el.removeEventListener('transitionend', onEnd);
    el.style.removeProperty('--reveal-delay');
    el.classList.add('is-revealed');
  };
  const onEnd = (e) => {
    if (e.target === el) finish(); // ignora transições de filhos
  };
  el.addEventListener('transitionend', onEnd);
  const delay = parseFloat(el.style.getPropertyValue('--reveal-delay')) || 0;
  window.setTimeout(finish, delay + SETTLE_MARGIN);
}

function applyDelays() {
  // Delay individual declarado no HTML.
  document.querySelectorAll('[data-reveal][data-reveal-delay]').forEach((el) => {
    const ms = parseInt(el.dataset.revealDelay, 10);
    if (!Number.isNaN(ms)) el.style.setProperty('--reveal-delay', `${ms}ms`);
  });

  // Cascata: soma o passo do grupo ao delay individual (se houver).
  document.querySelectorAll('[data-reveal-stagger]').forEach((group) => {
    let items = group.querySelectorAll(':scope > [data-reveal]');
    if (!items.length) items = group.querySelectorAll('[data-reveal]');
    items.forEach((el, i) => {
      const own = parseInt(el.dataset.revealDelay, 10) || 0;
      el.style.setProperty('--reveal-delay', `${own + i * STAGGER_STEP}ms`);
    });
  });
}

export function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  applyDelays();

  // Sem IntersectionObserver: mostra tudo de uma vez.
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible', 'is-revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        settle(entry.target);
        observer.unobserve(entry.target);
      });
    },
    // threshold 0 + margem inferior pequena: elementos altos também revelam, e
    // o que já está na tela no load revela no primeiro callback do observer.
    { threshold: 0, rootMargin: '0px 0px -8% 0px' }
  );

  items.forEach((el) => observer.observe(el));
}
