import { useRef, useState } from 'react'
import { CheckCircle2, FileText, Upload, X } from 'lucide-react'
import axios from 'axios'

const API_URL = 'https://palani-broilers-api.vercel.app'
const errorMessage = (error, fallback) => error.response?.data?.message || fallback

function ImportProducts() {
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [duplicateAction, setDuplicateAction] = useState('skip')

  const clear = () => { setFile(null); setPreview(null); setMessage(''); if (inputRef.current) inputRef.current.value = '' }
  const chooseFile = (selectedFile) => {
    if (!selectedFile) return
    if (!selectedFile.name.toLowerCase().endsWith('.txt')) { clear(); setMessage('Only .txt files can be imported.'); return }
    if (selectedFile.size > 256 * 1024) { clear(); setMessage('TXT file must be 256 KB or smaller.'); return }
    setFile(selectedFile); setPreview(null); setMessage('')
  }
  const requestImport = async (confirm = false) => {
    if (!file) return setMessage('Choose a TXT file first.')
    setLoading(true); setMessage('')
    const formData = new FormData()
    formData.append('file', file)
    formData.append('confirm', String(confirm))
    formData.append('duplicateAction', duplicateAction)
    try {
      const { data } = await axios.post(`${API_URL}/api/admin/import-products`, formData)
      if (confirm) { setPreview(null); setMessage(`Import completed — ${data.summary.productsCreated} created, ${data.summary.productsUpdated} updated, ${data.summary.productsSkipped} skipped, ${data.summary.categoriesCreated} categories created.`); setFile(null); if (inputRef.current) inputRef.current.value = '' }
      else setPreview(data)
    } catch (error) {
      const data = error.response?.data
      if (data?.products) setPreview(data)
      setMessage(errorMessage(error, 'Unable to inspect this TXT file.'))
    } finally { setLoading(false) }
  }
  const drop = (event) => { event.preventDefault(); chooseFile(event.dataTransfer.files[0]) }
  const hasErrors = Boolean(preview?.errors?.length)

  return <section className="admin-page"><div className="page-title"><span>Catalog control</span><h2>Import Products</h2><p>Preview a TXT file first, then safely add products and categories to your catalog.</p></div>
    {message && <div className="admin-alert">{message}</div>}
    <section className="admin-panel import-panel"><div className="import-dropzone" onDragOver={(event) => event.preventDefault()} onDrop={drop} role="button" tabIndex="0" onKeyDown={(event) => event.key === 'Enter' && inputRef.current?.click()}><Upload size={28} /><strong>Drop a TXT file here</strong><span>or</span><button type="button" className="secondary-action" onClick={() => inputRef.current?.click()}>Choose TXT File</button><input ref={inputRef} type="file" accept=".txt,text/plain" onChange={(event) => chooseFile(event.target.files[0])} /></div>{file && <div className="selected-file"><FileText size={20} /><span>{file.name}</span><small>{Math.ceil(file.size / 1024)} KB</small><button type="button" onClick={clear} aria-label="Clear selected file"><X size={17} /></button></div>}<div className="form-actions"><button className="primary-action" onClick={() => requestImport(false)} disabled={!file || loading}><FileText size={17} />{loading ? 'Checking…' : 'Preview Import'}</button><button className="secondary-action" onClick={clear} disabled={loading}>Clear</button></div></section>
    {preview && <section className="admin-panel"><div className="panel-heading"><div><span>Import preview</span><h3>{preview.summary.productsDetected} Products Detected</h3></div></div><div className="import-summary"><div><strong>{preview.summary.categoriesDetected}</strong><span>Categories</span></div><div><strong>{preview.summary.newCategories}</strong><span>New categories</span></div><div><strong>{preview.summary.existingCategories}</strong><span>Existing categories</span></div><div><strong>{preview.summary.existingProducts}</strong><span>Existing products</span></div></div>{hasErrors && <div className="import-errors"><strong>Fix these issues before importing:</strong><ul>{preview.errors.map((error, index) => <li key={`${error.line}-${index}`}>Line {error.line || '—'}{error.product ? ` (${error.product})` : ''}: {error.message}</li>)}</ul></div>}<div className="preview-scroll"><table className="preview-table"><thead><tr><th>Index</th><th>Line</th><th>Category</th><th>Tamil Name</th><th>English Name</th><th>Price</th><th>Unit</th><th>Status</th></tr></thead><tbody>{preview.products.map((product, index) => <tr key={`${product.line}-${index}`}><td>{product.productIndex || '—'}</td><td>{product.line}</td><td>{product.categoryName || '—'}</td><td>{product.nameTamil || '—'}</td><td>{product.nameEnglish || '—'}</td><td>{Number.isFinite(product.price) ? `₹${product.price}` : '—'}</td><td>{product.unit}</td><td><span className={`import-status status-${product.status}`}>{product.status === 'existing' ? 'Existing' : product.status === 'new' ? 'Ready' : 'Invalid'}</span>{product.errors?.map((error) => <small className="preview-error" key={error}>{error}</small>)}</td></tr>)}</tbody></table></div><div className="duplicate-choice"><strong>Existing products</strong><label><input type="radio" checked={duplicateAction === 'skip'} onChange={() => setDuplicateAction('skip')} /> Skip existing products (default)</label><label><input type="radio" checked={duplicateAction === 'update'} onChange={() => setDuplicateAction('update')} /> Update existing product index, price, unit, names, and category</label></div><div className="form-actions"><button className="primary-action" onClick={() => requestImport(true)} disabled={loading || hasErrors || !preview.products.length}><CheckCircle2 size={17} />{loading ? 'Importing…' : 'Confirm Import'}</button><button className="secondary-action" onClick={clear} disabled={loading}>Cancel</button></div></section>}
    <section className="admin-panel import-format"><h3>Supported TXT format</h3><pre>{`CATEGORY: Chicken\n\nPRODUCT:\nTamil Name: கோழி\nEnglish Name: Chicken\nPrice: 250\nUnit: kg\n\nPRODUCT:\nTamil Name: நாட்டுக்கோழி\nEnglish Name: Country Chicken\nPrice: 450\nUnit: kg\n\nCATEGORY: Eggs\nPRODUCT:\nTamil Name: முட்டை\nEnglish Name: Egg\nPrice: 12\nUnit: piece`}</pre></section>
  </section>
}

export default ImportProducts
