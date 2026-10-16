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
`assets/img/og.jpg` (1200×630, imagem de compartilhamento com a logo).
**O site não usa fotos** (decisão do cliente na revisão 2) → toda área de mídia usa `.media-placeholder` (ver abaixo).

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
- 360° Un.1: `https://www.google.com/maps/embed?pb=!4v1!6m8!1m7!1sD1BftDe1TRQwd22ZzLyq9Q!2m2!1d-22.9008164!2d-43.281611!3f61.08!4f0!5f0.7820865974627469`
- 360° Un.2: `https://www.google.com/maps/embed?pb=!4v1!6m8!1m7!1sQs2sHYKmd-HCLvxGI0vaTg!2m2!1d-22.9034313!2d-43.2814623!3f158.85!4f0!5f0.7820865974627469`

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
- Detecção de lite em `js/modules/motion.js`: `hardwareConcurrency <= 2` || `deviceMemory <= 2` || FPS medido < 45 no 1º segundo (o FPS é o critério principal).

## Log de decisões
(cada agente adiciona: `- [AGENTE] decisão — motivo`)
- [ORQUESTRADOR] Contrato inicial criado.
- [HTML] `a.skip-link[href="#conteudo"]` no início do body + `main#conteudo` — acessibilidade (pular navegação).
- [HTML] `<script type="module" src="js/main.js">` no fim do body — pedido do Agente JS.
- [HTML] Placeholder: `img.media-placeholder__icon` (simbolo-e) + `svg.media-placeholder__glyph` decorativo opcional (cards 2 e 3) — pedido do CSS / ícones dos serviços.
- [HTML] Abas com ids `tab-<data-tab>` e painéis `panel-<data-tab>` (aria-controls/aria-labelledby); aba ativa já com `.is-active` — ligação ARIA.
- [HTML] `dl.hours__list > div.hours__item > dt + dd`; `.hours__status` com texto padrão do horário — fallback sem JS.
- [HTML] Footer: `.site-footer__logo`, `__tagline`, `__units > address.site-footer__address`, `__hours`, `__copy`, `__top` — nomear os elementos do rodapé.
- [JS] main.js carrega cada módulo com `import()` dinâmico dentro de try/catch — um arquivo com erro/404 não derruba os outros (import estático quebraria o grafo inteiro). `is-ready` entra depois que todos tentaram iniciar.
- [JS] `is-lite` pode ser adicionada até ~1s após o load (medição de FPS); módulos assinam `onChange()` do motion.js e desligam tilt/parallax na hora.
- [JS] `.tabs__list.is-ready` adicionada após o 1º posicionamento do indicador — CSS só liga a transição do indicador com ela (sem "deslize" no load). Combinado com o CSS.
- [JS] Hero: WAAPI com `fill: both`; ao terminar adiciona `.is-shown` e cancela a animação. Sem transition de opacity/transform em `[data-hero]` no CSS. Dispara evento `hero:enter` (e `data-hero-entered`) quando cada item começa a entrar — contadores do hero esperam por ele.
- [JS] Contadores: com IO disponível, o texto vira `prefixo + 0 + sufixo` na inicialização e termina exatamente no texto original do HTML.
- [JS] Scroll suave vale para todo `a[href^="#"]` (inclui skip-link e "Voltar ao topo"); move o foco para o alvo (`tabindex="-1"` se preciso) e faz `pushState`. Link ativo ganha também `aria-current="location"`.
- [JS] Módulo extra `hours.js` (não estava no plano de módulos): status aberto/fechado em America/Sao_Paulo via Intl, atualiza na virada de cada minuto e ao voltar para a aba.
- [JS] Tilt: `--tilt-x/-y` voltam a `0deg` no pointerleave (CSS faz a transição de volta fora de `.is-tilting`).
- [CSS] Tokens extras em base.css: `--vermelho-hover:#E0171F`, `--verde:#2BD46B` (ponto "aberto"), `--header-h-sm:60px`, `--gutter` (16/24/32px), escala `--fs-*` com clamp — evitar números mágicos.
- [CSS] Header "encolhe" só com transform (fundo `::before` sobe 12px, logo/toggle/CTA sobem 6px), sem animar height — regra "só transform/opacity". Nunca pôr transform em `.site-header__inner`/`.site-header` (o `.site-nav` mobile é `position:fixed` dentro deles).
- [CSS] Sem JS (`.no-js`) ou JS travado (`.anim-fallback:not(.is-ready)`): header vira absoluto e o menu vira linha simples de links (botão escondido), para a navegação nunca depender do JS.
- [CSS] Hero desktop: grid de 12 col; `.hero__media` ocupa linhas 1–2 inteiras, `.hero__content` fica na linha 1 (col 1–7) com fundo `--preto` + `border-bottom-right-radius` e dois cantos côncavos via `::before/::after` (radial-gradient). Sem wrapper extra. Stats na linha 3, abaixo da foto.
- [CSS] Abas: `.tabs__list:not(.is-ready)` pinta a aba `[aria-selected=true]` direto (indicador oculto) — sem JS a aba ativa continua visível; transição do indicador só com `.is-ready`.
- [CSS] `.price-table__row--promo th::after` gera o selo "Promo" (conteúdo decorativo; o texto "Promoção" já está no th).
- [CSS] Bloco interno do horário estilizado como `div.hours` (a section `.hours#horario` não recebe estilo próprio), conforme orquestrador.
- [CSS] `[tabindex="-1"]:focus{outline:none}` para as seções focadas pelo scroll suave do JS.
- [JS] Lite: critério estático baixado para `hardwareConcurrency <= 2` / `deviceMemory <= 2` (revisão 1 com o cliente) — 4 núcleos é comum hoje; o FPS medido decide de verdade.
- [JS] Reveal: ao terminar (transitionend do próprio elemento ou timeout delay + 1200ms), remove o `--reveal-delay` inline e adiciona `.is-revealed`; CSS zera o transition-delay com ela — o tilt/hover dos cards não herdam mais o atraso da cascata.
- [HTML] Revisão 1: embeds 360° trocados pelas fotos oficiais do Street View enviadas pelo cliente (seção URLs atualizada) — pedido do cliente.
- [HTML] Revisão 1: `.card__price` agora tem `span.card__price-label` ("a partir de"/"diária") + `span.card__price-value` (com `<small>/mês</small>` no mensalista) — o preço competia com o título e "R$ 400/mês" quebrava; nomes combinados com o CSS.
- [HTML] Revisão 1: `p.site-footer__hours` com cada intervalo em `<span>` (sem "·") — pedido do CSS para empilhar em linhas com nowrap.
- [CSS] Revisão 1: removida a faixa diagonal vermelha da foto do hero (fica só o degradê escuro embaixo) — pedido do cliente.
- [CSS] Revisão 1: preço dos cards vai para o rodapé do card (order + margin-top:auto + linha divisória), na ordem título → nota → preço. `.card__price-label` em Inter pequeno e cinza, `.card__price-value` em Saira com nowrap e `small` em 0.5em cinza — hierarquia clara e sem vão vazio.
- [CSS] Revisão 1: seção Horário centralizada (cabeçalho e `div.hours`) — evita o vazio à direita.
- [CSS] Revisão 1: no rodapé, os spans de `.site-footer__hours` ficam empilhados com nowrap. Do 640px em diante, © e "Voltar ao topo" dividem uma área `bottom`, com uma linha contínua (`.container::before`) no lugar de duas bordas separadas.
- [CSS+JS] Revisão 1: o reveal.js adiciona `.is-revealed` (e remove `--reveal-delay`) quando o reveal termina. O CSS zera `transition-delay` e usa transição curta no transform do card, então o tilt volta sem atraso.
- [JS] Parallax (revisão 2, símbolo E no `.media-placeholder--hero`): mede o elemento pai e limita a ±4% da altura dele; remede após `document.fonts.ready` e após a entrada do `[data-hero="media"]` (evento `hero:shown`) — a 1ª medição era feita com o bloco em scale(.96) do WAAPI.
- [HTML] Revisão 2: todas as fotos saíram (cliente). Hero: `.hero__media > .media-placeholder.media-placeholder--hero > img.media-placeholder__icon[data-parallax="0.12"]` (300×300, sem label/glyph, sem picture/`.hero__img`/fetchpriority). Card Rotativo e Un. 1 viram `.media-placeholder` (glyph relógio / pin); Un. 1 e Un. 2 com glyph de pin e rótulos "Unidade Ana Barbosa"/"Unidade Jacinto" (sem "Foto em breve"). og:image e JSON-LD image → `assets/img/og.jpg` (1200×630). Nenhuma referência a `interior-ana-barbosa` no index.html — markup combinado com o CSS.
- [CSS] Revisão 2: as fotos saíram. `.media-placeholder--hero` ocupa exatamente a área da antiga foto (`position:absolute; inset:0` dentro de `.hero__media`, mesmos cantos e mesmo bolso). Símbolo com clamp(160px, 9rem + 12vw, 300px), brilho radial vermelho e drop-shadow. No desktop, `padding-left: --pocket-w` (7/12 e 50% a partir de 1200px) centraliza o símbolo na parte visível, à direita do bolso.
- [CSS] Revisão 2: `[data-parallax]` agora é só `translate3d(0, var(--parallax-y), 0)`, sem scale(1.08). O símbolo do hero fica com `transition:none` para o parallax não "arrastar". Removidos os estilos órfãos de foto (`.hero__img`, `.hero__media picture`, `.hero__media::after`, `.card__media > img`, `.unit__media > img`). As alturas de card e unidade não mudam, porque vêm do aspect-ratio da mídia.
- [ORQUESTRADOR] Cache-busting: CSS e `js/main.js` com `?v=AAAAMMDDHHMM` e `<script type="importmap">` no fim do body mapeando cada `js/modules/*.js` para a versão com `?v=` (assim os imports entre módulos, ex. `./motion.js`, também pegam a versão nova sem duplicar instâncias). Rodar `scripts/versao.sh` antes de publicar. Módulo novo → adicionar no importmap.
- [HTML] (branch teste/hero) Hero full-width: `section.hero.hero--full#inicio` > `div.hero__bg[aria-hidden][data-hero="media"]` (`img.hero__symbol[data-parallax="0.3"][data-parallax-max="160"]` 900×900 (pai .hero__bg = tamanho do hero, referência do JS) + `span.hero__beam.hero__beam--1|2|3` + `div.hero__fade`) + `.hero__inner.container` (`.hero__content` + `ul.hero__stats`) + `a.hero__scroll[href="#servicos"][data-hero][aria-label="Role para baixo até Serviços"]` (`span.hero__scroll-icon[aria-hidden]` + `span.hero__scroll-text`). 3ª linha do título `.hero__line--accent`. Saem `.hero__media` e `.media-placeholder--hero` — cliente quer hero moderno de largura total, sem o "bolso".
- [JS] Hero tela cheia (teste/hero): `[data-parallax-max="px"]` limita o deslocamento em px (sem ele, 4% da altura do pai). E gigante: `img.hero__symbol[data-parallax="0.3"][data-parallax-max="160"]` em `div.hero__bg[data-hero="media"]` — combinado com HTML e CSS.
- [JS] Entrada de `[data-hero="media"]` agora vai de `scale(1.05)` → normal (era `.96`): a camada tem o tamanho do hero, e escala menor que 1 revelaria as bordas.
- [JS] `.hero.is-offscreen` via IntersectionObserver quando o hero sai totalmente da tela; o CSS pausa as faixas de luz — combinado com o CSS.
- [JS] `.site-header.is-hovered`: pointerenter/leave só com `pointerType === 'mouse'` e `(hover: hover)`, e também foco dentro do header (focusin/focusout com relatedTarget). CSS encolhe com `.is-scrolled:not(.is-hovered)` — combinado com o CSS. Sem módulo novo (importmap inalterado).
- [CSS] Hero tela cheia (teste/hero): `.hero--full` com min-height max(620px, 100svh). Camadas: brilho radial (`.hero__bg::before`) → `img.hero__symbol` (tamanho `--sym: clamp(420px, 78svh, 860px)`, cortado ~30% na borda direita, começando logo abaixo do header; o parallax só translada) → `.hero__beam--1/2/3` → `.hero__fade::before` (preto sólido à esquerda) e `::after` (fade embaixo) → texto. Mobile (<960px): E com opacidade .2 e fade de baixo para cima. Saíram o bolso, `.media-placeholder--hero` e `--pocket-w`.
- [CSS] Faixas de luz: keyframes `hero-beam` só com translateX + opacity, durações 6,5s / 9s / 12s com atrasos negativos, halo feito com gradiente (sem filter). `.is-lite` mostra só a faixa 1. `.is-reduced` e `prefers-reduced-motion` deixam as faixas paradas e pulsam só a opacidade (`hero-beam-pulse`). `.hero.is-offscreen` (JS) pausa as faixas e o indicador "role".
- [CSS] `.hero__scroll` ("mouse" com bolinha) só aparece a partir de 640px, no canto inferior direito, alinhado ao container. No mobile, os stats ocupam a base.
- [CSS] Header: o encolhimento usa `--header-dur: 250ms`. Em `@media (hover:hover)`, `.is-scrolled.is-hovered` anula os transforms de encolher (na prática, o estado encolhido é `.is-scrolled:not(.is-hovered)`). O fundo continua visível.
- [CSS] Revisão do hero (orquestrador): E com opacidade .4. Fade da esquerda com preto sólido até 40%, ficando transparente a partir de 72%, mais um véu radial escuro (`.hero__fade` background). As faixas de luz ficam acima dos fades (z-index 2), com 3px, pico em opacidade 1, halo maior e um box-shadow estático. Elas ficam invisíveis até ~30% do trajeto, para não passarem por trás da coluna de texto; no mobile ficam na metade de cima (16/27/38%).
- [CSS] O hero cabe em 100svh a partir de ~700px de altura: título `clamp(2.75rem, min(1rem + 5.4vw, 9svh), 6rem)`, espaçamentos internos em svh, stats `clamp(1.75rem, min(1.3rem + 2vw, 5.5svh), 2.75rem)`. Grid `1fr auto`: conteúdo centralizado verticalmente e stats ancorados na base. Testado em 1440×900, 1280×720 e 500×844.
