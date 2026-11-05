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

> El script `"dev": "vite"` ya está definido en `package.json` 

### 4. Comandos adicionales disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor local Vite con HMR en `http://localhost:5173` |
| `npm run lint` | Verifica el código con ESLint |
| `npm run preview` | Previsualiza la build de producción en local |
| `npm run build` | Compila para producción (TypeScript + Vite → carpeta `dist/`) |


### Estructura de la vista única

Se implementó una sola página, dividida en tres zonas:

- **Sidebar** navegación lateral con acceso rápido a los primeros 8 departamentos, guía de uso y estadísticas globales (total de departamentos, municipios y población). En móvil se convierte en bloque superior.

- **Hero con SearchBar** contiene el buscador principal, un contador de resultados visibles 

- **Grid de DepartmentCard**  tarjetas expandibles en un grid responsive. Cada card muestra en estado cerrado el capital, población, superficie, municipios e indicativo; al expandir se despliega el detalle completo.



## Capturas



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
