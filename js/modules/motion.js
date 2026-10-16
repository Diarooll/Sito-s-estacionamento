/**
 * motion.js — decide "quanto" animar, nunca "se" animar.
 *
 * - is-reduced: prefers-reduced-motion ativo (comum no Windows com "efeitos de
 *   animação" desligados). A página continua viva, só com fades/escala curtos.
 * - is-lite: hardware fraco. Desliga só o que é caro (tilt, parallax, blur).
 *
 * Outros módulos consultam isReduced()/isLite() e podem assinar mudanças com onChange().
 */

const root = document.documentElement;
const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const listeners = new Set();

const state = {
  reduced: reducedQuery.matches,
  lite: false,
};

const FPS_MIN = 45;
const FPS_SAMPLE_MS = 1000;

export const isReduced = () => state.reduced;
export const isLite = () => state.lite;
/** Efeitos "caros" (tilt/parallax) só rodam sem reduced e sem lite. */
export const allowsRichMotion = () => !state.reduced && !state.lite;

/** Assina mudanças de estado; retorna função para cancelar. */
export function onChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Duração ajustada: no modo reduzido as animações ficam mais curtas. */
export function dur(ms) {
  return state.reduced ? Math.min(ms * 0.5, 250) : ms;
}

export const EASE_OUT = 'cubic-bezier(.22,1,.36,1)';

/** Executa quando o navegador estiver ocioso (com fallback). */
export function onIdle(fn, timeout = 1500) {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(fn, { timeout });
  }
  return window.setTimeout(fn, 1);
}

/** Agrupa chamadas em no máximo uma por frame (último argumento vence). */
export function rafThrottle(fn) {
  let frame = 0;
  let lastArgs;
  return (...args) => {
    lastArgs = args;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      fn(...lastArgs);
    });
  };
}

function apply() {
  root.classList.toggle('is-reduced', state.reduced);
  root.classList.toggle('is-lite', state.lite);
  listeners.forEach((fn) => fn({ ...state }));
}

/** Heurística estática só para hardware muito fraco; quem decide de verdade é o FPS. */
function weakHardware() {
  const cores = navigator.hardwareConcurrency;
  const memory = navigator.deviceMemory; // só Chromium
  return (cores && cores <= 2) || (memory && memory <= 2);
}

/** Mede o FPS real por ~1s via rAF; abaixo de FPS_MIN liga o modo lite. */
function measureFps() {
  if (document.hidden) return; // aba em segundo plano não tem rAF confiável

  let frames = 0;
  let start = 0;

  const tick = (now) => {
    if (document.hidden) return; // aba saiu de foco: medição inválida
    if (!start) start = now; // ignora o primeiro frame (custo do carregamento)
    else frames += 1;

    const elapsed = now - start;
    if (elapsed < FPS_SAMPLE_MS) {
      requestAnimationFrame(tick);
      return;
    }
    const fps = (frames * 1000) / elapsed;
    if (fps < FPS_MIN && !state.lite) {
      state.lite = true;
      apply();
    }
  };

  requestAnimationFrame(tick);
}

export function initMotion() {
  state.lite = Boolean(weakHardware());
  apply();

  // Usuário pode mudar a preferência do sistema com a página aberta.
  const onReducedChange = (e) => {
    state.reduced = e.matches;
    apply();
  };
  if (reducedQuery.addEventListener) reducedQuery.addEventListener('change', onReducedChange);
  else reducedQuery.addListener(onReducedChange); // Safari antigo

  if (!state.lite) measureFps();
}
