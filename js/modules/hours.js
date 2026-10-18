/**
 * hours.js — status "Aberto/Fechado agora" no fuso de São Paulo (Intl),
 * independente do fuso do visitante. Atualiza na virada de cada minuto.
 * [data-hours-status="short"] recebe a versão curta (barra fixa do celular).
 * [data-timeline]: marca o dia de hoje (.is-today) e põe o "agora" (--now,
 * em horas decimais) na barra dele.
 */

const TIME_ZONE = 'America/Sao_Paulo';
const DAY_LABELS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

// Minutos desde 00:00, por dia da semana (0 = domingo). null = fechado.
const SCHEDULE = [
  null,
  [420, 1260], // seg 7:00–21:00
  [420, 1260],
  [420, 1260],
  [420, 1260],
  [420, 1260], // sex
  [450, 1020], // sáb 7:30–17:00
];

const WEEKDAYS = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

const formatter = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE,
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

const toClock = (min) => `${Math.floor(min / 60)}:${String(min % 60).padStart(2, '0')}`;

/** Dia da semana e minuto atuais em São Paulo. */
function nowInSaoPaulo() {
  const parts = Object.fromEntries(formatter.formatToParts(new Date()).map((p) => [p.type, p.value]));
  return { day: WEEKDAYS[parts.weekday], minute: (parseInt(parts.hour, 10) % 24) * 60 + parseInt(parts.minute, 10) };
}

function status() {
  const { day, minute } = nowInSaoPaulo();
  const today = SCHEDULE[day];

  if (today && minute >= today[0] && minute < today[1]) {
    return { open: true, text: `Aberto agora · fecha às ${toClock(today[1])}`, short: `Aberto até ${toClock(today[1])}` };
  }

  // Próxima abertura: hoje (antes de abrir), amanhã ou o próximo dia útil.
  if (today && minute < today[0]) {
    return { open: false, text: `Fechado agora · abre hoje às ${toClock(today[0])}`, short: `Abre às ${toClock(today[0])}` };
  }
  for (let ahead = 1; ahead <= 7; ahead += 1) {
    const d = (day + ahead) % 7;
    if (SCHEDULE[d]) {
      const when = ahead === 1 ? 'amanhã' : DAY_LABELS[d];
      return { open: false, text: `Fechado agora · abre ${when} às ${toClock(SCHEDULE[d][0])}`, short: `Abre ${when} ${toClock(SCHEDULE[d][0])}` };
    }
  }
  return { open: false, text: 'Fechado agora', short: 'Fechado' };
}

/** Linha do tempo: hoje em destaque + marcador "agora" na hora atual. */
function renderTimeline(root) {
  const { day, minute } = nowInSaoPaulo();
  root.querySelectorAll('[data-day]').forEach((row) => {
    const today = Number(row.dataset.day) === day;
    row.classList.toggle('is-today', today);
    if (today) row.style.setProperty('--now', (minute / 60).toFixed(3));
    else row.style.removeProperty('--now');
  });
}

export function initHours() {
  const targets = document.querySelectorAll('[data-hours-status]');
  const timeline = document.querySelector('[data-timeline]');
  if (!targets.length && !timeline) return;

  const render = () => {
    if (timeline) renderTimeline(timeline);
    const { open, text, short } = status();
    targets.forEach((el) => {
      const value = el.dataset.hoursStatus === 'short' ? short : text;
      if (el.textContent !== value) el.textContent = value; // aria-live só fala quando muda
      el.classList.toggle('is-open', open);
      el.classList.toggle('is-closed', !open);
    });
  };

  // Agenda para a virada exata do próximo minuto.
  let timer = 0;
  const schedule = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      render();
      schedule();
    }, 60000 - (Date.now() % 60000) + 50);
  };

  render();
  schedule();

  // Aba volta do segundo plano (timers podem ter atrasado): atualiza já.
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      render();
      schedule();
    }
  });
}
