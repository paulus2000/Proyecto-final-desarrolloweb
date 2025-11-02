import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getEventById } from '../services/api'

export default function EventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    getEventById(id)
      .then((e) => mounted && setEvent(e))
      .catch((err) => console.error(err))
      .finally(() => mounted && setLoading(false))
    return () => (mounted = false)
  }, [id])

  if (loading) return <p>Cargando evento...</p>
  if (!event) return <p>Evento no encontrado.</p>

  return (
    <div className="page event-detail">
      <Link to="/">← Volver</Link>
      <h2>{event.title}</h2>
      <img src={event.image} alt={event.title} style={{ maxWidth: 400 }} />
      <p>{event.description}</p>
      <p>
        <strong>Fecha:</strong> {new Date(event.date).toLocaleString()}
      </p>
      <p>
        <strong>Ubicación:</strong> {event.location}
      </p>
      <p>
        <strong>Entradas:</strong> {event.capacity}
      </p>
      <p>
        <strong>Precio:</strong> {event.price === 0 ? 'Gratis' : `$${event.price}`}
      </p>
    </div>
  )
}
