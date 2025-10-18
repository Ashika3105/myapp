import React, { useEffect, useRef, useState } from 'react'
import './App.css'

function rand(min, max) {
  return Math.random() * (max - min) + min
}

function App() {
  const [sparks, setSparks] = useState([])
  const [confetti, setConfetti] = useState([])
  const [cursor, setCursor] = useState({ x: -1000, y: -1000 })
  const containerRef = useRef(null)
  const confettiRef = useRef(null)

  useEffect(() => {
    // initial confetti burst
    const items = Array.from({ length: 28 }).map(() => ({
      id: Math.random().toString(36).slice(2, 9),
      left: rand(0, 100),
      delay: rand(0, 2000),
      dur: rand(2500, 5200),
      size: rand(6, 14),
      color: [`#ff6b6b`, `#ffd166`, `#6bf5c1`, `#8b5cf6`, `#60a5fa`][Math.floor(rand(0,5))]
    }))
    setConfetti(items)
    // periodic subtle confetti regeneration
    const regen = setInterval(() => {
      setConfetti((c) => c.slice(8).concat(items.slice(0, 6).map(it => ({...it, id: Math.random().toString(36).slice(2,9), left: rand(0,100)}))))
    }, 6000)
    return () => clearInterval(regen)
  }, [])

  useEffect(() => {
    return () => {
      setSparks([])
      setConfetti([])
    }
  }, [])

  function addSpark(x, y) {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
    const spark = { id, x, y }
    setSparks((s) => {
      const next = [...s, spark]
      return next.slice(-44)
    })
    setTimeout(() => {
      setSparks((s) => s.filter((p) => p.id !== id))
    }, 900)
  }

  const handleMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const clientX = e.clientX ?? (e.touches && e.touches[0] && e.touches[0].clientX)
    const clientY = e.clientY ?? (e.touches && e.touches[0] && e.touches[0].clientY)
    if (clientX == null || clientY == null) return
    const x = clientX - rect.left
    const y = clientY - rect.top
    setCursor({ x, y })
    addSpark(x, y)
  }

  return (
    <div
      className="playground full"
      ref={containerRef}
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      <div className="overlay-blend" />
      <div className="wave-overlay" />

      <div className="stars" aria-hidden>
        <i className="star s1" />
        <i className="star s2" />
        <i className="star s3" />
        <i className="star s4" />
        <i className="star s5" />
        <i className="star s6" />
        <i className="star s7" />
        <i className="star s8" />
        <i className="star s9" />
        <i className="star s10" />
        <i className="star s11" />
        <i className="star s12" />
      </div>

      <div className="blobs" aria-hidden>
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
        <div className="blob b4" />
        <div className="blob b5" />
        <div className="orbiter or1" />
        <div className="orbiter or2" />
        <div className="orbiter or3" />
      </div>

      <div aria-hidden>
        <div className="trail t1" />
        <div className="trail t2" />
        <div className="trail t3" />
      </div>

      <header className="header">
        <h1 className="title">Creative Playground</h1>
        <p className="subtitle"> animations — move, click, and enjoy the chaos</p>
      </header>

      <div className="confetti" ref={confettiRef} aria-hidden>
        {confetti.map((c) => (
          <i
            key={c.id}
            className="conf"
            style={{
              left: `${c.left}%`,
              width: `${c.size}px`,
              height: `${c.size * 1.4}px`,
              background: c.color,
              animationDelay: `${c.delay}ms`,
              animationDuration: `${c.dur}ms`
            }}
          />
        ))}
      </div>

      {sparks.map((s) => (
        <span
          key={s.id}
          className="spark"
          style={{ left: `${s.x}px`, top: `${s.y}px` }}
        />
      ))}

      <div className="cursor-ring" style={{ left: `${cursor.x}px`, top: `${cursor.y}px` }} />

      <footer className="credits">A tiny demo — built with React + ❤️</footer>
    </div>
  )
}

export default App