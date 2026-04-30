---
description: "Procesa todos los componentes SPFx de la solución. Itera spfx-completo sobre todos los WebParts, Extensions y Adaptive Cards en spfx/src/."
agent: "agent"
tools: [read, search, edit, agent]
---

# Orquestador — Batch SPFx

Genera documentación completa para TODOS los componentes activos de la solución SPFx.

## Proceso

1. Leer `spfx-project.yml` para obtener `solution_folder`
2. Escanear las carpetas de componentes:
   - `{solution_folder}/src/webparts/` → WebParts
   - `{solution_folder}/src/extensions/` → Extensions
   - `{solution_folder}/src/adaptiveCardExtensions/` → Adaptive Cards
3. Para cada componente encontrado, ejecutar el pipeline `/spfx-completo`:
   - `spfx-analyst` (funcional + técnico) → MD
   - `mermaid-validator` → validar diagramas
   - `html-renderer` (funcional + técnico) → HTML
   - `qa-reviewer` → QA
4. Mostrar progreso: `[N/TOTAL] nombre-componente — tipo`
5. Al finalizar, mostrar resumen de resultados

## Formato de salida

Por cada componente `<COMP>`:
```
output/md/<COMP>-funcional.md
output/html/<COMP>-funcional.html
output/md/<COMP>-tecnico.md
output/html/<COMP>-tecnico.html
```

Resumen final:
```
=== Batch completado ===
Procesados: N componentes
OK: N
Con observaciones: N
Errores: N
```
