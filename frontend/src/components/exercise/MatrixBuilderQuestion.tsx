import { useState } from 'react'
import type { MatrixBuilderExercise } from '../../data/exerciseTypes'
import { colCount, rowCount } from '../../lib/matrixMath'
import ExerciseContext from './ExerciseContext'
import MatrixGrid from './MatrixGrid'

type Props = {
  exercise: MatrixBuilderExercise
  onSubmit: (answer: { kind: 'matrix-builder'; matrix: number[][] }) => void
  disabled?: boolean
  requireDimensionPick?: boolean
}

const buildBlankGrid = (rows: number, cols: number): Array<Array<number | null>> =>
  Array.from({ length: rows }, () => Array.from({ length: cols }, () => null))

const MatrixBuilderQuestion = ({ exercise, onSubmit, disabled, requireDimensionPick }: Props) => {
  const defaultRows = rowCount(exercise.operandA)
  const defaultCols = colCount(exercise.operandB)

  const [dimsConfirmed, setDimsConfirmed] = useState(!requireDimensionPick)
  const [rowsInput, setRowsInput] = useState('')
  const [colsInput, setColsInput] = useState('')
  const [values, setValues] = useState<Array<Array<number | null>>>(() =>
    requireDimensionPick ? [] : buildBlankGrid(defaultRows, defaultCols),
  )
  const [focusedCell, setFocusedCell] = useState<{ r: number; c: number } | null>(null)

  const operands = (
    <>
      <div className="matrix-display">
        <span className="matrix-display-label">{exercise.operandALabel ?? 'A'} =</span>
        <MatrixGrid values={exercise.operandA} readOnly highlightRow={focusedCell?.r ?? null} />
      </div>
      <span className="exercise-operator">{exercise.operatorLabel}</span>
      <div className="matrix-display">
        <span className="matrix-display-label">{exercise.operandBLabel ?? 'B'} =</span>
        <MatrixGrid values={exercise.operandB} readOnly highlightCol={focusedCell?.c ?? null} />
      </div>
    </>
  )

  if (requireDimensionPick && !dimsConfirmed) {
    const rowsNum = Number(rowsInput)
    const colsNum = Number(colsInput)
    const canConfirm = rowsInput !== '' && colsInput !== '' && rowsNum > 0 && colsNum > 0

    return (
      <div>
        <ExerciseContext items={exercise.context} />
        <p className="exercise-prompt">{exercise.prompt}</p>
        <div className="exercise-builder-row">{operands}</div>
        <p className="exercise-hint">Antes de preencher, qual é o tamanho (linhas × colunas) da matriz resultado?</p>
        <div className="dimension-picker">
          <label>
            Linhas
            <input type="number" min={1} inputMode="numeric" value={rowsInput} onChange={(e) => setRowsInput(e.target.value)} />
          </label>
          <span className="exercise-operator">×</span>
          <label>
            Colunas
            <input type="number" min={1} inputMode="numeric" value={colsInput} onChange={(e) => setColsInput(e.target.value)} />
          </label>
          <button
            type="button"
            className="btn-primary"
            disabled={!canConfirm}
            onClick={() => {
              setValues(buildBlankGrid(rowsNum, colsNum))
              setDimsConfirmed(true)
            }}
          >
            Confirmar tamanho
          </button>
        </div>
      </div>
    )
  }

  const isComplete = values.every((row) => row.every((v) => v !== null))

  return (
    <div>
      <ExerciseContext items={exercise.context} />
      <p className="exercise-prompt">{exercise.prompt}</p>
      <div className="exercise-builder-row">
        {operands}
        <span className="exercise-operator">=</span>
        <MatrixGrid
          values={values}
          editableMask={values.map((row) => row.map(() => true))}
          disabled={disabled}
          onFocusCell={(r, c) => setFocusedCell({ r, c })}
          onChange={(r, c, v) => {
            setValues((prev) => {
              const next = prev.map((row) => row.slice())
              next[r][c] = v
              return next
            })
          }}
        />
      </div>
      <p className="exercise-hint">Toque em uma célula do resultado para destacar a linha e a coluna usadas.</p>
      <button
        type="button"
        className="btn-primary"
        disabled={!isComplete || disabled}
        onClick={() => onSubmit({ kind: 'matrix-builder', matrix: values as number[][] })}
      >
        Verificar
      </button>
    </div>
  )
}

export default MatrixBuilderQuestion
