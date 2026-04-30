---
description: "Genera documentación técnica de un componente SPFx. Pipeline: spfx-analyst (técnico) → mermaid-validator → html-renderer → qa-reviewer."
agent: "agent"
tools: [read, search, edit, agent]
---

# Orquestador — Documentación Técnica SPFx

Genera los artefactos técnicos para un componente SPFx:
1. `output/md/{component_name}-tecnico.md` — documentación técnica Markdown
2. `output/html/{component_name}-tecnico.html` — HTML técnico Bootstrap 5

## Entradas

- `{component_name}`: nombre del componente SPFx
- `{full_source}`: código TypeScript/TSX del componente principal
- `{manifest_json}`: contenido del manifest.json del componente
- `{more_context}`: dependencias externas adicionales (opcional)

## Pipeline de ejecución

### Fase 1 — Análisis técnico

Invocar `spfx-analyst` en modo técnico:
- Lee `spfx-project.yml`
- Analiza `{full_source}`, `{manifest_json}` y `config/package-solution.json` si existe
- Documenta lifecycle hooks, props, API calls, estado, property pane
- Genera `output/md/{component_name}-tecnico.md` con resumen global obligatorio
- Requisito de profundidad: objetivo >= 6000 palabras
- Inventario obligatorio: servicios, metodos, stores, hooks, rutas, permisos y riesgos
- Criterio de completitud: 0 componentes activos omitidos

### Fase 2 — Validación de diagramas

Invocar `mermaid-validator`:
- Valida y corrige los bloques Mermaid del MD técnico
- Devuelve el MD con diagramas marcados como `<!-- Diagrama validado: ✅ -->`

### Fase 3 — Renderizado HTML

Invocar `html-renderer` en modo técnico:
- Convierte el MD técnico validado a HTML Bootstrap 5
- Hero azul + nav-pills sticky + tablas responsive + acordeón de componentes
- Guarda en `output/html/{component_name}-tecnico.html`

### Fase 4 — QA

Invocar `qa-reviewer`:
- Valida completitud de todos los componentes documentados
- Valida idioma español
- Valida diagramas Mermaid
- Valida cobertura exhaustiva e inventario tecnico completo
- Devuelve reporte QA

## Formato de salida

```
output/md/{component_name}-tecnico.md    ← Markdown técnico
output/html/{component_name}-tecnico.html ← HTML técnico
Reporte QA inline
```
