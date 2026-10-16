/**
 * cards.js — tilt 3D + brilho que segue o mouse em [data-tilt].
 * Só com mouse (pointer fine) e fora de is-lite/is-reduced. Escreve variáveis
 * CSS no máximo uma vez por frame; o retângulo é medido na entrada do ponteiro.
 */

import { allowsRichMotion, onChange } from './motion.js';

const MAX_DEG = 7;

function setupCard(card) {
  let rect = null;
  let hovering = false;
  let frame = 0;
  let px = 0.5;
  let py = 0.5;

  const write = () => {
    frame = 0;
    card.style.setProperty('--tilt-x', `${((0.5 - py) * MAX_DEG * 2).toFixed(2)}deg`);
    card.style.setProperty('--tilt-y', `${((px - 0.5) * MAX_DEG * 2).toFixed(2)}deg`);
    card.style.setProperty('--glow-x', `${(px * 100).toFixed(1)}%`);
    card.style.setProperty('--glow-y', `${(py * 100).toFixed(1)}%`);
  };

  const reset = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    rect = null;
    hovering = false;
    card.classList.remove('is-tilting');
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
  };

  card.addEventListener('pointerenter', (e) => {
    if (e.pointerType !== 'mouse' || !allowsRichMotion()) return;
    hovering = true;
    rect = card.getBoundingClientRect(); // uma leitura por entrada, não por movimento
    card.classList.add('is-tilting');
  });

  card.addEventListener('pointermove', (e) => {
    if (!hovering) return;
    if (!rect) rect = card.getBoundingClientRect(); // remede após scroll
    px = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    py = Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1);
    if (!frame) frame = requestAnimationFrame(write);
  }, { passive: true });

  card.addEventListener('pointerleave', reset);
  return { reset, invalidate: () => { rect = null; } };
}

export function initCards() {
  const cards = document.querySelectorAll('[data-tilt]');
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!cards.length || !fine.matches) return;

  const handles = [...cards].map(setupCard);
  // Scroll move o card sob o mouse: descarta o retângulo (remedido no próximo movimento).
  window.addEventListener('scroll', () => handles.forEach((h) => h.invalidate()), { passive: true });
  // Se o modo lite/reduzido ligar no meio do uso, solta os cards.
  onChange(() => !allowsRichMotion() && handles.forEach((h) => h.reset()));
}
