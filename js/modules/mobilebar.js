/**
 * mobilebar.js — barra fixa no celular ([data-mobile-bar]) com o status
 * aberto/fechado e "Como chegar". Aparece (.is-visible) depois que os botões
 * do hero saem da tela por cima; some com o menu aberto (CSS, .menu-open).
 * O tamanho de tela fica a cargo do CSS (só < 960px).
 */

export function initMobileBar() {
  const bar = document.querySelector('[data-mobile-bar]');
  const anchor = document.querySelector('.hero__actions');
  if (!bar || !anchor || !('IntersectionObserver' in window)) return;

  new IntersectionObserver(([entry]) => {
    // passou por cima (não está visível e ficou acima da tela)
    const passed = !entry.isIntersecting && entry.boundingClientRect.top < 0;
    bar.classList.toggle('is-visible', passed);
  }).observe(anchor);

  document.documentElement.classList.add('has-mobile-bar');
}
