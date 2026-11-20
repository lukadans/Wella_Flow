// Transformação de dados apenas para visualização. O JSON original não é alterado.
// Cada SKU é uma unidade do catálogo: produto -> SKU -> vendedor -> oferta.
const text = value => Array.isArray(value) ? String(value[0] ?? '') : String(value ?? '');
export function normalizeCatalog(raw) {
  const rows = Array.isArray(raw) ? raw : raw?.products;
  if (!Array.isArray(rows)) throw Error('O JSON precisa conter uma lista de produtos ou {products: [...]}');
  const output = [];
  for (const [index, p] of rows.entries()) {
    const items = Array.isArray(p.items) && p.items.length ? p.items : [p];
    for (const [j, sku] of items.entries()) {
      const sellers = Array.isArray(sku.sellers) ? sku.sellers : [];
      const offers = sellers.map(s => ({
        sellerId: String(s.sellerId ?? ''),
        sellerName: s.sellerName ?? '',
        price: typeof s.commertialOffer?.Price === 'number' ? s.commertialOffer.Price : null,
        listPrice: typeof s.commertialOffer?.ListPrice === 'number' ? s.commertialOffer.ListPrice : null,
        available: s.commertialOffer?.IsAvailable ?? null
      }));
      const priceValues = offers.map(o => o.price).filter(v => v !== null);
      const image = sku.images?.find(im => im?.imageUrl)?.imageUrl || p.imageUrl || p.image || '';
      output.push({
        id: String(sku.itemId ?? p.itemId ?? p.productId + '-' + j ?? index),
        productId: String(p.productId ?? ''),
        ean: text(sku.ean ?? p.ean),
        name: sku.nameComplete || sku.name || p.productName || p.productTitle || p.name || 'Produto sem nome',
        brand: p.brand || 'Wella',
        brandId: text(p.brandId),
        line: p.line || (Array.isArray(p.categories) ? p.categories.filter(Boolean).at(-1) : '') || '',
        category: p.category || (Array.isArray(p.categories) ? p.categories.filter(Boolean).at(-1) : '') || 'Outros',
        size: text(sku.Tamanho ?? sku.tamanho ?? p.size),
        tone: text(p.tone ?? p.tonalidade),
        image, offers,
        // Menor preço é uma referência para exibição, não substitui o valor comercial.
        price: priceValues.length ? Math.min(...priceValues) : typeof p.price === 'number' ? p.price : null
      });
    }
  }
  return output;
}
export const demo = [
  {id:'demo-1',name:'Shampoo profissional — demonstração',brand:'Wella',line:'Linha demonstrativa',category:'Shampoo',size:'250 ml',tone:'',price:null,image:'',offers:[]},
  {id:'demo-2',name:'Máscara de tratamento — demonstração',brand:'Wella',line:'Linha demonstrativa',category:'Tratamento',size:'500 g',tone:'',price:null,image:'',offers:[]},
  {id:'demo-3',name:'Coloração profissional — demonstração',brand:'Wella',line:'Linha demonstrativa',category:'Coloração',size:'60 g',tone:'7/0',price:null,image:'',offers:[]},
  {id:'demo-4',name:'Condicionador profissional — demonstração',brand:'Wella',line:'Linha demonstrativa',category:'Condicionador',size:'200 ml',tone:'',price:null,image:'',offers:[]}
];
