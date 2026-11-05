interface SidebarProps {
  departmentCount: number
  totalMunicipalities: number
  totalPopulation: number
}

export function Sidebar({
  departmentCount,
  totalMunicipalities,
  totalPopulation,
}: SidebarProps) {
  return (
    <aside className="sidebar" aria-label="Información general">
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

      <div className="sidebar__stats" aria-live="polite">
        <p>
          Departamentos: <strong>{departmentCount}</strong>
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

      <div className="sidebar__quick">
        <h3>Cómo usar</h3>
        <p>
          Escribe en el buscador del hero para filtrar en tiempo real. Haz clic en una card para
          abrir el detalle con datos clave y sus ciudades.
        </p>
      </div>
    </aside>
  )
}
