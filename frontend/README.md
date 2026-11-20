# Wella Flow — Frontend (protótipo)

Interface React + Vite responsiva para navegador desktop e mobile. Pode ser usada como base visual de um futuro aplicativo Tauri, mas **Tauri ainda não foi configurado**.

## Executar

Requisitos: Node.js 20.19+ ou 22.12+ e npm.

```bash
cd frontend
npm install
npm run dev
```

Para testar a compilação: `npm run build`.

## Escopo

- Catálogo responsivo com cards de borda em gradiente; busca por nome, SKU, EAN, marca e linha; filtros; favoritos; quantidades no pedido.
- Importação manual de JSON local (formato VTEX bruto ou `{products: [...]}` e dados já normalizados).
- Produtos de demonstração são fictícios. Não há preço comercial real associado.
- A importação transforma cada registro de `items[]` em um SKU de catálogo e mantém a lista de vendedores e ofertas (incluindo preço e disponibilidade quando informados).
- O preço mostrado é **apenas indicativo do site**, menor oferta disponível nos dados, sem equivaler ao preço da planilha comercial.
- Favoritos e pedido ficam só na memória da página; recarregar apaga as escolhas.
- Sem backend, autenticação, envio real de pedidos ou banco de dados conectado.

## Próximos passos

Integrar ao catálogo tratado e aos preços comerciais do Google Sheets; avaliar navegação/visual mobile, persistência e empacotamento Tauri desktop/mobile.
