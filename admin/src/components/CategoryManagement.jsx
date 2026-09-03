import { useEffect, useState } from 'react'
import { Edit, Plus, Save, Search, Trash2, X } from 'lucide-react'
import axios from 'axios'

const API_URL = 'https://palani-broilers-api.vercel.app'
const errorMessage = (error, fallback) => error.response?.data?.message || fallback

function CategoryManagement() {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [editing, setEditing] = useState(null)
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/categories`)
      setCategories(data)
    } catch (error) {
      setMessage(errorMessage(error, 'Unable to load categories.'))
    }
  }
  useEffect(() => { fetchCategories() }, [])
  const submit = async (event) => {
    event.preventDefault()
    setSaving(true); setMessage('')
    try {
      if (editing) await axios.put(`${API_URL}/api/categories/${editing._id}`, { name })
      else await axios.post(`${API_URL}/api/categories`, { name })
      setName(''); setEditing(null); await fetchCategories()
      setMessage(editing ? 'Category name updated.' : 'Category added successfully.')
    } catch (error) {
      setMessage(errorMessage(error, 'Unable to save category.'))
    } finally {
      setSaving(false)
    }
  }
  const startEdit = (category) => { setEditing(category); setName(category.name); setMessage('') }
  const remove = async (category) => {
    if (!window.confirm(`Delete “${category.name}”? Categories used by products cannot be deleted.`)) return
    try {
      await axios.delete(`${API_URL}/api/categories/${category._id}`)
      await fetchCategories()
      setMessage('Category deleted successfully.')
    } catch (error) {
      setMessage(errorMessage(error, 'Unable to delete category.'))
    }
  }
  const visibleCategories = categories.filter((category) => category.name.toLowerCase().includes(query.toLowerCase()))

  return <section className="admin-page"><div className="page-title"><span>Catalog control</span><h2>Categories</h2><p>Create product categories once and use them throughout the catalog.</p></div>{message && <div className="admin-alert">{message}</div>}
    <section className="admin-panel category-form-panel"><div className="panel-heading"><div><span>{editing ? 'Update category' : 'New category'}</span><h3>{editing ? 'Rename Category' : 'Add Category'}</h3></div>{editing && <button className="icon-button" type="button" onClick={() => { setEditing(null); setName('') }} aria-label="Cancel category rename"><X /></button>}</div><form className="category-form" onSubmit={submit}><label>Category Name<input value={name} onChange={(event) => setName(event.target.value)} maxLength="80" placeholder="For example: Fresh Fish" required /></label><button className="primary-action" disabled={saving}><Save size={17} />{saving ? 'Saving…' : editing ? 'Save Name' : 'Add Category'}</button></form></section>
    <section className="admin-panel"><div className="panel-heading"><div><span>Available categories</span><h3>{categories.length} Categories</h3></div><label className="search-field category-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search categories" /></label></div><div className="category-list">{visibleCategories.map((category) => <article className="category-row" key={category._id}><div><strong>{category.name}</strong><small>{category.productCount} product{category.productCount === 1 ? '' : 's'}</small></div><div className="row-actions"><button onClick={() => startEdit(category)} aria-label={`Rename ${category.name}`}><Edit size={17} /></button><button className="danger-button" onClick={() => remove(category)} aria-label={`Delete ${category.name}`}><Trash2 size={17} /></button></div></article>)}</div>{!visibleCategories.length && <div className="empty-state"><h3>No categories found</h3><p>Add a category or adjust your search.</p></div>}</section></section>
}

export default CategoryManagement
