import photo1 from './photos/product-1.webp';
import photo2 from './photos/product-2.webp';
import photo3 from './photos/product-3.webp';
import photo4 from './photos/product-4.webp';
import photo5 from './photos/product-5.webp';
import photo6 from './photos/product-6.webp';

export const products = [
  { sku: 'D01', image: photo1, name: 'Shampoo Oil Reflections 250 ml', line: 'Oil Reflections', type: 'Shampoo', size: '250 ml', price: 8900, color: 'gold' },
  { sku: 'D02', image: photo2, name: 'Máscara Fusion 150 ml', line: 'Fusion', type: 'Máscara', size: '150 ml', price: 11900, color: 'rose' },
  { sku: 'D03', image: photo3, name: 'Óleo Oil Reflections 100 ml', line: 'Oil Reflections', type: 'Óleo', size: '100 ml', price: 14900, color: 'amber' },
  { sku: 'D04', image: photo4, name: 'Shampoo Invigo Nutri-Enrich 250 ml', line: 'Invigo', type: 'Shampoo', size: '250 ml', price: 7900, color: 'copper' },
  { sku: 'D05', image: photo5, name: 'Máscara Color Motion+ 150 ml', line: 'Color Motion+', type: 'Máscara', size: '150 ml', price: 12900, color: 'lilac' },
  { sku: 'D06', image: photo6, name: 'Shampoo Ultimate Repair 250 ml', line: 'Ultimate Repair', type: 'Shampoo', size: '250 ml', price: 13900, color: 'ruby' },
];

export const productBySku = Object.fromEntries(products.map(product => [product.sku, product]));
export const currency = cents => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
export const amount = items => items.reduce((total, item) => total + item.price * item.quantity, 0);
