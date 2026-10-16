/**
 * tabs.js — componente de abas genérico para cada [data-tabs].
 * ARIA tabs (setas, Home, End; ativação automática), indicador via
 * --indicator-x/--indicator-w no .tabs__list e cascata do conteúdo novo (WAAPI).
 */

import { dur, isReduced, rafThrottle, EASE_OUT } from './motion.js';

const KEYS = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];

/** Linhas da tabela entram uma a uma; painéis sem tabela entram inteiros. */
function cascade(panel) {
  if (typeof panel.animate !== 'function') return;
  const reduced = isReduced();
  const rows = panel.querySelectorAll('tr');
  const targets = rows.length ? rows : [panel];

  targets.forEach((el, i) => {
    const from = reduced
      ? { opacity: 0 }
      : { opacity: 0, transform: rows.length ? 'translate3d(12px,0,0)' : 'scale(.98)' };
    el.animate([from, { opacity: 1, transform: 'none' }], {
      duration: dur(420),
      delay: i * (reduced ? 20 : 40),
      easing: EASE_OUT,
      fill: 'backwards',
    });
  });
}

function setupTabs(root) {
  const list = root.querySelector('[role="tablist"]');
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  if (!list || !tabs.length) return;

  const panelFor = (tab) =>
    document.getElementById(tab.getAttribute('aria-controls')) ||
    root.querySelector(`[data-tab-panel="${tab.dataset.tab}"]`);

  // O indicador só existe visualmente; medir não causa thrashing (só leituras, depois escritas).
  const placeIndicator = rafThrottle(() => {
    const active = tabs.find((t) => t.getAttribute('aria-selected') === 'true');
    if (!active) return;
    const listBox = list.getBoundingClientRect();
    const tabBox = active.getBoundingClientRect();
    const x = tabBox.left - listBox.left + list.scrollLeft;
    list.style.setProperty('--indicator-x', `${x.toFixed(1)}px`);
    list.style.setProperty('--indicator-w', `${tabBox.width.toFixed(1)}px`);
    // Depois do 1º posicionamento o CSS liga a transição (evita "deslize" no load).
    if (!list.classList.contains('is-ready')) requestAnimationFrame(() => list.classList.add('is-ready'));
  });

  function select(tab, { focus = false, animate = true } = {}) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = panelFor(t);
      if (panel) panel.hidden = !on;
    });
    if (focus) tab.focus();
    placeIndicator();
    const panel = panelFor(tab);
    if (animate && panel) cascade(panel);
  }

  list.addEventListener('click', (e) => {
    const tab = e.target.closest('[role="tab"]');
    if (tab && tabs.includes(tab) && tab.getAttribute('aria-selected') !== 'true') select(tab);
  });

  list.addEventListener('keydown', (e) => {
    if (!KEYS.includes(e.key)) return;
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    const last = tabs.length - 1;
    const next = {
      ArrowLeft: i === 0 ? last : i - 1,
      ArrowRight: i === last ? 0 : i + 1,
      Home: 0,
      End: last,
    }[e.key];
    select(tabs[next], { focus: true });
  });

  // Estado inicial a partir do HTML (sem animar).
  const initial = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
  select(initial, { animate: false });

  // Fontes carregando ou resize mudam a largura das abas.
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(placeIndicator);
    ro.observe(list);
    tabs.forEach((t) => ro.observe(t));
  } else {
    window.addEventListener('resize', placeIndicator, { passive: true });
  }
}

export function initTabs() {
  document.querySelectorAll('[data-tabs]').forEach((root) => {
    try {
      setupTabs(root);
    } catch (err) {
      console.warn('[sito] abas não iniciaram:', err);
    }
  });
}
