---
name: cost-estimation
description: "Cost estimation skill for any type of software component. Use when estimating development hours, story points, cost, complexity, risk, and reusability from Markdown documentation and a historical CSV file."
---

# Estimación de Costes — Skill de dominio agnostic

Skill de conocimiento para estimar costes de componentes de software de cualquier dominio, a partir de documentación Markdown y un histórico de proyectos anteriores.

---

## Schema canónico del CSV histórico

El archivo CSV histórico (`costs/historico.csv`) debe seguir este schema:

```
id,nombre,tipo_componente,horas_reales,story_points,complejidad,api_calls,dependencias_externas,loc,fecha,dominio,notas
```

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | string | Identificador único del componente histórico |
| `nombre` | string | Nombre descriptivo del componente |
| `tipo_componente` | string | Tipo según el dominio (WebPart, Extension, Service, Class, Function…) |
| `horas_reales` | number | Horas de desarrollo reales (sin QA ni despliegue) |
| `story_points` | number | Story points asignados al componente |
| `complejidad` | number (1-5) | Complejidad técnica asignada al finalizar |
| `api_calls` | number | Número de llamadas a APIs o servicios externos |
| `dependencias_externas` | number | Número de librerías/servicios externos usados |
| `loc` | number | Líneas de código (aprox.) |
| `fecha` | YYYY-MM-DD | Fecha de finalización del componente |
| `dominio` | string | Dominio del componente (SPFx, COBOL, Java…) |
| `notas` | string | Observaciones adicionales (opcional) |

### Ejemplo de fila CSV

```
WP001,EmployeeDirectory,WebPart,32,8,3,4,3,420,2025-11-15,SPFx,"Web part de directorio con búsqueda y filtrado"
```

---

## Tabla de pesos base por tipo de componente

La tabla base aplica cuando no se especifica `cost_weights` en el manifest del proyecto.
Cada repo de dominio puede sobreescribir estos pesos en su `<dominio>-project.yml`.

| Tipo genérico | Peso base |
|---|---|
| Componente principal / WebPart / Clase principal | 1.0 |
| Extensión / Customizer / Decorador | 0.8 |
| Adaptive Card / Vista secundaria | 0.9 |
| Servicio / Helper / Utilidad | 0.6 |
| Librería / Módulo compartido | 0.7 |

---

## Algoritmo de estimación

### Paso 1 — Calcular complejidad del componente analizado

Derivar la complejidad (1-5) sumando los siguientes factores:

| Factor | Puntuación |
|--------|-----------|
| API calls: 0 | +0 |
| API calls: 1-2 | +0.5 |
| API calls: 3-5 | +1 |
| API calls: >5 | +1.5 |
| Dependencias externas: 0-1 | +0 |
| Dependencias externas: 2-3 | +0.5 |
| Dependencias externas: >3 | +1 |
| Estado: sin estado | +0 |
| Estado: local (useState) | +0.5 |
| Estado: compartido (Context/Redux) | +1 |
| Estado: global complejo | +1.5 |
| LOC: < 200 | +0 |
| LOC: 200-500 | +0.5 |
| LOC: 500-1000 | +1 |
| LOC: > 1000 | +1.5 |

Clamp final: min(1, max(5, suma))

### Paso 2 — Buscar similares en histórico

1. Filtrar por `tipo_componente` igual al componente analizado (o más cercano)
2. Ordenar por distancia de complejidad (`abs(complejidad_historico - complejidad_calculada)`)
3. Seleccionar top-3
4. Si no hay suficientes del mismo tipo, ampliar a todos los del mismo dominio
5. Si el histórico está vacío → usar valores de referencia (tabla abajo)

### Paso 3 — Calcular estimación base

```
horas_base = promedio_ponderado(horas_reales_top3)
  donde peso_i = 1 / (1 + distancia_complejidad_i)

horas_ajustadas = horas_base * peso_tipo_componente * factor_loc * factor_api
  factor_loc = 1 + (loc_actual - loc_promedio_similares) / loc_promedio_similares * 0.3
  factor_api = 1 + (api_calls_actual - api_calls_promedio_similares) / max(api_calls_promedio_similares, 1) * 0.2
```

### Paso 4 — Derivar el resto de métricas

| Métrica | Derivación |
|---------|-----------|
| Story Points | horas_ajustadas / 4 (escala Fibonacci: 1,2,3,5,8,13,21) |
| Coste €/h | horas_ajustadas * tarifa_hora (NO incluir si no hay tarifa definida) |
| T-shirt size | XS: ≤8h, S: ≤16h, M: ≤32h, L: ≤64h, XL: >64h |
| Risk score (1-5) | = complejidad_calculada |
| Reusability score | 5 si es servicio/librería; 3 si es componente; 1 si es muy específico |
| Maintenance burden | horas_ajustadas * 0.15 h/año (aproximación) |
| Test complexity | Bajo: complejidad ≤2; Medio: 3; Alto: ≥4 |
| Bundle size risk | Bajo: api_calls=0, dep_ext ≤1; Medio: api_calls ≤3; Alto: api_calls >3 o dep_ext >3 |
| Permisos | Extraer literalmente del Markdown analizado; si no consta: `NO DISPONIBLE` |

---

## Valores de referencia (sin histórico)

Usar cuando el CSV está vacío o no hay similares suficientes:

| Tipo | Complejidad media | Horas referencia | SPs referencia |
|------|---|---|---|
| WebPart simple | 2 | 16h | 4 SP |
| WebPart con Graph API | 3 | 32h | 8 SP |
| WebPart complejo (estado global) | 4 | 56h | 13 SP |
| Extension/Customizer | 2 | 12h | 3 SP |
| Adaptive Card | 3 | 24h | 5 SP |
| Servicio/Helper | 2 | 8h | 2 SP |

---

## Formato de salida (secciones obligatorias del MD)

El cost-estimator debe generar TODAS estas secciones:

1. **Resumen ejecutivo** (tabla de 5 métricas clave: T-shirt, horas, SPs, coste, risk)
2. **Métricas detalladas** (tabla de 8 métricas: reusability, maintenance, test complexity, bundle risk, permisos, complejidad calculada, tipo, LOC)
3. **Comparativa con histórico** (tabla top-3 similares; si no hay histórico, indicarlo y usar valores de referencia)
4. **Recomendaciones** (orden de implementación, riesgos a mitigar, oportunidades de reutilización)
