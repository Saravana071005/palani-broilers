import { Search, SlidersHorizontal } from 'lucide-react'

function ProductList({ products, categories, onProductClick, selectedCategory, onCategoryChange, searchQuery, onSearchChange }) {
  const categoryOptions = [{ id: 'all', name: 'All' }, ...categories.map((category) => ({ id: category.slug, name: category.name }))]
  const unavailable = (product) => product.stockStatus === 'out-of-stock' || product.lowStock
  return <section id="products" className="catalogue-section" aria-labelledby="products-title">
    <div className="catalogue-intro"><p className="eyebrow">THE DAILY SELECTION</p><h2 id="products-title">எங்கள் <em>பொருட்கள்</em></h2><p>உங்கள் விருப்பமான புதிய பொருட்களைத் தேர்வு செய்யுங்கள்.</p></div>
    <div className="catalogue-tools"><label className="editorial-search"><Search size={18} /><input type="search" placeholder="Tamil, English அல்லது category தேடவும்" value={searchQuery} onChange={(event) => onSearchChange(event.target.value)} /></label><div id="categories" className="category-rail" aria-label="Product categories"><SlidersHorizontal size={16} />{categoryOptions.map((category) => <button key={category.id} type="button" onClick={() => onCategoryChange(category.id)} className={selectedCategory === category.id ? 'is-active' : ''}>{category.name}</button>)}</div></div>
    <div className="editorial-product-grid">{products.map((product, index) => <button type="button" className={`editorial-product ${index % 7 === 0 ? 'product-feature' : ''} ${unavailable(product) ? 'product-unavailable' : ''}`} key={product._id} onClick={() => onProductClick(product)} aria-label={`${product.nameEnglish} details`}><span className="product-image-frame">{product.imageUrl ? <img src={product.imageUrl} alt={product.nameEnglish} loading="lazy" /> : <span className="image-placeholder">PB</span>}{unavailable(product) && <span className="availability-tag">OUT OF STOCK</span>}</span><span className="product-copy"><span className="product-category">{categories.find((category) => category.slug === product.category)?.name || product.category || 'Palani Broilers'}</span><strong>{product.nameTamil}</strong><small>{product.nameEnglish}</small><span className="product-open">View product <i>↗</i></span></span></button>)}</div>
    {!products.length && <div className="catalogue-empty">பொருட்கள் கிடைக்கவில்லை. வேறு தேடல் அல்லது வகையை முயற்சிக்கவும்.</div>}
  </section>
}
export default ProductList
