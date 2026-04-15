export type FunctionKey = 'x2' | 'x3-3x' | 'sin' | 'exp' | 'ln'

const TAU = Math.PI * 2

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

export const lerp = (start: number, end: number, amount: number): number =>
  start + (end - start) * amount

export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number => {
  if (inMax === inMin) return outMin
  const normalized = (value - inMin) / (inMax - inMin)
  return outMin + normalized * (outMax - outMin)
}

export const degToRad = (degrees: number): number => (degrees * Math.PI) / 180

export const radToDeg = (radians: number): number => (radians * 180) / Math.PI

export const normalizeAngle = (angle: number): number => {
  const wrapped = angle % TAU
  return wrapped < 0 ? wrapped + TAU : wrapped
}

export const formatPiFraction = (radians: number): string => {
  const commonFractions = [
    0,
    1 / 12,
    1 / 8,
    1 / 6,
    1 / 4,
    1 / 3,
    1 / 2,
    2 / 3,
    3 / 4,
    5 / 6,
    1,
    7 / 6,
    5 / 4,
    4 / 3,
    3 / 2,
    5 / 3,
    7 / 4,
    11 / 6,
    2,
  ]

  const normalized = normalizeAngle(radians)
  const ratio = normalized / Math.PI

  let closest = commonFractions[0]
  let bestDistance = Number.POSITIVE_INFINITY

  for (const fraction of commonFractions) {
    const distance = Math.abs(ratio - fraction)
    if (distance < bestDistance) {
      closest = fraction
      bestDistance = distance
    }
  }

  if (bestDistance > 0.04) {
    return `${ratio.toFixed(2)}pi`
  }

  if (closest === 0) return '0'
  if (closest === 1) return 'pi'
  if (closest === 2) return '2pi'

  const numerator = Math.round(closest * 12)
  const denominator = 12
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
  const d = gcd(numerator, denominator)
  const simplifiedNumerator = numerator / d
  const simplifiedDenominator = denominator / d

  if (simplifiedNumerator === 1) {
    return `pi/${simplifiedDenominator}`
  }

  return `${simplifiedNumerator}pi/${simplifiedDenominator}`
}

export const evaluateFunction = (key: FunctionKey, x: number): number => {
  switch (key) {
    case 'x2':
      return x * x
    case 'x3-3x':
      return x * x * x - 3 * x
    case 'sin':
      return Math.sin(x)
    case 'exp':
      return Math.exp(x)
    case 'ln':
      return x <= 0 ? Number.NaN : Math.log(x)
    default:
      return x
  }
}

export const evaluateDerivative = (key: FunctionKey, x: number): number => {
  switch (key) {
    case 'x2':
      return 2 * x
    case 'x3-3x':
      return 3 * x * x - 3
    case 'sin':
      return Math.cos(x)
    case 'exp':
      return Math.exp(x)
    case 'ln':
      return x <= 0 ? Number.NaN : 1 / x
    default:
      return 1
  }
}

export const integrateRiemann = (
  fn: (x: number) => number,
  start: number,
  end: number,
  slices: number,
): number => {
  const dx = (end - start) / slices
  let area = 0

  for (let i = 0; i < slices; i += 1) {
    const x = start + i * dx
    area += fn(x) * dx
  }

  return area
}

export const exactIntegral = (
  key: 'sin' | 'x2',
  start: number,
  end: number,
): number => {
  if (key === 'sin') {
    return -Math.cos(end) + Math.cos(start)
  }

  return (end ** 3 - start ** 3) / 3
}

export const formatSigned = (value: number, digits = 3): string => {
  if (!Number.isFinite(value)) return value > 0 ? '+infinity' : '-infinity'
  const abs = Math.abs(value)
  const fixed = abs.toFixed(digits)
  return value >= 0 ? `+${fixed}` : `-${fixed}`
}

export const round = (value: number, digits = 3): number => {
  const multiplier = 10 ** digits
  return Math.round(value * multiplier) / multiplier
}
