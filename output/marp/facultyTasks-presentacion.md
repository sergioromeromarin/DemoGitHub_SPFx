---
marp: true
theme: gaia
class: lead
paginate: true
_paginate: false
backgroundColor: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
footer: "Faculty Tasks — Documentación Funcional"
style: |
  :root {
    --color-background: #ffffff;
    --color-foreground: #333333;
    --color-highlight: #667eea;
    --color-dimmed: #888888;
  }
  section {
    font-family: 'Segoe UI', system-ui, sans-serif;
  }
  h1 { color: #667eea; font-size: 3em; }
  h2 { color: #764ba2; }
  strong { color: #667eea; }
  a { color: #667eea; }
  section.lead {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  section.lead h1 { color: white; }
  section.lead strong { color: #e0e0e0; }
---

# 🎓 Faculty Tasks

**Gestión Integrada de Planificación Docente**

*Análisis exhaustivo de negocio — 2026-04-28*

---

## ¿Qué es Faculty Tasks?

**Una aplicación digital integrada en Microsoft 365** que centraliza las tres grandes necesidades del profesorado:

---

## Tres Pilares Centrales

| | |
|---|---|
| **📅 Planificación** | Declarar disponibilidad para impartir clases |
| **📋 Confirmación** | Revisar y confirmar asignaciones de docencia |
| **✓ Tareas** | Seguimiento de compromisos pendientes |

**Accesible desde:**  
🔗 SharePoint • 🔗 Microsoft Teams  
*Donde el profesorado ya trabaja habitualmente*

---

## El Problema que Resuelve

### ❌ Sin Faculty Tasks
- **⏱️ Retrasos** en confirmación de asignaciones
- **❌ Errores** de planificación por disponibilidad desactualizada  
- **👁️ Falta de visibilidad** sobre respuestas del profesorado
- **📧 Tareas perdidas** entre correos

---

### ✅ Con Faculty Tasks
- **🎯 Una única plataforma** centralizada
- **🔄 Información actualizada** en tiempo real
- **📊 Trazabilidad completa** del proceso
- **💼 Acceso integrado** donde ya trabaja el profesorado

---

## Tres Tipos de Usuario

---

### 🛠️ El Coordinador / Administrador

**Responsable de la planificación institucional**

| Capacidad | Descripción |
|-----------|------------|
| **📅 Períodos** | Crear, editar, eliminar períodos académicos |
| **👁️ Supervisión** | Ver disponibilidad de todo el claustro |
| **📊 Asignaciones** | Revisar estado de confirmaciones |
| **📥 Exportación** | Descargar datos para análisis |

---

### 👨‍🏫 El Profesor de Planificación

**Participa activamente en fases de planificación docente**

| Capacidad | Descripción |
|-----------|------------|
| **📅 Disponibilidad** | Declarar su calendario de disponibilidad |
| **📋 Asignaciones** | Revisar y confirmar asignaciones |
| **⚙️ Preferencias** | Indicar estructura de sesiones |
| **✅ Decisión** | Aceptar o rechazar propuestas |

---

### ✔️ El Profesor de Tareas

**Gestiona compromisos operativos con plazo**

| Capacidad | Descripción |
|-----------|------------|
| **👀 Visualizar** | Ver tareas pendientes por urgencia |
| **⏰ Plazos** | Consultar fechas límite y responsables |
| **🔗 Acceso** | Ir directamente al recurso vinculado |
| **📍 Trazabilidad** | Mantener registro de compromisos |

*💡 Un mismo profesor puede tener múltiples roles simultáneamente*

---

## Ciclo de Vida de un Período Académico

```
┌─────────────────────────────────────────────┐
│ Fase 1: Configuración del Período           │
├─────────────────────────────────────────────┤
│ Fase 2: Recogida de Disponibilidad Docente  │
├─────────────────────────────────────────────┤
│ Fase 3: Revisión y Confirmación Asignaciones│
├─────────────────────────────────────────────┤
│ Fase 4: Gestión de Tareas Operativas        │
└─────────────────────────────────────────────┘
```

Cada período define fechas clave, parámetros de planificación y calendario de festivos

---

## Fase 1: Configuración del Período

El coordinador define:

- **Curso/Edición:** p.ej. "MBA 2024-25"
- **Nombre del período:** p.ej. "Trimestre 1"
- **Fechas del período:** inicio y fin de docencia
- **Ventana de disponibilidad:** cuándo pueden declarar los profesores
- **Ventana de asignaciones:** cuándo pueden revisar asignaciones
- **Horas máximas por día:** límite de docencia diaria
- **Coeficiente de espaciado:** margen entre sesiones
- **Festivos:** días no lectivos

---

## Fase 2: Recogida de Disponibilidad

**El calendario del profesor:**

Cada profesor marca día a día su situación:

| Estado | Significado |
|--------|------------|
| **Disponible** | Puede impartir clase sin objeción (por defecto) |
| **Preferido** | Puede y prefiere activamente impartir clase |
| **Bloqueado** | No puede impartir clase (compromisos, viajes, etc.) |

*Disponible durante la ventana de disponibilidad del período*

---

## Fase 2: Operaciones en Bloque

Para agilizar el proceso:

- 📆 **Aplicar a toda la semana** — extiende el estado de un día a toda la semana
- 📅 **Aplicar a todo el mes** — extiende a todos los días del mes
- 🗓️ **Aplicar a todo el período** — extiende a todos los días hábiles
- ⚡ **Marcar semana completa** — acciones rápidas de preferido o bloqueado
- 🔍 **Filtrar por estado** — visualizar solo excepciones

---

## Fase 3: Revisión de Asignaciones

**Una asignación docente incluye:**

- 📚 Materia a impartir
- 🏢 Programa académico
- 👥 Edición/promoción de estudiantes
- 📍 Campus y turno (mañana, tarde)
- 📆 Fechas inicio y fin
- 🔢 Número de sesiones
- 📝 Descripción

---

## Fase 3: Indicador de Compatibilidad

Cada asignación muestra su estado respecto a la disponibilidad declarada:

| Indicador | Significado |
|-----------|------------|
| ✅ **Compatible** | Fechas coinciden con disponible/preferido |
| ⚠️ **Con conflicto** | Una o más fechas están bloqueadas |
| ❓ **Desconocido** | No hay información suficiente |

*El profesor puede aceptar incluso con conflicto si así lo decide*

---

## Fase 3: Decisión del Profesor

Al **aceptar** una asignación proporciona:
- Estructura de sesiones preferida
- Información adicional o condiciones especiales

Al **rechazar** una asignación indica:
- Motivo del rechazo (queda registrado para coordinadores)

**Requisito previo:** Disponibilidad completada para el período

---

## Fase 4: Gestión de Tareas

**¿Qué es una tarea?**

Acción operativa con fecha límite y responsable asignado:
- Entrega de materiales
- Revisión de documentos
- Cumplimentación de formularios
- Otras acciones de gestión académica

---

## Fase 4: Vista de Tareas

**Vista de urgencia (carrusel):**
Rotación automática con tareas más próximas al vencimiento

**Lista completa (tabla):**
- Descripción de la tarea
- Tipo y fecha límite
- Estado (pendiente, completada, vencida)
- Enlace directo al recurso
- Nombre y foto del responsable

---

## Panel de Administración — Coordinador

**Gestión de períodos:**
- ✏️ Crear, editar, eliminar, ver detalles

**Supervisión de disponibilidad:**
- ¿Quién completó? ¿Quién no?
- Desglose de disponible/preferido/bloqueado
- Búsqueda individual y exportación

**Supervisión de asignaciones:**
- Pendientes, aceptadas, rechazadas
- Seguimiento de confirmación
- Motivos de rechazo
- Exportación de datos

---

## Integración con Microsoft Teams

**Experiencia nativa en Teams:**
✅ Idéntica a SharePoint pero integrada en el entorno diario

**Enlaces profundos:**
✅ Acceso directo a secciones específicas desde Teams

**Sin cambio de contexto:**
✅ El profesorado trabaja donde ya está habituado

---

## Control de Acceso y Seguridad

**Autenticación y autorización:**
- Basada en grupos del directorio corporativo
- Verificación automática y transparente
- Determinación automática del perfil

**Protección de datos:**
- Datos centralizados en Faculty Hub
- Comunicaciones autenticadas
- Cada usuario solo ve/modifica sus datos

**Permisos requeridos:**
- Acceso al directorio (Microsoft 365)
- Acceso al sistema de negocio (Faculty Hub API)

---

## Funcionalidades Futuras

Próximamente (en desarrollo):

- 📬 **Solicitudes (Requests)** — gestión de solicitudes formales docentes
- ⭐ **Evaluaciones (Evaluations)** — procesos de evaluación docente
- 📍 **Mis Sesiones** — detalle de sesiones confirmadas

*Requieren validación funcional y comunicación al claustro antes de activación*

---

## Resumen: Valor para la Institución

| Beneficio | Impacto |
|-----------|--------|
| **⚡ Eficiencia operativa** | Automatización de procesos manuales |
| **📋 Trazabilidad completa** | Registro digital de toda la gestión docente |
| **👁️ Transparencia** | Coordinadores ven situación en tiempo real |
| **💼 Experiencia mejorada** | Profesorado accede donde ya trabaja |
| **📊 Datos para decisiones** | Exportación y análisis integrados |
| **✓ Reducción de errores** | Sistema valida coherencia automáticamente |

---

## Resumen: Valor para el Profesorado

| Beneficio | Impacto |
|-----------|--------|
| **🎯 Un único lugar** | Centraliza toda su gestión docente |
| **⚡ Flexibilidad** | Operaciones en bloque optimizan su tiempo |
| **✨ Claridad** | Indicadores de compatibilidad y estado |
| **📱 Accesibilidad** | SharePoint o Teams, sin cambiar contexto |
| **📝 Trazabilidad** | Todo queda registrado y visible |
| **📞 Apoyo** | Enlaces directos a recursos y responsables |

---

## 🚀 ¿Listo para comenzar?

**Faculty Tasks — Gestión Integrada de Planificación Docente**

*Integración transparente en Microsoft 365*  
*Donde el profesorado ya trabaja habitualmente*

💡 **Contacto para más información**
