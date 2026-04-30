---
description: "Global rules for SPFx analysis agents. Apply to all SPFx documentation generation: language, prohibitions, markers, and shared variables."
applyTo: "spfx/**/*.{ts,tsx}"
---

# Reglas globales — Análisis SPFx

Instrucciones aplicables a todos los agentes del pipeline SPFx de este proyecto.

---

## Idioma

- Toda la documentación generada debe estar en **español**.
- Los nombres de clases, métodos, propiedades y variables se mantienen en su idioma original (inglés) tal como aparecen en el código fuente.
- Los títulos, narrativa, explicaciones y comentarios: español.
- Sin mezcla de idiomas en un mismo párrafo.

---

## Prohibiciones globales

### Prohibiciones para spfx-analyst

- **Prohibido** generar HTML — solo Markdown canónico.
- **Prohibido** generar diagramas Mermaid — lo hace el agente `mermaid-validator`.
- **Prohibido** calcular o mencionar estimaciones de costes — lo hace el agente `cost-estimator`.
- **Prohibido** inventar comportamientos no observables directamente en el código fuente.
- **Prohibido** resumir o comprimir varias props/métodos en un párrafo genérico — cada elemento debe tener su explicación individual.
- **Prohibido** incluir código TypeScript/TSX literal en la documentación (ni fragmentos, ni pseudocódigo).

### Prohibiciones para todos los agentes

- **Prohibido** fabricar datos (nombres de endpoints, permisos, scopes) que no estén evidenciados en el código fuente o el manifest.
- **Prohibido** mezclar el modo funcional y el técnico en el mismo artefacto.
- **Prohibido** omitir componentes activos (no comentados) en el análisis técnico.

---

## Marcadores de ausencia de información

| Situación | Marcador |
|-----------|---------|
| Información técnica que existe pero no está disponible en el código analizado | `NO DISPONIBLE` |
| Dependencias externas (contratos, schemas) no aportados por el usuario | `NO PROPORCIONADO` |
| Permisos AAD/SharePoint no declarados en el manifest | `NO DECLARADO` |

Cuando se usa un marcador, incluir siempre una nota de **impacto funcional**: qué información falta y por qué es relevante para el análisis.

---

## Variables compartidas entre agentes

Las siguientes variables se pasan entre agentes del pipeline:

| Variable | Tipo | Descripción |
|----------|------|-------------|
| `{component_name}` | string | Nombre del componente SPFx analizado |
| `{component_type}` | string | Tipo: WebPart / Extension / AdaptiveCard / Service |
| `{full_source}` | string | Código fuente TypeScript/TSX completo del componente |
| `{manifest_json}` | string | Contenido del manifest.json del componente |
| `{more_context}` | string | Dependencias externas adicionales (opcional) |
| `{md_funcional}` | string | Ruta al MD funcional generado por spfx-analyst |
| `{md_tecnico}` | string | Ruta al MD técnico generado por spfx-analyst |
| `{md_estimacion}` | string | Ruta al MD de estimación generado por cost-estimator |
| `{costs_csv}` | string | Ruta al CSV histórico de costes |

---

## Lectura del manifest del proyecto

Antes de iniciar cualquier análisis, leer `spfx-project.yml` para obtener:
- `spfx_version`: versión SPFx activa
- `solution_folder`: carpeta de fuentes
- `technologies`: lista de tecnologías a detectar
- `cost_weights`: pesos por tipo de componente (para cost-estimator)
- `output_md_folder` / `output_html_folder`: carpetas de salida

---

## Convenciones de nombrado de artefactos

| Tipo de artefacto | Nombre del fichero |
|---|---|
| Documentación funcional MD | `output/md/<COMP>-funcional.md` |
| Documentación técnica MD | `output/md/<COMP>-tecnico.md` |
| Estimación de costes MD | `output/md/<COMP>-estimacion.md` |
| Documentación funcional HTML | `output/html/<COMP>-funcional.html` |
| Documentación técnica HTML | `output/html/<COMP>-tecnico.html` |
| Estimación de costes HTML | `output/html/<COMP>-estimacion.html` |
