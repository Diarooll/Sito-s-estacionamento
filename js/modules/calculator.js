/**
 * calculator.js — preços interativos dos serviços.
 *
 * - Seletor de unidade ([data-unit-switch]): vale para a calculadora e o simulador.
 * - Rotativo ([data-calc]): a barra (input range) escolhe a faixa de horas e o
 *   preço muda na hora.
 * - Mensalista ([data-month]): calendário do mês atual; cada dia marcado soma
 *   o preço escolhido na barra do Rotativo (tempo por dia) e compara com o
 *   valor fixo do mensalista. Domingo: fechado.
 * - Diária & Pernoite ([data-stay]): botões Dia / Noite trocam o preço.
 * - Janelinha (#precos-dialog): tabela completa, aberta por [data-dialog-open].
 *
 * Fonte única dos valores: as tabelas da janelinha (data-count-to de cada
 * linha), lidas uma vez no início — nenhum preço é repetido aqui no JS.
 */

import { isReduced, EASE_OUT } from './motion.js';

const brl = (n) => `R$ ${n}`;
const PROMO_LABEL = 'Até 30 min · promo';

/* ---------- leitura dos preços ---------- */

function readPrices(dialog) {
  const units = {};
  dialog.querySelectorAll('[data-tab-panel]').forEach((panel) => {
    const rows = [...panel.querySelectorAll('tr')].map((tr) => ({
      label: tr.querySelector('th').textContent.trim(),
      value: parseFloat(tr.querySelector('[data-count-to]')?.dataset.countTo),
    }));
    const find = (label) => rows.find((r) => r.label === label)?.value;
    units[panel.dataset.tabPanel] = {
      hours: rows.slice(0, 9), // promoção 30 min … 8h01 até 9h
      daily: find('Diária'),
      overnight: find('Pernoite'),
      monthly: find('Mensalista'),
    };
  });
  return units;
}

/** Pequeno "pulo" no número quando ele muda. */
function bump(el) {
  if (typeof el.animate !== 'function') return;
  el.animate(
    isReduced()
      ? [{ opacity: 0.4 }, { opacity: 1 }]
      : [{ opacity: 0.4, transform: 'translate3d(0,6px,0)' }, { opacity: 1, transform: 'none' }],
    { duration: 260, easing: EASE_OUT }
  );
}

function setText(el, text) {
  if (!el || el.textContent === text) return;
  el.textContent = text;
  bump(el);
}

/* ---------- Rotativo: barra de horas ---------- */

function setupCalc(root, getUnit, onChange) {
  const range = root.querySelector('[data-calc-range]');
  const label = root.querySelector('[data-calc-label]');
  const price = root.querySelector('[data-calc-price]');
  if (!range) return { render: () => {}, current: () => null };

  /** Faixa escolhida na barra: { label, value } da unidade atual. */
  const current = () => getUnit().hours[Number(range.value)];

  const render = () => {
    const step = current();
    if (!step) return;
    const text = step.label.startsWith('Promoção') ? PROMO_LABEL : step.label;
    label.textContent = text;
    setText(price, brl(step.value));
    range.setAttribute('aria-valuetext', `${text}: ${brl(step.value)}`);
    // preenchimento da barra até o ponto (CSS usa --pct)
    range.style.setProperty('--pct', `${(Number(range.value) / Number(range.max)) * 100}%`);
  };

  range.addEventListener('input', () => {
    render();
    onChange();
  });
  return { render, current };
}

/** "Até 2h" → "até 2h"; promoção vira "até 30 min (promo)". */
function rateText(step) {
  if (step.label.startsWith('Promoção')) return 'até 30 min (promo)';
  return step.label.charAt(0).toLowerCase() + step.label.slice(1);
}

/* ---------- Mensalista: dias do mês ---------- */

function setupMonth(root, getUnit, getStep) {
  const grid = root.querySelector('[data-month-grid]');
  if (!grid) return () => {};

  const total = root.querySelector('[data-month-total]');
  const rate = root.querySelector('[data-month-rate]');
  const count = root.querySelector('[data-month-count]');
  const plan = root.querySelector('[data-month-plan]');
  const verdict = root.querySelector('[data-month-verdict]');

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();

  const name = root.querySelector('[data-month-name]');
  if (name) name.textContent = `em ${new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(now)}:`;

  // espaços antes do dia 1, para alinhar com D S T Q Q S S
  for (let i = 0; i < firstWeekday; i += 1) {
    grid.append(Object.assign(document.createElement('span'), { className: 'month__blank' }));
  }

  const days = [];
  for (let d = 1; d <= daysInMonth; d += 1) {
    const sunday = new Date(year, month, d).getDay() === 0;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'month__day';
    btn.textContent = String(d);
    if (sunday) {
      btn.disabled = true;
      btn.setAttribute('aria-label', `Dia ${d}, domingo: fechado`);
    } else {
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('aria-label', `Dia ${d}`);
      days.push(btn);
    }
    grid.append(btn);
  }

  const render = () => {
    const { daily, monthly } = getUnit();
    // valor por dia = faixa da barra do Rotativo (sem barra: a diária)
    const step = getStep();
    const perDay = step ? step.value : daily;
    const n = days.filter((b) => b.getAttribute('aria-pressed') === 'true').length;
    const sum = n * perDay;

    if (rate) rate.textContent = step ? rateText(step) : 'a diária';
    count.textContent = `(${n} × ${brl(perDay)})`;
    setText(total, brl(sum));
    setText(plan, brl(monthly));

    let text = 'Toque nos dias para comparar.';
    let win = false;
    if (sum > monthly) {
      text = `Com o mensalista você economiza ${brl(sum - monthly)} neste mês.`;
      win = true;
    } else if (sum === monthly) {
      text = 'Empata com o mensalista.';
    } else if (n > 0) {
      const missing = Math.floor(monthly / perDay) + 1 - n;
      // não sobram dias abertos no mês para o mensalista compensar
      text = missing > days.length - n
        ? 'Nesse ritmo, pagar por dia sai mais barato neste mês.'
        : `Mais ${missing} ${missing === 1 ? 'dia' : 'dias'} e o mensalista passa a compensar.`;
    }
    verdict.textContent = text;
    root.classList.toggle('is-win', win);
  };

  const press = (btn, on) => {
    btn.setAttribute('aria-pressed', String(on));
    btn.classList.toggle('is-on', on);
  };

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.month__day');
    if (!btn || btn.disabled) return;
    press(btn, btn.getAttribute('aria-pressed') !== 'true');
    render();
  });

  root.querySelector('[data-month-fill]')?.addEventListener('click', () => {
    days.forEach((b) => press(b, true));
    render();
  });
  root.querySelector('[data-month-clear]')?.addEventListener('click', () => {
    days.forEach((b) => press(b, false));
    render();
  });

  return render;
}

/* ---------- Diária & Pernoite: Dia / Noite ---------- */

function setupStay(root, getUnit) {
  const buttons = [...root.querySelectorAll('[data-stay-mode]')];
  const label = root.querySelector('[data-stay-label]');
  const price = root.querySelector('[data-stay-price]');
  if (!buttons.length) return () => {};

  let night = false;

  const render = () => {
    const { daily, overnight } = getUnit();
    root.classList.toggle('is-night', night);
    buttons.forEach((b) => b.setAttribute('aria-pressed', String((b.dataset.stayMode === 'night') === night)));
    label.textContent = night ? 'pernoite' : 'diária';
    setText(price, brl(night ? overnight : daily));
  };

  buttons.forEach((b) => b.addEventListener('click', () => {
    night = b.dataset.stayMode === 'night';
    render();
  }));
  return render;
}

/* ---------- janelinha com a tabela completa ---------- */

function setupDialog(dialog, getUnitKey) {
  const root = document.documentElement;

  const open = () => {
    // abre na aba da unidade escolhida no seletor
    const tab = dialog.querySelector(`[role="tab"][data-tab="${getUnitKey()}"]`);
    if (tab && tab.getAttribute('aria-selected') !== 'true') tab.click();
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    root.classList.add('dialog-open');
  };

  const close = () => {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  };

  dialog.addEventListener('close', () => root.classList.remove('dialog-open'));
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) close(); // clique no fundo escuro
  });
  dialog.querySelectorAll('[data-dialog-close]').forEach((b) => b.addEventListener('click', close));

  document.querySelectorAll(`[data-dialog-open="${dialog.id}"]`).forEach((b) => b.addEventListener('click', open));
}

export function initCalculator() {
  const dialog = document.getElementById('precos-dialog');
  if (!dialog) return;

  const prices = readPrices(dialog);
  const keys = Object.keys(prices);
  if (!keys.length) return;

  let unitKey = keys[0];
  const getUnit = () => prices[unitKey];

  const calcRoot = document.querySelector('[data-calc]');
  const monthRoot = document.querySelector('[data-month]');
  // a barra do Rotativo define o valor por dia do simulador do Mensalista
  let renderMonth = () => {};
  const calc = calcRoot
    ? setupCalc(calcRoot, getUnit, () => renderMonth())
    : { render: () => {}, current: () => null };
  const renderCalc = calc.render;
  if (monthRoot) renderMonth = setupMonth(monthRoot, getUnit, calc.current);
  const stayRoot = document.querySelector('[data-stay]');
  const renderStay = stayRoot ? setupStay(stayRoot, getUnit) : () => {};

  const unitSwitch = document.querySelector('[data-unit-switch]');
  if (unitSwitch) {
    const checked = unitSwitch.querySelector('input:checked');
    if (checked && prices[checked.value]) unitKey = checked.value;
    unitSwitch.addEventListener('change', (e) => {
      if (!prices[e.target.value]) return;
      unitKey = e.target.value;
      renderCalc();
      renderMonth();
      renderStay();
    });
  }

  setupDialog(dialog, () => unitKey);
  renderCalc();
  renderMonth();
  renderStay();
}
