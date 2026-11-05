export interface CityCapital {
  id: number
  name: string
  description?: string | null
  surface?: number | null
  population?: number | null
  postalCode?: string | null
  departmentId?: number | null
}

export interface Department {
  id: number
  name: string
  description: string
  cityCapitalId: number
  municipalities: number
  surface: number
  population: number
  phonePrefix: string
  countryId: number
  cityCapital: CityCapital
  regionId?: number | null
  region?: unknown
}

export interface City {
  id: number
  name: string
  description?: string | null
  surface?: number | null
  population?: number | null
  postalCode?: string | null
  departmentId?: number | null
}
