type MatrixDisplayProps = {
  label: string
  matrix: number[][]
}

const MatrixDisplay = ({ label, matrix }: MatrixDisplayProps) => {
  const cols = matrix[0]?.length ?? 0

  return (
    <div className="matrix-display">
      <span className="matrix-display-label">{label} =</span>
      <div
        className="matrix-grid"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(2.2rem, 1fr))` }}
      >
        {matrix.map((row, r) =>
          row.map((value, c) => (
            <span key={`${r}-${c}`} className="matrix-cell">
              {value}
            </span>
          )),
        )}
      </div>
    </div>
  )
}

export default MatrixDisplay
