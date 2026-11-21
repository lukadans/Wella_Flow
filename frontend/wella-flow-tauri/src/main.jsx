import '@fontsource-variable/manrope/wght.css';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowRight, ChevronRight, ClipboardCheck, Heart, LayoutGrid, Minus,
  Moon, Plus, ReceiptText, Search, ShoppingBag, Sun, X,
} from 'lucide-react';
import { amount, currency, productBySku, products } from './products';
import './style.css';

const pages = [
  { id: 'catalog', label: 'Catálogo', Icon: LayoutGrid },
  { id: 'favorites', label: 'Favoritos', Icon: Heart },
  { id: 'orders', label: 'Meus pedidos', Icon: ReceiptText },
  { id: 'review', label: 'Conferir pedidos', Icon: ClipboardCheck },
];
const filters = ['Todos', 'Shampoo', 'Máscara', 'Óleo'];
const pending = 'Pendente de análise';
const dateFormat = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

function useSaved(key, fallback) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch { /* The current session still works without local storage. */ }
  }, [key, value]);
  return [value, setValue];
}

const normalize = value => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

function ProductCard({ product, favorite, onFavorite, onAdd }) {
  return <article className="product">
    <div className={`product-art ${product.color}`} aria-hidden="true">
      <img src={product.image} alt="" width="320" height="280" loading="lazy" />
    </div>
    <button type="button" className="icon-button favorite" aria-label={`Favoritar ${product.name}`}
      aria-pressed={favorite} onClick={onFavorite}><Heart size={18} fill={favorite ? 'currentColor' : 'none'} /></button>
    <div className="product-main-content">
      <div className="product-header">
        <span>{product.line}</span>
        <span>{product.sku}</span>
      </div>
      <h3>{product.name}</h3>
      <div className="categories" aria-label="Tipo e tamanho">
        <span>{product.type}</span>
        <span>{product.size}</span>
      </div>
    </div>
    <div className="product-footer">
      <strong>{currency(product.price)}</strong>
      <button type="button" className="icon-button add" aria-label={`Adicionar ${product.name}`} onClick={onAdd}><Plus size={20} /></button>
    </div>
  </article>;
}

function OrderCard({ order, review, onDecision, onRepeat }) {
  const [note, setNote] = useState('');
  return <article className="order">
    <header><div><h2>Pedido {order.number}</h2><p>{dateFormat.format(order.createdAt)}</p></div>
      <span className="status">{order.status}</span></header>
    <ul>{order.items.map(item => <li key={item.sku}><span>{item.quantity} × {item.name}</span><strong>{currency(item.price * item.quantity)}</strong></li>)}</ul>
    <div className="order-total"><span>Total de referência</span><strong>{currency(amount(order.items))}</strong></div>
    {order.note && <p className="note">Observação do pedido · {order.note}</p>}
    {order.reviewNote && <p className="note">Nota da conferência · {order.reviewNote}</p>}
    {review && order.status === pending && <>
      <label className="field">Nota da conferência<textarea value={note} onChange={event => setNote(event.target.value)} rows="2" maxLength="500" /></label>
      <div className="actions">{['Aprovado', 'Ajuste solicitado', 'Recusado'].map(decision =>
        <button type="button" className={decision === 'Aprovado' ? 'primary' : 'secondary'} key={decision} onClick={() => onDecision(order.number, decision, note.trim())}>
          {{ Aprovado: 'Aprovar', 'Ajuste solicitado': 'Solicitar ajuste', Recusado: 'Recusar' }[decision]}
        </button>)}</div>
    </>}
    {!review && <button type="button" className="secondary" onClick={() => onRepeat(order.items)}>Repetir pedido</button>}
  </article>;
}

function App() {
  const [page, setPage] = useState('catalog');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Todos');
  const [theme, setTheme] = useSaved('wella-flow-tauri-theme', 'dark');
  const [favorites, setFavorites] = useSaved('wella-flow-tauri-favorites', []);
  const [draft, setDraft] = useSaved('wella-flow-tauri-draft', {});
  const [note, setNote] = useSaved('wella-flow-tauri-note', '');
  const [orders, setOrders] = useSaved('wella-flow-tauri-orders', []);
  const [message, setMessage] = useState({ text: '', tick: 0 });
  const dialog = useRef(null);
  const main = useRef(null);
  const title = pages.find(item => item.id === page).label;
  const draftItems = Object.entries(draft).flatMap(([sku, quantity]) => {
    const product = productBySku[sku];
    return product ? [{ sku, name: product.name, price: product.price, quantity }] : [];
  });
  const unitCount = draftItems.reduce((total, item) => total + item.quantity, 0);
  const featured = [...new Set([...favorites, ...products.map(product => product.sku)])].slice(0, 3);
  const visibleProducts = products.filter(product =>
    (page !== 'favorites' || favorites.includes(product.sku)) &&
    (filter === 'Todos' || product.type === filter) &&
    normalize(`${product.name} ${product.line} ${product.sku}`).includes(normalize(query.trim()))
  );

  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => {
    if (!message.text) return;
    const timeout = setTimeout(() => setMessage(current => ({ ...current, text: '' })), 2600);
    return () => clearTimeout(timeout);
  }, [message]);

  function navigate(id) {
    setPage(id);
    setQuery('');
    setFilter('Todos');
    window.scrollTo(0, 0);
    main.current.focus({ preventScroll: true });
  }

  function adjust(sku, change) {
    setDraft(previous => {
      const next = { ...previous };
      const quantity = (next[sku] ?? 0) + change;
      if (quantity > 0) next[sku] = quantity;
      else delete next[sku];
      return next;
    });
  }

  function announce(text) {
    setMessage(previous => ({ text, tick: previous.tick + 1 }));
  }

  function submit(event) {
    event.preventDefault();
    if (!draftItems.length) return;
    setOrders(previous => [{
      number: (previous[0]?.number ?? 0) + 1, items: draftItems, note: note.trim(),
      createdAt: Date.now(), status: pending,
    }, ...previous]);
    setDraft({});
    setNote('');
    dialog.current.close();
    navigate('orders');
    announce('Pedido enviado para análise local.');
  }

  function decide(number, status, reviewNote) {
    setOrders(previous => previous.map(order => order.number === number && order.status === pending
      ? { ...order, status, reviewNote } : order));
    announce('Decisão registrada.');
  }

  function repeat(items) {
    setDraft(previous => {
      const next = { ...previous };
      items.forEach(({ sku, quantity }) => {
        if (productBySku[sku]) next[sku] = (next[sku] ?? 0) + quantity;
      });
      return next;
    });
    dialog.current.showModal();
  }

  return <>
    <header className="mobile-header">
      <div className="brand"><span className="brand-mark">W</span> Wella Flow</div>
      <button type="button" className="icon-button" aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <Sun size={20}/> : <Moon size={20}/>}</button>
    </header>
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">W</span> Wella Flow</div>
      <nav aria-label="Navegação principal">
        {pages.map(({ id, label, Icon }) => <button type="button" className="nav-item" key={id}
          aria-current={id === page ? 'page' : undefined} onClick={() => navigate(id)}><Icon size={19}/><span>{label}</span></button>)}
      </nav>
      <button type="button" className="sidebar-order" onClick={() => dialog.current.showModal()}>
        <span className="sidebar-order__glass"><strong>Meu pedido</strong>
          <small>{unitCount} {unitCount === 1 ? 'unidade' : 'unidades'}</small>
        </span>
        <span className="sidebar-order__arrow" aria-hidden="true"><ChevronRight size={18}/></span>
      </button>
      <button type="button" className="theme-button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        {theme === 'dark' ? <Sun size={19}/> : <Moon size={19}/>}
        {theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
      </button>
    </aside>

    <main ref={main} tabIndex={-1} aria-label="Área de trabalho">
      <div className="page-header">
        <h1>{title}</h1>
        <button type="button" className="primary draft-button" onClick={() => dialog.current.showModal()}>
          <ShoppingBag size={18}/><span>Revisar pedido</span><span className="count">{unitCount}</span>
        </button>
      </div>

      {page === 'catalog' && <section className="hero" aria-labelledby="selection">
        <div className="hero-content">
          <p className="eyebrow">Seleção para o salão</p>
          <h2 id="selection">Sua seleção <em>de produtos</em></h2>
          <div className="shortcuts">{featured.map(sku => <button type="button" key={sku} title={productBySku[sku].name} onClick={() => { setQuery(sku); setFilter('Todos'); }}>
            {productBySku[sku].type} · {productBySku[sku].size}<ChevronRight size={14}/>
          </button>)}</div>
        </div>
        <div className="hero-photo" aria-hidden="true">
          <img src={productBySku.D01.image} alt="" className="hero-shampoo" />
          <img src={productBySku.D03.image} alt="" className="hero-oil" />
        </div>
      </section>}

      {(page === 'catalog' || page === 'favorites') && <section className="catalog" aria-label="Produtos">
        <div className="tools">
          <label className="search"><Search size={19}/><input type="search" aria-label="Buscar produto" placeholder="Buscar por produto, linha ou SKU" value={query} onChange={event => setQuery(event.target.value)} /></label>
          <div className="filters" aria-label="Filtrar por tipo">{filters.map(type => <button type="button" key={type}
            aria-pressed={type === filter} onClick={() => setFilter(type)}>{type}</button>)}</div>
        </div>
        <p className="results">{visibleProducts.length} {visibleProducts.length === 1 ? 'produto' : 'produtos'} · Catálogo de demonstração</p>
        {visibleProducts.length ? <div className="product-grid">{visibleProducts.map(product => <ProductCard
          product={product} key={product.sku} favorite={favorites.includes(product.sku)}
          onFavorite={() => setFavorites(previous => previous.includes(product.sku) ? previous.filter(sku => sku !== product.sku) : [...previous, product.sku])}
          onAdd={() => { adjust(product.sku, 1); announce('Produto adicionado ao pedido.'); }}/>)}</div> :
          <p className="empty">{page === 'favorites' && !favorites.length ? 'Toque no coração de um produto para salvá-lo aqui.' : 'Nenhum produto encontrado.'}</p>}
      </section>}

      {(page === 'orders' || page === 'review') && <section className="order-list" aria-label={title}>
        {orders.length ? orders.map(order => <OrderCard key={order.number} order={order} review={page === 'review'} onDecision={decide} onRepeat={repeat}/>) :
          <p className="empty">{page === 'review' ? 'Os pedidos enviados para análise aparecem aqui.' : 'Ainda não há pedidos neste dispositivo.'}</p>}
      </section>}
    </main>

    <dialog ref={dialog} aria-labelledby="draft-title">
      <form className="draft" onSubmit={submit}>
        <header><h2 id="draft-title">Revisar pedido</h2><button type="button" className="icon-button" aria-label="Fechar revisão" onClick={() => dialog.current.close()}><X size={22}/></button></header>
        {draftItems.length ? <>
          <ul className="draft-items">{draftItems.map(item => <li key={item.sku}>
            <div><strong>{item.name}</strong><small>{currency(item.price)} por unidade</small></div>
            <div className="quantity"><button type="button" className="icon-button" aria-label={`Remover uma unidade de ${item.name}`} onClick={() => adjust(item.sku, -1)}><Minus size={17}/></button>
              <span>{item.quantity}</span><button type="button" className="icon-button" aria-label={`Adicionar uma unidade de ${item.name}`} onClick={() => adjust(item.sku, 1)}><Plus size={17}/></button></div>
          </li>)}</ul>
          <label className="field">Observação<textarea value={note} onChange={event => setNote(event.target.value)} rows="2" maxLength="500"/></label>
          <div className="order-total"><span>Total de referência</span><strong>{currency(amount(draftItems))}</strong></div>
          <button type="submit" className="primary">Solicitar análise <ArrowRight size={18}/></button>
        </> : <p className="empty">Adicione um produto do catálogo para montar o pedido.</p>}
      </form>
    </dialog>
    <div className={message.text ? 'toast visible' : 'toast'} role="status" aria-atomic="true">{message.text}</div>
  </>;
}

createRoot(document.getElementById('root')).render(<App/>);
