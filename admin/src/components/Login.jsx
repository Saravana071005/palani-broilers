import { useState } from 'react'
import { Eye, EyeOff, LockKeyhole, LogIn } from 'lucide-react'

function Login({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await onLogin(event.target.email.value, event.target.password.value)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return <main className="login-page"><section className="login-card"><img src="/logo.png" alt="Palani Broilers Logo" className="login-logo" /><span>Secure admin access</span><h1>Palani Broilers</h1><p>Sign in to manage products and contact details.</p><form onSubmit={submit}><label>Email / Login ID<input name="email" type="email" autoComplete="username" required /></label><label>Password<div className="password-field"><input name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>{error && <p className="login-error" role="alert">{error}</p>}<button className="login-submit" disabled={loading}><LogIn size={18} />{loading ? 'Signing in…' : 'Login'}</button></form><div className="login-lock"><LockKeyhole size={14} />Your session is secured by the server.</div></section></main>
}

export default Login
