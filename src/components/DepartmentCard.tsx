import { useState } from 'react'
import type { Department, City } from '../types'
import { formatNumber, formatSurface } from '../utils'

interface DepartmentCardProps {
  department: Department
  cities: City[] | undefined
  isLoadingCities: boolean
  citiesError: string | null
  onOpenCities: (departmentId: number) => void
}

const PALETTE = [
  'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
  'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
  'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
  'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
]

function gradientFor(department: Department): string {
  let hash = 0
  for (let i = 0; i < department.name.length; i++) {
    hash = (hash * 31 + department.name.charCodeAt(i)) % 997
  }
  return PALETTE[Math.abs(hash) % PALETTE.length]
}

export function DepartmentCard({
  department,
  cities,
  isLoadingCities,
  citiesError,
  onOpenCities,
}: DepartmentCardProps) {
  const [expanded, setExpanded] = useState(false)

  const capital = department.cityCapital?.name ?? '—'
  const density =
    department.surface > 0
      ? Math.round(department.population / department.surface)
      : null

  const toggle = () => {
    const next = !expanded
    setExpanded(next)
    if (next) onOpenCities(department.id)
  }

  return (
    <article className={`dept-card ${expanded ? 'dept-card--expanded' : ''}`}>
      <button
        type="button"
        className="dept-card__header"
        onClick={toggle}
        aria-expanded={expanded}
        aria-label={`${expanded ? 'Contraer' : 'Expandir'} detalle de ${department.name}`}
      >
        <div
          className="dept-card__avatar"
          style={{ background: gradientFor(department) }}
          aria-hidden="true"
        >
          <span>{department.name.charAt(0)}</span>
        </div>

        <div className="dept-card__title-block">
          <h2 className="dept-card__name">{department.name}</h2>
          <p className="dept-card__capital">Capital: {capital}</p>
        </div>

        <div className="dept-card__chevron" aria-hidden="true">
          {expanded ? '▴' : '▾'}
        </div>
      </button>

      <div className="dept-card__stats">
        <div className="stat">
          <span className="stat__label">Población</span>
          <span className="stat__value">{formatNumber(department.population)}</span>
        </div>
        <div className="stat">
          <span className="stat__label">Superficie</span>
          <span className="stat__value">{formatSurface(department.surface)}</span>
        </div>
        <div className="stat">
          <span className="stat__label">Municipios</span>
          <span className="stat__value">{formatNumber(department.municipalities)}</span>
        </div>
        <div className="stat">
          <span className="stat__label">Indicativo</span>
          <span className="stat__value">+57 ({department.phonePrefix})</span>
        </div>
      </div>

      {expanded && (
        <div className="dept-card__detail">
          <h3>Datos clave</h3>
          <dl className="key-data">
            <div>
              <dt>Capital departamental</dt>
              <dd>{capital}</dd>
            </div>
            <div>
              <dt>Población de la capital</dt>
              <dd>
                {formatNumber(department.cityCapital?.population ?? null)} hab.
              </dd>
            </div>
            <div>
              <dt>Densidad aprox.</dt>
              <dd>{density !== null ? `${density} hab/km²` : '—'}</dd>
            </div>
            <div>
              <dt>Código postal capital</dt>
              <dd>{department.cityCapital?.postalCode ?? '—'}</dd>
            </div>
          </dl>

          <p className="dept-card__description">{department.description}</p>

          {department.cityCapital?.description ? (
            <div className="capital-desc">
              <h4>Sobre {capital}</h4>
              <p>{department.cityCapital.description}</p>
            </div>
          ) : null}

          <h3 className="cities-title">
            Ciudades y municipios{' '}
            <span className="cities-count">
              {cities ? `(${cities.length})` : ''}
            </span>
          </h3>

          {isLoadingCities ? (
            <p className="cities-status cities-status--loading" role="status">
              <span className="spinner" aria-hidden="true" />
              Cargando ciudades...
            </p>
          ) : citiesError ? (
            <div className="cities-error" role="alert">
              <p>{citiesError}</p>
              <button
                type="button"
                className="btn-retry"
                onClick={() => onOpenCities(department.id)}
              >
                Reintentar
              </button>
            </div>
          ) : cities && cities.length > 0 ? (
            <ul className="cities-list">
              {cities.map((city) => (
                <li key={city.id} className="city-item">
                  <div className="city-item__head">
                    <span className="city-item__name">{city.name}</span>
                    {city.population != null ? (
                      <span className="city-item__pop">
                        {formatNumber(city.population)} hab.
                      </span>
                    ) : null}
                  </div>
                  {city.description ? (
                    <p className="city-item__desc">{city.description}</p>
                  ) : null}
                  <div className="city-item__meta">
                    {city.surface != null ? (
                      <span>{formatSurface(city.surface)}</span>
                    ) : null}
                    {city.postalCode ? <span>CP {city.postalCode}</span> : null}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="cities-status">Sin ciudades registradas para este departamento.</p>
          )}
        </div>
      )}
    </article>
  )
}
