import { useEffect, useMemo, useState } from 'react'
import { Edit, ImagePlus, Plus, Save, Search, Trash2, X } from 'lucide-react'
import axios from 'axios'

const API_URL = 'https://palani-broilers-api.vercel.app'
const requestErrorMessage = (error, fallback) => error.response?.data?.message || (error.request ? 'The API did not respond. Check the deployed backend CORS configuration.' : error.message || fallback)
const stockStatusFor = (product) => product.stockStatus || (product.lowStock ? 'low-stock' : 'in-stock')

function ProductManagement() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [lowStockOnly, setLowStockOnly] = useState(false)
  const [sort, setSort] = useState('newest')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [quickSaving, setQuickSaving] = useState('')
  const [imageUploading, setImageUploading] = useState('')
  const [deleting, setDeleting] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [message, setMessage] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const [productResponse, categoryResponse] = await Promise.all([axios.get(`${API_URL}/api/products`), axios.get(`${API_URL}/api/categories`)])
      setProducts(productResponse.data)
      setCategories(categoryResponse.data)
    } catch (error) { setMessage(requestErrorMessage(error, 'Unable to load products.')) } finally { setLoading(false) }
  }
  useEffect(() => { fetchData() }, [])
  const categoryName = (slug) => slug === 'all' ? 'All products' : categories.find((item) => item.slug === slug)?.name || slug
  const visibleProducts = useMemo(() => [...products].filter((product) => {
    const query = search.toLowerCase()
    return (!query || product.nameTamil.toLowerCase().includes(query) || product.nameEnglish.toLowerCase().includes(query) || product.category?.toLowerCase().includes(query)) && (category === 'all' || product.category === category) && (!lowStockOnly || stockStatusFor(product) === 'low-stock')
  }).sort((a, b) => {
    if (sort === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
    if (sort === 'price-low') return a.price - b.price
    if (sort === 'price-high') return b.price - a.price
    if (sort === 'name') return a.nameEnglish.localeCompare(b.nameEnglish)
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  }), [products, search, category, lowStockOnly, sort])
  const resetForm = () => { setShowForm(false); setEditingProduct(null); setImagePreview(null) }
  const handleSave = async (event) => {
    event.preventDefault(); setSaving(true); setMessage('')
    try {
      const formData = new FormData(event.target)
      if (editingProduct) await axios.put(`${API_URL}/api/products/${editingProduct._id}`, formData)
      else await axios.post(`${API_URL}/api/products`, formData)
      await fetchData(); resetForm(); setMessage('Product saved successfully.')
    } catch (error) { setMessage(requestErrorMessage(error, 'Unable to save product.')) } finally { setSaving(false) }
  }
  const saveQuickEdit = async (product, form) => {
    setQuickSaving(product._id); setMessage('')
    try {
      const formData = new FormData()
      formData.append('nameTamil', product.nameTamil)
      formData.append('nameEnglish', product.nameEnglish)
      formData.append('category', product.category || 'all')
      formData.append('unit', product.unit || 'kg')
      formData.append('price', form.price.value)
      formData.append('stockStatus', form.stockStatus.value)
      await axios.put(`${API_URL}/api/products/${product._id}`, formData)
      await fetchData(); setMessage(`${product.nameEnglish} price and stock status updated.`)
    } catch (error) { setMessage(requestErrorMessage(error, 'Unable to update product.')) } finally { setQuickSaving('') }
  }
  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(deleteTarget._id)
    try { await axios.delete(`${API_URL}/api/products/${deleteTarget._id}`); await fetchData(); setMessage(`${deleteTarget.nameEnglish} was deleted successfully.`) } catch (error) { setMessage(requestErrorMessage(error, 'Unable to delete product.')) } finally { setDeleting(null); setDeleteTarget(null) }
  }
  const handleImage = (event) => { const file = event.target.files[0]; if (file) setImagePreview(URL.createObjectURL(file)) }
  const uploadInlineImage = async (product, file) => {
    if (!file) return
    setImageUploading(product._id); setMessage('')
    try {
      const formData = new FormData()
      formData.append('nameTamil', product.nameTamil)
      formData.append('nameEnglish', product.nameEnglish)
      formData.append('category', product.category || 'all')
      formData.append('unit', product.unit || 'kg')
      formData.append('price', product.price)
      formData.append('stockStatus', stockStatusFor(product))
      formData.append('image', file)
      await axios.put(`${API_URL}/api/products/${product._id}`, formData)
      await fetchData(); setMessage(`${product.nameEnglish} image uploaded successfully.`)
    } catch (error) { setMessage(requestErrorMessage(error, 'Unable to upload image.')) } finally { setImageUploading('') }
  }
  const startEdit = (product) => { setEditingProduct(product); setImagePreview(product.imageUrl || null); setShowForm(true); setMessage('') }

  return <section className="admin-page"><div className="page-title product-page-title"><div><span>Catalog control</span><h2>Product Management</h2><p>Change price, low stock, or out-of-stock status directly from each product.</p></div><button className="primary-action" onClick={() => { resetForm(); setShowForm(true) }}><Plus size={18} />Add Product</button></div>{message && <div className="admin-alert">{message}</div>}
    {showForm && <form className="admin-panel product-form" onSubmit={handleSave}><div className="panel-heading"><div><span>{editingProduct ? 'Update product' : 'New product'}</span><h3>{editingProduct ? 'Edit Product' : 'Add Product'}</h3></div><button type="button" className="icon-button" onClick={resetForm} aria-label="Close product form"><X /></button></div><div className="form-section"><h4>Product information</h4><div className="form-grid"><label>Tamil Name<input name="nameTamil" defaultValue={editingProduct?.nameTamil} required /></label><label>English Name<input name="nameEnglish" defaultValue={editingProduct?.nameEnglish} required /></label><label>Category<select name="category" defaultValue={editingProduct?.category || 'all'}><option value="all">All products</option>{categories.map((item) => <option value={item.slug} key={item._id}>{item.name}</option>)}</select></label></div><p className="form-help">Need a new option? Add it from the Categories section, then return here to select it.</p></div><div className="form-section"><h4>Pricing & availability</h4><div className="form-grid"><label>Price (₹)<input name="price" type="number" step="0.01" defaultValue={editingProduct?.price} required /></label><label>Unit<input name="unit" defaultValue={editingProduct?.unit || 'kg'} /></label><label>Stock Status<select name="stockStatus" defaultValue={editingProduct ? stockStatusFor(editingProduct) : 'in-stock'}><option value="in-stock">In Stock</option><option value="low-stock">Low Stock</option><option value="out-of-stock">No Stock</option></select></label></div></div><div className="form-section"><h4>Product image</h4><div className="image-input"><input name="image" type="file" accept="image/*" onChange={handleImage} /><button type="button" onClick={() => setImagePreview(null)}>Remove selected image</button></div>{imagePreview && <img className="image-preview" src={imagePreview} alt="Selected product preview" />}</div><div className="form-actions"><button className="primary-action" disabled={saving}><Save size={17} />{saving ? 'Saving…' : editingProduct ? 'Save Changes' : 'Save Product'}</button><button type="button" className="secondary-action" onClick={resetForm}>Cancel</button></div></form>}
    <section className="admin-panel"><div className="catalog-toolbar"><label className="search-field"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search Tamil, English, or category" /></label><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">All categories</option>{categories.map((item) => <option key={item._id} value={item.slug}>{item.name}</option>)}</select><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="name">Name A to Z</option></select><label className="stock-filter"><input type="checkbox" checked={lowStockOnly} onChange={(event) => setLowStockOnly(event.target.checked)} />Low Stock</label></div>{loading ? <div className="loading-grid">{Array.from({ length: 5 }).map((_, index) => <div className="skeleton" key={index} />)}</div> : visibleProducts.length ? <div className="product-list">{visibleProducts.map((product) => <article className="admin-product-card" key={product._id}>{product.imageUrl ? <img src={product.imageUrl} alt={product.nameEnglish} /> : <label className="inline-image-upload" title="Upload product image"><input type="file" accept="image/*" disabled={imageUploading === product._id} onChange={(event) => uploadInlineImage(product, event.target.files[0])} /><ImagePlus size={18} /><span>{imageUploading === product._id ? 'Uploading…' : 'Add image'}</span></label>}<div className="product-meta"><strong>{product.nameTamil}</strong><span>{product.nameEnglish}</span><small>{categoryName(product.category)} · {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'Date unavailable'}</small></div><form className="quick-product-edit" onSubmit={(event) => { event.preventDefault(); saveQuickEdit(product, event.currentTarget) }}><label>Price (₹)<input name="price" type="number" min="0" step="0.01" defaultValue={product.price} required /></label><label>Status<select name="stockStatus" defaultValue={stockStatusFor(product)}><option value="in-stock">In Stock</option><option value="low-stock">Low Stock</option><option value="out-of-stock">No Stock</option></select></label><button type="submit" className="quick-save" disabled={quickSaving === product._id}>{quickSaving === product._id ? 'Saving…' : 'Update'}</button></form><span className={`stock-status stock-${stockStatusFor(product)}`}>{stockStatusFor(product) === 'out-of-stock' ? 'No Stock' : stockStatusFor(product) === 'low-stock' ? 'Low Stock' : 'In Stock'}</span><div className="row-actions"><button type="button" onClick={() => startEdit(product)} aria-label={`Edit ${product.nameEnglish}`}><Edit size={17} /></button><button type="button" className="danger-button" onClick={() => setDeleteTarget(product)} aria-label={`Delete ${product.nameEnglish}`}><Trash2 size={17} /></button></div></article>)}</div> : <div className="empty-state"><h3>No products found</h3><p>Adjust the filters or add your first product.</p><button className="primary-action" onClick={() => { resetForm(); setShowForm(true) }}><Plus size={17} />Add Product</button></div>}</section>
    {deleteTarget && <div className="confirm-backdrop" role="dialog" aria-modal="true" aria-labelledby="delete-title"><div className="confirm-dialog"><h3 id="delete-title">Delete product?</h3><p>Are you sure you want to delete <strong>{deleteTarget.nameEnglish}</strong>? This cannot be undone.</p><div className="form-actions"><button className="danger-action" onClick={handleDelete} disabled={Boolean(deleting)}>{deleting ? 'Deleting…' : 'Delete Product'}</button><button className="secondary-action" onClick={() => setDeleteTarget(null)}>Cancel</button></div></div></div>}</section>
}

export default ProductManagement
