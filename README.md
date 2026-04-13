# IA Challenge 2025 — Plataforma de Formación en IA

Plataforma gamificada para enseñar a los empleados a usar ChatGPT y Gemini en su trabajo diario.
Los usuarios completan módulos, responden quizzes, ganan puntos y compiten en un ranking.

---

## 📁 Estructura del proyecto

### Configuración raíz
| Archivo | Descripción |
|---|---|
| `index.html` | Página HTML principal donde se monta la app React |
| `vite.config.ts` | Configuración de Vite (bundler/servidor de desarrollo) |
| `tailwind.config.ts` | Configuración de Tailwind CSS (fuentes, colores, tokens) |
| `tsconfig.json` | Configuración base de TypeScript |
| `tsconfig.app.json` | Configuración de TypeScript para el código de la app |
| `tsconfig.node.json` | Configuración de TypeScript para scripts de Node |
| `postcss.config.js` | Configuración de PostCSS (usado por Tailwind) |
| `eslint.config.js` | Reglas de linting del código |
| `components.json` | Configuración de shadcn/ui (librería de componentes) |
| `package.json` | Dependencias npm y scripts del proyecto |
| `vitest.config.ts` | Configuración de tests unitarios |
| `playwright.config.ts` | Configuración de tests end-to-end |

### `/public` — Archivos estáticos
| Archivo | Descripción |
|---|---|
| `favicon.ico` | Icono de la pestaña del navegador |
| `placeholder.svg` | Imagen placeholder genérica |
| `robots.txt` | Instrucciones para bots de búsqueda |

### `/src` — Código fuente principal

#### `src/main.tsx`
Punto de entrada de React. Monta el componente `<App />` en el DOM.

#### `src/App.tsx`
Componente raíz. Define todas las rutas de la app y envuelve todo con los providers (React Query, Tooltips, Toasts, UserContext).

#### `src/index.css`
**Sistema de diseño completo.** Define todas las variables CSS (colores, gradientes, sombras) y las clases utilitarias personalizadas. Es el archivo clave para cambiar la identidad visual.

#### `src/App.css`
Estilos adicionales (actualmente vacío o mínimo).

---

### `/src/pages` — Páginas de la aplicación

| Archivo | Ruta | Descripción |
|---|---|---|
| `Onboarding.tsx` | `/` | **Pantalla de inicio.** Tabs de Login (por email) y Registro (nombre + email + departamento). Primera pantalla que ve el usuario. |
| `Dashboard.tsx` | `/dashboard` | **Panel principal.** Muestra stats del usuario (puntos, ranking, nivel), barra de progreso y tarjetas de los 6 módulos de formación. |
| `ModulePage.tsx` | `/module/:id` | **Página de módulo.** Tiene 3 fases: contenido educativo (slides), quiz (preguntas tipo test) y resultados. Aquí se ganan puntos y badges. |
| `Ranking.tsx` | `/ranking` | **Tabla de clasificación.** 3 tabs: ranking global, ranking del departamento del usuario, y ranking por departamentos (equipos). |
| `Challenges.tsx` | `/challenges` | **Retos semanales.** Muestra los retos organizados por semana con puntos y herramienta asociada (ChatGPT/Gemini). |
| `CompletionPage.tsx` | `/completion` | **Página de finalización.** Resumen de logros cuando el usuario completa módulos. Muestra puntos, ranking y nivel. |
| `AdminPanel.tsx` | `/admin` | **Panel de administración.** Vista con stats globales, tabla de todos los usuarios y estadísticas por departamento. |
| `Index.tsx` | — | Reexporta `Onboarding.tsx` (alias). |
| `NotFound.tsx` | `*` | Página 404 para rutas que no existen. |

---

### `/src/context` — Estado global

| Archivo | Descripción |
|---|---|
| `UserContext.tsx` | **Contexto de usuario.** Gestiona el estado de todos los usuarios y el usuario actual. Funciones: `login`, `loginByEmail`, `logout`, `addPoints`, `completeModule`, `addBadge`. Persiste datos en `localStorage`. |

---

### `/src/types` — Tipos TypeScript

| Archivo | Descripción |
|---|---|
| `challenge.ts` | **Tipos centrales.** Define `User`, `Module`, `QuizQuestion`, `WeeklyChallenge`, `Badge`, `Department`. También las funciones `getLevelFromPoints` y `getLevelName` para calcular niveles. Contiene la lista de departamentos y badges. |

---

### `/src/data` — Datos estáticos

| Archivo | Descripción |
|---|---|
| `modules.ts` | **Contenido de formación.** 6 módulos con su contenido educativo y preguntas de quiz. También los 6 retos semanales. Este es el archivo a editar para cambiar el contenido de los cursos. |

---

### `/src/components` — Componentes reutilizables

| Archivo | Descripción |
|---|---|
| `NavLink.tsx` | Componente wrapper de `NavLink` de React Router con soporte para clases activas. |
| `ui/*` | Componentes de shadcn/ui (Button, Input, Card, Tabs, Dialog, etc.). **No editar manualmente** — se gestionan con shadcn CLI. |

---

### `/src/hooks` — Hooks personalizados

| Archivo | Descripción |
|---|---|
| `use-mobile.tsx` | Hook para detectar si el viewport es móvil. |
| `use-toast.ts` | Hook para mostrar notificaciones toast. |

---

### `/src/integrations/supabase` — Conexión backend (Lovable Cloud)

| Archivo | Descripción |
|---|---|
| `client.ts` | Cliente de Supabase auto-generado. **No editar.** |
| `types.ts` | Tipos de la base de datos auto-generados. **No editar.** |

---

### `/supabase` — Configuración backend

| Archivo | Descripción |
|---|---|
| `config.toml` | Configuración del proyecto Supabase. **No editar manualmente.** |

---

## 🗺️ Flujo de la aplicación

```
Onboarding (/ ) → Login o Registro
       ↓
Dashboard (/dashboard) → Ver stats, módulos, insignias
       ↓
ModulePage (/module/:id) → Contenido → Quiz → Resultados
       ↓
Ranking (/ranking) → Global / Departamento / Equipos
Challenges (/challenges) → Retos semanales
CompletionPage (/completion) → Resumen de logros
AdminPanel (/admin) → Vista administrador
```

## 🎨 Sistema de diseño

Los colores y gradientes se definen en `src/index.css`. El color primario es un **rojo corporativo** (`hsl(0, 65%, 42%)`).

- `gradient-primary` → Rojo principal (botones, headers)
- `gradient-hero` → Negro/oscuro (headers de páginas internas)
- `gradient-success` → Verde (badges completados)
- `gradient-rank-*` → Oro/Plata/Bronce (podium ranking)

## 📦 Tecnologías

- **React + TypeScript** — Framework principal
- **Vite** — Bundler y servidor de desarrollo
- **Tailwind CSS** — Estilos utility-first
- **shadcn/ui** — Componentes de UI
- **Framer Motion** — Animaciones
- **React Router** — Navegación SPA
- **TanStack React Query** — Gestión de datos async
- **Lucide React** — Iconos
