import { useMemo, useRef, useState } from 'react'
import gsap from 'gsap'

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

const LETTER_INDEX: Record<QuizOptionLetter, number> = { A: 0, B: 1, C: 2, D: 3 }

const QuizQuestion = ({
  number,
  difficulty,
  question,
  formula,
  options,
}: QuizQuestionProps) => {
  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const [selected, setSelected] = useState<QuizOptionLetter | null>(null)
  const answered = selected !== null

  const cardRef    = useRef<HTMLDivElement>(null)
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])

  const handleSelect = (opt: QuizOption) => {
    if (answered) return
    setSelected(opt.letter)

    if (reducedMotion) return

    const idx        = LETTER_INDEX[opt.letter]
    const btnEl      = optionRefs.current[idx]
    const correctIdx = options.findIndex((o) => o.isCorrect)
    const correctEl  = optionRefs.current[correctIdx]

    if (opt.isCorrect) {
      gsap.fromTo(
        btnEl,
        { scale: 1 },
        { scale: 1.04, duration: 0.15, ease: 'power2.out', yoyo: true, repeat: 1 },
      )
    } else {
      const tl = gsap.timeline()
      tl.to(cardRef.current, { x: 6,  duration: 0.06, ease: 'none' })
        .to(cardRef.current, { x: -6, duration: 0.06, ease: 'none' })
        .to(cardRef.current, { x: 5,  duration: 0.06, ease: 'none' })
        .to(cardRef.current, { x: -5, duration: 0.06, ease: 'none' })
        .to(cardRef.current, { x: 0,  duration: 0.08, ease: 'power1.out' })

      gsap.fromTo(
        correctEl,
        { scale: 1 },
        { scale: 1.03, duration: 0.2, ease: 'power2.out', delay: 0.35, yoyo: true, repeat: 1 },
      )
    }
  }

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
    <div ref={cardRef} className="quiz-question-card" role="group" aria-labelledby={`quiz-q-${number}`}>
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
        {options.map((opt, i) => (
          <button
            key={opt.letter}
            ref={(el) => { optionRefs.current[i] = el }}
            type="button"
            className={getOptionClass(opt)}
            onClick={() => handleSelect(opt)}
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
