const DAY_NAMES = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM']

type StreakSectionProps = {
  streak: number
  days: boolean[]
  todayIndex?: number
}

const getMotivationalMessage = (streak: number): string => {
  if (streak >= 14) return 'Você está em chamas! 🔥🔥'
  if (streak >= 7)  return 'Meta da semana concluída! 🎉'
  if (streak >= 4)  return 'Quase uma semana! Não pare agora.'
  return 'Bom começo! Continue assim.'
}

const StreakSection = ({ streak, days, todayIndex }: StreakSectionProps) => {
  const message = getMotivationalMessage(streak)
  const normalizedDays = days.slice(0, 7)

  return (
    <div className="streak-section" aria-label="Sequência semanal de estudo">
      <div className="streak-counter">
        <span className="streak-number" aria-label={`${streak} dias seguidos`}>
          🔥 {streak}
        </span>
        <span className="streak-label">Dias Seguidos</span>
      </div>

      <div className="streak-days-row" role="list" aria-label="Dias da semana">
        {DAY_NAMES.map((name, i) => {
          const isDone = normalizedDays[i] === true
          const isToday = i === todayIndex

          const circleClass = [
            'streak-day-circle',
            isDone ? 'is-done' : '',
            isToday ? 'is-today' : '',
            !isDone && !isToday ? 'is-empty' : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <div
              key={name}
              className="streak-day-item"
              role="listitem"
              aria-label={`${name}: ${isDone ? 'concluído' : isToday ? 'hoje' : 'pendente'}`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={circleClass} aria-hidden="true">
                {isDone ? '✓' : isToday ? '🔥' : ''}
              </div>
              <span className="streak-day-name">{name}</span>
            </div>
          )
        })}
      </div>

      <p className="streak-message">{message}</p>
    </div>
  )
}

export default StreakSection
