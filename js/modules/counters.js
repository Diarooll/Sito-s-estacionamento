/**
 * counters.js — [data-count-to] conta de 0 até o valor ao ficar visível.
 * O texto final já vem no HTML (sem JS/IO ele simplesmente fica lá).
 * Dentro do hero, espera o item começar a entrar (evento hero:enter).
 */

import { isReduced } from './motion.js';

const DEFAULT_DURATION = 1400;
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

function setup(el) {
  const raw = el.dataset.countTo;
  const target = parseFloat(raw);
  if (Number.isNaN(target)) return null;

  const decimals = (raw.split('.')[1] || '').length;
  const format = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  const prefix = el.dataset.countPrefix || '';
  const suffix = el.dataset.countSuffix || '';
  const finalText = el.textContent;

  const render = (value) => {
    el.textContent = `${prefix}${format.format(value)}${suffix}`;
  };

  return { el, target, finalText, render, done: false };
}

function play(counter) {
  if (counter.done) return;
  counter.done = true;

  const base = parseInt(counter.el.dataset.countDuration, 10) || DEFAULT_DURATION;
  const duration = isReduced() ? Math.min(base, 700) : base;
  let start = 0;

  const tick = (now) => {
    if (!start) start = now;
    const t = Math.min((now - start) / duration, 1);
    if (t < 1) {
      counter.render(counter.target * easeOutCubic(t));
      requestAnimationFrame(tick);
    } else {
      counter.el.textContent = counter.finalText; // termina exatamente no texto do HTML
    }
  };
  requestAnimationFrame(tick);
}

/** Se o contador está num item do hero, só toca depois que o item entrar. */
function whenHeroReady(counter, fn) {
  const heroItem = counter.el.closest('[data-hero]');
  if (!heroItem || 'heroEntered' in heroItem.dataset) return fn();
  heroItem.addEventListener('hero:enter', fn, { once: true });
  // Segurança: se o hero não rodar, conta mesmo assim.
  window.setTimeout(fn, 2500);
}

export function initCounters() {
  const elements = document.querySelectorAll('[data-count-to]');
  if (!elements.length || !('IntersectionObserver' in window)) return;

  const counters = new Map();
  elements.forEach((el) => {
    const counter = setup(el);
    if (!counter) return;
    counter.render(0);
    counters.set(el, counter);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const counter = counters.get(entry.target);
        observer.unobserve(entry.target);
        if (counter) whenHeroReady(counter, () => play(counter));
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((_, el) => observer.observe(el));
}
