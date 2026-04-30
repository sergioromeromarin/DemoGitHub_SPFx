---
description: "Genera documentación funcional de un componente SPFx. Pipeline: spfx-analyst (funcional) → mermaid-validator → html-renderer → qa-reviewer."
agent: "agent"
tools: [read, search, edit, agent]
---

# Orquestador — Documentación Funcional SPFx

Genera los artefactos funcionales para un componente SPFx:
1. `output/md/{component_name}-funcional.md` — documentación funcional Markdown
2. `output/html/{component_name}-funcional.html` — HTML funcional Bootstrap 5

## Entradas

- `{component_name}`: nombre del componente SPFx (WebPart, Extension, etc.)
- `{full_source}`: código TypeScript/TSX del componente principal
- `{manifest_json}`: contenido del manifest.json del componente
- `{more_context}`: dependencias externas adicionales (opcional)

## Pipeline de ejecución

### Fase 1 — Análisis funcional

Invocar `spfx-analyst` en modo funcional:
- Lee `spfx-project.yml`
- Analiza `{full_source}` y `{manifest_json}`
- Genera `output/md/{component_name}-funcional.md` con analisis profundo
- Requisito de profundidad: narrativa extensa orientada a negocio (objetivo >= 5000 palabras)
- Debe cubrir roles, ciclo de negocio completo, controles de acceso e impacto funcional

### Fase 2 — Validación de diagramas

Invocar `mermaid-validator`:
- Valida y corrige los bloques Mermaid del MD funcional generado
- Devuelve el MD con diagramas marcados como `<!-- Diagrama validado: ✅ -->`

### Fase 3 — Renderizado HTML

Invocar `html-renderer` en modo funcional:
- Convierte el MD funcional validado a HTML Bootstrap 5
- Hero azul Microsoft + cards + acordeón + diagramas
- Guarda en `output/html/{component_name}-funcional.html`

### Fase 4 — QA

Invocar `qa-reviewer`:
- Valida completitud de las 5 secciones
- Valida idioma español
- Valida diagramas Mermaid
- Valida que no haya resumen superficial ni bloques omitidos
- Devuelve reporte QA

## Formato de salida

```
output/md/{component_name}-funcional.md   ← Markdown funcional
output/html/{component_name}-funcional.html ← HTML funcional
Reporte QA inline
```
