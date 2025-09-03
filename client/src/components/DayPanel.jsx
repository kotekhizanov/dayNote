import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import './panel.css'

export default function DayPanel({ date, event, onClose, onSave }) {
  const [text, setText] = useState(event?.text || '')
  const [icon, setIcon] = useState(event?.icon || '')
  const [color, setColor] = useState(event?.color || '#ffffff')

  useEffect(() => {
    setText(event?.text || '')
    setIcon(event?.icon || '')
    setColor(event?.color || '#ffffff')
  }, [event])

  if (!date) return null

  const handleSave = () => {
    onSave({ text, icon, color })
  }

  return (
    <div className="panel">
      <button className="close" onClick={onClose}>×</button>
      <h2>{dayjs(date).format('MMMM D, YYYY')}</h2>
      <input
        value={icon}
        onChange={e => setIcon(e.target.value)}
        placeholder="Icon (emoji)"
      />
      <input
        type="color"
        value={color}
        onChange={e => setColor(e.target.value)}
      />
      <textarea
        rows="5"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="What happened?"
      />
      <button onClick={handleSave}>Save</button>
    </div>
  )
}
