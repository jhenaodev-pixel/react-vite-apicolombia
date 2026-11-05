interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  total: number
  visible: number
}

export function SearchBar({ value, onChange, total, visible }: SearchBarProps) {
  return (
    <div className="search-bar">
      <input
        type="search"
        className="search-input"
        placeholder="Buscar por nombre o capital... ej: Antioquia, Bogotá"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Buscar departamentos"
        autoComplete="off"
      />
      {value ? (
        <button
          type="button"
          className="search-clear"
          onClick={() => onChange('')}
          aria-label="Limpiar búsqueda"
        >

        </button>
      ) : null}
      <span className="search-count" aria-live="polite">
        {visible} de {total}
      </span>
    </div>
  )
}
