import { useEffect, useState } from 'react'
import { Boxes, ClipboardList, FileUp, FolderTree, LayoutDashboard, Mail, Menu, X } from 'lucide-react'
import Header from './components/Header'
import ProductManagement from './components/ProductManagement'
import CategoryManagement from './components/CategoryManagement'
import ImportProducts from './components/ImportProducts'
import ContactManagement from './components/ContactManagement'
import Login from './components/Login'
import axios from 'axios'

const API_URL = 'https://palani-broilers-api.vercel.app'
axios.defaults.withCredentials = true

function Dashboard() {
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')
  useEffect(() => { axios.get(`${API_URL}/api/products`).then(({ data }) => setProducts(data)).catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load dashboard data.')) }, [])
  const categories = new Set(products.map((product) => product.category).filter(Boolean)).size
  const recent = [...products].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 5)
  const stats = [['Total Products', products.length, Boxes], ['Not Low Stock', products.filter((product) => !product.lowStock).length, ClipboardList], ['Low Stock', products.filter((product) => product.lowStock).length, LayoutDashboard], ['Categories', categories, LayoutDashboard]]
  return <section className="admin-page"><div className="page-title"><span>Overview</span><h2>Dashboard</h2><p>Live information calculated from your current product data.</p></div>{error && <div className="admin-alert admin-alert-error">{error}</div>}<div className="admin-stats">{stats.map(([label, value, Icon]) => <article className="stat-card" key={label}><div><p>{label}</p><strong>{value}</strong></div><Icon size={22} /></article>)}</div><section className="admin-panel recent-panel"><div className="panel-heading"><div><span>Latest entries</span><h3>Recently Added</h3></div></div>{recent.length ? <div className="recent-list">{recent.map((product) => <div className="recent-row" key={product._id}>{product.imageUrl ? <img src={product.imageUrl} alt="" /> : <div className="thumb-placeholder">PB</div>}<div><strong>{product.nameTamil}</strong><small>{product.nameEnglish}</small></div><div><strong>₹{Number(product.price).toFixed(2)}</strong><small>{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'Date unavailable'}</small></div></div>)}</div> : <p className="empty-copy">No products found.</p>}</section></section>
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [authenticated, setAuthenticated] = useState(null)
  const navigation = [['dashboard', 'Dashboard', LayoutDashboard], ['products', 'Products', Boxes], ['categories', 'Categories', FolderTree], ['import', 'Import Products', FileUp], ['contact', 'Contact Details', Mail]]
  const selectTab = (tab) => { setActiveTab(tab); setMenuOpen(false) }
  useEffect(() => { axios.get(`${API_URL}/api/admin/session`).then(() => setAuthenticated(true)).catch(() => setAuthenticated(false)) }, [])
  const login = async (email, password) => { await axios.post(`${API_URL}/api/admin/login`, { email, password }); setAuthenticated(true) }
  const logout = async () => { try { await axios.post(`${API_URL}/api/admin/logout`) } finally { setAuthenticated(false); setMenuOpen(false) } }
  if (authenticated === null) return <main className="login-page"><p className="session-loading">Checking secure session…</p></main>
  if (!authenticated) return <Login onLogin={login} />
  return <div className="admin-shell"><Header onLogout={logout} /><aside className={`admin-sidebar ${menuOpen ? 'admin-sidebar-open' : ''}`} aria-label="Admin navigation">{navigation.map(([id, label, Icon]) => <button key={id} onClick={() => selectTab(id)} className={activeTab === id ? 'nav-active' : ''}><Icon size={18} />{label}</button>)}</aside><button className="admin-menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle admin navigation">{menuOpen ? <X /> : <Menu />}</button><main className="admin-main">{activeTab === 'dashboard' && <Dashboard />}{activeTab === 'products' && <ProductManagement />}{activeTab === 'categories' && <CategoryManagement />}{activeTab === 'import' && <ImportProducts />}{activeTab === 'contact' && <ContactManagement />}</main></div>
}

export default App
