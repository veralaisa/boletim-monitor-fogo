# Boletim do Monitor do Fogo — Documentação

**Protótipo**: automação do boletim mensal do [Monitor do Fogo](https://plataforma.monitorfogo.mapbiomas.org/) — relatório visual sobre área queimada no Brasil, exportável em PDF.

## 📁 Arquivos

| Arquivo | Papel |
|---|---|
| `boletim-fogo.html` | **Versão consolidada e publicada.** É a única fonte de verdade; vira o `index.html` do repositório. |
| `boletim-fogo-versao-2.html` | Backup local da revisão anterior. Não é publicado e não deve ser editado. |
| `Monitor_PT.png` | Logo usado no cabeçalho das folhas e no cabeçalho de impressão do painel. |
| `README.md` | Visão geral para o público. |
| `CLAUDE.md` | Este documento técnico. |

> **Regra do projeto**: não fazer commit nem push sem autorização explícita.

---

## 🏗️ Arquitetura

### Stack
- **HTML5 + CSS3 + JavaScript vanilla** (sem frameworks, sem build)
- **Bibliotecas via CDN**:
  - [Chart.js 4.4.1](https://www.chartjs.org/) — gráficos
  - [D3.js 7.9.0](https://d3js.org/) — mapa de estados (SVG)
  - [Leaflet 1.9.4](https://leafletjs.com/) — mapas
  - [Leaflet.VectorGrid 1.3.0](https://github.com/Leaflet/Leaflet.VectorGrid) — tiles vetoriais (MVT)
  - [Montserrat](https://fonts.google.com/specimen/Montserrat) — fonte institucional
- **Dados**: API pública do Monitor do Fogo (sem autenticação)

### Estrutura do arquivo

```
boletim-fogo.html
├─ <head> — metadados, CSS, imports de CDN
├─ <body>
│  ├─ .top — barra do app (logo, abas, botão PDF)
│  ├─ #tab-boletim — boletim mensal (7 páginas A4)
│  │  ├─ #pg1 — Brasil
│  │  ├─ #pg2 — Territórios mais afetados
│  │  ├─ #pg3 — Bioma mais afetado
│  │  ├─ #pg4 — Estado mais afetado
│  │  ├─ .divisor — aviso de "proposta em desenvolvimento"
│  │  ├─ #pg5 — Fora do normal? (proposta)
│  │  ├─ #pg6 — Dinâmica temporal, sazonalidade e áreas protegidas (proposta)
│  │  └─ #pg7 — Sobre este boletim
│  └─ #tab-explorer — Destaque dinâmico (painel interativo; filtros no hash #explorer?…)
└─ <script> — lógica JavaScript
```

### Páginas do boletim

| Página | Conteúdo | Status |
|---|---|---|
| 1 | Brasil: KPIs, tiles, gráficos por ano, área por mês e uso/cobertura | Oficial |
| 2 | Estados, biomas, top 10 municípios, UCs e terras indígenas | Oficial |
| 3 | Bioma mais afetado: KPIs, cicatrizes, cobertura e gráficos por ano | Oficial |
| 4 | Estado mais afetado: KPIs, municípios, cobertura e gráficos por ano | Oficial |
| 5 | "Fora do normal?": anomalia (z-score) por bioma e estado | Proposta |
| 6 | Dinâmica temporal, calendário do fogo, áreas protegidas e concentração | Proposta |
| 7 | Sobre: links, metodologia, citação e notas | Oficial |

**Layout A4**: cada folha tem `min-height: 297mm` e as sete fecham em ~1123 px de altura (A4 ≈ 1122,5 px), sem estourar para uma oitava página. Ao mexer em alturas, medir o vazio entre o último bloco e o rodapé (ideal < 20 px).

---

## 🔑 Constantes principais

### APIs e dados
```javascript
const API = 'https://plataforma.monitorfogo.mapbiomas.org';
const GEO_URL = '...brasil-states.geojson'; // Estados (click_that_hood)
```

### Referências geográficas
```javascript
const UF = [...]           // 27 estados com código IBGE
const BIOMAS = [...]       // 6 biomas (Amazônia=1, Caatinga=2, ...)
const TERRITORIOS = { country, biome, state }
const PADRAO = { country: 0, biome: 1, state: 15 } // Defaults
const PREF = { country: ['state'], biome: ['biome'], state: ['city'] }
```

### Cobertura do solo
```javascript
const CLS = [...]          // Classes MapBiomas (id → nome, cor)
const ANTROPICAS = new Set([...])  // IDs de classes antrópicas
const NATIVAS = new Set([...])     // IDs de vegetação nativa
const RAMP5 = [...]        // 5 tons de vermelho para mapas de fogo
const SEM_DADO = '#EFEFEF'
```

Paleta de nível 2:

| Classe | Cor principal | Borda |
|---|---|---|
| Formação Florestal | `#129912` | `#1B5E20` |
| Formação Savânica | `#84A866` | `#66BB6A` |
| Formação Campestre / Campo | `#CCA85A` | — |
| Campo Alagado / Áreas Úmidas | `#519799` | — |
| Pastagem | `#FFE082` | `#EBD784` |
| Agricultura | `#E974ED` | `#D082BE` |
| Mosaico de Usos | `#FFF3B0` | `#D8C58C` |

### Cores e formatação
```javascript
const C = {
  red: '#E94030',     // vermelho institucional (logo, ênfases)
  redD: '#B42A1C',
  fire: '#D32F2F',    // ano corrente nas séries
  gray: '#BDBDBD',    // anos anteriores nas séries
  dark: '#212121',    // linha da média
  ink: '#1F1F1F', ink2: '#4F4F4F', muted: '#6B6B6B',
  line: '#E6E6E6', good: '#2E7D4F'
};
```

### Variação no mapa (divergente)
```javascript
const DIV_LIM = [-50, -10, 10, 50];   // limites das 5 classes
// DIV_CORES: queda forte → neutro → alta forte (verde, cinza, vermelho)
classeVar(p)  // converte a variação % em índice 0..4 (-1 = sem dado)
legVar()      // legenda HTML das 5 classes
```

### Helpers de formatação
```javascript
nf0(v)          // Número inteiro formatado (pt-BR)
haC(v)          // "123.456 ha"
haM(v)          // "2,59 Mha"
pctTxt(p)       // "+5%" / "−3%"
fmtP(p)         // "5%" / "<1%"
esc(s)          // HTML escape
```

---

## 📊 Funções principais

### API e dados
| Função | O que faz |
|---|---|
| `getJSON(path)` | Fetch + JSON da API |
| `groupings(type, code)` | Lista agrupamentos válidos (com cache) |
| `pickGroup(type, code, want)` | Valida o agrupamento em `/groupings` antes de qualquer estatística (evita HTTP 500) |
| `st(kind, type, code, params, want)` | GET genérico de estatística |
| `rankingAll(type, code, params, want)` | Percorre todas as páginas de um ranking `/raw` |
| `loadGeo()` | Carrega GeoJSON dos estados |
| `lcTrans()` | Tradução de classes de cobertura |
| `detectarPeriodo()` | Encontra o mês mais recente com dados |
| `dadosTerritorio(type, code, want)` | Mês, acumulado, série e cobertura de um território |

### Gráficos
| Função | O que faz |
|---|---|
| `mkChart(key, canvasId, cfg)` | Cria Chart.js com `devicePixelRatio: 3` e sem animação |
| `yearChart(id, anos, vals, Y)` | Barras por ano: anos anteriores em cinza, ano corrente em vermelho-fogo e linha da média tracejada |
| `anosCharts(prefix, ts)` | Dois gráficos: jan–mês e só mês, por ano |
| `classes(values, n=5)` | Quantis para colorir mapas |
| `topLabels`, `linhaMedia`, `whiskers`, `faixasNormal`, `rotulos` | Plugins de rótulos, média, mín/máx, faixas de normalidade e valores no fim das barras |
| `opLinha(yT, xT, st, extra)` | Opções padrão dos gráficos de linha do painel |
| `pintarCalendario(cv, M, ano, ini, fim, o)` | Calendário do fogo em canvas |

### Mapas
| Função | O que faz |
|---|---|
| `mapaEstatico(id, bounds)` | Leaflet estático com fundo branco (sem basemap Esri) |
| `reajustarMapas()` | Refita mapas se o tamanho mudou |
| `mvt(path, style, zIndex)` | Cria tile layer vetorial (MVT) |
| `drawStates(el, geo, vals, total, cls)` | Mapa D3 dos estados com cores, rótulos e divisas cinza-claro |
| `novoMapa`, `limparMapa`, `camadas` | Mapa interativo do painel |
| `xMapa(f, vivo, rankP)` | **Mapa único** do painel: coroplético por subdivisão (área ou variação %), cicatrizes ou calor |
| `classeVar`, `legVar` | Classes e legenda do mapa divergente de variação |

### Boletim
| Função | O que faz |
|---|---|
| `kpiHTML(rótulo, valor, sub, linhas)` | Card com número grande e unidade acoplada |
| `renderKpis(prefix, d, nacional)` | Preenche KPIs de uma página |
| `varLine(v, atual, ref)` | "▲ 5% vs. 2,92 mi ha em set/2025 (−327 mil ha)" |
| `coverHTML`, `coverDonuts`, `renderCover` | Tabela e roscas de uso/cobertura |
| `rankHTML(items, cor)` | Lista classificada com barras |
| `cabecalho(per)` | Logo + "DESTAQUES" + mês |
| `initBoletim()` | Busca dados e renderiza as 7 páginas em paralelo |
| `p1Kpi`, `p1Tiles`, `p1Mes` | Página 1 |
| `p2Mapa`, `p2Bio`, `p2Lista` | Página 2 (top 10 municípios, UCs e TIs) |
| `p3Kpi`, `p3Mapa` | Página 3 |
| `p4Kpi`, `p4Mapa`, `p4Mun` | Página 4 |
| `p5Brasil`, `p5Tabela` | Página 5 (anomalia) |
| `p6Cal`, `p6Prot`, `p6Conc`, `desenharCal6` | Página 6 (dinâmica temporal) |
| `p7Sobre()` | Página 7 (links, metodologia, notas) |

### Destaque dinâmico
| Função | O que faz |
|---|---|
| `initPainel()` | Inicializa o painel e lê o hash |
| `ligarEventos()` | Liga filtros, chips, selects, toggles e botões |
| `definirTerritorio(tipo, code)` | Troca o recorte e recarrega os dados |
| `atualizarDiv`, `atualizarControles` | Atualiza subdivisões e controles |
| `xRun()` | Orquestra os jobs do painel |
| `xKpi`, `xSaz`, `xAcu`, `xAnual`, `xCal` | Destaques e histórico |
| `xMapa`, `xRank`, `xUso`, `xUsoAno` | Mapa, Top 15 e uso/cobertura |
| `lerHash`, `salvarHash` | Estado dos filtros na URL (`#explorer?t=&c=&a=&i=&f=&m=&ref=`) |
| `baixarCSV`, `baixarPNG`, `copiarLink` | Exportações e link compartilhável |
| `modoPainel`, `imprimirPainel` | Layout A4 paisagem para PDF do painel |

### Abas, impressão e início
| Função | O que faz |
|---|---|
| `abrirAba(nome)` | Alterna entre "Boletim do mês" e "Destaque dinâmico" |
| `modoImpressao(on)` | Ativa o CSS de folha A4 (classe `html.pm`) |
| `beforeprint` / `afterprint` | Ajusta mapas e gráficos antes/depois da impressão |

---

## 🔄 Fluxo de dados

```
User abre boletim-fogo.html
  ↓
detectarPeriodo() encontra o mês mais recente com dados
  ↓
initBoletim() busca dados da API em paralelo
  ├─ totais do Brasil (grouping=biome)
  ├─ rankings de estados, biomas, municípios, UCs, TIs
  ├─ séries mensais e cobertura do solo
  └─ GeoJSON dos estados
  ↓
Renderiza as 7 páginas A4 (cada bloco tem estado de carregamento/erro via secao())
  ├─ KPIs e tiles
  ├─ gráficos Chart.js
  ├─ mapas Leaflet/D3/VectorGrid
  └─ rankings e tabelas
  ↓
"Exportar PDF" → modoImpressao(true) → window.print() → PDF → modoImpressao(false)
```

---

## 🎯 Como usar

### Acesso online
```
https://veralaisa.github.io/boletim-monitor-fogo/
```

### Rodar localmente
```powershell
cd "C:\Users\vera.arruda\OneDrive - IPAM-Amazonia\Backup\Projetos\Boletim-Monitor-Fogo"
start boletim-fogo.html
```

Ou abra direto no navegador:
```
file:///C:/Users/vera.arruda/OneDrive%20-%20IPAM-Amazonia/Backup/Projetos/Boletim-Monitor-Fogo/boletim-fogo.html
```

### Testar o PDF
```powershell
# Boletim (7 páginas A4)
& "C:\Program Files\Google\Chrome\Application\chrome.exe" `
  --headless --disable-gpu --disable-extensions --disable-background-networking `
  --no-sandbox --no-pdf-header-footer --run-all-compositor-stages-before-draw `
  --virtual-time-budget=45000 `
  --print-to-pdf="$env:TEMP\boletim.pdf" `
  "file:///C:/Users/vera.arruda/OneDrive%20-%20IPAM-Amazonia/Backup/Projetos/Boletim-Monitor-Fogo/boletim-fogo.html#pdf"

# Painel (A4 paisagem, com os filtros do hash)
# ...#explorer?t=country&c=0&a=2026&i=1&f=9&px=1
```

Hashtags:
- `#pdf` — abre o boletim já no layout de folha (usado na linha de comando).
- `#explorer?…&px=1` — abre o painel já no layout de impressão.
- `&m=var` — abre o mapa já no modo de variação percentual.
- `&ref=media` — usa a média histórica como base de comparação (padrão: ano anterior).

---

## 🔗 API do Monitor do Fogo

Documentação: https://plataforma.monitorfogo.mapbiomas.org/api/docs/

### Endpoints principais

**Dados de área queimada**
```
GET /api/territories/{type}/{code}/statistics
  ?year=2026&monthStart=1&monthEnd=9&grouping=biome&landCover=true
```
Retorna: `monthly[{month, year, areaHa, ...}]`, `landCover[{name, hectares, ...}]`

**Validar agrupamentos**
```
GET /api/territories/{type}/{code}/groupings
```
Resposta: `groupings: ['biome', 'state', ...]` (o que é válido para esse tipo)

**Ranking bruto (todas as páginas)**
```
GET /api/statistics/ranking/{type}/{code}/{grouping}/raw
  ?year=2026&monthStart=9&monthEnd=9
```

**Séries mensais**
```
GET /api/statistics/time-series/{type}/{code}/{grouping}?monthStart=1&monthEnd=12
```

**Tiles de fogo (raster)**
```
GET /api/maps/fire/monthly/{z}/{x}/{y}
  ?territoryType=country&territoryCode=0&year=2026&monthStart=9&monthEnd=9
```

**Tiles vetoriais (MVT)**
```
GET /api/territories/grouping/tiles/country/0/state/{z}/{x}/{y}.mvt
GET /api/territories/grouping/tiles/country/0/biome/{z}/{x}/{y}.mvt
GET /api/territories/grouping/tiles/state/{code}/city/{z}/{x}/{y}.mvt
```

**Limites**
```
GET /api/territories/{type}/{code}/bounds
Retorna: [minLat, minLng, maxLat, maxLng]
```

**Cobertura do solo**
```
GET /api/statistics/land-cover
  ?territoryType=state&territoryCode=51&year=2026&monthStart=9&monthEnd=9&level=2
```

### Codificações
- **Países**: 0 = Brasil
- **Biomas**: 1=Amazônia, 2=Caatinga, 3=Cerrado, 4=Mata Atlântica, 5=Pampa, 6=Pantanal
- **Estados**: código IBGE (15=Amazonas, 17=Bahia, ..., 51=Mato Grosso, ...)
- **Classes de cobertura**: 1=Floresta, 4=Savana, 10=Campo, 15=Pastagem, etc.

---

## 🛠️ Desenvolvimento

### Editar localmente
1. Abra o HTML em um editor (VS Code, Notepad++, etc.).
2. Teste no navegador (`file:///...`).
3. Abra o DevTools (F12) para ver erros.
4. Se for publicar, faça commit/push **somente com autorização**.

### Estrutura CSS
```css
:root {
  --red: #E94030;        /* Cor institucional */
  --red-d: #B42A1C;      /* Escuro */
  --fire: #D32F2F;       /* Ano corrente */
  --gray: #BDBDBD;       /* Anos anteriores */
  --dark: #212121;       /* Linha da média */
  --ink: #1F1F1F;        /* Texto */
  --good: #2E7D4F;       /* Verde (positivo) */
}

/* Folhas A4 */
.sheet { width: 210mm; min-height: 297mm; }

/* Tipografia */
.k-v { font-size: 32px; font-weight: 700; }
.tl-v { font-size: 24px; font-weight: 700; }

/* Grids */
.g2 { grid-template-columns: 1fr 1fr; }
.g3 { grid-template-columns: repeat(3, 1fr); }
.g4 { grid-template-columns: repeat(4, 1fr); }
.gmap { grid-template-columns: 1.15fr 1fr; }
```

### Modo impressão
```css
@media print {
  @page { size: A4; margin: 0; }
  .top, .no-print { display: none !important; }
  .sheet { width: 210mm; height: 297mm; break-after: page; }
}

html.pm { /* Ativado por modoImpressao(true) */ }
html.pm .sheet { margin: 0; }
```

### Responsividade
```css
@media screen and (max-width: 820px) html:not(.pm) {
  /* Mobile: grids em uma coluna, menos padding, etc. */
  .g2, .g3 { grid-template-columns: 1fr; }
}
```

---

## 🎨 Sistema visual

### Tipografia
- **Família**: Montserrat (400/500/600/700/800), com fallback para `system-ui`.
- **KPIs**: 32 px, peso 700, unidade acoplada (`ha`, `Mha`, `%`).
- **Tiles**: 24 px, peso 700.
- **Apoio e legendas**: 8–11 px, `line-height: 1.2–1.4`, para não colidir com eixos e gráficos.
- **Chamadas**: frases curtas e técnicas, sem transições redundantes.

### Séries históricas
- Anos anteriores: barras cinza `#BDBDBD`.
- Ano corrente: barra vermelho-fogo `#D32F2F`.
- Média histórica: linha tracejada `#212121`.

### Mapas
- Fundo branco absoluto (`#FFFFFF`), sem basemap Esri.
- Divisas estaduais finas em cinza-claro (`#D9D9D9`).
- Limite de biomas em preto (`#212121`).
- Escala de fogo em 5 quantis (`RAMP5`).

### Página 2
- Sem o bloco de quilombos.
- Top 10 (em vez de 5) para municípios, UCs e terras indígenas.
- Mapas de estados e biomas com 275 px; três colunas compactas de 8,8 px para caber na A4.
- Rótulos dos mapas em `.ml-s` (13 px) e `.ml-v` (10 px) no viewBox 640×600 do SVG.

### Página 3
- Mapa de cicatrizes com 300 px e coluna do mapa mais larga (`1.4fr`).
- Gráficos por ano com 300 px.

### Página 4
- Mapa do estado com 390 px.
- `fitBounds` com padding `[4, 4]` para o território ocupar a área.

### Página 6
- Título: "Dinâmica temporal, sazonalidade e áreas protegidas em {mês}".
- Eixo Y do gráfico de áreas protegidas com rótulo HTML vertical e `padding-left: 23px`, sem colidir com a escala.
- Legenda das linhas na base do gráfico, fora da área das curvas.

### Destaque dinâmico (explorer)
- **Mapa único**: ao comparar, um só mapa coroplético divergente de variação percentual (verde = queda, cinza = estável, vermelho = alta). Não há mais mapa duplo, sincronização nem GIF.
- **Camadas**: "Por subdivisão" (área ou variação), "Cicatrizes de fogo" e "Mapa de calor".
- **Medida**: `Área queimada (ha)` ou `Variação percentual`; a variação só existe na camada por subdivisão.
- **Top 15**: componente único em lista, com posição, nome, microbarras (`width: calc(valor / máximo * 100%)`), área e etiqueta (`▼ -X%` / `▲ +X%`).
- **Comparação**: o toggle `vs. Ano Anterior` / `vs. Média Histórica` no card do Top 15 define `f.ref` (`''` ou `'media'`) e força `f.metrica = 'var'`.
- **Removidos**: GIF mensal, tabela paginada e filtro global "Comparar com".
- **Mapa**: `.leaf` com 500 px de altura e `max-width: 760px`, centralizado.

---

## 📝 Notas técnicas

### Por que um arquivo só?
- Fácil de publicar no GitHub Pages.
- Sem build, sem dependências locais.
- Tudo em um único arquivo para o MapBiomas integrar.

### Gráficos em alta resolução
```javascript
mkChart(key, canvasId, cfg) {
  // ...
  devicePixelRatio: Math.max(3, window.devicePixelRatio || 1)
  // Garante que gráficos saem nítidos no PDF (3x a tela).
}
```

### VectorGrid (tiles vetoriais)
- O VectorGrid desenha polígonos via Canvas/SVG.
- Às vezes o Leaflet não marca o tile como "loaded" e o tile fica oculto.
- Fix: CSS `.lmap svg.leaflet-tile { visibility: visible; }`.

### Texto em canvas no PDF
- Canvas é rasterizado na impressão; em prévias de baixa resolução os números pequenos parecem "duplicados".
- Conferir sempre em 300 dpi antes de considerar um problema real.

### Diferenças na API
- `areaHa` dentro de `previousYearVariation` é uma **diferença**, não um valor.
  - Exemplo: se o mês anterior = 100 ha e agora = 80 ha → `areaHa: -20` (diminuiu 20).
- `landCover` só aceita classes de nível 2 (ex.: 3, 15); a classe 1 volta `null`.
- Totais do Brasil usam o agrupamento `biome` — é o recorte que reproduz os números do boletim oficial.
- `pickGroup()` valida o agrupamento em `/groupings` antes de qualquer estatística; sem isso a API pode retornar HTTP 500.
- `pct(a, b)` devolve `null` quando `b <= 0`; o Top 15 mostra "sem fogo na base" nesses casos.

### Versionamento
- O repositório publica `index.html` (cópia de `boletim-fogo.html`).
- `boletim-fogo-versao-2.html` é apenas backup local.
- Edite, teste e só publique quando estiver pronto.

---

## 🚀 Deploy

### GitHub Pages (automático, somente com autorização)
```
Edite localmente
  ↓
Copie boletim-fogo.html → index.html no repositório
  ↓
Commit + Push via GitHub Desktop
  ↓
GitHub Pages atualiza automaticamente (~30s)
  ↓
https://veralaisa.github.io/boletim-monitor-fogo/
```

Repositório local: `C:\Users\vera.arruda\OneDrive - IPAM-Amazonia\Documentos\GitHub\boletim-monitor-fogo` (branch `main`).

> **Não fazer commit nem push** sem pedido explícito.

---

## ❓ Troubleshooting

| Problema | Solução |
|----------|---------|
| "L is not defined" | Leaflet não carregou; checar conexão com a internet |
| Mapa em branco | API fora do ar; testar https://plataforma.monitorfogo.mapbiomas.org/api/docs/ |
| Erro no Console (F12) | Ler o erro, localizar a linha no HTML e conferir |
| PDF vazio | Esperar os dados carregarem antes de exportar |
| Página a mais no PDF | Alguma folha passou de 1123 px; medir o vazio e reduzir alturas |
| Gráfico cortado no PDF | Conferir a altura do contêiner (`.cv-*`) e o `layout.padding` do Chart.js |
| Rótulo do eixo Y colidindo | Usar o rótulo HTML `.y-lab` + `padding-left` no contêiner |
| Link `file:///` no PDF | A página 7 usa a constante `SITE`; não voltar a usar `location.origin` |
| GitHub Pages mostra 404 | Checar Settings → Pages (branch main, folder /) |

---

## 📞 Próximas etapas

- [x] **Destaque dinâmico**: filtros por qualquer território, sazonalidade, acumulado, calendário, mapa único, Top 15, cobertura, CSV/PNG/PDF.
- [x] **Boletim consolidado**: tipografia, paleta MapBiomas, top 10 na página 2, ajustes das páginas 3, 4 e 6, folhas A4 sem vazios.
- [x] **Explorer enxuto**: mapa único de variação, sem GIF e sem tabela paginada.
- [ ] **Fonte customizada**: quando o arquivo .ttf/.woff2 chegar, atualizar `@font-face`.
- [ ] **Mais integrações**: considerar copiar para a produção do MapBiomas.

---

**Última atualização**: 2026-10-27  
**Versão**: arquivo único consolidado (7 páginas A4 + Destaque dinâmico)
