# Monitor do Fogo · protótipo

Protótipo estático (somente HTML, CSS e JavaScript). Não precisa de servidor, banco de dados nem instalação.
Os dados são **simulados** e a geografia vem de Natural Earth.

## Como publicar no GitHub Pages (gratuito, sem linha de comando)

1. Crie uma conta em https://github.com (se ainda não tiver).
2. Clique em **New** (ou **+ > New repository**) e crie um repositório público, por exemplo `monitor-do-fogo`.
3. Na página do repositório, clique em **uploading an existing file**.
4. Arraste **todos os arquivos desta pasta** para a janela (inclusive `.nojekyll` e as imagens `.png`). Depois clique em **Commit changes**.
5. Vá em **Settings > Pages**.
6. Em **Build and deployment > Source**, escolha **Deploy from a branch**. Em **Branch**, escolha `main` e a pasta `/ (root)`. Clique em **Save**.
7. Aguarde 1 a 3 minutos e recarregue a página. O link aparecerá no topo, no formato:
   `https://SEU-USUARIO.github.io/monitor-do-fogo/`

Para atualizar o site, basta enviar de novo os arquivos alterados em **Add file > Upload files**.

## Estrutura

| Arquivo | Função |
|---|---|
| `index.html` | Página principal |
| `estilo.css` | Aparência |
| `app.js` | Mapa, painel e relatório |
| `fogo.js` | Área queimada (gráficos, filtros, API opcional) |
| `navegacao.js` | Seções do relatório |
| `exportar.js` | Downloads (CSV, GeoTIFF, GeoPDF de exemplo) |
| `controles.js` | Compartilhar, tema, acessibilidade, idioma |
| `geografia.js` | Limites dos estados e países vizinhos |
| `logo-monitor-do-fogo.png`, `material-combustivel-v2.png` | Imagens |

## Testar no computador

Basta dar dois cliques em `index.html`. Algumas funções (como o botão de copiar link) podem exigir um endereço de internet para funcionar totalmente.
