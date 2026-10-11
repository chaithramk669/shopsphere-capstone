import { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { ArrowDownUp, ArrowRight, Check, Heart, Menu, Minus, Plus, Search, ShoppingBag, X } from "lucide-react";
import { categories, products } from "./data/products.js";

const money = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0
}).format(value);

function Header({ count, search, setSearch }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <header className="header">
    <div className="announcement">A little something extra: free shipping on orders over ₹2,499</div>
    <nav className="nav container" aria-label="Main navigation">
      <button className="icon-button mobile-menu" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      <Link to="/" className="logo">shop<span>sphere</span><i>.</i></Link>
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <a href="/#shop" onClick={() => setMenuOpen(false)}>Shop all</a>
        <a href="/#story" onClick={() => setMenuOpen(false)}>Our story</a>
        <a href="/#newsletter" onClick={() => setMenuOpen(false)}>Journal</a>
      </div>
      <label className="searchbox"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." aria-label="Search products" /></label>
      <Link to="/cart" className="cart-link" aria-label={`Shopping bag, ${count} items`}><ShoppingBag size={20} /><span>Bag</span><b>{count}</b></Link>
    </nav>
  </header>;
}

function ProductCard({ product, addToCart, favorite, toggleFavorite }) {
  return <article className="product-card">
    <div className="product-image" style={{ backgroundColor: product.color }}>
      <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`}><img loading="lazy" src={product.image} alt={product.name} /></Link>
      {product.tag && <span className="tag">{product.tag}</span>}
      <button className={`favorite ${favorite ? "selected" : ""}`} aria-label={favorite ? "Remove from favorites" : "Add to favorites"} onClick={() => toggleFavorite(product.id)}><Heart size={18} fill={favorite ? "currentColor" : "none"} /></button>
      <button className="quick-add" onClick={() => addToCart(product)}><Plus size={16} /> Quick add</button>
    </div>
    <div className="product-meta"><div><p className="category-label">{product.category}</p><Link to={`/product/${product.id}`} className="product-name">{product.name}</Link></div><strong>{money(product.price)}</strong></div>
    {product.oldPrice && <p className="old-price">{money(product.oldPrice)}</p>}
  </article>;
}

function Home({ search, cart, addToCart, favorites, toggleFavorite }) {
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const visibleProducts = useMemo(() => {
    let list = products.filter(p => (category === "All" || p.category === category) && p.name.toLowerCase().includes(search.toLowerCase()));
    if (sort === "low") list = [...list].sort((a,b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a,b) => b.price - a.price);
    return list;
  }, [category, search, sort]);
  return <>
    <section className="hero container">
      <div className="hero-copy"><span className="eyebrow"><span className="eyebrow-line" /> GOOD THINGS, WELL CHOSEN</span>
        <h1>Everyday,<br /><em>elevated.</em></h1>
        <p>Thoughtful finds for the way you live, work, and unwind. Less noise, more of what matters.</p>
        <a href="#shop" className="button button-dark">Explore the collection <ArrowRight size={17} /></a>
        <div className="hero-note"><span className="note-stars">✳</span><span>Made for your everyday<br /><b>Designed to last.</b></span></div>
      </div>
      <div className="hero-art"><img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85" alt="Curated neutral-toned everyday essentials" /><div className="floating-note"><span>THE DAILY EDIT</span><b>Small things.<br />Better days.</b><span className="note-arrow">↗</span></div></div>
    </section>
    <section className="benefits container" aria-label="Shop benefits">
      <div><span>✳</span><p><b>Thoughtfully selected</b><small>Quality over quantity</small></p></div><div><span>↗</span><p><b>Easy, always</b><small>Simple shopping experience</small></p></div><div><span>♡</span><p><b>Made to be loved</b><small>Everyday essentials</small></p></div>
    </section>
    <section className="shop-section container" id="shop">
      <div className="section-heading"><div><span className="eyebrow">THE COLLECTION</span><h2>Find your <em>everyday.</em></h2></div><p>Useful things. Beautifully considered.</p></div>
      <div className="catalog-controls"><div className="category-tabs" aria-label="Filter by category">{categories.map(c => <button key={c} onClick={() => setCategory(c)} className={category === c ? "active" : ""}>{c}</button>)}</div><label className="sort-control"><ArrowDownUp size={15}/><select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort products"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label></div>
      {visibleProducts.length ? <div className="product-grid">{visibleProducts.map(p => <ProductCard key={p.id} product={p} addToCart={addToCart} favorite={favorites.includes(p.id)} toggleFavorite={toggleFavorite} />)}</div> : <div className="empty-state"><Search size={30}/><h3>No products found</h3><p>Try another search or category.</p><button className="button button-dark" onClick={() => {setCategory("All");}}>Clear category</button></div>}
    </section>
    <section className="story-section" id="story"><div className="story-image"><img loading="lazy" src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80" alt="Warm, thoughtfully arranged retail space" /></div><div className="story-copy"><span className="eyebrow">A DIFFERENT KIND OF EVERYDAY</span><h2>Buy less.<br /><em>Choose well.</em></h2><p>We believe the things you use every day should earn their place. ShopSphere is a curated collection of useful, lasting, feel-good essentials.</p><a href="#shop" className="text-link">Get to know the collection <ArrowRight size={16}/></a></div></section>
    <section className="newsletter container" id="newsletter"><span className="eyebrow">A NOTE FROM US</span><h2>Good things, <em>occasionally.</em></h2><p>New finds, thoughtful ideas, and a little inspiration for everyday living.</p><Newsletter /></section>
  </>;
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return <form className="newsletter-form" onSubmit={e => {e.preventDefault(); if (email.trim()) setDone(true);}}>
    {done ? <p className="success-message"><Check size={18}/> You're on the list! (Demo only — no email was sent.)</p> : <><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" required placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)} /><button className="button button-dark" type="submit">Sign me up <ArrowRight size={16}/></button></>}
  </form>;
}

function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id));
  const navigate = useNavigate();
  if (!product) return <main className="container page-wrap"><h2>Product not found</h2><Link className="text-link" to="/">Back to shop</Link></main>;
  return <main className="container detail-layout page-wrap"><div className="detail-image" style={{backgroundColor: product.color}}><img src={product.image} alt={product.name}/></div><div className="detail-copy"><Link className="back-link" to="/">← Back to collection</Link><p className="category-label">{product.category}</p><h1>{product.name}</h1><p className="detail-price">{money(product.price)} {product.oldPrice && <del>{money(product.oldPrice)}</del>}</p><p>{product.description}</p><p className="detail-small">Designed for everyday use. Easy to style, simple to love.</p><button className="button button-dark full-button" onClick={() => {addToCart(product); navigate("/cart");}}>Add to bag <ShoppingBag size={17}/></button><div className="detail-perks"><p>✓ Secure checkout experience (demo)</p><p>✓ Free shipping over ₹2,499</p><p>✓ Thoughtful everyday essentials</p></div></div></main>;
}

function Cart({ cart, updateQuantity, removeItem }) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return <main className="container page-wrap cart-page"><span className="eyebrow">YOUR SELECTION</span><h1>Your <em>bag.</em></h1>
    {!cart.length ? <div className="empty-cart"><ShoppingBag size={34}/><h2>Your bag is taking a breather.</h2><p>Find something useful, beautiful, or a little bit of both.</p><Link className="button button-dark" to="/">Explore products <ArrowRight size={16}/></Link></div> :
    <div className="cart-layout"><div className="cart-items">{cart.map(item => <article className="cart-item" key={item.id}><img src={item.image} alt={item.name}/><div className="cart-item-info"><p className="category-label">{item.category}</p><h3>{item.name}</h3><strong>{money(item.price)}</strong><div className="quantity"><button aria-label={`Decrease ${item.name} quantity`} onClick={() => updateQuantity(item.id, -1)}><Minus size={14}/></button><span>{item.quantity}</span><button aria-label={`Increase ${item.name} quantity`} onClick={() => updateQuantity(item.id, 1)}><Plus size={14}/></button></div></div><button className="remove-button" onClick={() => removeItem(item.id)}>Remove</button></article>)}</div>
      <aside className="order-summary"><h2>Order summary</h2><div><span>Subtotal</span><b>{money(subtotal)}</b></div><div><span>Shipping</span><b>{subtotal >= 2499 ? "Free" : money(99)}</b></div><div className="summary-total"><span>Total</span><strong>{money(subtotal + (subtotal >= 2499 ? 0 : 99))}</strong></div><button className="button button-dark full-button" onClick={() => alert("This is a demo storefront. Checkout and payment are not connected.")}>Continue to checkout <ArrowRight size={16}/></button><p className="summary-note">Checkout is a demo; no payment will be collected.</p></aside>
    </div>}
  </main>;
}

function Footer() {
  return <footer className="footer"><div className="container footer-inner"><Link to="/" className="logo">shop<span>sphere</span><i>.</i></Link><p>Thoughtful finds for everyday living.</p><div className="footer-bottom"><span>© {new Date().getFullYear()} ShopSphere. Capstone demo project.</span><a href="#top" onClick={e => {e.preventDefault(); window.scrollTo({top:0, behavior:"smooth"});}}>Back to top ↑</a></div></div></footer>;
}

export default function App() {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState(() => { try { return JSON.parse(localStorage.getItem("shopsphere-cart")) || []; } catch { return []; } });
  const [favorites, setFavorites] = useState(() => { try { return JSON.parse(localStorage.getItem("shopsphere-favorites")) || []; } catch { return []; } });
  useEffect(() => { localStorage.setItem("shopsphere-cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("shopsphere-favorites", JSON.stringify(favorites)); }, [favorites]);
  const addToCart = product => setCart(current => {
    const existing = current.find(item => item.id === product.id);
    return existing ? current.map(item => item.id === product.id ? {...item, quantity:item.quantity + 1} : item) : [...current, {...product, quantity:1}];
  });
  const updateQuantity = (id, change) => setCart(current => current.map(item => item.id === id ? {...item, quantity:item.quantity + change} : item).filter(item => item.quantity > 0));
  const removeItem = id => setCart(current => current.filter(item => item.id !== id));
  const toggleFavorite = id => setFavorites(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id]);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  return <div id="top"><Header count={count} search={search} setSearch={setSearch}/><Routes><Route path="/" element={<Home search={search} cart={cart} addToCart={addToCart} favorites={favorites} toggleFavorite={toggleFavorite}/>} /><Route path="/product/:id" element={<ProductDetail addToCart={addToCart}/>} /><Route path="/cart" element={<Cart cart={cart} updateQuantity={updateQuantity} removeItem={removeItem}/>} /><Route path="*" element={<main className="container page-wrap"><h1>Page not found</h1><Link to="/" className="text-link">Return home <ArrowRight size={16}/></Link></main>} /></Routes><Footer/></div>;
}