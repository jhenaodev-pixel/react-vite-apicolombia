import { useEffect, useMemo, useRef, useState } from 'react'
import { fetchDepartments, fetchDepartmentCities } from './api'
import { Sidebar } from './components/Sidebar'
import { Hero } from './components/Hero'
import { DepartmentCard } from './components/DepartmentCard'
import type { City, Department } from './types'
import { normalize } from './utils'
import './App.css'

type Status = 'loading' | 'ready' | 'error'

const POPULAR_SEARCHES = [
  'Antioquia',
  'Bogotá',
  'Valle del Cauca',
  'Santander',
  'Chocó',
  'La Guajira',
]

export default function App() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const [search, setSearch] = useState('')
  const [citiesById, setCitiesById] = useState<
    Record<number, { status: 'loading' | 'ready' | 'error'; cities?: City[]; error?: string }>
  >({})

  const citiesAbortRef = useRef<Map<number, AbortController>>(new Map())

  // Carga inicial de departamentos
  useEffect(() => {
    const controller = new AbortController()
    setStatus('loading')
    setErrorMsg(null)

    fetchDepartments(controller.signal)
      .then((data) => {
        setDepartments(data)
        setStatus('ready')
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setErrorMsg(err instanceof Error ? err.message : 'No se pudo cargar la información')
        setStatus('error')
      })

    return () => controller.abort()
  }, [reloadKey])

  // Filtro en tiempo real (nombre + capital, sin tildes)
  const filtered = useMemo(() => {
    const query = normalize(search)
    if (!query) return departments
    return departments.filter((d) => {
      const name = normalize(d.name)
      const capital = normalize(d.cityCapital?.name ?? '')
      return name.includes(query) || capital.includes(query)
    })
  }, [departments, search])

  const totals = useMemo(
    () => ({
      population: departments.reduce((acc, d) => acc + (d.population ?? 0), 0),
      municipalities: departments.reduce((acc, d) => acc + (d.municipalities ?? 0), 0),
    }),
    [departments],
  )

  const loadCities = (departmentId: number) => {
    const current = citiesById[departmentId]
    if (current?.status === 'loading' || current?.status === 'ready') return

    setCitiesById((prev) => ({ ...prev, [departmentId]: { status: 'loading' } }))

    const controller = new AbortController()
    citiesAbortRef.current.set(departmentId, controller)

    fetchDepartmentCities(departmentId, controller.signal)
      .then((cities) => {
        setCitiesById((prev) => ({
          ...prev,
          [departmentId]: { status: 'ready', cities },
        }))
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setCitiesById((prev) => ({
          ...prev,
          [departmentId]: {
            status: 'error',
            error: err instanceof Error ? err.message : 'Error al cargar ciudades',
          },
        }))
      })
      .finally(() => {
        citiesAbortRef.current.delete(departmentId)
      })
  }

  useEffect(
    () => () => {
      citiesAbortRef.current.forEach((c) => c.abort())
      citiesAbortRef.current.clear()
    },
    [],
  )

  const retryDepartments = () => setReloadKey((k) => k + 1)

  return (
    <div className="app">
      <Sidebar
        departments={departments}
        activeName={search || null}
        onSelect={setSearch}
        totalPopulation={totals.population}
        totalMunicipalities={totals.municipalities}
      />

      <div className="main">
        <Hero
          search={search}
          onSearchChange={setSearch}
          total={departments.length}
          visible={filtered.length}
          popularSearches={POPULAR_SEARCHES}
          onPopular={setSearch}
        />

        {status === 'loading' && (
          <div className="state state--loading" role="status" aria-live="polite">
            <span className="spinner spinner--large" aria-hidden="true" />
            <p>Cargando departamentos desde la API Colombia...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="state state--error" role="alert">
            <p className="state__icon" aria-hidden="true">⚠️</p>
            <h2>No pudimos cargar los departamentos</h2>
            <p>{errorMsg}</p>
            <button type="button" className="btn-primary" onClick={retryDepartments}>
              Reintentar
            </button>
            <p className="state__hint">
              Verifica tu conexión a internet y que https://api-colombia.com esté disponible.
            </p>
          </div>
        )}

        {status === 'ready' && (
          <>
            {filtered.length === 0 ? (
              <div className="state state--empty">
                <p className="state__icon" aria-hidden="true">🗺️</p>
                <h2>Sin resultados</h2>
                <p>
                  No encontramos departamentos que coincidan con <strong>“{search}”</strong>.
                </p>
                <button type="button" className="btn-primary" onClick={() => setSearch('')}>
                  Limpiar filtro
                </button>
              </div>
            ) : (
              <div className="grid">
                {filtered.map((dept) => {
                  const entry = citiesById[dept.id]
                  return (
                    <DepartmentCard
                      key={dept.id}
                      department={dept}
                      cities={entry?.cities}
                      isLoadingCities={entry?.status === 'loading'}
                      citiesError={entry?.status === 'error' ? entry.error ?? null : null}
                      onOpenCities={loadCities}
                    />
                  )
                })}
              </div>
            )}

            <p className="foot-note">
              Fuente de datos:{' '}
              <a href="https://api-colombia.com/api/v1" target="_blank" rel="noreferrer">
                api-colombia.com/api/v1
              </a>{' '}
              · Endpoints usados: <code>/Department</code> y <code>/Department/{'{id}'}/Cities</code>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
