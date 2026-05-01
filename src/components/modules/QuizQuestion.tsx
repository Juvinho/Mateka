import { useState } from 'react'

export type QuizOptionLetter = 'A' | 'B' | 'C' | 'D'

export type QuizOption = {
  letter: QuizOptionLetter
  text: string
  isCorrect: boolean
}

export type QuizQuestionData = {
  id: string
  number: number
  difficulty: string
  question: string
  formula: string
  options: QuizOption[]
}

type QuizQuestionProps = QuizQuestionData

const QuizQuestion = ({
  number,
  difficulty,
  question,
  formula,
  options,
}: QuizQuestionProps) => {
  const [selected, setSelected] = useState<QuizOptionLetter | null>(null)
  const answered = selected !== null

  const getOptionClass = (opt: QuizOption): string => {
    const base = 'quiz-option-btn'
    if (!answered) return selected === opt.letter ? `${base} is-selected` : base
    if (opt.letter === selected) {
      return opt.isCorrect ? `${base} is-correct` : `${base} is-wrong`
    }
    if (opt.isCorrect) return `${base} is-correct`
    return base
  }

  return (
    <div className="quiz-question-card" role="group" aria-labelledby={`quiz-q-${number}`}>
      <div className="quiz-question-meta">
        <span className="quiz-question-number" id={`quiz-q-${number}`}>
          Questão {number}
        </span>
        <span className="quiz-question-difficulty">{difficulty}</span>
      </div>

      <p className="quiz-question-text">{question}</p>

      <div className="quiz-formula-display" aria-label="Fórmula da questão">
        {formula}
      </div>

      <div className="quiz-options" role="radiogroup" aria-label="Alternativas">
        {options.map((opt) => (
          <button
            key={opt.letter}
            type="button"
            className={getOptionClass(opt)}
            onClick={() => { if (!answered) setSelected(opt.letter) }}
            aria-pressed={selected === opt.letter}
            disabled={answered && selected !== opt.letter && !opt.isCorrect}
          >
            <span className="quiz-option-letter" aria-hidden="true">{opt.letter}</span>
            <span className="quiz-option-text">{opt.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuizQuestion
