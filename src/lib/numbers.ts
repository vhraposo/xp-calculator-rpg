export function sanitizeInteger(value: number): number {
  if (!Number.isFinite(value)) {
    return 0
  }
  return Math.trunc(value)
}

export function clampNumber(
  value: number,
  min: number,
  max: number | null,
): number {
  const safeMax = max ?? Number.POSITIVE_INFINITY
  const integer = sanitizeInteger(value)
  return Math.min(Math.max(integer, min), safeMax)
}

export function parseIntegerInput(raw: string): number | null {
  const trimmed = raw.trim()
  if (!/^[+-]?\d+$/.test(trimmed)) {
    return null
  }
  const parsed = Number.parseInt(trimmed, 10)
  return Number.isFinite(parsed) ? parsed : null
}
