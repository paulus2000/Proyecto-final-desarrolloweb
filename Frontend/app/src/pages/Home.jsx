import React, { useEffect, useState } from 'react'
import { getEvents } from '../services/api'
import Carousel from '../components/Carousel'
import EventCard from '../components/EventCard'

export default function Home() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    getEvents()
      .then((data) => {
        if (mounted) setEvents(data)
      })
      .catch((err) => console.error(err))
      .finally(() => mounted && setLoading(false))

    return () => (mounted = false)
  }, [])

  if (loading) return <p>Cargando eventos...</p>

  return (
    <div className="page home-page">
      <h2>Eventos disponibles</h2>
      <Carousel>
        {events.map((ev) => (
          <EventCard key={ev.id} event={ev} />
        ))}
      </Carousel>
    </div>
  )
}
