export function normalize(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

const numberFormatter = new Intl.NumberFormat('es-CO')

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return numberFormatter.format(value)
}

export function formatSurface(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return `${numberFormatter.format(value)} km²`
}
