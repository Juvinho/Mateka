import { useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import type { MultipleChoiceExercise } from '../../data/exerciseTypes'
import ExerciseContext from './ExerciseContext'
import MatrixGrid from './MatrixGrid'

type Props = {
  exercise: MultipleChoiceExercise
  onSubmit: (answer: { kind: 'multiple-choice'; choiceId: string }) => void
  disabled?: boolean
}

const MultipleChoiceQuestion = ({ exercise, onSubmit, disabled }: Props) => {
  const [selected, setSelected] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)

  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const cardRef = useRef<HTMLDivElement>(null)
  const choiceRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const handleVerify = () => {
    if (!selected || disabled) return
    setAnswered(true)

    if (!reducedMotion) {
      const isCorrect = selected === exercise.correctChoiceId
      const selectedEl = choiceRefs.current[selected]

      if (isCorrect) {
        gsap.fromTo(
          selectedEl,
          { scale: 1 },
          { scale: 1.04, duration: 0.15, ease: 'power2.out', yoyo: true, repeat: 1 },
        )
      } else {
        const tl = gsap.timeline()
        tl.to(cardRef.current, { x: 6, duration: 0.06, ease: 'none' })
          .to(cardRef.current, { x: -6, duration: 0.06, ease: 'none' })
          .to(cardRef.current, { x: 5, duration: 0.06, ease: 'none' })
          .to(cardRef.current, { x: -5, duration: 0.06, ease: 'none' })
          .to(cardRef.current, { x: 0, duration: 0.08, ease: 'power1.out' })

        const correctEl = choiceRefs.current[exercise.correctChoiceId]
        gsap.fromTo(
          correctEl,
          { scale: 1 },
          { scale: 1.03, duration: 0.2, ease: 'power2.out', delay: 0.35, yoyo: true, repeat: 1 },
        )
      }
    }

    onSubmit({ kind: 'multiple-choice', choiceId: selected })
  }

  const getChoiceClass = (choiceId: string): string => {
    const base = 'exercise-choice-btn'
    if (!answered) return selected === choiceId ? `${base} is-selected` : base
    if (choiceId === selected) return choiceId === exercise.correctChoiceId ? `${base} is-correct` : `${base} is-wrong`
    if (choiceId === exercise.correctChoiceId) return `${base} is-correct`
    return base
  }

  return (
    <div ref={cardRef}>
      <ExerciseContext items={exercise.context} />
      <p className="exercise-prompt">{exercise.prompt}</p>
      <div className="exercise-choices">
        {exercise.choices.map((choice) => (
          <button
            key={choice.id}
            ref={(el) => {
              choiceRefs.current[choice.id] = el
            }}
            type="button"
            className={getChoiceClass(choice.id)}
            onClick={() => setSelected(choice.id)}
            disabled={disabled}
          >
            {choice.matrix ? <MatrixGrid values={choice.matrix} readOnly /> : choice.label}
          </button>
        ))}
      </div>
      <button type="button" className="btn-primary" disabled={!selected || disabled} onClick={handleVerify}>
        Verificar
      </button>
    </div>
  )
}

export default MultipleChoiceQuestion
