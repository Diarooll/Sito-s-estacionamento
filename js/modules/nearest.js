/**
 * nearest.js — "Qual fica mais perto de mim?" nas unidades.
 * Só pede a localização quando a pessoa clica. Calcula a distância em linha
 * reta (haversine) até cada .unit[data-lat][data-lng], mostra em
 * [data-unit-distance] e destaca a mais próxima (.is-nearest + [data-unit-badge]).
 * Sem geolocalização no navegador, o bloco [data-nearest] continua escondido.
 */

const EARTH_M = 6371000;
const WALK_M_PER_MIN = 80; // passo tranquilo
const DETOUR = 1.3; // ruas não são linha reta

const rad = (deg) => (deg * Math.PI) / 180;

function distanceM(a, b) {
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_M * Math.asin(Math.sqrt(h));
}

function describe(m) {
  const fmt = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
  const dist = m < 1000 ? `${Math.round(m / 10) * 10} m` : `${fmt.format(m / 1000)} km`;
  if (m > 3000) return `≈ ${dist} de você`;
  const min = Math.max(1, Math.round((m * DETOUR) / WALK_M_PER_MIN));
  return `≈ ${dist} de você · uns ${min} min a pé`;
}

export function initNearest() {
  const root = document.querySelector('[data-nearest]');
  const units = [...document.querySelectorAll('.unit[data-lat][data-lng]')];
  if (!root || !units.length || !('geolocation' in navigator)) return;

  const btn = root.querySelector('[data-nearest-btn]');
  const label = root.querySelector('[data-nearest-label]');
  const msg = root.querySelector('[data-nearest-msg]');
  const idle = label.textContent;
  root.hidden = false;

  const show = (pos) => {
    const here = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    const measured = units.map((el) => ({
      el,
      m: distanceM(here, { lat: parseFloat(el.dataset.lat), lng: parseFloat(el.dataset.lng) }),
    }));
    const nearest = measured.reduce((a, b) => (b.m < a.m ? b : a));

    measured.forEach(({ el, m }) => {
      const on = el === nearest.el;
      el.classList.toggle('is-nearest', on);
      const badge = el.querySelector('[data-unit-badge]');
      if (badge) badge.hidden = !on;
      const out = el.querySelector('[data-unit-distance]');
      if (out) {
        out.textContent = describe(m);
        out.hidden = false;
      }
    });

    msg.textContent = `A unidade ${nearest.el.dataset.unit} é a mais perto de você.`;
  };

  const fail = (err) => {
    msg.textContent = err && err.code === 1
      ? 'Sem acesso à sua localização. Você pode permitir no navegador e tentar de novo.'
      : 'Não deu para descobrir sua localização agora. Tente de novo em instantes.';
  };

  btn.addEventListener('click', () => {
    btn.disabled = true;
    label.textContent = 'Procurando você…';
    msg.textContent = '';
    navigator.geolocation.getCurrentPosition(
      (pos) => { show(pos); btn.disabled = false; label.textContent = idle; },
      (err) => { fail(err); btn.disabled = false; label.textContent = idle; },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  });
}
