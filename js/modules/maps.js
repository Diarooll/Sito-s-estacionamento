/**
 * maps.js — cria os iframes de mapa/360° só quando o .embed chega perto da tela
 * (rootMargin 300px). No load do iframe adiciona .is-loaded (fim do skeleton).
 */

function load(embed) {
  const src = embed.dataset.lazySrc;
  if (!src || embed.querySelector('iframe')) return;

  const iframe = document.createElement('iframe');
  iframe.title = embed.dataset.lazyTitle || 'Mapa';
  iframe.loading = 'lazy';
  iframe.referrerPolicy = 'no-referrer-when-downgrade';
  iframe.allowFullscreen = true;
  iframe.addEventListener('load', () => embed.classList.add('is-loaded'), { once: true });
  iframe.src = src;
  embed.appendChild(iframe);
}

export function initMaps() {
  const embeds = document.querySelectorAll('.embed[data-lazy-src]');
  if (!embeds.length) return;

  if (!('IntersectionObserver' in window)) {
    embeds.forEach(load);
    return;
  }

  // Painéis de aba com [hidden] não intersectam; carregam quando a aba abrir.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        load(entry.target);
      });
    },
    { rootMargin: '300px 0px' }
  );

  embeds.forEach((el) => observer.observe(el));
}
