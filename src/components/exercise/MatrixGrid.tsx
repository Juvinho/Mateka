type MatrixGridProps = {
  values: Array<Array<number | null>>
  editableMask?: boolean[][]
  onChange?: (row: number, col: number, value: number | null) => void
  onFocusCell?: (row: number, col: number) => void
  highlightRow?: number | null
  highlightCol?: number | null
  readOnly?: boolean
  disabled?: boolean
  ariaLabel?: string
}

const MatrixGrid = ({
  values,
  editableMask,
  onChange,
  onFocusCell,
  highlightRow = null,
  highlightCol = null,
  readOnly = false,
  disabled = false,
  ariaLabel,
}: MatrixGridProps) => {
  const cols = values[0]?.length ?? 0

  return (
    <div
      className="matrix-grid exercise-matrix"
      role="group"
      aria-label={ariaLabel}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(2.6rem, 1fr))` }}
    >
      {values.map((row, r) =>
        row.map((value, c) => {
          const isEditable = !readOnly && (editableMask ? editableMask[r][c] : value === null)
          const isHighlighted = highlightRow === r || highlightCol === c
          const className = [
            'matrix-cell',
            isEditable ? 'exercise-matrix-input' : '',
            isHighlighted ? 'exercise-matrix-highlight' : '',
          ]
            .filter(Boolean)
            .join(' ')

          if (isEditable) {
            return (
              <input
                key={`${r}-${c}`}
                className={className}
                type="number"
                inputMode="decimal"
                value={value ?? ''}
                disabled={disabled}
                onFocus={() => onFocusCell?.(r, c)}
                onChange={(e) => {
                  const raw = e.target.value
                  onChange?.(r, c, raw === '' ? null : Number(raw))
                }}
                aria-label={`linha ${r + 1}, coluna ${c + 1}`}
              />
            )
          }

          return (
            <span key={`${r}-${c}`} className={className}>
              {value ?? ''}
            </span>
          )
        }),
      )}
    </div>
  )
}

export default MatrixGrid
