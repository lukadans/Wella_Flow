# Wella Flow

Frontend de demonstração para o piloto de catálogo e pedidos do salão. A mesma interface React roda no navegador e é usada pelo Tauri 2 para desktop e mobile.

## Visualização

Extraia o ZIP e abra `Wella-Flow-Preview.html` no navegador. A prévia abre sem instalação ou conexão. Em uma janela estreita, as abas passam para a parte de baixo da tela.

O catálogo usa seis produtos de exemplo, preços ilustrativos e fotos das embalagens. Favoritos, rascunhos, pedidos e decisões ficam no armazenamento local de cada ambiente. Para experimentar o fluxo, adicione um produto, revise o pedido e solicite análise. Acesse Conferir pedidos para registrar a decisão e Meus pedidos para acompanhá-la.

## Aplicativo nativo

As instruções abaixo são para quem for compilar o app a partir da pasta `wella-flow-tauri`. Consulte os [pré-requisitos do Tauri](https://v2.tauri.app/start/prerequisites/).

| Objetivo | Comando |
| --- | --- |
| Instalar dependências JavaScript | `npm ci` |
| Abrir o frontend no navegador | `npm run dev` |
| Compilar o frontend | `npm run build` |
| Abrir a janela nativa no desktop | `npm run tauri dev` |
| Gerar o pacote nativo no desktop | `npm run tauri build` |
| Inicializar o projeto Android | `npm run tauri android init` |
| Abrir no Android | `npm run tauri android dev` |
| Gerar APK Android | `npm run tauri android build -- --apk` |
| Inicializar e testar no simulador iOS, no macOS com Xcode | `npm run tauri ios init`, seguido de `npm run tauri ios dev` |

O frontend compilado usa o arquivo `src-tauri/tauri.conf.json`. Desktop e mobile compartilham o comando de entrada Rust em `src-tauri/src/lib.rs`. As pastas nativas de Android e iOS são criadas pelos respectivos comandos `init`.

## Referências das fotos

- [Shampoo Oil Reflections](https://www.lookfantastic.com/p/wella-professionals-care-oil-reflections-luminous-reveal-shampoo-250ml/11352932/)
- [Máscara Fusion](https://www.sephora.fr/p/fusion-intense-repair---masque-cheveux-reparation-intense-pour-cheveux-abimes-P10023632.html)
- [Óleo Oil Reflections](https://www.walmart.com/ip/550033808)
- [Shampoo Invigo Nutri-Enrich](https://www.ozhairandbeauty.com/products/wella-professionals-nutri-enrich-deep-nourishing-shampoo-250ml)
- [Máscara ColorMotion+](https://www.ulta.com/p/colormotion-structure-mask-pimprod2035258?sku=2600519)
- [Shampoo Ultimate Repair](https://www.sephora.com.br/shampoo-wella-ultimate-repair-9090705992-9090705992.html)
