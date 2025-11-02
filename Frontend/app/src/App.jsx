import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import EventDetail from './pages/EventDetail'
import CreateEvent from './pages/CreateEvent'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="app-header">
          <h1>Gestor de Eventos</h1>
          <nav>
            <Link to="/">Inicio</Link>
            <Link to="/create" style={{ marginLeft: 12 }}>Crear evento</Link>
            <Link to="/login" style={{ marginLeft: 12 }}>Login</Link>
            <Link to="/register" style={{ marginLeft: 8 }}>Registro</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/create" element={<CreateEvent />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>

        <footer className="app-footer">&copy; {new Date().getFullYear()} Gestor de Eventos</footer>
      </div>
    </BrowserRouter>
  )
}

export default App
