/**
 * hero.js — entrada sequencial do hero (Web Animations API) e parallax da foto.
 *
 * Entrada: cada [data-hero] anima em ordem; ao terminar recebe .is-shown e a
 * animação é cancelada (o CSS assume o estado final). Roda em todos os modos,
 * só fica mais curta/sem deslocamento em is-reduced.
 * Parallax: [data-parallax="fator"] recebe --parallax-y (px) enquanto visível,
 * desligado em is-reduced/is-lite.
 */

import { allowsRichMotion, dur, isReduced, onChange, rafThrottle, EASE_OUT } from './motion.js';

const STEP = 110;

/* ---------- entrada ---------- */

function keyframesFor(el) {
  const reduced = isReduced();
  if (el.dataset.hero === 'media') {
    return reduced
      ? [{ opacity: 0, transform: 'scale(.99)' }, { opacity: 1, transform: 'none' }]
      : [{ opacity: 0, transform: 'scale(.96)' }, { opacity: 1, transform: 'none' }];
  }
  return reduced
    ? [{ opacity: 0 }, { opacity: 1 }]
    : [{ opacity: 0, transform: 'translate3d(0,24px,0)' }, { opacity: 1, transform: 'none' }];
}

/** Evento para quem depende do hero (ex.: contadores começam junto com o fade). */
function announce(el) {
  el.dataset.heroEntered = '';
  el.dispatchEvent(new CustomEvent('hero:enter', { bubbles: true }));
}

function show(el) {
  el.classList.add('is-shown');
  announce(el);
}

function playEntrance() {
  const items = [...document.querySelectorAll('[data-hero]')];
  if (!items.length) return;

  // Sem WAAPI: apenas mostra (o CSS faz o fade de .is-shown, se houver).
  if (typeof items[0].animate !== 'function') {
    items.forEach(show);
    return;
  }

  const step = isReduced() ? STEP / 2 : STEP;
  const duration = (el) => dur(el.dataset.hero === 'media' ? 1000 : 700);

  items.forEach((el, i) => {
    const delay = i * step;
    const anim = el.animate(keyframesFor(el), {
      duration: duration(el),
      delay,
      easing: EASE_OUT,
      fill: 'both',
    });

    // Avisa (ex.: contadores) quando o item começa a aparecer de fato.
    window.setTimeout(() => announce(el), delay);

    const finish = () => {
      el.classList.add('is-shown'); // classe antes do cancel: sem "piscar"
      anim.cancel();
      el.dispatchEvent(new CustomEvent('hero:shown', { bubbles: true }));
    };
    anim.finished.then(finish, finish);
  });
}

/* ---------- parallax ---------- */

function initParallax() {
  const items = [...document.querySelectorAll('[data-parallax]')].map((el) => ({
    el,
    factor: parseFloat(el.dataset.parallax) || 0.1,
    top: 0,
    height: 0,
    visible: false,
  }));
  if (!items.length || !('IntersectionObserver' in window)) return;

  let viewportH = window.innerHeight;
  let active = false;

  // Mede o contêiner (não a imagem, que está transformada) fora do loop de scroll.
  const measure = () => {
    viewportH = window.innerHeight;
    const scrollY = window.scrollY;
    items.forEach((item) => {
      const box = (item.el.parentElement || item.el).getBoundingClientRect();
      item.top = box.top + scrollY;
      item.height = box.height;
    });
  };

  // Por frame: só lê scrollY e escreve variáveis (sem leitura de layout).
  const update = rafThrottle(() => {
    if (!active) return;
    const center = window.scrollY + viewportH / 2;
    items.forEach((item) => {
      if (!item.visible) return;
      const offset = (center - (item.top + item.height / 2)) * item.factor;
      const limit = item.height * 0.04; // deslocamento sutil: até 4% da altura do contêiner
      const y = Math.max(-limit, Math.min(limit, offset));
      item.el.style.setProperty('--parallax-y', `${y.toFixed(1)}px`);
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const item = items.find((it) => it.el === entry.target);
      if (item) item.visible = entry.isIntersecting;
    });
    update();
  });

  const onScroll = () => update();
  const onResize = rafThrottle(() => {
    measure();
    update();
  });

  const start = () => {
    if (active) return;
    active = true;
    measure();
    items.forEach((item) => observer.observe(item.el));
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('load', onResize, { once: true }); // fontes/imagens mudam medidas
  };

  // Remede quando as fontes chegam e quando o bloco de mídia termina a entrada
  // (durante o WAAPI ele está em scale(.96), o que distorce a 1ª medição).
  document.fonts?.ready.then(() => active && onResize());
  document.addEventListener('hero:shown', (e) => {
    if (active && e.target.dataset.hero === 'media') onResize();
  });

  const stop = () => {
    if (!active) return;
    active = false;
    observer.disconnect();
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    items.forEach((item) => item.el.style.removeProperty('--parallax-y'));
  };

  // O modo lite pode ser ligado depois (medição de FPS): reage na hora.
  const sync = () => (allowsRichMotion() ? start() : stop());
  onChange(sync);
  sync();
}

export function initHero() {
  playEntrance();
  initParallax();
}
