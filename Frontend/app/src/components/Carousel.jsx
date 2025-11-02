import React, { useRef, useState, useEffect } from 'react'
import './Carousel.css'

export default function Carousel({ children, autoplay = true, interval = 3500 }) {
  const ref = useRef(null)
  const [index, setIndex] = useState(0)
  const indexRef = React.useRef(0)
  const [paused, setPaused] = useState(false)

  const childCount = React.Children.count(children)

  const scrollToIndex = (i) => {
    const el = ref.current
    if (!el) return
    const gap = 16
    const cardWidth = el.firstElementChild?.clientWidth || el.clientWidth
    const left = i * (cardWidth + gap)
    el.scrollTo({ left, behavior: 'smooth' })
    indexRef.current = i
    setIndex(i)
  }

  const next = () => {
    if (childCount === 0) return
    const nextIdx = (index + 1) % childCount
    scrollToIndex(nextIdx)
  }

  const prev = () => {
    if (childCount === 0) return
    const prevIdx = (index - 1 + childCount) % childCount
    scrollToIndex(prevIdx)
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      const childrenEls = Array.from(el.children)
      const visibleCenter = el.scrollLeft + el.clientWidth / 2
      const closest = childrenEls
        .map((c, i) => ({ i, center: c.offsetLeft + c.clientWidth / 2 }))
        .reduce((best, cur) => Math.abs(cur.center - visibleCenter) < Math.abs(best.center - visibleCenter) ? cur : best)
      indexRef.current = closest.i
      setIndex(closest.i)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [children])

  useEffect(() => {
    if (!autoplay || paused) return undefined
    const id = setInterval(() => {
      const el = ref.current
      if (!el) return
      const gap = 16
      const cardWidth = el.firstElementChild?.clientWidth || el.clientWidth
      const nextIdx = (indexRef.current + 1) % Math.max(1, childCount)
      const left = nextIdx * (cardWidth + gap)
      el.scrollTo({ left, behavior: 'smooth' })
      indexRef.current = nextIdx
      setIndex(nextIdx)
    }, interval)
    return () => clearInterval(id)
  }, [autoplay, paused, interval, childCount])

  return (
    <div className="carousel-wrapper" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="carousel" ref={ref} tabIndex={0}>
        {React.Children.map(children, (child, i) => (
          <div className={`carousel-item ${i === index ? 'active' : ''}`} key={i}>
            {child}
          </div>
        ))}
      </div>

      <div className="carousel-controls">
        <div className="nav-buttons">
          <button className="carousel-btn" onClick={prev} aria-label="Anterior">
            <svg className="icon icon-left" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="btn-text">Anterior</span>
          </button>

          <button className="carousel-btn" onClick={next} aria-label="Siguiente">
            <span className="btn-text">Siguiente</span>
            <svg className="icon icon-right" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="carousel-dots">
          {Array.from({ length: childCount }).map((_, i) => (
            <button key={i} className={`dot ${i === index ? 'active' : ''}`} onClick={() => scrollToIndex(i)} aria-label={`Ir a slide ${i + 1}`}></button>
          ))}
        </div>
      </div>
    </div>
  )
}
