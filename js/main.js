/**
 * main.js — ponto de entrada.
 *
 * Cada módulo é carregado com import() e iniciado no próprio try/catch:
 * se um arquivo falhar (rede, erro de sintaxe, elemento inesperado),
 * os demais seguem funcionando e a página nunca fica parada.
 */

const root = document.documentElement;

// Ordem só importa para o motion (os outros leem isReduced()/isLite()).
const MODULES = [
  ['./modules/header.js', 'initHeader'],
  ['./modules/hero.js', 'initHero'],
  ['./modules/reveal.js', 'initReveal'],
  ['./modules/counters.js', 'initCounters'],
  ['./modules/scrollspy.js', 'initScrollspy'],
  ['./modules/tabs.js', 'initTabs'],
  ['./modules/calculator.js', 'initCalculator'],
  ['./modules/cards.js', 'initCards'],
  ['./modules/maps.js', 'initMaps'],
  ['./modules/hours.js', 'initHours'],
];

async function run(path, fnName) {
  try {
    const mod = await import(path);
    mod[fnName]?.();
  } catch (err) {
    console.warn(`[sito] módulo ${path} não iniciou:`, err);
  }
}

function fillYear() {
  const year = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = year;
  });
}

async function boot() {
  try {
    fillYear();
  } catch (err) {
    console.warn('[sito] ano não preenchido:', err);
  }

  // Motion primeiro: define is-reduced/is-lite antes dos outros decidirem efeitos.
  await run('./modules/motion.js', 'initMotion');
  await Promise.allSettled(MODULES.map(([path, fn]) => run(path, fn)));

  root.classList.add('is-ready');
}

boot();
