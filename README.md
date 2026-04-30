# DemoGitHub_SPFx

Sistema agéntico para análisis y documentación de soluciones **SharePoint Framework (SPFx)** con GitHub Copilot.

Creado desde la plantilla [agentic-framework](https://github.com/your-org/agentic-framework) v1.0.0.

## Inicio rápido

1. Coloca tu solución SPFx en la carpeta `spfx/`
2. Edita `spfx-project.yml` con la versión SPFx y tecnologías de tu proyecto
3. Ejecuta un prompt en Copilot Chat o usa el CLI

## Prompts disponibles

| Prompt | Qué genera |
|--------|-----------|
| `/spfx-funcional` | MD funcional + HTML funcional |
| `/spfx-tecnico` | MD técnico + HTML técnico |
| `/spfx-completo` | Los 4 artefactos (funcional + técnico) |
| `/spfx-batch` | Procesa todos los componentes de la solución |
| `/spfx-estimacion` | Documentación completa + estimación de costes |

## CLI

```powershell
# Análisis individual
python .\cli.py run-spfx MiWebPart --mode completo

# Batch (todos los componentes)
python .\cli.py batch-spfx --mode completo

# Estimación de costes
python .\cli.py estimate MiWebPart --costs costs/historico.csv

# Generar payload para API cloud
python .\cli.py run-spfx MiWebPart --mode completo --runtime cloud
```

## Estructura

```
DemoGitHub_SPFx/
├── spfx/                     ← Fuentes SPFx (.ts, .tsx, manifest.json)
├── costs/
│   ├── historico-template.csv ← Schema vacío del histórico
│   └── historico.csv          ← (crear cuando tengas datos)
├── output/
│   ├── md/                   ← Markdown generados
│   └── html/                 ← HTML generados
├── spfx-project.yml          ← Manifest del proyecto
├── framework-version.yml     ← Versión del framework agéntico
└── cli.py                    ← CLI SPFx
```

## Estimación de costes

Rellena `costs/historico.csv` con los datos de proyectos anteriores (schema en `.github/skills/cost-estimation/SKILL.md`). Cuantas más filas, más precisa la estimación.
