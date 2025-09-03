import { List } from 'react-window'
import dayjs from 'dayjs'
import './calendar.css'

function generateMonth(date) {
  const start = date.startOf('month')
  const daysInMonth = start.daysInMonth()
  const firstDay = start.day()
  const weeks = []
  let current = 1 - firstDay
  while (current <= daysInMonth) {
    const week = []
    for (let i = 0; i < 7; i++) {
      week.push(start.date(current + i))
    }
    weeks.push(week)
    current += 7
  }
  return weeks
}

function Month({ index, style, onSelect, events }) {
  const base = dayjs().startOf('month')
  const month = base.add(index, 'month')
  const weeks = generateMonth(month)
  const monthKey = month.format('YYYY-MM')

  return (
    <div style={style} className="month">
      <h3 className="month-title">{month.format('MMMM YYYY')}</h3>
      <div className="week-days">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d}>{d}</div>)}
      </div>
      {weeks.map((week, wi) => (
        <div className="week" key={wi}>
          {week.map((day, di) => {
            const dateStr = day.format('YYYY-MM-DD')
            const event = events[dateStr]
            const other = day.format('YYYY-MM') !== monthKey
            return (
              <div
                key={di}
                className={`day${other ? ' other' : ''}`}
                onClick={() => onSelect(day)}
              >
                <span className="date">{day.date()}</span>
                {event && <span className="dot" style={{backgroundColor: event.color}}></span>}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default function Calendar({ onSelect, events, loadMonth }) {
  const total = 2400
  const itemSize = 260
  const middle = Math.floor(total / 2)

  const handleItemsRendered = ({ visibleStartIndex, visibleStopIndex }) => {
    for (let i = visibleStartIndex; i <= visibleStopIndex; i++) {
      const month = dayjs().startOf('month').add(i - middle, 'month')
      loadMonth(month)
    }
  }

  return (
    <List
      className="calendar-list"
      height={600}
      width={'100%'}
      itemCount={total}
      itemSize={itemSize}
      initialScrollOffset={middle * itemSize}
      onItemsRendered={handleItemsRendered}
    >
      {({ index, style }) => (
        <Month
          index={index - middle}
          style={style}
          onSelect={onSelect}
          events={events}
        />
      )}
    </List>
  )
}
