import { SearchBar } from './SearchBar'

interface HeroProps {
  search: string
  onSearchChange: (value: string) => void
  total: number
  visible: number
  popularSearches: string[]
  onPopular: (term: string) => void
}

export function Hero({
  search,
  onSearchChange,
  total,
  visible,
  popularSearches,
  onPopular,
}: HeroProps) {
  return (
    <section className="hero" aria-label="Buscador de departamentos">
      <div className="hero__stars" aria-hidden="true">
        <span>★</span>
        <span>★</span>
        <span>★</span>
      </div>

      <p className="hero__kicker">API Colombia · https://api-colombia.com/api/v1</p>

      <h1 className="hero__title">
        <span aria-hidden="true">🇨🇴</span> Explora Colombia en tiempo real
      </h1>

      <p className="hero__subtitle">
        Filtra los 32 departamentos por nombre o capital y despliega el detalle completo: datos
        clave, descripción oficial y la lista de sus ciudades y municipios.
      </p>

      <div className="hero__search">
        <SearchBar
          value={search}
          onChange={onSearchChange}
          total={total}
          visible={visible}
        />
      </div>

      <div className="chips" aria-label="Búsquedas populares">
        {popularSearches.map((term) => (
          <button
            key={term}
            type="button"
            className={`chip ${search === term ? 'chip--active' : ''}`}
            onClick={() => onPopular(term)}
          >
            {term}
          </button>
        ))}
      </div>
    </section>
  )
}
