export type Matrix = number[][]

export function rowCount(m: Matrix): number {
  return m.length
}

export function colCount(m: Matrix): number {
  return m[0]?.length ?? 0
}

export function zeros(rows: number, cols: number): Matrix {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0))
}

export function identity(n: number): Matrix {
  return Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)))
}

export function sum(a: Matrix, b: Matrix): Matrix {
  return a.map((row, i) => row.map((v, j) => v + b[i][j]))
}

export function sub(a: Matrix, b: Matrix): Matrix {
  return a.map((row, i) => row.map((v, j) => v - b[i][j]))
}

export function scalarMul(k: number, a: Matrix): Matrix {
  return a.map((row) => row.map((v) => v * k))
}

export function multiply(a: Matrix, b: Matrix): Matrix {
  const result: Matrix = []
  for (let i = 0; i < a.length; i += 1) {
    const row: number[] = []
    for (let j = 0; j < b[0].length; j += 1) {
      let value = 0
      for (let k = 0; k < b.length; k += 1) {
        value += a[i][k] * b[k][j]
      }
      row.push(value)
    }
    result.push(row)
  }
  return result
}

export function transpose(a: Matrix): Matrix {
  const result: Matrix = []
  for (let j = 0; j < colCount(a); j += 1) {
    const row: number[] = []
    for (let i = 0; i < a.length; i += 1) {
      row.push(a[i][j])
    }
    result.push(row)
  }
  return result
}

export function trace(a: Matrix): number {
  let sum = 0
  for (let i = 0; i < a.length; i += 1) sum += a[i][i]
  return sum
}

export function isOrthogonal(a: Matrix, epsilon = 1e-9): boolean {
  return matricesEqual(multiply(transpose(a), a), identity(rowCount(a)), epsilon)
}

export function det2(a: Matrix): number {
  return a[0][0] * a[1][1] - a[0][1] * a[1][0]
}

export function det3(a: Matrix): number {
  return (
    a[0][0] * (a[1][1] * a[2][2] - a[1][2] * a[2][1]) -
    a[0][1] * (a[1][0] * a[2][2] - a[1][2] * a[2][0]) +
    a[0][2] * (a[1][0] * a[2][1] - a[1][1] * a[2][0])
  )
}

export function inverse2(a: Matrix): Matrix | null {
  const d = det2(a)
  if (d === 0) return null
  return [
    [a[1][1] / d, -a[0][1] / d],
    [-a[1][0] / d, a[0][0] / d],
  ]
}

export function formatMatrix(m: Matrix): string {
  return `[${m.map((row) => row.join(' ')).join('; ')}]`
}

export function matricesEqual(a: Matrix, b: Matrix, epsilon = 1e-9): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i += 1) {
    if (a[i].length !== b[i].length) return false
    for (let j = 0; j < a[i].length; j += 1) {
      if (Math.abs(a[i][j] - b[i][j]) > epsilon) return false
    }
  }
  return true
}
