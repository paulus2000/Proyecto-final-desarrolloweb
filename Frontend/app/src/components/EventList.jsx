import React from 'react'
import EventCard from './EventCard'

export default function EventList({ events }) {
  if (!events || events.length === 0) return <p>No hay eventos disponibles.</p>

  return (
    <section className="event-list">
      {events.map((ev) => (
        <EventCard key={ev.id} event={ev} />
      ))}
    </section>
  )
}
