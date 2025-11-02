import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import EventDetail from './pages/EventDetail'

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="app-header">
          <h1>Gestor de Eventos</h1>
          <nav>
            <Link to="/">Inicio</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events/:id" element={<EventDetail />} />
          </Routes>
        </main>

        <footer className="app-footer">&copy; {new Date().getFullYear()} Gestor de Eventos</footer>
      </div>
    </BrowserRouter>
  )
}

export default App
