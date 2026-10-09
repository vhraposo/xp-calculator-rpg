const numberFormatter = new Intl.NumberFormat('pt-BR')

export function formatXp(value: number): string {
  return numberFormatter.format(value)
}

export function formatSigned(value: number): string {
  return value > 0 ? `+${numberFormatter.format(value)}` : numberFormatter.format(value)
}

export function formatAcquired(value: number): string {
  return `+${numberFormatter.format(value)}`
}
