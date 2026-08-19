import type { ContextItem } from '../../data/exerciseTypes'
import MatrixGrid from './MatrixGrid'

const ExerciseContext = ({ items }: { items?: ContextItem[] }) => {
  if (!items || items.length === 0) return null

  return (
    <div className="exercise-context-row">
      {items.map((item) => (
        <div key={item.label} className="matrix-display">
          <span className="matrix-display-label">{item.label} =</span>
          <MatrixGrid values={item.matrix} readOnly ariaLabel={`matriz ${item.label}`} />
        </div>
      ))}
    </div>
  )
}

export default ExerciseContext
