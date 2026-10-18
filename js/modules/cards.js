/**
 * cards.js — "farol" que segue o mouse em [data-spotlight] (luz suave no card
 * + borda acesa perto do ponteiro). Adaptado do Spotlight do 21st.dev.
 * Só com mouse e fora de is-lite. Escreve --spot-x/--spot-y (px) no máximo
 * uma vez por frame; o retângulo é medido na entrada do ponteiro.
 */

import { isLite, onChange } from './motion.js';

function setupCard(card) {
  let rect = null;
  let frame = 0;
  let x = 0;
  let y = 0;

  const write = () => {
    frame = 0;
    card.style.setProperty('--spot-x', `${x.toFixed(0)}px`);
    card.style.setProperty('--spot-y', `${y.toFixed(0)}px`);
  };

  const reset = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    rect = null;
    card.classList.remove('is-lit');
  };

  card.addEventListener('pointerenter', (e) => {
    if (e.pointerType !== 'mouse' || isLite()) return;
    rect = card.getBoundingClientRect(); // uma leitura por entrada, não por movimento
    card.classList.add('is-lit');
  });

  card.addEventListener('pointermove', (e) => {
    if (!card.classList.contains('is-lit')) return;
    if (!rect) rect = card.getBoundingClientRect(); // remede após scroll
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
    if (!frame) frame = requestAnimationFrame(write);
  }, { passive: true });

  card.addEventListener('pointerleave', reset);
  return { reset, invalidate: () => { rect = null; } };
}

export function initCards() {
  const cards = document.querySelectorAll('[data-spotlight]');
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!cards.length || !fine.matches) return;

  const handles = [...cards].map(setupCard);
  // Scroll move o card sob o mouse: descarta o retângulo (remedido no próximo movimento).
  window.addEventListener('scroll', () => handles.forEach((h) => h.invalidate()), { passive: true });
  // Se o modo lite ligar no meio do uso, apaga os faróis.
  onChange(() => isLite() && handles.forEach((h) => h.reset()));
}
