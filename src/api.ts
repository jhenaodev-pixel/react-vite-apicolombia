import type { City, Department } from './types'

const API_BASE = 'https://api-colombia.com/api/v1'

export async function fetchDepartments(signal?: AbortSignal): Promise<Department[]> {
  const res = await fetch(`${API_BASE}/Department`, { signal })
  if (!res.ok) throw new Error(`Error ${res.status} al cargar departamentos`)
  const data = (await res.json()) as Department[]
  return data.sort((a, b) => a.name.localeCompare(b.name, 'es'))
}

export async function fetchDepartmentCities(
  departmentId: number,
  signal?: AbortSignal,
): Promise<City[]> {
  const res = await fetch(`${API_BASE}/Department/${departmentId}/Cities`, { signal })
  if (!res.ok) throw new Error(`Error ${res.status} al cargar ciudades`)
  const data = (await res.json()) as City[]
  return data.sort((a, b) => a.name.localeCompare(b.name, 'es'))
}
