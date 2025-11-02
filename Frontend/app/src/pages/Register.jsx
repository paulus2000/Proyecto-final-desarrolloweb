import React, { useState } from 'react'
import { registerUser } from '../services/api'
import { useNavigate } from 'react-router-dom'
import './Auth.css'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
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
    // basic client-side checks to give faster, clearer feedback
    if (!form.password || form.password.length < 8) {
      setError({ message: 'La contraseña debe tener al menos 8 caracteres.' })
      setLoading(false)
      return
    }
    if (/^\d+$/.test(form.password)) {
      setError({ message: 'La contraseña no puede ser solo números.' })
      setLoading(false)
      return
    }

    try {
      await registerUser(form)
      navigate('/')
    } catch (err) {
      // Normalize different error shapes into a friendly message.
      const resp = err.response
      if (!resp) {
        setError({ message: err.message || 'Error de red' })
      } else if (typeof resp.data === 'string' && resp.data.trim().startsWith('<')) {
        // Backend returned an HTML error page (Django debug or similar).
        setError({ message: `Respuesta inesperada del servidor (${resp.status} ${resp.statusText}). Revisa la consola y la pestaña Network.` })
        console.error('Server HTML response for /api/auth/register/:', resp.data)
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
          <h2>Registro</h2>
          <form onSubmit={onSubmit}>
        <label>Usuario
          <input name="username" value={form.username} onChange={onChange} required />
        </label>
        <label>Email
          <input name="email" type="email" value={form.email} onChange={onChange} required />
        </label>
        <label>Contraseña
          <input name="password" type="password" value={form.password} onChange={onChange} required />
        </label>
        <div style={{marginTop:12}}>
          <button className="btn btn-primary" disabled={loading}>{loading ? 'Creando...' : 'Crear cuenta'}</button>
        </div>
          {error && <div className="auth-error">{error.message ? error.message : JSON.stringify(error)}</div>}
          </form>
        </div>
      </div>
  )
}
