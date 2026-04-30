---
description: "Genera documentación completa + estimación de costes de un componente SPFx. Pipeline: spfx-analyst → cost-estimator → html-renderer → qa-reviewer."
agent: "agent"
tools: [read, search, edit, agent]
---

# Orquestador — Estimación SPFx

Genera documentación completa y tabla de estimación de costes para un componente SPFx.

## Entradas

- `{component_name}`: nombre del componente SPFx
- `{full_source}`: código TypeScript/TSX del componente principal
- `{manifest_json}`: contenido del manifest.json del componente
- `{more_context}`: dependencias externas adicionales (opcional)
- `{costs_csv}`: ruta al CSV histórico (por defecto: `costs/historico.csv`)

## Pipeline de ejecución

### Fase 1 — Análisis completo

Ejecutar `/spfx-completo` para generar los 4 artefactos de documentación.

### Fase 2 — Estimación de costes

Invocar `cost-estimator`:
- Lee `spfx-project.yml` para obtener `cost_weights` y `costs_folder`
- Lee el CSV histórico de `{costs_csv}` (o `costs/historico.csv` por defecto)
- Lee el MD técnico ya generado para extraer métricas del componente
- Calcula: tipo, LOC, API calls, dependencias, complejidad, estado
- Busca top-3 similares en histórico
- Genera `output/md/{component_name}-estimacion.md` con todas las métricas del skill `cost-estimation`

### Fase 3 — Renderizado HTML de estimación

Invocar `html-renderer` en modo estimación:
- Convierte el MD de estimación a HTML con hero cian + 4 cards resumen + tabla detallada + acordeón de comparativa
- Guarda en `output/html/{component_name}-estimacion.html`

### Fase 4 — QA

Invocar `qa-reviewer`:
- Valida completitud de la estimación (todas las métricas presentes)
- Valida artefactos de documentación
- Devuelve reporte QA consolidado

## Formato de salida

```
output/md/{component_name}-funcional.md
output/html/{component_name}-funcional.html
output/md/{component_name}-tecnico.md
output/html/{component_name}-tecnico.html
output/md/{component_name}-estimacion.md    ← NUEVO
output/html/{component_name}-estimacion.html ← NUEVO
Reporte QA consolidado
```
