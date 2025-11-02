import axios from 'axios'

const API = axios.create({ baseURL: '/' })

export async function getEvents() {
  const res = await API.get('mock/events.json')
  return res.data
}

export async function getEventById(id) {
  const events = await getEvents()
  return events.find((e) => String(e.id) === String(id))
}
