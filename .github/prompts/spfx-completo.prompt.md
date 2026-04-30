---
description: "Genera documentación completa (funcional + técnica) de un componente SPFx. Ejecuta ambos pipelines en secuencia."
agent: "agent"
tools: [read, search, edit, agent]
---

# Orquestador — Documentación Completa SPFx

Genera los cuatro artefactos para un componente SPFx:
1. `output/md/{component_name}-funcional.md`
2. `output/html/{component_name}-funcional.html`
3. `output/md/{component_name}-tecnico.md`
4. `output/html/{component_name}-tecnico.html`

## Entradas

- `{component_name}`: nombre del componente SPFx
- `{full_source}`: código TypeScript/TSX del componente principal
- `{manifest_json}`: contenido del manifest.json del componente
- `{more_context}`: dependencias externas adicionales (opcional)

## Pipeline de ejecución

### Fase A — Pipeline funcional

Ejecuta el pipeline completo de `/spfx-funcional`:
1. `spfx-analyst` (modo funcional) → Markdown funcional
2. `mermaid-validator` → validar diagramas
3. `html-renderer` (modo funcional) → HTML funcional
4. `qa-reviewer` → validar calidad

Gate funcional:
- narrativa profunda orientada a negocio
- cobertura integral por rol y capacidades activas
- sin superficialidad ni omisiones

### Fase B — Pipeline técnico

Ejecuta el pipeline completo de `/spfx-tecnico`:
1. `spfx-analyst` (modo técnico) → Markdown técnico
2. `mermaid-validator` → validar diagramas
3. `html-renderer` (modo técnico) → HTML técnico
4. `qa-reviewer` → validar calidad

Gate tecnico:
- inventario completo de elementos activos
- matriz de riesgos con mitigaciones
- profundidad de analisis sin truncado

## Formato de salida

```
output/md/{component_name}-funcional.md
output/html/{component_name}-funcional.html
output/md/{component_name}-tecnico.md
output/html/{component_name}-tecnico.html
Reporte QA (Fase A + Fase B)
```
