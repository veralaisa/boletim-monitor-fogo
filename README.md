# Boletim do Monitor do Fogo

Boletim mensal interativo alimentado pela API pública do [Monitor do Fogo](https://plataforma.monitorfogo.mapbiomas.org/), mostrando dados atualizados sobre área queimada no Brasil.

## 📊 Sobre

O **Boletim do Monitor do Fogo** é um relatório visual mensal que apresenta:

- **Boletim do Mês**: página estática e exportável em PDF com análise consolidada
  - Brasil: mapa de incêndios, gráficos por ano e mês
  - Onde queima: rankings de estados, biomas e municípios
  - Bioma mais afetado: estatísticas e mapa temático
  - Estado mais afetado: mapa municipal e ranking

- **Destaque Dinâmico**: painel interativo para exploração de dados
  - Filtros por período, bioma, estado
  - Série temporal de área queimada
  - Rankings dinâmicos
  - Mapa de calor interativo

## 🎯 Recursos

✅ Dados ao vivo da [API Monitor do Fogo](https://plataforma.monitorfogo.mapbiomas.org/api/docs/)  
✅ PDF exportável (4 páginas, formatação A4)  
✅ Responsivo (desktop, tablet, mobile)  
✅ Cores e logo do MapBiomas Fogo  
✅ Sem autenticação, sem custos de servidor  
✅ Atualização automática com dados mais recentes  

## 🚀 Como usar

### Online
Acesse em: **[seu-link-do-github-pages.io]** (será atualizado após publicação)

### Localmente
1. Clone ou baixe este repositório
2. Abra `boletim-fogo.html` no navegador
3. Use o botão "Exportar PDF" para gerar o relatório

## 📋 Estrutura

```
boletim-fogo.html
├─ Cabeçalho (logo, abas)
├─ Boletim do Mês
│  ├─ Página 1: Brasil (KPIs, gráficos)
│  ├─ Página 2: Onde queima (mapa, rankings)
│  ├─ Página 3: Bioma mais afetado (mapa, gráficos)
│  └─ Página 4: Estado mais afetado (mapa municipal)
└─ Destaque Dinâmico (painel exploratório)
```

## 🔧 Tecnologia

**Frontend:**
- HTML5, CSS3, JavaScript vanilla
- [Chart.js 4.4.1](https://www.chartjs.org/) — gráficos
- [D3.js 7.9.0](https://d3js.org/) — mapa de estados
- [Leaflet 1.9.4](https://leafletjs.com/) — mapas base
- [Leaflet.VectorGrid 1.3.0](https://github.com/Leaflet/Leaflet.VectorGrid) — tiles vetoriais
- [Montserrat](https://fonts.google.com/specimen/Montserrat) — tipografia

**Dados:**
- API pública: `https://plataforma.monitorfogo.mapbiomas.org/api/`
- Sem autenticação, CORS permissivo (`*`)
- Esri World_Light_Gray basemap
- GeoJSON de estados: [click_that_hood](https://github.com/codeforamerica/click_that_hood)

## 📡 API do Monitor do Fogo

A aplicação consome estes endpoints:

| Endpoint | Uso |
|----------|-----|
| `/api/territories/{type}/{code}/statistics` | Dados de área queimada |
| `/api/territories/{type}/{code}/groupings` | Validar agrupamentos |
| `/api/maps/fire/monthly` | Tiles de raster (incêndios) |
| `/api/territories/grouping/tiles/...` | Tiles vetoriais (municipios, UCs) |
| `/api/territories/{type}/{code}/bounds` | Limites geográficos |
| `/api/statistics/land-cover` | Cobertura do solo |

**Documentação completa:** https://plataforma.monitorfogo.mapbiomas.org/api/docs/

## 📦 Variáveis principais

```javascript
// Constantes
const API = 'https://plataforma.monitorfogo.mapbiomas.org';
const MES = 9;      // Mês (1-12, auto-detectado)
const BIOMAS = {    // Códigos dos biomas
  1: 'Amazônia',
  2: 'Caatinga',
  3: 'Cerrado',
  // ...
};

// Cores (MapBiomas)
const RAMP5 = ['#FDE3E0', '#F8B1AA', '#F06A61', '#E94030', '#A82416'];
const CLS = {       // Classe de cobertura → cor
  '1': '#1f8d49',   // Floresta
  '4': '#7dc975',   // Savana
  // ...
};

// Classificações
const ANTROPICAS = new Set([9,14,15,18,19,20,21,24,30,31,35,36,39,40,41,46,47,48,62,75]);
```

## 🎨 Customização

### Alterar cores
Edite as variáveis CSS no `<style>`:
```css
:root {
  --red: #E94030;        /* Vermelho principal */
  --red-d: #B42A1C;      /* Vermelho escuro */
  --ink: #1F1F1F;        /* Texto principal */
}
```

### Alterar logo
Substitua `Monitor_PT.png` (3074×540px) e atualize a referência no HTML.

### Alterar fonte
Se você tiver um arquivo `.ttf` ou `.woff2` da fonte:
```css
@font-face {
  font-family: 'Sua Fonte';
  src: url('caminho/da/fonte.woff2') format('woff2');
}
```

## 📄 Modo impressão

O PDF é gerado com:
- Formatação A4 (210mm × 297mm)
- Sem margens do navegador
- Animações desabilitadas
- Resolução 3x a tela (gráficos nítidos)

Use o botão **"Exportar PDF"** na barra superior.

## 🔗 Publicar no GitHub Pages

1. **Crie um repositório** em https://github.com/novo
   - Nome sugerido: `boletim-monitor-fogo`

2. **Faça upload** dos arquivos:
   - `boletim-fogo.html`
   - `Monitor_PT.png`
   - `README.md`

3. **Ative GitHub Pages**:
   - Vá em Settings → Pages
   - Branch: `main`, Folder: `/(root)`
   - Seu site estará em: `https://veralaisa.github.io/boletim-monitor-fogo/`

4. **Compartilhe o link** com a equipe!

## 🐛 Troubleshooting

| Problema | Solução |
|----------|---------|
| "L is not defined" | Leaflet não carregou — verifique a conexão internet |
| Mapa em branco | A API pode estar fora. Verifique https://plataforma.monitorfogo.mapbiomas.org/api/docs/ |
| Gráfico não aparece | Abra o Console (F12) e procure por erros de JavaScript |
| PDF vazio | Espere os dados carregarem antes de exportar |

## 📞 Suporte técnico

Para a equipe de tecnologia do MapBiomas:

- O código é um único arquivo HTML com JavaScript inline
- Sem dependências externas além das CDNs listadas
- Os dados são buscados em tempo real via API
- A estrutura é responsiva e exportável em PDF
- Todos os comentários estão em português

## 📄 Licença

[Defina aqui a licença — ex: CC BY 4.0, MIT, etc.]

---

**Desenvolvido com dados do [MapBiomas Fogo](https://www.monitorfogo.mapbiomas.org/)**  
Última atualização: 2026-10-25
