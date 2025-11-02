import React, { useEffect, useState } from 'react'
import { getEvents } from '../services/api'
import Carousel from '../components/Carousel'
import EventCard from '../components/EventCard'

export default function Home() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    let mounted = true
    // load current user from localStorage (set on login)
    try {
      const raw = localStorage.getItem('apiUser')
      if (raw) setCurrentUser(JSON.parse(raw))
    } catch (e) {
      console.warn('Could not parse apiUser from localStorage', e)
    }

    // reflect changes if another tab updates the storage
    const onStorage = (ev) => {
      if (ev.key === 'apiUser') {
        try {
          setCurrentUser(ev.newValue ? JSON.parse(ev.newValue) : null)
        } catch {
          setCurrentUser(null)
        }
      }
    }
    window.addEventListener('storage', onStorage)

    getEvents()
      .then((data) => {
        if (mounted) setEvents(data)
      })
      .catch((err) => {
        console.error('Error loading events:', err)
        if (mounted) setEvents([])
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  if (loading) return <p>Cargando eventos...</p>

  return (
    <div className="page home-page">
      <h2>Eventos disponibles</h2>
      {currentUser ? (
        <p className="logged-user">Sesión iniciada como: <strong>{currentUser.username}</strong> ({currentUser.email})</p>
      ) : (
        <p className="logged-user">No hay sesión iniciada</p>
      )}
      <Carousel>
        {events.map((ev) => (
          <EventCard key={ev.id} event={ev} />
        ))}
      </Carousel>
    </div>
  )
}
