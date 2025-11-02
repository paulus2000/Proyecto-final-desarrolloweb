import React, { useState } from 'react'
import { createEvent } from '../services/api'
import { useNavigate } from 'react-router-dom'
import './CreateEvent.css'

export default function CreateEvent() {
  const storedUser = localStorage.getItem('apiUser')
  const currentUser = storedUser ? JSON.parse(storedUser) : null
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: 50,
    price: 0.0,
  })
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
    // ensure user is logged in before creating an event
    if (!currentUser) {
      setError({ message: 'Debes iniciar sesión para crear un evento.' })
      setLoading(false)
      return
    }
    try {
      // ensure numeric fields are proper types
      // Convert the datetime-local input (local time without tz) into an
      // ISO timestamp with timezone (UTC) so backend stores a timezone-aware
      // value and clients can display it correctly in their local zone.
      const payload = {
        ...form,
        capacity: Number(form.capacity),
        price: Number(form.price),
        date: form.date ? new Date(form.date).toISOString() : form.date,
      }
      await createEvent(payload)
      navigate('/')
    } catch (err) {
      setError(err.response?.data || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page create-event-page">
      {currentUser ? (
        <div style={{marginBottom:12}}>Sesión iniciada como: <strong>{currentUser.username}</strong></div>
      ) : (
        <div style={{marginBottom:12, color:'salmon'}}>No has iniciado sesión. Inicia sesión para crear eventos.</div>
      )}
      <h2>Crear evento</h2>
      <form onSubmit={onSubmit} className="create-event-form">
        <label>
          Título
          <input name="title" value={form.title} onChange={onChange} required />
        </label>

        <label>
          Descripción
          <textarea name="description" value={form.description} onChange={onChange} />
        </label>

        <label>
          Fecha y hora
          <input name="date" type="datetime-local" value={form.date} onChange={onChange} required />
        </label>

        <label>
          Ubicación
          <input name="location" value={form.location} onChange={onChange} />
        </label>

        <label>
          Capacidad
          <input name="capacity" type="number" value={form.capacity} onChange={onChange} min="1" />
        </label>

        <label>
          Precio
          <input name="price" type="number" step="0.01" value={form.price} onChange={onChange} min="0" />
        </label>

        <div className="form-actions">
          <button type="submit" disabled={loading}>{loading ? 'Creando...' : 'Crear evento'}</button>
        </div>

        {error && <pre className="error">{JSON.stringify(error)}</pre>}
      </form>
    </div>
  )
}
