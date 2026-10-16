/**
 * scrollspy.js — marca .is-active no link da seção visível e faz scroll suave
 * (com desconto da altura do header) em todos os links internos "#id".
 * Em is-reduced o salto é instantâneo.
 */

import { isReduced } from './motion.js';

const GAP = 8; // respiro entre o header e o topo da seção

function headerHeight() {
  const header = document.querySelector('.site-header');
  return header ? header.getBoundingClientRect().height : 0;
}

function setActive(links, id) {
  links.forEach((link) => {
    const on = link.hash === `#${id}`;
    link.classList.toggle('is-active', on);
    if (on) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

function scrollToTarget(target) {
  const top = target.id === 'inicio'
    ? 0
    : target.getBoundingClientRect().top + window.scrollY - headerHeight() - GAP;

  try {
    window.scrollTo({ top, behavior: isReduced() ? 'instant' : 'smooth' });
  } catch {
    window.scrollTo(0, top); // navegadores sem o valor "instant"
  }

  // Acessibilidade: leva o foco junto, sem novo salto.
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}

function initSmoothScroll(links) {
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = e.target.closest('a[href^="#"]');
    if (!link || link.hash.length < 2) return;

    let target = null;
    try {
      target = document.querySelector(decodeURIComponent(link.hash));
    } catch {
      return; // hash que não é seletor válido: comportamento padrão
    }
    if (!target) return;

    e.preventDefault();
    scrollToTarget(target);
    if (history.pushState) history.pushState(null, '', link.hash);
    if (links.includes(link)) setActive(links, target.id);
  });
}

function initSpy(links) {
  if (!('IntersectionObserver' in window)) return;

  const sections = links
    .map((link) => document.getElementById(link.hash.slice(1)))
    .filter(Boolean);
  if (!sections.length) return;

  const visible = new Set();

  // Faixa de leitura: logo abaixo do header até ~45% da tela.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });
      // A primeira seção (na ordem da página) dentro da faixa vence.
      const current = sections.find((s) => visible.has(s));
      if (current) setActive(links, current.id);
    },
    { rootMargin: `-${Math.round(headerHeight())}px 0px -55% 0px`, threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

export function initScrollspy() {
  const links = [...document.querySelectorAll('.site-nav__link[href^="#"]')];
  initSmoothScroll(links);
  if (links.length) initSpy(links);
}
