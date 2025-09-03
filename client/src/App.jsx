import { useRef, useState } from 'react'
import Calendar from './components/Calendar'
import DayPanel from './components/DayPanel'
import './App.css'

function App() {
  const [events, setEvents] = useState({})
  const [selected, setSelected] = useState(null)
  const loaded = useRef(new Set())

  const loadMonth = async (month) => {
    const key = month.format('YYYY-MM')
    if (loaded.current.has(key)) return
    const res = await fetch(`/api/events?month=${key}`)
    if (res.ok) {
      const data = await res.json()
      setEvents((prev) => ({ ...prev, ...data }))
    }
    loaded.current.add(key)
  }

  const handleSelect = async (date) => {
    const key = date.format('YYYY-MM-DD')
    if (!events[key]) {
      const res = await fetch(`/api/events/${key}`)
      if (res.ok) {
        const data = await res.json()
        setEvents((prev) => ({ ...prev, [key]: data }))
      }
    }
    setSelected(date)
  }

  const handleSave = async (data) => {
    const key = selected.format('YYYY-MM-DD')
    await fetch(`/api/events/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setEvents((prev) => ({ ...prev, [key]: data }))
    setSelected(null)
  }

  return (
    <div className="app">
      <Calendar onSelect={handleSelect} events={events} loadMonth={loadMonth} />
      <DayPanel
        date={selected}
        event={selected ? events[selected.format('YYYY-MM-DD')] : null}
        onClose={() => setSelected(null)}
        onSave={handleSave}
      />
    </div>
  )
}

export default App
