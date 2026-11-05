# 🇨🇴 Explora Colombia

Tablero interactivo de una sola vista construido con **React + TypeScript + Vite** que consume la API pública [API Colombia](https://api-colombia.com/api/v1). El usuario puede **filtrar departamentos en tiempo real** y **desplegar el detalle completo** (datos clave, descripción y ciudades/municipios) dentro de una **Card expandible** de cada departamento.

## Stack

- React 19 + TypeScript
- Vite 8
- Fetch nativo (sin librerías externas de red)
- CSS propio con variables (fondo pastel + secundarios amarillo, azul y rojo)

## Instalación y ejecución local

### Requisitos previos

- Node.js LTS (v20 o superior recomendado)
- npm

Verifica tus versiones:

```powershell
node -v
npm -v
```

### 1. Clonar / ubicarse en la carpeta

```powershell
cd C:\Users\ALEX\Documents\react-vite-apicolombia
```

Si estás clonando desde un repositorio:

```bash
git clone <url-del-repositorio>
cd react-vite-apicolombia
```

### 2. Instalar dependencias

```powershell
npm install
```

### 3. Levantar el servidor de desarrollo

```powershell
npm run dev
```

Abre en tu navegador **http://localhost:5173**

> El script `"dev": "vite"` ya está definido en `package.json` (líneas 6-12).

### 4. Comandos adicionales disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor local Vite con HMR en `http://localhost:5173` |
| `npm run lint` | Verifica el código con ESLint |
| `npm run preview` | Previsualiza la build de producción en local |
| `npm run build` | Compila para producción (TypeScript + Vite → carpeta `dist/`) |

## Decisiones técnicas tomadas para la interacción de la vista única

### 1. Estructura de la vista única

Se implementó una sola página sin router, dividida en tres zonas:

- **Sidebar** (`src/components/Sidebar.tsx`): navegación lateral con acceso rápido a los primeros 8 departamentos, guía de uso y estadísticas globales (total de departamentos, municipios y población). En móvil se convierte en bloque superior.
- **Hero con SearchBar** (`src/components/Hero.tsx` + `src/components/SearchBar.tsx`): contiene el buscador principal, un contador de resultados visibles y etiquetas de búsqueda popular (chips) que actúan como atajos.
- **Grid de DepartmentCard** (`src/components/DepartmentCard.tsx`): tarjetas expandibles en un grid responsive. Cada card muestra en estado cerrado el capital, población, superficie, municipios e indicativo; al expandir se despliega el detalle completo.

### 2. Uso adecuado de Hooks (`useState`, `useEffect`, `useMemo`, `useRef`)

- **`useState`**: estado local para `departments`, `status` (`loading | ready | error`), `search`, `citiesById`, `errorMsg` y `reloadKey`. Cada card gestiona su propio `expanded` con `useState` para una interacción independiente.
- **`useEffect`**: carga inicial de departamentos con cleanup mediante `AbortController`. Un segundo efecto limpia todos los controllers de ciudades al desmontar el componente.
  - Carga inicial: `useEffect(..., [reloadKey])` — permite re-consultar la API al pulsar “Reintentar”.
  - Cleanup de ciudades: `useEffect(() => () => { ... abort() ... }, [])`.
- **`useMemo`**: filtrado reactivo (`filtered`) y cálculo de totales (población y municipios). Evita recalcular en cada render si `departments` o `search` no cambiaron.
- **`useRef<Map<number, AbortController>>`**: un controller por departamento para cargar ciudades. Así, expandir dos cards a la vez no cancela una a la otra, ni deja una card en estado de carga eterno.

### 3. Consumo de API y asincronía

Capa de acceso a datos dedicada en `src/api.ts`:

- `fetchDepartments(signal?)` → `GET https://api-colombia.com/api/v1/Department`
- `fetchDepartmentCities(departmentId, signal?)` → `GET /Department/{id}/Cities`

Ambas funciones son `async/await`, verifican `res.ok` y lanzan un error legible si el HTTP falla. La UI maneja tres estados:

- **Loading**: spinner en la vista principal al cargar departamentos y spinner dentro de la card al cargar ciudades.
- **Error**: pantalla de error con botón “Reintentar” para departamentos; mensaje + botón “Reintentar” dentro de la card para ciudades.
- **Empty**: “Sin resultados” con botón “Limpiar filtro” cuando el filtro no coincide con ningún departamento.

La carga de ciudades es **perezosa (lazy)**: solo se solicita al expandir una card por primera vez y se cachea en `citiesById`, de modo que cerrar y reabrir no vuelve a pedir el recurso.

### 4. Interacción UI: filtro en tiempo real y Card expandible

- **Filtro reactivo**: `SearchBar` es controlada (`value` + `onChange`). Cada tecla actualiza `search` en `App`, y `useMemo` recalcula `filtered` sin recargar la API. La comparación ignora mayúsculas, minúsculas y tildes mediante la utilidad `normalize` (`src/utils.ts`), así “bogota” encuentra “Bogotá”.
- **Card expandible vs. Modal**: se eligió Card expandible en sitio (no Modal) porque:
  - Mantiene el contexto visual del grid y el scroll de lectura.
  - Permite comparar varios departamentos expandidos a la vez.
  - Evita gestión de focus trap, cierre con `Esc` y overlay en móvil.
  - Cada card es independiente: abrir/cerrar no afecta a las demás.
- **Accesibilidad**: el botón de la card expone `aria-expanded` y `aria-label` dinámicos; los estados de carga y error usan `role="status"` / `role="alert"` y `aria-live="polite"` en el contador de resultados.

### 5. Tipado y modularidad

- `src/types.ts`: interfaces `Department`, `City` y `CityCapital` que describen la forma de la respuesta de la API.
- `src/utils.ts`: `normalize`, `formatNumber` (`Intl.NumberFormat('es-CO')`) y `formatSurface`.
- `src/api.ts`: solo red (sin lógica de UI).
- `src/components/*`: `SearchBar`, `Hero`, `Sidebar`, `DepartmentCard` — cada uno con una responsabilidad única y props explícitas.
- `src/App.tsx`: orquestación (estado global, efectos, filtrado) y composición de la vista.

### 6. Paleta visual

- Fondo **pastel** (`#fff7e0` / `#fef3d6`) con degradados suaves.
- Secundarios inspirados en la bandera de Colombia: **amarillo** (principal), **azul** (links y foco) y **rojo** (errores y detalles).
- Definida con variables CSS en `src/index.css` para facilidad de ajuste.

## Capturas

> Deja tus capturas en una carpeta `docs/` dentro del proyecto, por ejemplo `docs/captura-hero.png`, y enlázalas aquí. Mientras tanto se muestran los estados clave que debe evidenciar cada captura.

### 1. Vista general: sidebar + hero con buscador

```
docs/captura-01-vista-general.png
```

Muestra: sidebar con acceso rápido y estadísticas, hero pastel con el buscador y el grid de departamentos cargados desde la API.

### 2. Filtrado en tiempo real

```
docs/captura-02-filtro-tiempo-real.png
```

Muestra: el usuario escribe “Antioquia” en el buscador y la grilla se reduce en vivo a 1 resultado (contador “1 de 32”). Se aprecia que no hay recarga de página.

### 3. Card expandida con detalle y ciudades

```
docs/captura-03-card-expandida.png
```

Muestra: una card expandida con datos clave (capital, población de la capital, densidad, código postal), descripción del departamento y la lista de sus ciudades cargadas desde `/Department/{id}/Cities`.

### 4. Estado de carga (loading)

```
docs/captura-04-loading.png
```

Muestra: spinner inicial “Cargando departamentos desde la API Colombia...” y/o el spinner “Cargando ciudades...” dentro de una card.

### 5. Estado sin resultados y error

```
docs/captura-05-sin-resultados.png
docs/captura-05b-error.png
```

Muestra: (a) “Sin resultados” con botón “Limpiar filtro” cuando la búsqueda no coincide; (b) tarjeta de error con botón “Reintentar” cuando la API no responde.

## Estructura del proyecto

```
react-vite-apicolombia/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── DepartmentCard.tsx
│   │   ├── Hero.tsx
│   │   ├── SearchBar.tsx
│   │   └── Sidebar.tsx
│   ├── api.ts
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── types.ts
│   └── utils.ts
├── index.html
├── package.json
└── vite.config.ts
```

## Fuente de datos

- Base URL: https://api-colombia.com/api/v1
- Endpoints usados:
  - `GET /Department`
  - `GET /Department/{id}/Cities`
