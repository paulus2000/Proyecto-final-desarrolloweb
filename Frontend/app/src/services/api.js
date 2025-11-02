import axios from 'axios'

const MOCK = axios.create({ baseURL: '/' })
export const API = axios.create({ baseURL: 'http://127.0.0.1:8000/api/' })

export async function getEvents() {
  // Try the backend API first, fall back to the local mock JSON if the backend is unreachable.
  try {
    const res = await API.get('events/')
    return res.data
  } catch (err) {
    console.warn('Backend events API not available, falling back to mock:', err.message)
    const res = await MOCK.get('mock/events.json')
    return res.data
  }
}

export async function getEventById(id) {
  const events = await getEvents()
  return events.find((e) => String(e.id) === String(id))
}

export async function createEvent(payload) {
  // payload should match serializer fields: title, description, date, location, capacity, price
  const res = await API.post('events/', payload)
  return res.data
}

export async function login(username, password) {
  // send as form-encoded to be compatible with the token endpoint parsers
  const params = new URLSearchParams()
  params.append('username', username)
  params.append('password', password)
  const res = await axios.post('http://127.0.0.1:8000/api/auth/login/', params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  const token = res.data?.token
  if (token) {
    API.defaults.headers.common['Authorization'] = `Token ${token}`
    localStorage.setItem('apiToken', token)
  }
  // fetch current user info and persist it
  try {
    const userRes = await API.get('auth/user/')
    const user = userRes.data
    localStorage.setItem('apiUser', JSON.stringify(user))
    return { token, user }
  } catch {
    // If fetching user fails, still return token info
    return { token }
  }
}

export async function registerUser({ username, email, password }) {
  // registration endpoint accepts JSON or form data; use form-encoded to avoid JSON parsing issues in some environments
  const params = new URLSearchParams()
  if (username) params.append('username', username)
  if (email) params.append('email', email)
  if (password) params.append('password', password)
  const res = await axios.post('http://127.0.0.1:8000/api/auth/register/', params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  const token = res.data?.token
  const user = res.data?.user
  if (token) {
    API.defaults.headers.common['Authorization'] = `Token ${token}`
    localStorage.setItem('apiToken', token)
  }
  if (user) {
    localStorage.setItem('apiUser', JSON.stringify(user))
  }
  return res.data
}

export function loadTokenFromStorage() {
  const token = localStorage.getItem('apiToken')
  if (token) API.defaults.headers.common['Authorization'] = `Token ${token}`
  const user = localStorage.getItem('apiUser')
  if (user) {
    try {
      API.defaults.currentUser = JSON.parse(user)
    } catch {
      /* ignore parse error */
    }
  }
}
