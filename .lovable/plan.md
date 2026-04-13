

## Plan: Consolidar secciones del Módulo 1

### Cambios en `src/data/modules.ts` — módulo `intro-tools`

**1. Fusionar "Paso 1", "Paso 2", "Paso 3" en una sola sección:**
- Título: "Tutorial Paso a Paso"
- Tipo: `text`
- Body: Combinar el contenido de las 3 secciones (Acceso al Chat Directo, Panel Lateral, Extensiones de Workspace) en un solo bloque con subtítulos claros separados por saltos de línea.

**2. Fusionar las 3 secciones de "Aplicaciones" en una sola:**
- Título: "Aplicación por Departamento"
- Tipo: `text`
- Body: Combinar Departamentos Operativos + Científicos/Calidad + Gestión en un solo bloque con subtítulos por área.

**3. Hacer scrollable las slides largas en `ModuleContent.tsx`:**
- Envolver el contenido de cada slide en un contenedor con `max-h` y `overflow-y-auto` para que las secciones extensas sean navegables con scroll vertical.

### Resultado
- El módulo pasa de 14 slides a **10 slides**
- Las slides largas se pueden recorrer con scroll
- El índice y la navbar reflejan los nuevos títulos consolidados

### Archivos a modificar
1. `src/data/modules.ts` — Consolidar las 6 secciones en 2
2. `src/components/module/ModuleContent.tsx` — Añadir scroll vertical al contenido

