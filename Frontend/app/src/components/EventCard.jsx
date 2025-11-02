import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import './EventCard.css'

export default function EventCard({ event }) {
  const [registered, setRegistered] = useState(false)

  const handleRegister = async () => {
    const result = await Swal.fire({
      title: 'Confirmar registro',
      text: `¿Deseas registrarte en "${event.title}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, registrar',
    })

    if (result.isConfirmed) {
      setRegistered(true)
      Swal.fire('Listo', 'Te has registrado correctamente.', 'success')
    }
  }

  const handleCancel = async () => {
    const result = await Swal.fire({
      title: 'Cancelar registro',
      text: `¿Deseas cancelar tu registro en "${event.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
    })

    if (result.isConfirmed) {
      setRegistered(false)
      Swal.fire('Cancelado', 'Tu registro ha sido cancelado.', 'info')
    }
  }

  return (
    <article className="event-card">
      <img
        src={event.image || `https://picsum.photos/seed/${event.id}/600/400`}
        alt={event.title}
        className="event-image"
        onError={(e) => {
          e.currentTarget.onerror = null
          e.currentTarget.src = `https://picsum.photos/seed/${event.id}/600/400`
        }}
      />
      <div className="event-body">
        <h3 className="event-title"><Link to={`/events/${event.id}`}>{event.title}</Link></h3>
        <p className="event-desc">{event.description}</p>
        <div className="meta-row">
          <p className="event-meta">{new Date(event.date).toLocaleString()} — {event.location}</p>
          <div>
            <span className="badge">Entradas: {event.capacity}</span>
            <span style={{marginLeft:8}} className="badge">{event.price === 0 ? 'Gratis' : `$${event.price}`}</span>
          </div>
        </div>
        <div className="event-actions">
          {!registered ? (
            <button onClick={handleRegister} className="btn btn-primary">Registrar</button>
          ) : (
            <button onClick={handleCancel} className="btn btn-ghost">Cancelar registro</button>
          )}
        </div>
      </div>
    </article>
  )
}
