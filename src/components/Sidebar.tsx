import type { Department } from '../types'

interface SidebarProps {
  departments: Department[]
  activeName: string | null
  onSelect: (name: string) => void
  totalPopulation: number
  totalMunicipalities: number
}

export function Sidebar({
  departments,
  activeName,
  onSelect,
  totalPopulation,
  totalMunicipalities,
}: SidebarProps) {
  return (
    <aside className="sidebar" aria-label="Navegación lateral">
      <div className="sidebar__brand">
        <div className="sidebar__flag" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div>
          <p className="sidebar__name">Explora Colombia</p>
          <p className="sidebar__tag">Tablero interactivo</p>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Departamentos favoritos">
        <h3>Acceso rápido</h3>
        <ul className="sidebar__list">
          {departments.slice(0, 8).map((dept) => (
            <li key={dept.id}>
              <button
                type="button"
                className={`sidebar__item ${activeName === dept.name ? 'sidebar__item--active' : ''}`}
                onClick={() => onSelect(dept.name)}
              >
                <span>{dept.name}</span>
                <span className="sidebar__item-cap">{dept.cityCapital?.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar__quick">
        <h3>Cómo usar</h3>
        <p>
          Escribe en el buscador del hero para filtrar en tiempo real. Haz clic en una card para
          abrir el detalle con datos clave y sus ciudades.
        </p>
      </div>

      <div className="sidebar__stats" aria-live="polite">
        <p>Paleta: fondo pastel + amarillo, azul y rojo</p>
        <p>
          Departamentos: <strong>{departments.length}</strong>
        </p>
        <p>
          Municipios: <strong>{totalMunicipalities.toLocaleString('es-CO')}</strong>
        </p>
        <p>
          Población: <strong>{totalPopulation.toLocaleString('es-CO')}</strong>
        </p>
        <p>
          Fuente: <strong>API Colombia v1</strong>
        </p>
      </div>
    </aside>
  )
}
