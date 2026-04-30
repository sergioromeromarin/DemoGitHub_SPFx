# Documentación Funcional — Faculty Tasks

**Análisis exhaustivo de negocio** — 2026-04-28

---

## ¿Qué es Faculty Tasks?

Faculty Tasks es una aplicación digital integrada en el entorno Microsoft 365 de la institución educativa que centraliza en un único lugar las tres grandes necesidades operativas del profesorado en relación con su actividad docente: la planificación de su disponibilidad para impartir clases, la revisión y confirmación de las asignaciones de docencia que le corresponden cada período, y el seguimiento de las tareas pendientes que tiene encomendadas.

La aplicación vive dentro de SharePoint y también puede utilizarse directamente desde Microsoft Teams, lo que permite al profesor acceder a toda su información docente sin necesidad de cambiar de plataforma ni abrir herramientas externas. Todo está disponible donde el profesorado ya trabaja habitualmente.

El propósito central de la herramienta es eliminar la dispersión de información y la dependencia de correos electrónicos o listados manuales para gestionar la participación del profesorado en los períodos académicos. Con Faculty Tasks, toda la interacción entre la institución y el cuerpo docente relativa a la planificación y las asignaciones queda registrada digitalmente, con trazabilidad completa y en tiempo real.

---

## ¿Para qué existe esta herramienta?

En una institución educativa de alto nivel, la organización docente para cada período académico implica coordinar la disponibilidad de decenas o cientos de profesores, cruzarla con las necesidades de cada programa, generar propuestas de asignación y obtener la confirmación de cada docente. Este proceso, cuando se gestiona de forma manual o fragmentada, genera:

- Retrasos en la confirmación de asignaciones por falta de un canal directo.
- Errores de planificación porque la disponibilidad declarada no está actualizada o es ambigua.
- Falta de visibilidad para los coordinadores sobre qué profesores han respondido y cuáles no.
- Tareas encomendadas al profesorado que se pierden entre correos y no tienen un seguimiento claro.

Faculty Tasks resuelve todos estos problemas proporcionando una única plataforma donde cada actor del proceso tiene exactamente lo que necesita: el profesor ve su disponibilidad, sus asignaciones y sus tareas; el coordinador gestiona los períodos y supervisa la respuesta del colectivo docente.

---

## ¿Quiénes utilizan esta aplicación?

La aplicación distingue tres tipos de usuario, cada uno con un acceso y unas capacidades específicas. El tipo de usuario se determina automáticamente en función del grupo institucional al que pertenece cada persona en el directorio corporativo, por lo que no requiere ninguna configuración manual por parte del usuario.

### El coordinador o administrador

Es el responsable de la planificación institucional. Su misión dentro de la aplicación es configurar y gestionar los períodos académicos, así como supervisar de forma agregada la disponibilidad y las asignaciones de todo el colectivo docente.

El coordinador puede crear nuevos períodos, definir todos sus parámetros y fechas clave, modificarlos cuando la planificación cambia, y eliminarlos si un período queda obsoleto. Además, tiene acceso a las vistas de disponibilidad y asignaciones de todos los profesores, lo que le permite saber en todo momento qué porcentaje del claustro ha respondido, qué profesores tienen asignaciones pendientes de confirmación y qué situaciones requieren atención.

La herramienta también le ofrece funciones de exportación de datos tanto de disponibilidad como de asignaciones, con granularidad a nivel de profesor individual o a nivel de período completo, facilitando el análisis y la toma de decisiones.

### El profesor de planificación

Es el docente cuya participación en los programas requiere una fase de planificación previa. Dentro de la aplicación, este perfil tiene acceso a dos grandes funcionalidades: declarar su disponibilidad para impartir clases durante un período determinado, y revisar y confirmar las asignaciones de docencia que le han propuesto.

Este perfil es el más activo en términos de interacción con la herramienta durante las fases de planificación de cada período académico.

### El profesor de tareas

Es el docente al que se le asignan tareas operativas con fecha límite y responsable asignado. Su experiencia en la aplicación está centrada en tener siempre visible qué compromisos pendientes tiene, ordenados por urgencia, para poder atenderlos a tiempo.

Este perfil puede convivir con el anterior: un mismo profesor puede tener simultáneamente capacidades de planificación y de gestión de tareas si pertenece a ambos grupos institucionales.

---

## El ciclo de vida de un período académico

El funcionamiento de Faculty Tasks está estructurado alrededor del concepto de **período académico**. Un período representa un bloque de actividad docente con inicio y fin definidos, como puede ser un trimestre, un cuatrimestre o una convocatoria específica de un programa.

Cada período tiene una estructura de fechas que define cuándo ocurre cada fase del proceso:

**Fechas del período propiamente dicho:** el intervalo de tiempo durante el cual se imparte la docencia. Define el marco temporal general.

**Ventana de disponibilidad:** el intervalo de tiempo durante el cual los profesores pueden (y deben) declarar su disponibilidad. Fuera de este intervalo, la sección de disponibilidad puede estar visible pero no permite modificaciones. La institución abre esta ventana cuando necesita recoger la información del claustro para un período concreto.

**Ventana de revisión de asignaciones:** el intervalo de tiempo durante el cual los profesores pueden revisar las asignaciones propuestas y aceptarlas o rechazarlas. Esta fase comienza normalmente una vez que el sistema o los coordinadores han generado las propuestas de asignación a partir de la disponibilidad recogida.

Además, cada período tiene configurados parámetros como el número máximo de horas de docencia por día, un coeficiente de espaciado entre sesiones, y el calendario de festivos específico para ese período, de modo que la planificación tenga en cuenta la realidad del calendario académico.

### Fase 1: Configuración del período

El coordinador crea el período en el panel de administración, definiendo el nombre del curso o edición (por ejemplo, "MBA 2024-25"), el nombre del período, todas las fechas relevantes y los parámetros de planificación. A partir de ese momento, el período está disponible para el profesorado.

### Fase 2: Recogida de disponibilidad docente

Dentro de la ventana de disponibilidad configurada, cada profesor con perfil de planificación accede a su sección de disponibilidad y marca, día a día para cada semana del período, su situación real: si está disponible sin preferencia especial, si prefiere esa jornada para impartir clase, o si tiene un impedimento y no puede impartir clase ese día.

Esta información es la base sobre la que se construyen las propuestas de asignación docente.

### Fase 3: Revisión y confirmación de asignaciones

Una vez generadas las propuestas de asignación (proceso que ocurre en el sistema central), cada profesor accede a su sección de asignaciones, ve las materias, programas y fechas que tiene asignadas, y decide si acepta o rechaza cada propuesta. Si acepta, puede añadir información adicional sobre preferencias de estructura de sesión. Si rechaza, debe indicar el motivo.

El sistema verifica de forma automática que el profesor ha completado su disponibilidad antes de permitirle acceder a la revisión de asignaciones. Esto garantiza la coherencia del proceso.

### Fase 4: Gestión de tareas operativas

En paralelo a todo lo anterior, y de forma continua, los profesores con tareas pendientes pueden acceder en cualquier momento a su lista de compromisos activos, ver los plazos y el responsable de cada tarea, y acceder directamente al recurso vinculado a cada una de ellas.

---

## Módulo de Planificación — Lo que puede hacer el profesor

### Mi disponibilidad

#### ¿Qué significa declarar disponibilidad?

Declarar disponibilidad es el proceso por el que cada profesor indica a la institución, para cada jornada del período académico, en qué medida puede o desea impartir clases. Esta información es la materia prima del proceso de asignación docente: sin ella, no es posible construir un plan de docencia que respete las circunstancias reales de los profesores.

La herramienta presenta al profesor un calendario visual organizado por semanas donde puede ver todos los días hábiles del período seleccionado. Para cada jornada, el profesor puede asignar uno de tres estados:

**Disponible:** el profesor puede impartir clase ese día sin objeción. Es el estado por defecto.

**Preferido:** el profesor no solo puede impartir clase ese día, sino que lo prefiere activamente. Esta señal permite al sistema priorizar esa jornada para asignarle docencia si hay opciones equivalentes.

**Bloqueado:** el profesor no puede impartir clase ese día, ya sea por compromisos previos, viajes, vacaciones u otras razones. El sistema respetará este impedimento en las propuestas de asignación.

El profesor puede cambiar el estado de cualquier jornada tantas veces como necesite mientras la ventana de disponibilidad del período esté abierta. Al guardar, los cambios quedan registrados de forma inmediata para que los coordinadores los vean en tiempo real.

Si el profesor cambia de sección sin guardar sus cambios, la aplicación le avisa con un mensaje de advertencia para que no pierda trabajo sin querer.

#### Operaciones en bloque para agilizar el proceso

Marcar disponibilidad día a día para un período largo puede ser tedioso. Por eso, la herramienta ofrece operaciones masivas que permiten al profesor replicar el estado de un día concreto a varios destinos de forma inmediata:

- **Aplicar a toda la semana:** el estado del día seleccionado se extiende a todos los días de esa misma semana.
- **Aplicar a todo el mes:** el estado del día seleccionado se extiende a todos los días del mismo mes.
- **Aplicar a todo el período:** el estado del día seleccionado se extiende a todos los días hábiles del período completo.
- **Marcar toda la semana como preferido o bloqueado de una vez:** acciones masivas rápidas sobre toda una semana sin necesidad de seleccionar un día base.

Estas operaciones permiten al profesor con una disponibilidad regular (por ejemplo, disponible toda la semana salvo los martes) configurar su calendario en muy pocos clics.

El profesor también puede filtrar la vista del calendario para mostrar únicamente los días marcados como preferidos o bloqueados, lo que facilita la revisión rápida de excepciones.

#### ¿Cuándo puede el profesor modificar su disponibilidad?

Solo durante la ventana de disponibilidad configurada por el coordinador para cada período. La aplicación calcula automáticamente si el período actual está abierto para modificaciones comparando la fecha actual con las fechas de inicio y fin de la ventana. Si el período está cerrado, la disponibilidad puede consultarse pero no modificarse.

---

### Mis asignaciones

#### ¿Qué es una asignación docente?

Una asignación docente es la propuesta formal que hace la institución a un profesor para que imparta una materia concreta en un programa y fechas determinadas. Cada asignación incluye la información completa que el profesor necesita para tomar una decisión fundamentada:

- **Materia:** la asignatura que se le propone impartir.
- **Programa:** el programa académico en el que se encuadra esa materia.
- **Área académica:** el departamento o área de conocimiento al que pertenece.
- **Edición o convocatoria (intake):** la promoción concreta de estudiantes que recibirá esa docencia.
- **Campus y turno:** dónde y en qué franja horaria se impartirán las clases (mañana, tarde, etc.).
- **Fechas de inicio y fin:** el período durante el cual el profesor impartirá esa materia.
- **Número de sesiones asignadas:** las sesiones concretas que tendría este profesor, dentro del total de sesiones que tiene la materia.
- **Número total de sesiones:** el total de sesiones que compone la materia, para que el profesor entienda el contexto completo aunque solo imparta una parte.
- **Descripción:** información adicional sobre el contenido o las particularidades de esa asignación.

#### El indicador de compatibilidad con disponibilidad

Cada asignación muestra un indicador visual que informa al profesor de si las fechas de docencia propuestas son compatibles con la disponibilidad que él mismo ha declarado. Este indicador puede tener tres estados:

**Compatible:** las fechas de la asignación coinciden con días que el profesor ha marcado como disponible o preferido. No hay conflictos conocidos.

**Con conflicto:** una o más fechas de la asignación coinciden con días que el profesor ha marcado como bloqueados. El sistema detecta esta incompatibilidad para que el profesor la tenga en cuenta al decidir.

**Desconocido:** no es posible determinar la compatibilidad porque no hay información suficiente de disponibilidad registrada.

Este indicador es una herramienta de apoyo a la decisión, no un bloqueo: el profesor puede aceptar una asignación con conflicto si así lo decide, por ejemplo, si va a actualizar su disponibilidad.

#### Cómo acepta el profesor una asignación

Cuando el profesor decide aceptar una asignación, la aplicación le solicita dos datos adicionales:

1. **Estructura de sesiones:** información sobre sus preferencias o requisitos en cuanto a cómo organizar las sesiones de esa materia. Esto permite al equipo de coordinación adaptar la planificación a las necesidades del docente.

2. **Información adicional:** cualquier comentario o condición especial que el profesor quiera comunicar junto con su aceptación.

Una vez enviada la aceptación, la asignación pasa a estado "aceptada" y queda registrada con la información proporcionada.

#### Cómo rechaza el profesor una asignación

Si el profesor no puede aceptar la asignación propuesta, puede rechazarla indicando el motivo. El motivo de rechazo queda registrado para que el equipo de coordinación pueda tenerlo en cuenta en la revisión de la planificación.

Una vez enviado el rechazo, la asignación pasa a estado "rechazada" y el motivo queda visible tanto para el profesor como para el coordinador.

#### El requisito previo: disponibilidad completa

Para que el profesor pueda acceder a la sección de revisión de asignaciones de un período concreto, la aplicación verifica de forma automática que ese profesor ha completado su disponibilidad para ese período. Si aún no la ha completado, la sección de asignaciones le indica claramente este requisito y le dirige a completar primero su disponibilidad.

Este mecanismo garantiza que las propuestas de asignación se revisan con toda la información de disponibilidad ya registrada, evitando situaciones en las que un profesor acepta una asignación sin haber declarado sus impedimentos.

---

## Módulo de Tareas — Lo que puede hacer el profesor de tareas

### Mis tareas pendientes

#### ¿Qué es una tarea en este contexto?

Una tarea es cualquier acción operativa que la institución encomienda a un profesor con una fecha límite y un responsable asignado. Puede tratarse de la entrega de materiales, la revisión de documentos, la cumplimentación de formularios u otras acciones de gestión académica que requieren la participación activa del docente.

Cada tarea incluye:

- **Descripción:** qué se le está pidiendo al profesor exactamente.
- **Tipo:** categoría o naturaleza de la tarea.
- **Fecha límite:** la fecha hasta la que el profesor tiene para completarla. La aplicación utiliza esta fecha para ordenar las tareas y destacar las más urgentes.
- **Estado:** si la tarea está pendiente, completada o ha vencido su plazo.
- **Enlace directo:** cada tarea lleva a un recurso o herramienta específica donde el profesor puede completar lo que se le pide, sin necesidad de buscarlo en otra parte.
- **Responsable:** la persona de la institución asignada como supervisora de esa tarea, con su nombre y fotografía de perfil para que el profesor sepa a quién puede dirigirse si tiene dudas.

#### Vista de urgencia: las tareas más próximas al vencimiento

La sección de tareas presenta, en primer lugar, una vista destacada en formato carrusel con las tareas más próximas a su fecha límite. Esta vista rota automáticamente entre las tareas más urgentes para que ningún plazo pase desapercibido. El profesor ve de un vistazo cuáles son sus compromisos más inmediatos y puede acceder directamente a cada uno.

#### Lista completa de tareas pendientes

Debajo de la vista de urgencia, el profesor dispone de una tabla con todas sus tareas pendientes. Esta vista le permite tener una visión global de su carga de compromisos, ver los plazos de cada uno y acceder a cualquiera de ellos de forma ordenada.

La fotografía de perfil del supervisor aparece junto a cada tarea, facilitando la identificación visual de quién es el responsable sin necesidad de buscar en el directorio corporativo.

---

## Panel de Administración — Lo que puede hacer el coordinador

### Gestión de períodos académicos

El panel de administración es el espacio desde el que el coordinador tiene el control completo sobre la estructura de períodos académicos y la supervisión de la respuesta del colectivo docente.

#### Crear un nuevo período académico

El coordinador puede dar de alta un nuevo período académico proporcionando la siguiente información:

- **Curso o edición:** el nombre del curso o convocatoria al que pertenece este período (por ejemplo, "MBA Full-Time 2025-26"). Tiene un límite de 100 caracteres para mantener la nomenclatura ordenada.
- **Nombre del período:** una denominación específica para este tramo temporal (por ejemplo, "Trimestre 1" o "Módulo Estrategia"). También con límite de 100 caracteres.
- **Fechas del período:** la fecha de inicio y fin del período académico propiamente dicho, que define cuándo se imparte la docencia.
- **Ventana de disponibilidad:** la fecha de inicio y fin del plazo durante el cual los profesores podrán declarar su disponibilidad. Estas fechas determinan exactamente cuándo se abre y cierra el proceso de recogida de disponibilidad para este período.
- **Ventana de revisión de asignaciones:** la fecha de inicio y fin del plazo durante el cual los profesores podrán revisar y confirmar sus asignaciones. Se configura de forma independiente a la ventana de disponibilidad, permitiendo una separación clara entre ambas fases.
- **Horas máximas por día:** el número máximo de horas de docencia que puede concentrarse en una sola jornada dentro de este período.
- **Coeficiente de espaciado:** un parámetro de planificación que determina el margen o hueco mínimo deseable entre sesiones de un mismo profesor a lo largo del período.
- **Festivos:** los días no lectivos específicos de este período (festivos nacionales, locales o del calendario académico propio de la institución), que el sistema excluirá automáticamente de los días disponibles para docencia.

Una vez creado, el período queda disponible de inmediato para el profesorado en sus respectivas secciones.

#### Editar un período existente

Todos los parámetros de un período pueden modificarse después de su creación. Esto permite ajustar fechas si la planificación cambia, corregir errores o actualizar información sin necesidad de eliminar y volver a crear el período. Los cambios se reflejan de inmediato para todos los usuarios.

#### Eliminar un período

El coordinador puede eliminar un período cuando ya no es necesario. Esta acción retira el período de la vista del profesorado. La operación es reversible desde el sistema central de datos si fuera necesario recuperarlo.

#### Ver el detalle de un período

El coordinador puede acceder al detalle completo de cualquier período para revisar toda su configuración: fechas, parámetros, festivos y el estado actual de la recogida de disponibilidad.

---

### Supervisión de la disponibilidad del claustro

Desde el panel de administración, el coordinador puede seleccionar un período y ver la disponibilidad declarada por todos los profesores que han participado en ese período. Esta vista le permite identificar:

- Qué profesores han completado su disponibilidad y cuáles todavía no lo han hecho.
- El desglose de días disponibles, preferidos y bloqueados de cada profesor.

Esta información es esencial para detectar situaciones de baja participación o para hacer seguimiento de la recogida de disponibilidad antes de que cierre la ventana.

El coordinador puede filtrar los profesores para buscar a uno concreto, consultar sus datos individualmente y exportar la información de disponibilidad tanto a nivel de un profesor específico como de todo el período completo.

---

### Supervisión de las asignaciones del claustro

De forma análoga a la disponibilidad, el coordinador puede ver el estado de todas las asignaciones de un período: cuántas están pendientes de revisión, cuántas han sido aceptadas y cuántas rechazadas, y quién es cada profesor en cada caso.

Esta vista permite al coordinador hacer un seguimiento del proceso de confirmación de asignaciones, identificar a los profesores que todavía no han respondido, y conocer los motivos de los rechazos para actuar en consecuencia.

Al igual que con la disponibilidad, puede buscar profesores individualmente y exportar los datos de asignaciones tanto a nivel de profesor como de período completo.

---

### Exportación de datos

La herramienta proporciona funciones de exportación de datos para facilitar el análisis y el trabajo con herramientas externas. Las exportaciones disponibles son:

- **Exportación de disponibilidad por período completo:** descarga la disponibilidad de todos los profesores del período seleccionado en un único archivo.
- **Exportación de disponibilidad de un profesor específico en un período:** descarga la disponibilidad individual de un profesor concreto para un período determinado.
- **Exportación de asignaciones por período completo:** descarga el estado de todas las asignaciones del período seleccionado.
- **Exportación de asignaciones de un profesor específico en un período:** descarga las asignaciones individuales de un profesor concreto para el análisis o seguimiento específico.

Estas exportaciones permiten al equipo de coordinación trabajar con los datos en herramientas de análisis, informes o sistemas de gestión académica fuera de la aplicación.

---

## Integración con Microsoft Teams

Faculty Tasks está diseñada para funcionar de forma nativa tanto en SharePoint como en Microsoft Teams. Cuando un profesor accede a la aplicación desde Teams, la experiencia es exactamente la misma que en SharePoint, pero integrada en el entorno de trabajo que el profesor utiliza para sus comunicaciones diarias.

Esta integración permite que la herramienta esté siempre accesible donde el profesorado ya trabaja, eliminando la fricción de tener que cambiar de plataforma o abrir un navegador adicional para gestionar su disponibilidad o revisar sus asignaciones.

Adicionalmente, la aplicación soporta el concepto de **enlace directo a subpágina**: si alguien comparte un enlace profundo a una sección concreta de la aplicación desde Teams (por ejemplo, directamente a "Mis Asignaciones"), el sistema detecta este contexto y lleva al usuario directamente a esa sección sin pasar por la pantalla de inicio general.

---

## Control de acceso y seguridad del dato

El acceso a cada sección de la aplicación está protegido por la pertenencia del usuario a grupos del directorio institucional. Este control se realiza de forma automática y transparente al usuario en el momento en que abre la aplicación, sin necesidad de que el usuario haga nada.

El sistema verifica si el usuario pertenece al grupo de planificación docente, al grupo de profesores de tareas y al grupo de administradores o coordinadores. En función de ello, la aplicación le muestra únicamente las secciones a las que tiene derecho y le impide el acceso a las demás.

Si al abrir la aplicación el sistema determina que el usuario no pertenece a ninguno de los grupos reconocidos, la aplicación muestra una pantalla informando de que no tiene acceso y guía al usuario para que contacte con el administrador correspondiente.

Todos los datos de la aplicación se almacenan y gestionan en el sistema central de Faculty Hub, y las comunicaciones entre la aplicación y ese sistema están protegidas mediante la autenticación corporativa de la institución, de manera que solo el usuario autenticado puede ver y modificar sus propios datos.

---

## Permisos que requiere la aplicación

Para funcionar correctamente, la aplicación necesita dos tipos de acceso al ecosistema corporativo:

**Acceso al directorio corporativo (Microsoft 365):** para verificar a qué grupos pertenece el usuario y así determinar qué perfil y qué accesos corresponden a cada persona. También se utiliza para obtener la fotografía y los datos básicos del perfil de los supervisores que aparecen en las tareas, de modo que la información sea siempre la oficial del directorio.

**Acceso al sistema de negocio (Faculty Hub API):** para leer y escribir todos los datos operativos de la aplicación — períodos, disponibilidad, asignaciones y tareas — en el sistema central de la institución que actúa como fuente de verdad para toda la gestión académica.

Ambos accesos se ejercen siempre con la identidad del usuario que ha iniciado sesión, de modo que cada persona solo puede ver y modificar sus propios datos y los que le corresponden según su rol.

---

## Funcionalidades planificadas y no activas todavía

La aplicación tiene previsto incorporar en el futuro próximo al menos dos secciones adicionales que ya están en proceso de desarrollo pero no están habilitadas en la versión actual:

**Solicitudes (Requests):** una sección para gestionar solicitudes formales relacionadas con la actividad docente, cuya naturaleza exacta está pendiente de definición funcional completa.

**Evaluaciones (Evaluations):** una sección vinculada a procesos de evaluación docente, cuya integración con el resto de la plataforma está en fase de diseño.

Adicionalmente, existe una ruta denominada "Mis Sesiones" que está contemplada en la arquitectura de la aplicación como una posible sección del módulo de planificación para que el profesor pueda ver el detalle de sus sesiones de docencia confirmadas, pero que tampoco está activa en la versión actual.

La activación de estas secciones requerirá validación funcional y comunicación al colectivo docente cuando estén disponibles.
