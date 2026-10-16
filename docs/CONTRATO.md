# Contrato do projeto — Sito's Estacionamentos

Fonte única de verdade entre os agentes **HTML**, **CSS** e **JS**. Antes de inventar um
nome de classe, atributo ou variável, procure aqui. Se precisar de algo novo ou mudar algo,
**avise os outros agentes (SendMessage)** e registre no **Log de decisões** no fim.

## Donos dos arquivos (não edite arquivo de outro agente — peça por mensagem)
| Agente | Arquivos |
|---|---|
| HTML | `index.html` |
| CSS  | `css/base.css`, `css/layout.css`, `css/components.css`, `css/sections.css`, `css/animations.css` |
| JS   | `js/main.js`, `js/modules/*.js` |

Assets prontos (não alterar): `assets/logo/logo.svg` (logo transparente, proporção ~2.6:1),
`assets/logo/simbolo-e.svg` (círculo vermelho + E, quadrado), `assets/icons/favicon.svg`,
`assets/icons/favicon-32.png`, `assets/icons/apple-touch-icon.png`,
`assets/img/interior-ana-barbosa.webp` + `.jpg` (1206×677, interior coberto da Un. 1).
**Não existe foto da Un. 2** → usar `.media-placeholder` (ver abaixo).

## Objetivo
Landing page escura, **dinâmica e que desperte interesse**, com muitas animações suaves —
que **rodem também em PC fraco** (nunca deixar a página estática). Sem formulário e sem
contato (o negócio não tem canal de contato). Português do Brasil. Sem bibliotecas, sem build.

## Conteúdo (exato — não alterar valores)
- Nome: **Sito's Estacionamentos** · Méier, Rio de Janeiro · **Há mais de 27 anos com você**
- Carros e motos pagam o mesmo valor · Tolerância de 5 minutos · Rotativo, diária, pernoite, mensalista
- Horário (as duas unidades): **Seg a Sex 7:00–21:00 · Sábado 7:30–17:00** (domingo: não mencionar na lista; o status "Fechado agora" pode aparecer)

| Faixa | Un. 1 — R. Ana Barbosa, 44 (`ana-barbosa`) | Un. 2 — R. Jacinto, 57 e 61 (`jacinto`) |
|---|---|---|
| Promoção até 30 min | R$ 12 | R$ 10 |
| Até 2h | R$ 15 | R$ 13 |
| 2h01 até 3h | R$ 17 | R$ 15 |
| 3h01 até 4h | R$ 19 | R$ 17 |
| 4h01 até 5h | R$ 21 | R$ 19 |
| 5h01 até 6h | R$ 23 | R$ 21 |
| 6h01 até 7h | R$ 25 | R$ 23 |
| 7h01 até 8h | R$ 27 | R$ 25 |
| 8h01 até 9h | R$ 29 | R$ 27 |
| Diária | R$ 29 | R$ 29 |
| Pernoite | R$ 28 | R$ 27 |
| Mensalista | R$ 430/mês | R$ 400/mês |

Endereços:
- Un. 1: R. Ana Barbosa, 44 – Méier, Rio de Janeiro – RJ, 20735-120 · geo -22.9006456, -43.2816968
- Un. 2: R. Jacinto, 57 e 61 – Méier, Rio de Janeiro – RJ, 20725-020 · geo -22.9035429, -43.2814071

URLs:
- Mapa Un.1: `https://www.google.com/maps?q=R.+Ana+Barbosa,+44+-+M%C3%A9ier,+Rio+de+Janeiro+-+RJ,+20735-120&output=embed`
- Mapa Un.2: `https://www.google.com/maps?q=R.+Jacinto,+57+-+M%C3%A9ier,+Rio+de+Janeiro+-+RJ,+20725-020&output=embed`
- Rota Un.1: `https://www.google.com/maps/dir/?api=1&destination=R.+Ana+Barbosa,+44+-+M%C3%A9ier,+Rio+de+Janeiro+-+RJ`
- Rota Un.2: `https://www.google.com/maps/dir/?api=1&destination=R.+Jacinto,+57+-+M%C3%A9ier,+Rio+de+Janeiro+-+RJ`
- 360° Un.1: `https://www.google.com/maps/embed?pb=!4v1!6m8!1m7!1sCIHM0ogKEICAgIC1j6XKxwE!2m2!1d-22.9006456!2d-43.2816968!3f0!4f0!5f0.7820865974627469`
- 360° Un.2: `https://www.google.com/maps/embed?pb=!4v1!6m8!1m7!1sCIHM0ogKEICAgIDE5dHvkQE!2m2!1d-22.9035429!2d-43.2814071!3f90!4f0!5f0.7820865974627469`

## Design tokens (definidos em `css/base.css`, `:root`)
```
--preto:#0B0B0B  --grafite:#1A1A1A  --grafite-2:#222  --borda:#2A2A2A
--branco:#FFFFFF --cinza:#B3B3B3    --vermelho:#ED1C24 --vermelho-btn:#D4141B
--font-display:"Saira", system-ui, sans-serif   (itálico 800, títulos/etiquetas/preços grandes)
--font-body:"Inter", system-ui, sans-serif
--radius-sm:10px --radius:16px --radius-lg:28px
--ease-out:cubic-bezier(.22,1,.36,1)   --ease-in-out:cubic-bezier(.65,0,.35,1)
--dur-fast:180ms --dur:450ms --dur-slow:800ms
--header-h:72px (encolhido: 60px)
```
Vermelho em ~10% da tela: CTA primário, item ativo do menu, etiquetas, aba ativa, destaque do mensalista, brilho dos cards.
Contraste AA. Gutter lateral 16px no mobile. Mobile-first; breakpoints 640px, 960px, 1200px. Container máx. 1200px.

Fontes (no `<head>`): preconnect + `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Saira:ital,wght@1,700;1,800&display=swap`

## Estrutura do HTML (ordem, IDs e blocos BEM)
```
<html lang="pt-BR" class="no-js">   ← script inline no <head> troca para "js" (ver Classes globais)
header.site-header#topo
  .site-header__inner.container
    a.site-header__logo[href="#inicio"] > img(logo.svg, alt="Sito's Estacionamentos")
    button.site-header__toggle[aria-controls="site-nav"][aria-expanded="false"] (3 spans .site-header__bar)
    nav.site-nav#site-nav[aria-label="Principal"] > ul.site-nav__list > li > a.site-nav__link
        links: #inicio Início · #servicos Serviços · #precos Preços · #unidades Unidades · #horario Horário
    a.btn.btn--primary.site-header__cta[href="#unidades"] "Como chegar"
main
  section.hero#inicio
    .hero__inner.container
      .hero__content            ← o "bolso" de texto; a foto contorna esse bloco
        p.hero__eyebrow[data-hero] "Méier · Rio de Janeiro"
        h1.hero__title > span.hero__line[data-hero] (2–3 linhas)
        p.hero__text[data-hero]
        .hero__actions[data-hero] > a.btn.btn--primary[href="#precos"] "Ver preços" + a.btn.btn--ghost[href="#unidades"] "Como chegar"
      .hero__media[data-hero="media"] > picture > img.hero__img[data-parallax="0.12"] (webp+jpg, fetchpriority="high", width/height)
      ul.hero__stats[data-hero]
        li.stat > strong.stat__value[data-count-to="27" data-count-suffix="+"] + span.stat__label "anos com você"
        li.stat > strong.stat__value[data-count-to="2"] + "unidades no Méier"
        li.stat > strong.stat__value[data-count-to="5" data-count-suffix=" min"] + "de tolerância"
  section.section.services#servicos
    .container > header.section__head[data-reveal] (p.section__eyebrow + h2.section__title + p.section__lead)
    .services__grid[data-reveal-stagger]
      article.card[data-tilt][data-reveal]  (×3; o 3º também .card--featured)
        .card__media  (img da foto OU .media-placeholder)
        .card__body > span.card__tag + h3.card__title + p.card__price + p.card__note
        cards: Rotativo "a partir de R$ 10" (promo 30 min) · Diária & Pernoite "diária R$ 29" · Mensalista "a partir de R$ 400/mês"
  section.section.pricing#precos
    .container > header.section__head[data-reveal]
      .tabs[data-tabs][data-reveal]
        .tabs__list[role="tablist"] > button.tabs__tab[role="tab"][data-tab="ana-barbosa"|"jacinto"][aria-selected][aria-controls] + span.tabs__indicator[aria-hidden]
        .tabs__panel[role="tabpanel"][data-tab-panel="ana-barbosa"]  (o inativo com atributo hidden)
          table.price-table > caption.sr-only + tbody > tr.price-table__row > th[scope=row] + td > span.price[data-count-to="15" data-count-prefix="R$ "]
              linha da promoção: .price-table__row--promo · linha mensalista: .price-table__row--featured
      ul.pricing__notes[data-reveal] (tolerância 5 min · carros e motos mesmo valor · pernoite)
  section.section.units#unidades
    .container > header.section__head[data-reveal]
    .units__grid[data-reveal-stagger]
      article.unit[data-reveal] (×2)
        .unit__media (foto na Un.1, .media-placeholder na Un.2)
        .unit__body > h3.unit__title + address.unit__address + a.btn.btn--primary[target=_blank][rel="noopener"] "Como chegar"
        .embed.unit__map[data-lazy-src="<mapa>"][data-lazy-title="Mapa da unidade …"] > noscript a(link do mapa)
  section.section.tour#tour
    .container > header.section__head[data-reveal] "Conheça por dentro em 360°"
      .tabs[data-tabs][data-reveal] (mesmo componente; data-tab="tour-ana-barbosa"|"tour-jacinto")
        painéis com .embed.embed--wide[data-lazy-src="<360>"][data-lazy-title]
  section.section.hours#horario
    .container > header.section__head[data-reveal]
      .hours[data-reveal] > p.hours__status[data-hours-status] (JS preenche) + dl.hours__list (Seg a Sex / Sábado)
footer.site-footer
  .container > img logo + endereços + horário + p "© <span data-year>2026</span> Sito's Estacionamentos" + a "Voltar ao topo"[href="#inicio"]
```
`.media-placeholder`: div com gradiente grafite + `simbolo-e.svg` centralizado (img decorativa, alt="") e um `span.media-placeholder__label` ("Foto em breve" ou nome da unidade). Fácil de trocar por `<img>` depois.
`.sr-only` para textos só de leitor de tela.

## Classes e atributos de estado (JS liga, CSS estiliza)
**Classes globais no `<html>`:**
- `no-js` → `js`: script inline no `<head>` (do HTML): `document.documentElement.classList.replace('no-js','js')` + timeout de 3000ms que adiciona `anim-fallback` se `is-ready` não existir.
- `is-ready`: main.js adiciona ao iniciar.
- `anim-fallback`: CSS mostra TUDO sem animação (segurança).
- `is-reduced`: usuário tem prefers-reduced-motion → **animações continuam**, mas só fade/escala curtos (sem deslocamentos grandes, sem parallax, sem tilt).
- `is-lite`: hardware fraco detectado → mantém reveals, contadores, abas, entrada do hero; desliga tilt, parallax e `backdrop-filter`.
- `menu-open`: menu mobile aberto (trava scroll do body).

**Estados escondidos só existem sob `.js`** (sem JS tudo aparece).

| Gatilho (HTML) | O que o JS faz | O que o CSS faz |
|---|---|---|
| `[data-reveal]` (valor opcional: `up` padrão, `fade`, `left`, `right`, `scale`) + `[data-reveal-delay="ms"]` | IntersectionObserver adiciona `.is-visible` (uma vez) | `.js [data-reveal]` começa invisível/deslocado; `.is-visible` faz transição p/ normal usando `transition-delay: var(--reveal-delay, 0ms)` |
| `[data-reveal-stagger]` no pai | define `--reveal-delay` nos filhos `[data-reveal]` (i × 90ms) | usa `--reveal-delay` |
| `[data-hero]` | entrada sequencial (WAAPI) ao carregar; ao terminar adiciona `.is-shown` | `.js [data-hero]` começa `opacity:0`; `.is-shown` = `opacity:1` |
| `.site-header` | adiciona `.is-scrolled` quando scrollY > 24 | encolhe altura, fundo + blur (sem blur em `.is-lite`) |
| `.site-header__toggle` | alterna `aria-expanded`, `.is-open` em `.site-nav` e `menu-open` no html; fecha com Esc/clique em link | anima abertura (transform/opacity) |
| `.site-nav__link` | scrollspy: `.is-active` no link da seção visível; scroll suave com offset do header | sublinhado vermelho animado em `.is-active` |
| `[data-tabs]` / `.tabs__tab` / `.tabs__panel` | clique/teclado (setas): `.is-active` + `aria-selected`, troca `hidden`, seta `--indicator-x` e `--indicator-w` (px) no `.tabs__list`; linhas do painel novo entram em cascata | indicador posicionado com essas variáveis + transição |
| `[data-count-to]` (+ `data-count-prefix`, `data-count-suffix`, `data-count-duration`) | ao ficar visível conta de 0 até o valor (texto final já vem no HTML) | `font-variant-numeric: tabular-nums` |
| `[data-tilt]` | desktop com mouse e sem `is-lite`/`is-reduced`: seta `--tilt-x`, `--tilt-y` (deg), `--glow-x`, `--glow-y` (%) e `.is-tilting` | `transform: perspective(900px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y))` + brilho radial vermelho em `--glow-x/y` |
| `[data-parallax="fator"]` | rAF: seta `--parallax-y` (px) enquanto visível (não em lite/reduced) | `transform: translate3d(0,var(--parallax-y,0),0) scale(1.08)` |
| `.embed[data-lazy-src]` | ao chegar perto da tela cria `<iframe loading="lazy" title=…>`; no `load` adiciona `.is-loaded` | skeleton animado até `.is-loaded`, depois fade do iframe |
| `[data-hours-status]` | calcula aberto/fechado (fuso America/Sao_Paulo), preenche texto ("Aberto agora · fecha às 21:00" / "Fechado agora · abre seg às 7:00") e `.is-open`/`.is-closed` | badge com ponto pulsante verde/vermelho |
| `[data-year]` | ano atual | — |

## Regras de desempenho (obrigatórias — a página NUNCA pode ficar estática)
- Animar só `transform` e `opacity` (exceção tolerada: largura do indicador das abas).
- Sem listeners de scroll pesados: IntersectionObserver; parallax/header com rAF + `{passive:true}`, 1 leitura por frame.
- `will-change` só durante a animação.
- Animações infinitas (ponto pulsante, skeleton) pausam fora da tela ou são baratas.
- `prefers-reduced-motion` NÃO desliga tudo: vira `is-reduced` (fades curtos).
- Detecção de lite em `js/modules/motion.js`: `hardwareConcurrency <= 4` || `deviceMemory <= 4` || FPS medido < 45 no 1º segundo.

## Log de decisões
(cada agente adiciona: `- [AGENTE] decisão — motivo`)
- [ORQUESTRADOR] Contrato inicial criado.
