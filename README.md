# Boletim do Monitor do Fogo 🔥

**Protótipo**: Teste de automação do boletim mensal do [Monitor do Fogo](https://plataforma.monitorfogo.mapbiomas.org/).

Relatório visual com dados ao vivo sobre área queimada no Brasil, exportável em PDF.

## 📄 O que tem

- **Boletim do Mês** (7 páginas A4) ✅
  - Brasil: área queimada, comparações com o ano anterior e a média, uso e cobertura
  - Territórios mais afetados: estados, biomas e top 10 municípios, UCs e terras indígenas
  - Bioma e estado mais afetados
  - Proposta em desenvolvimento: "Fora do normal?" (anomalia em linguagem simples) e "Dinâmica temporal" (calendário do fogo, áreas protegidas — inclusive quilombos — e concentração nos municípios)
  - Sobre este boletim: links para os dados, metodologia dos cálculos e notas

- **Destaque Dinâmico** (painel interativo, versão de teste)
  - Qualquer recorte da API: Brasil, bioma, estado, município, terra indígena, UC, quilombo, bacias e outros
  - Período livre (ano, mês inicial e final) e filtro por classe de cobertura
  - Sazonalidade, acumulado contra a média, série anual, calendário do fogo e uso e cobertura (níveis 1 a 4)
  - Mapa único por subdivisão (área queimada ou variação percentual), cicatrizes de fogo e mapa de calor
  - Top 15 com microbarras, comparado com o ano anterior ou com a média histórica
  - Download dos dados em CSV, dos gráficos em PNG, PDF do painel e link com os filtros

## 🚀 Acesso

**Online**: https://veralaisa.github.io/boletim-monitor-fogo/

## 📚 Para desenvolvedores

Leia [CLAUDE.md](CLAUDE.md) para documentação técnica completa.

---

**Desenvolvido com dados do [MapBiomas Fogo](https://www.monitorfogo.mapbiomas.org/)**
