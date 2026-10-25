# Boletim do Monitor do Fogo — Documentação

**Protótipo**: Automação do boletim mensal do [Monitor do Fogo](https://plataforma.monitorfogo.mapbiomas.org/) — relatório visual sobre área queimada no Brasil, exportável em PDF.

**Arquivo único**: `boletim-fogo.html` (todo o código em um arquivo)

---

## 🏗️ Arquitetura

### Stack
- **HTML5 + CSS3 + JavaScript vanilla** (sem frameworks)
- **Bibliotecas via CDN**:
  - [Chart.js 4.4.1](https://www.chartjs.org/) — gráficos
  - [D3.js 7.9.0](https://d3js.org/) — mapa de estados (SVG)
  - [Leaflet 1.9.4](https://leafletjs.com/) — mapas base
  - [Leaflet.VectorGrid 1.3.0](https://github.com/Leaflet/Leaflet.VectorGrid) — tiles vetoriais (MVT)
  - [Montserrat](https://fonts.google.com/specimen/Montserrat) — fonte

- **Dados**: API pública do Monitor do Fogo (sem autenticação)

### Estrutura do arquivo

```
boletim-fogo.html
├─ <head> — metadados, CSS, imports de CDN
├─ <body>
│  ├─ .top — barra do app (logo, abas, botão PDF)
│  ├─ #tab-boletim — boletim mensal (4 páginas A4)
│  │  ├─ #pg1 — Brasil
│  │  ├─ #pg2 — Onde queima
│  │  ├─ #pg3 — Bioma mais afetado
│  │  └─ #pg4 — Estado mais afetado
│  └─ #tab-explorer — Destaque dinâmico (painel interativo, em desenvolvimento)
└─ <script> — lógica JavaScript
```

---

## 🔑 Constantes principais

### APIs e dados
```javascript
const API = 'https://plataforma.monitorfogo.mapbiomas.org';
const GEO_URL = '...brasil-states.geojson'; // Estados (click_that_hood)
const ESRI = '...World_Light_Gray...';      // Basemap
```

### Referências geográficas
```javascript
const UF = [...]           // 27 estados com código IBGE
const BIOMAS = [...]       // 6 biomas (Amazônia=1, Caatinga=2, ...)
const TERRITORIOS = { country, biome, state }
const PADRAO = { country: 0, biome: 1, state: 15 } // Defaults
```

### Cobertura do solo
```javascript
const CLS = [...]          // Classes MapBiomas (id → nome, cor)
const ANTROPICAS = new Set([...])  // IDs de classes antrópicas
```

### Cores e formatação
```javascript
const C = {                // Cores (CSS vars mapeadas)
  red: '#E94030',          // Vermelho principal
  redD: '#B42A1C',         // Vermelho escuro
  ...
}
const RAMP5 = [...]        // 5 tons (claro → escuro) para mapas
```

### Helpers de formatação
```javascript
nf0(v)          // Número inteiro formatado (pt-BR)
haC(v)          // "123.456 ha"
pctTxt(p)       // "+5%" / "−3%"
fmtP(p)         // "5%" / "<1%"
esc(s)          // HTML escape
```

---

## 📊 Funções principais

### API e dados
| Função | O que faz |
|--------|-----------|
| `getJSON(path)` | Fetch + JSON da API |
| `groupings(type, code)` | Lista agrupamentos válidos (com cache) |
| `st(kind, type, code, params, want)` | GET genérico com retry |
| `loadGeo()` | Carrega GeoJSON dos estados |
| `lcTrans()` | Tradução de classes de cobertura |
| `detectarPeriodo()` | Encontra o mês mais recente com dados |

### Gráficos
| Função | O que faz |
|--------|-----------|
| `mkChart(key, canvasId, cfg)` | Criar Chart.js com `devicePixelRatio:3` |
| `yearChart(id, anos, vals, Y)` | Gráfico de área por ano com eixos |
| `anosCharts(prefix, ts)` | 2 gráficos: jan–mês e só mês, por ano |
| `classes(values, n=5)` | Quantis para colorir mapa |

### Mapas
| Função | O que faz |
|--------|-----------|
| `mapaEstatico(id, bounds)` | Leaflet estático (sem interação) |
| `reajustarMapas()` | Refita mapas se o tamanho mudou |
| `mvt(path, style, zIndex)` | Cria tile layer vetorial (MVT) |
| `drawStates(el, geo, vals, total, cls)` | Mapa D3 dos estados com cores |

### Boletim
| Função | O que faz |
|--------|-----------|
| `kpiHTML(rótulo, valor, sub, linhas)` | Card com número grande |
| `renderKpis(prefix, d, nacional)` | Preenche KPIs de uma página |
| `varLine(v, ref)` | "↑ 5.2%" ou "↓ −3.1%" |
| `coverHTML(lcMes, lcAcum)` | Tabela de cobertura do solo |
| `rankHTML(items, cor)` | Lista classificada com barras |
| `cabecalho(per)` | Logo + "DESTAQUES" + mês |

### Fluxo principal
| Função | O que faz |
|--------|-----------|
| `initBoletim()` | Busca dados, renderiza 4 páginas |
| `dadosTerritorio(type, code, want)` | Agrupa dados por território |
| `p1Kpi()`, `p1Tiles()`, etc. | Renderiza cada seção |
| `abrirAba(nome)` | Alterna entre abas |
| `modoImpressao(on)` | Ativa CSS de PDF |

---

## 🔄 Fluxo de dados

```
User abre boletim-fogo.html
  ↓
Detecta mês mais recente com dados (detectarPeriodo)
  ↓
Busca dados da API (GET /api/territories/...)
  ↓
Agrupa por bioma, estado, município (dadosTerritorio)
  ↓
Renderiza 4 páginas A4 (p1Kpi, p1Mes, p2Mapa, p3Mapa, etc.)
  ├─ KPIs (valores grandes)
  ├─ Gráficos (Chart.js)
  ├─ Mapas (Leaflet + D3 + VectorGrid)
  └─ Rankings (tabelas, listas)
  ↓
User clica "Exportar PDF"
  ├─ Ativa .html.pm (modo impressão)
  ├─ Edge imprime → PDF
  └─ Desativa modo impressão
```

---

## 🎯 Como usar

### Acesso online
```
https://veralaisa.github.io/boletim-monitor-fogo/
```

### Rodar localmente
```bash
# 1. Clone ou abra a pasta
cd "C:\Users\vera.arruda\OneDrive - IPAM-Amazonia\Documentos\GitHub\boletim-monitor-fogo"

# 2. Abra no navegador
file:///C:/Users/vera.arruda/OneDrive%20-%20IPAM-Amazonia/Documentos/GitHub/boletim-monitor-fogo/boletim-fogo.html

# 3. Abra DevTools (F12) se houver erro
```

### Testar PDF
```bash
# Via scratchpad\testar.ps1 (Windows, Edge)
testar.ps1 -Hash "#pdf" -Nome boletim-teste

# Ou: clique "Exportar PDF" no navegador
```

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

**Tiles de fogo (raster)**
```
GET /api/maps/fire/monthly/{z}/{x}/{y}
  ?territoryType=country&territoryCode=0&year=2026&monthStart=9&monthEnd=9
```

**Tiles de municípios/UCs (vetorial, MVT)**
```
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
1. Abra `boletim-fogo.html` em um editor (VS Code, Notepad++, etc.)
2. Teste no navegador (`file:///...`)
3. Abra DevTools (F12) para ver erros
4. Faça push via GitHub Desktop

### Estrutura CSS
```css
:root {
  --red: #E94030;        /* Cor principal */
  --red-d: #B42A1C;      /* Escuro */
  --ink: #1F1F1F;        /* Texto */
  --good: #2E7D4F;       /* Verde (positivo) */
}

/* Folhas A4 */
.sheet { width: 210mm; min-height: 297mm; }

/* Abas */
.tabs { ... }
.tab.on { ... }

/* Grids */
.g2 { grid-template-columns: 1fr 1fr; }
.g3 { grid-template-columns: repeat(3, 1fr); }
.gmap { grid-template-columns: 1.15fr 1fr; }
```

### Modo impressão
```css
@media print {
  @page { size: A4; margin: 0; }
  .top, .no-print { display: none !important; }
  .sheet { width: 210mm; height: 297mm; break-after: page; }
}

html.pm { /* Ativo via modoImpressao(true) */ }
html.pm .sheet { margin: 0; }
```

### Responsividade
```css
@media screen and (max-width: 820px) html:not(.pm) {
  /* Mobile: reflow de grids, menos padding, etc. */
  .g2, .g3 { grid-template-columns: 1fr; }
}
```

---

## 📝 Notas técnicas

### Por que um arquivo só?
- Fácil de publicar no GitHub Pages
- Sem build, sem dependências locais
- Tudo em um único arquivo para o MapBiomas integrar

### Gráficos em alta resolução
```javascript
mkChart(key, canvasId, cfg) {
  // ... 
  devicePixelRatio: Math.max(3, window.devicePixelRatio || 1)
  // Garante que gráficos saem nítidos no PDF (3x a tela)
}
```

### VectorGrid (tiles vetoriais)
- O VectorGrid desenha polígonos via Canvas/SVG
- Às vezes o Leaflet não marca o tile como "loaded"
- Fix: CSS `.lmap svg.leaflet-tile { visibility: visible; }`

### Diferenças na API
- `areaHa` dentro de `previousYearVariation` é uma **diferença**, não um valor
- Exemplo: se mês anterior = 100 ha, agora = 80 ha → `areaHa: -20` (diminuiu 20)

### Sem versionamento
- Repositório sempre tem a última versão pronta
- Não há branches de desenvolvimento
- Edite, teste, e faça push quando estiver pronto

---

## 🚀 Deploy

### GitHub Pages (automático)
```
Edite localmente
  ↓
Commit + Push via GitHub Desktop
  ↓
GitHub Pages atualiza automaticamente (~30s)
  ↓
https://veralaisa.github.io/boletim-monitor-fogo/
```

---

## ❓ Troubleshooting

| Problema | Solução |
|----------|---------|
| "L is not defined" | Leaflet não carregou; checar conexão internet |
| Mapa em branco | API pode estar fora; testar https://plataforma.monitorfogo.mapbiomas.org/api/docs/ |
| Erro no Console (F12) | Ler erro, procurar a linha no HTML e conferir |
| PDF vazio | Esperar dados carregarem antes de exportar |
| GitHub Pages mostra 404 | Checar Settings → Pages (branch main, folder /) |

---

## 📞 Próximas etapas

- [ ] **Painel dinâmico** (Destaque dinâmico): filtros, série temporal, mapa interativo
- [ ] **Fonte customizada**: quando arquivo .ttf/.woff2 chegar, atualizar @font-face
- [ ] **Mais integrações**: considerar copiar para prod do MapBiomas

---

**Última atualização**: 2026-10-25  
**Versão**: Protótipo (sem versionamento formal)
