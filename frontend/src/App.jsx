import {useMemo,useState} from 'react';
import {Search,LayoutGrid,ShoppingBag,Heart,SlidersHorizontal,Plus,Minus,Menu,X,Sparkles,PackageOpen,ArrowRight,Check,ClipboardList} from 'lucide-react';
import {normalizeCatalog,demo} from './catalog.js';
const nav=[{key:'catalogo',label:'Catálogo',icon:LayoutGrid},{key:'favoritos',label:'Favoritos',icon:Heart},{key:'pedido',label:'Meu pedido',icon:ShoppingBag}];
const money=value=>value==null?'Preço não informado':new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(value);
function ProductCard({product,favorite,toggleFavorite,quantity,changeQuantity}){
 return <article className="product-card"><div className="product-image">
 {product.image?<img src={product.image} alt={product.name} loading="lazy"/>:<div className="image-placeholder"><Sparkles size={30}/><span>Imagem do catálogo</span></div>}
 <button className={'favorite '+(favorite?'active':'')} aria-label={favorite?'Remover dos favoritos':'Adicionar aos favoritos'} aria-pressed={favorite} onClick={()=>toggleFavorite(product.id)}><Heart size={18} fill={favorite?'currentColor':'none'}/></button>
 <span className="image-tag">{product.category}</span></div><div className="card-body">
 <div className="card-meta"><span>{product.brand}</span><span>{product.size}</span></div>
 <h3 title={product.name}>{product.name}</h3><p className="product-line">{product.line}{product.tone?' · Tom '+product.tone:''}</p>
 <div className="card-footer"><span className="price">{money(product.price)}</span>
 {quantity?<div className="quantity" aria-label={'Quantidade: '+quantity}><button onClick={()=>changeQuantity(product.id,-1)} aria-label="Diminuir quantidade"><Minus size={15}/></button><strong>{quantity}</strong><button onClick={()=>changeQuantity(product.id,1)} aria-label="Aumentar quantidade"><Plus size={15}/></button></div>:<button className="add" onClick={()=>changeQuantity(product.id,1)} aria-label={'Adicionar '+product.name+' ao pedido'}><Plus size={19}/></button>}
 </div></div></article>;
}
export default function App(){
 const [active,setActive]=useState('catalogo'),[menu,setMenu]=useState(false),[query,setQuery]=useState(''),[category,setCategory]=useState('Todos'),[favs,setFavs]=useState([]),[cart,setCart]=useState({}),[products,setProducts]=useState(demo),[loaded,setLoaded]=useState(false),[error,setError]=useState('');
 const cats=['Todos',...new Set(products.map(p=>p.category))],count=Object.values(cart).reduce((a,b)=>a+b,0);
 const filtered=useMemo(()=>products.filter(p=>(active!=='favoritos'||favs.includes(p.id))&&(active!=='pedido'||cart[p.id]>0)&&(category==='Todos'||p.category===category)&&[p.name,p.brand,p.line,p.size,p.tone,p.ean,p.id].join(' ').toLowerCase().includes(query.toLowerCase().trim())),[products,active,favs,cart,category,query]);
 const changeQuantity=(id,n)=>setCart(prev=>({...prev,[id]:Math.max(0,(prev[id]||0)+n)}));
 const toggleFavorite=id=>setFavs(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
 const select=k=>{setActive(k);setCategory('Todos');setMenu(false);};
 async function importJson(file){if(!file)return;try{const parsed=normalizeCatalog(JSON.parse(await file.text()));setProducts(parsed);setLoaded(true);setCart({});setFavs([]);setCategory('Todos');setActive('catalogo');setError('');}catch(e){setError('Não foi possível importar: '+e.message);}}
 return <div className="shell">
 <aside className={'sidebar '+(menu?'open':'')}><div className="logo"><span className="logo-mark">W</span><span><strong>Wella Flow</strong><small>Gestão de produtos</small></span><button className="close-menu" onClick={()=>setMenu(false)} aria-label="Fechar menu"><X size={22}/></button></div><div className="nav-label">WORKSPACE</div><nav aria-label="Navegação principal">{nav.map(({key,label,icon:Icon})=><button key={key} className={'nav-link '+(active===key?'selected':'')} onClick={()=>select(key)}><Icon size={19}/><span>{label}</span>{key==='pedido'&&count>0&&<b>{count}</b>}</button>)}</nav><div className="sidebar-bottom"><div className="status-dot"/><span>{loaded?'Catálogo importado':'Modo demonstração'}</span></div></aside>
 {menu&&<button className="scrim" onClick={()=>setMenu(false)} aria-label="Fechar navegação"/>}
 <main className="main"><header className="topbar"><button className="menu-toggle" onClick={()=>setMenu(true)} aria-label="Abrir menu"><Menu size={22}/></button><div className="breadcrumb">Workspace <span>/</span> {nav.find(x=>x.key===active).label}</div><div className="top-actions"><span className="top-tag">WELLA FLOW</span><button className="cart-top" onClick={()=>select('pedido')} aria-label={'Abrir pedido, '+count+' unidades'}><ShoppingBag size={20}/>{count>0&&<b>{count}</b>}</button></div></header>
 <div className="content"><div className="hero"><div className="hero-glow"/><span className="eyebrow"><Sparkles size={14}/> SUA ÁREA DE TRABALHO</span><h1>{active==='catalogo'?'Catálogo de produtos':active==='favoritos'?'Seus favoritos':'Meu pedido'}</h1><p>{active==='catalogo'?'Encontre produtos, explore categorias e organize seu próximo pedido.':active==='favoritos'?'Os produtos que você separou para consultar depois.':'Revise os itens e quantidades selecionados.'}</p><div className="hero-bottom"><span><Check size={15}/>{loaded?'Arquivo carregado':'Prévia com produtos fictícios'}</span><span>{products.length} SKUs no catálogo</span></div></div>
 <div className="section-top"><div><span className="section-kicker">EXPLORE</span><h2>{active==='catalogo'?'Produtos disponíveis':active==='favoritos'?'Produtos salvos':'Itens selecionados'}</h2><p>{filtered.length} {filtered.length===1?'resultado':'resultados'}</p></div><label className="import-btn"><PackageOpen size={17}/> Importar JSON<input type="file" accept=".json,application/json" onChange={e=>{importJson(e.target.files?.[0]);e.target.value='';}}/></label></div>
 {error&&<p className="error" role="alert">{error}</p>}
 <div className="toolbar"><label className="search"><Search size={19}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar por nome, marca, SKU ou EAN..." aria-label="Buscar produtos"/></label><div className="filter"><SlidersHorizontal size={17}/><select value={category} onChange={e=>setCategory(e.target.value)} aria-label="Filtrar categoria">{cats.map(c=><option key={c}>{c}</option>)}</select></div></div>
 <div className="chips" aria-label="Categorias">{cats.map(c=><button key={c} className={category===c?'chip current':'chip'} onClick={()=>setCategory(c)}>{c}</button>)}</div>
 {filtered.length?<div className="products">{filtered.map(p=><ProductCard key={p.id} product={p} favorite={favs.includes(p.id)} toggleFavorite={toggleFavorite} quantity={cart[p.id]||0} changeQuantity={changeQuantity}/>)}</div>:<div className="empty"><PackageOpen size={34}/><h3>Nenhum produto encontrado</h3><p>Tente outra busca ou selecione uma categoria diferente.</p><button onClick={()=>{setQuery('');setCategory('Todos')}}>Limpar filtros <ArrowRight size={16}/></button></div>}
 {active==='pedido'&&count>0&&<div className="order-summary"><span><ClipboardList size={19}/> Total de unidades: <strong>{count}</strong></span><span>Envio e conferência serão integrados posteriormente.</span></div>}
 </div></main>
 <nav className="mobile-nav" aria-label="Navegação móvel">{nav.map(({key,label,icon:Icon})=><button key={key} onClick={()=>select(key)} className={active===key?'selected':''}><Icon size={20}/><span>{label}</span>{key==='pedido'&&count>0&&<b>{count}</b>}</button>)}</nav></div>;
}
