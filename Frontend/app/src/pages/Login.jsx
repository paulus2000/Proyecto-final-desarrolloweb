import React, { useState } from 'react'
import { login } from '../services/api'
import { useNavigate } from 'react-router-dom'
import './Auth.css'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  function onChange(e) {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login(form.username, form.password)
      navigate('/')
    } catch (err) {
      const resp = err.response
      if (!resp) {
        setError({ message: err.message || 'Error de red' })
      } else if (typeof resp.data === 'string' && resp.data.trim().startsWith('<')) {
        setError({ message: `Respuesta inesperada del servidor (${resp.status} ${resp.statusText}). Revisa la consola y la pestaña Network.` })
        console.error('Server HTML response for /api/auth/login/:', resp.data)
      } else if (resp.data && resp.data.detail) {
        setError({ message: resp.data.detail })
      } else {
        setError({ message: JSON.stringify(resp.data) })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Login</h2>
        <form onSubmit={onSubmit}>
          <label>Usuario</label>
          <input name="username" value={form.username} onChange={onChange} required placeholder="usuario" />

          <label>Contraseña</label>
          <input name="password" type="password" value={form.password} onChange={onChange} required placeholder="Contraseña" />

          <div className="auth-actions">
            <button className="btn btn-primary" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
          </div>
          {error && <div className="auth-error">{error.message ? error.message : JSON.stringify(error)}</div>}
        </form>
      </div>
    </div>
  )
}
