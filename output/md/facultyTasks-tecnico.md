# Documentación Técnica — Faculty Tasks

**Análisis técnico exhaustivo** — 2026-04-28

---

## Identificación del componente

| Campo | Valor |
|---|---|
| Nombre del WebPart | FacultyTasksWebPart |
| Alias de manifest | FacultyTasksWebPart |
| ID de manifest | 809de794-ce35-44f7-b6f7-b45f145c15ba |
| Versión SPFx | 1.21.1 |
| Versión React | 17.0.1 |
| skipFeatureDeployment | true |
| isDomainIsolated | false |
| supportedHosts en manifest | [] (NO DECLARADO) |

La ausencia de `supportedHosts` declarados en el manifest del WebPart implica que no se restringe el entorno de publicación a nivel de manifiesto. La compatibilidad con SharePoint Online y Microsoft Teams se gestiona en tiempo de ejecución mediante detección del contexto `sdks.microsoftTeams`.

---

## Stack tecnológico

| Tecnología | Versión observada | Uso en la solución |
|---|---|---|
| SPFx | 1.21.1 | Framework base de la solución |
| React | 17.0.1 | Capa de presentación |
| Fluent UI | 8.x | Componentes de interfaz de usuario |
| Zustand | — | Gestión de estado global y de dominio |
| react-router-dom | v6 | Enrutado interno con HashRouter |
| dayjs | — | Cálculo de semanas ISO (isoWeek plugin) |
| Microsoft Graph SDK | vía MSGraphClientFactory | Consultas a Microsoft Graph |
| SPHttpClient / AadHttpClient | SPFx | Llamadas HTTP autenticadas a API propia |
| Microsoft Teams JS SDK | v2 | Detección e inicialización de contexto Teams |

---

## Estructura de carpetas del proyecto

```
src/
├── webparts/
│   └── facultyTasks/
│       ├── FacultyTasksWebPart.ts          ← Clase WebPart principal
│       ├── FacultyTasksWebPart.manifest.json
│       └── components/
│           ├── FacultyTasks.tsx            ← Root React, routing y layout
│           └── ...
├── services/
│   ├── FacultyTasksService.ts              ← Servicio principal de negocio
│   └── GraphService.ts                     ← Servicio de Microsoft Graph
├── store/
│   ├── useAppStore.ts                      ← Estado global SPFx
│   ├── useTasksStore.ts                    ← Estado del módulo Tasks
│   └── useAdminPlanningStore.ts            ← Estado del módulo Admin Planning
├── hooks/
│   ├── useInitializeUser.ts                ← Inicialización de identidad y roles
│   ├── useMyAssignments.ts                 ← Hook de asignaciones del profesor
│   └── useWeeklyAvailability.ts            ← Hook de disponibilidad semanal
├── types/
│   ├── Assignment.ts                       ← Tipos de asignación y enums de estado
│   ├── AssignmentDTO.ts                    ← DTO de asignación del backend
│   ├── Availability.ts                     ← Tipo de disponibilidad agregada
│   ├── AvailabilityDTO.ts                  ← DTO de disponibilidad del backend
│   ├── PeriodDTO.ts                        ← DTO de período del backend
│   ├── TaskDTO.ts                          ← DTO de tarea del backend
│   ├── Task.ts                             ← Tipo de tarea interno
│   ├── UserDTO.ts                          ← DTO de usuario de Graph
│   ├── UserPeriodDTO.ts                    ← DTO de período para usuario
│   ├── UpdatedAvailabilityDTO.ts           ← Payload de actualización masiva
│   ├── UseWeeklyAvailability.ts            ← Tipos del hook de disponibilidad
│   └── UseMyAssignments.ts                 ← Tipos del hook de asignaciones
├── utils/
│   ├── Constants.ts                        ← Rutas, endpoints, enums y constantes
│   ├── Utils.ts                            ← Funciones utilitarias
│   ├── MockData.ts                         ← Datos de prueba (entorno local)
│   └── MockDataV2.ts                       ← Datos de prueba v2 (entorno local)
└── appSettings.d.ts                        ← Declaración de tipos de configuración
```

---

## Ciclo de vida del WebPart (FacultyTasksWebPart)

### onInit()

Es el método más crítico del ciclo de vida. Se ejecuta una única vez cuando el WebPart se carga en la página y es responsable de:

1. **Inyección del contexto SPFx en el estado global:** lee `this.context.pageContext.user.loginName` (userId), la cultura `this.context.pageContext.cultureInfo.currentCultureName`, la URL de la web `this.context.pageContext.web.absoluteUrl`, la referencia a `MSGraphClientFactory` y la referencia a `SPHttpClient`, y los persiste en `useAppStore` para que estén disponibles en toda la aplicación sin necesidad de prop drilling.

2. **Detección de contexto Microsoft Teams:** evalúa si `this.context.sdks.microsoftTeams` está disponible. Si lo está, establece `hasTeamsContext: true` en el estado global e inicializa el SDK de Teams (`microsoftTeams.app.initialize()`). Esta inicialización es necesaria para que el SDK de Teams esté listo antes de cualquier interacción con él.

3. **Resolución de roles:** aunque el arranque de la resolución de roles se delega al hook `useInitializeUser` que se ejecuta en el componente React raíz, `onInit` prepara el entorno (serviceScope) necesario para que los servicios puedan consumir las dependencias SPFx.

4. **Registro del serviceScope:** el `serviceScope` completo se persiste en `useAppStore` para que todos los servicios puedan ser consumidos desde cualquier punto de la aplicación mediante `serviceScope.consume(ServiceKey)`.

### render()

Monta el árbol React completo en el `domElement` del WebPart usando `ReactDom.render()`. El componente raíz es `FacultyTasks`, al que no se le pasan props directamente ya que todo el estado relevante está en los stores de Zustand accesibles globalmente.

### onThemeChanged(currentTheme)

Recibe el objeto de tema del host (SharePoint o Teams) y propaga las variables de color semánticas del tema como variables CSS sobre el `domElement`. Esto garantiza que los componentes Fluent UI adapten sus colores al tema activo sin necesidad de configuración manual.

### onDispose()

Desmonta el árbol React limpiamente con `ReactDom.unmountComponentAtNode(this.domElement)` para evitar memory leaks.

### getPropertyPaneConfiguration()

Devuelve la configuración del panel de propiedades del WebPart. En la versión actual, el property pane no expone campos funcionales activos al editor de páginas. La configuración de la aplicación (URL del backend, identificadores de grupos) se realiza mediante el archivo `appSettings` compilado, no a través del property pane.

---

## Componente React raíz: FacultyTasks

`FacultyTasks` es el componente de nivel superior del árbol React. Sus responsabilidades son:

1. **Inicialización de identidad:** invoca el hook `useInitializeUser` que dispara la verificación de grupos del usuario contra Microsoft Graph y actualiza el estado global con los flags `isAdmin`, `isUser`, `isTaskUser` e `isLoading`.

2. **Control de carga:** mientras `isLoading` sea `true`, renderiza un spinner de pantalla completa para evitar que el usuario vea contenido parcial o rutas sin autorizar.

3. **Layout global:** una vez completada la carga, renderiza el layout fijo que engloba todas las rutas: cabecera con el nombre del usuario y su foto de perfil, menú de navegación lateral dependiente del rol, área de contenido principal y pie de página.

4. **Enrutado:** implementa un `HashRouter` de react-router-dom v6. El uso de HashRouter (rutas basadas en `#`) es necesario en el contexto SPFx porque la URL real de la página es controlada por SharePoint y no puede modificarse con el History API de forma fiable en todos los entornos.

5. **Gestión de cambios sin guardar:** monitoriza el flag `hasUnsavedChanges` del estado global. Si el usuario intenta navegar a otra sección con cambios pendientes, muestra un diálogo de confirmación.

6. **Integración con Teams:** si `hasTeamsContext` es verdadero, invoca `CheckRedirection` que analiza el `subPageId` del contexto Teams. Si existe un subPageId válido, navega programáticamente a la ruta correspondiente dentro del HashRouter, habilitando así la navegación profunda desde enlaces compartidos en Teams.

---

## Enrutado y control de acceso

### Tabla de rutas

| Ruta | Componente destino | Guard | Roles autorizados |
|---|---|---|---|
| `/` | DefaultRedirect | Ninguno | Todos (redirige según rol) |
| `/planning/*` | Planning (módulo) | ProtectedRoute | Roles.user |
| `/planning/myavailability` | MyAvailability | ProtectedRoute | Roles.user |
| `/planning/myassignments` | MyAssignments | ProtectedRoute | Roles.user |
| `/tasks/*` | Tasks (módulo) | ProtectedRoute | Roles.taskUser |
| `/tasks/mypendingtasks` | MyPendingTasks | ProtectedRoute | Roles.taskUser |
| `/admin/*` | Admin (módulo) | ProtectedRoute | Roles.admin |
| `/admin/adminplanning` | AdminPlanning | ProtectedRoute | Roles.admin |
| `/admin/admintasks` | AdminTasks | ProtectedRoute | Roles.admin |
| `/no-access` | NoAccess | Ninguno | Todos |

### Componente ProtectedRoute

`ProtectedRoute` recibe el rol requerido y comprueba el flag correspondiente en `useAppStore`. Si el usuario no tiene el rol necesario, redirige a `/no-access`. Si lo tiene, renderiza el componente hijo. No hay lógica de redirección parcial: el acceso es binario (autorizado o denegado).

### Lógica de DefaultRedirect

Al acceder a la raíz (`/`), la aplicación evalúa los roles disponibles del usuario y redirige automáticamente al módulo principal correspondiente:
- Si `isUser`: redirige a `/planning/myavailability`.
- Si solo `isTaskUser`: redirige a `/tasks/mypendingtasks`.
- Si solo `isAdmin`: redirige a `/admin/adminplanning`.
- Si ninguno: redirige a `/no-access`.

---

## Gestión de estado (Zustand)

### useAppStore — Estado global

Gestiona el contexto técnico y de identidad compartido por toda la aplicación.

| Campo | Tipo | Descripción |
|---|---|---|
| serviceScope | ServiceScope | Scope SPFx para consumo de servicios |
| msGraphClientFactory | MSGraphClientFactory | Factoría de clientes Graph |
| spHttpClient | SPHttpClient | Cliente HTTP SPFx estándar |
| hasTeamsContext | boolean | Si la app está en host Teams |
| userId | string | Login name del usuario autenticado |
| isAdmin | boolean | Usuario pertenece al grupo admin |
| isUser | boolean | Usuario pertenece al grupo de planificación |
| isTaskUser | boolean | Usuario pertenece al grupo de tareas |
| isLoading | boolean | Carga de identidad en curso |
| hasUnsavedChanges | boolean | Hay cambios sin guardar en la vista actual |
| currentOperation | Operations \| null | Operación en curso (para feedback de UI) |

### useTasksStore — Estado del módulo Tasks

Gestiona el ciclo de vida de las tareas del usuario.

| Campo / Acción | Descripción |
|---|---|
| tasks | Array de tareas cargadas del backend |
| isLoaded | Flag de carga completada |
| loadTasks(serviceScope) | Llama a `FacultyTasksService.getMyTasks()`, mapea TaskDTO → Task y persiste en store |
| Enriquecimiento de supervisores | Tras la carga de tareas, para cada tarea con supervisor, llama a `GraphService` para obtener el nombre y la foto del supervisor. Este enriquecimiento es progresivo y asíncrono: las tareas se muestran primero con el identificador del supervisor y se actualizan con nombre/foto conforme Graph responde |
| Ordenación por fecha | Las tareas se ordenan por `dueDate` ascendente para que las más urgentes aparezcan primero |

### useAdminPlanningStore — Estado del módulo Admin Planning

Gestiona el CRUD de períodos y el estado de los paneles modales del panel de administración.

| Campo / Acción | Descripción |
|---|---|
| periods | Array de períodos cargados |
| selectedPeriods | Array de períodos seleccionados en la tabla (single selection) |
| isDataLoaded | Flag de carga completada |
| isModalOpen_PeriodForm | Controla visibilidad del formulario de alta/edición de período |
| isModalOpen_DetailPeriod | Controla visibilidad del panel de detalle de período |
| isDialogHidden_DeletePeriod | Controla visibilidad del diálogo de confirmación de eliminación |
| isModalOpen_FacultyAvailabilities | Controla visibilidad del panel de disponibilidades del claustro |
| isModalOpen_FacultyAssignments | Controla visibilidad del panel de asignaciones del claustro |
| loadPeriods(serviceScope) | Carga todos los períodos vía `getPeriods()` |
| createPeriod(serviceScope, data) | Crea período en backend y antepone el nuevo objeto al array local |
| updatePeriod(serviceScope, data, periodId) | Actualiza período en backend y reemplaza en array local por índice |
| deletePeriod(serviceScope, periodId) | Elimina período en backend y filtra el array local |

---

## Hook useInitializeUser

Este hook es la pieza central del arranque de la aplicación. Se ejecuta en el montaje de `FacultyTasks` y:

1. Recupera `serviceScope` y `userId` de `useAppStore`.
2. Consume `GraphService` desde el serviceScope.
3. Invoca `GraphService.checkGroups(userId)`, que llama al endpoint `POST /me/checkMemberGroups` de Microsoft Graph con los tres identificadores de grupo configurados en `appSettings` (AdminGroupId, UserGroupId, TaskUserGroupId).
4. Graph devuelve el subconjunto de los GUIDs proporcionados a los que pertenece el usuario.
5. El hook evalúa la respuesta y establece `isAdmin`, `isUser`, `isTaskUser` en `useAppStore`.
6. Establece `isLoading: false` para desbloquear el renderizado de la aplicación.

Si la llamada a Graph falla, `isLoading` se establece a `false` igualmente para evitar que la aplicación quede bloqueada en el loader, pero los flags de rol quedan a `false`, llevando al usuario a la pantalla de no acceso.

---

## Hook useWeeklyAvailability

Hook de orquestación del módulo "Mi Disponibilidad". Responsabilidades:

1. **Carga de períodos disponibles:** invoca `FacultyTasksService.getPeriodsForAvailability()` que devuelve los períodos cuya ventana de disponibilidad está activa o pendiente según la configuración del backend. La selección inicial recae automáticamente en el primer período de la lista.

2. **Carga de disponibilidad del período seleccionado:** invoca `FacultyTasksService.getMyAvailability(period)`. El backend devuelve un array de `DateAvailabilityDTO` con la fecha y el estado numérico (0=available, 1=preferred, 2=blocked) de cada jornada. El servicio mapea estos estados al enum `AvailabilityStatus` tipado. El resultado se estructura como un objeto `Availability` que agrupa las fechas por período e incluye el indicador `openPeriod` (calculado comparando la fecha actual con `availabilityStartDate` y `availabilityEndDate`).

3. **Edición puntual de un día:** modifica el estado de una jornada concreta en el array local. Actualiza `hasUnsavedChanges` en `useAppStore` si hay cambios pendientes de persistir.

4. **Operaciones masivas (bulk):** implementa las acciones de `AvailabilityBulkActions`:
   - `allDayPreferred` / `allDayBlocked` / `allDayAvailable`: establece el estado de todos los días de una semana.
   - `replyDayToAllDaysWeek`: copia el estado de una jornada a todos los días de su semana ISO (calculada con `dayjs.isoWeek()`).
   - `replyDayToMonth`: copia el estado a todos los días del mismo mes.
   - `replyDayToPeriod`: copia el estado a todos los días hábiles del período completo (excluyendo festivos y fines de semana si corresponde).

5. **Guardado:** invoca `FacultyTasksService.updateMyAvailability(updatedAvailabilities)` con el payload `UpdatedAvailabilityDTO[]` (solo los días modificados). Si la respuesta es HTTP 200, resetea `hasUnsavedChanges` a `false`.

---

## Hook useMyAssignments

Hook de orquestación del módulo "Mis Asignaciones". Responsabilidades:

1. **Carga de períodos para asignaciones:** invoca `FacultyTasksService.getPeriodsForAssignment()`. La lista de períodos disponibles para la revisión de asignaciones puede diferir de la lista de disponibilidad, ya que cada lista está filtrada por su propia ventana de fechas en el backend.

2. **Verificación de prerequisito:** al seleccionar un período, invoca `FacultyTasksService.checkIsAllAvailable(periodId)`. Si el backend responde `false`, el hook bloquea la carga de asignaciones y expone un flag que el componente de UI utiliza para mostrar el mensaje de "complete primero su disponibilidad".

3. **Carga de asignaciones:** si el prerequisito se cumple, invoca `FacultyTasksService.getMyAssignments(period)`. El servicio recibe un array de `AssignmentDTO` y los mapea a `Assignment` tipados, convirtiendo:
   - El campo `status` numérico (0=pending, 1=accepted, 2=rejected) al enum `AssignmentStatus`.
   - El campo `compatibilityStatus` numérico (0=compatible, 1=conflicted, 2=unknown) al enum `AvailabilityCompatibility`.
   - Los campos de fecha de string ISO a objetos `Date`.

4. **Aceptación de asignación:** invoca `FacultyTasksService.acceptMyAssignment(assignmentId, sessionStructureQuestions, additionalInfo)`. El payload enviado al backend es `{ acceptAssignmentSessionStructure, acceptAssignmentAditionalInfo }`. Si la respuesta es HTTP 200, actualiza el estado local de la asignación a `accepted`.

5. **Rechazo de asignación:** invoca `FacultyTasksService.rejectMyAssignment(assignmentId, rejectionReason)`. El payload enviado al backend es `{ rejectAssignmentReason }`. Si la respuesta es HTTP 200, actualiza el estado local a `rejected` y persiste el motivo.

---

## Servicio FacultyTasksService — Inventario completo de métodos

Este servicio encapsula todas las comunicaciones con el backend REST de Faculty Hub. Utiliza `AadHttpClient` en producción (autenticado con el token AAD del usuario) e `HttpClient` estándar en entorno local de desarrollo (controlado por el flag `Local` de `appSettings`).

### Métodos de disponibilidad (profesor)

| Método | HTTP | Endpoint | Descripción |
|---|---|---|---|
| `getMyAvailability(period)` | GET | `/api/Availabilities/my-availabities-by-period/{periodId}` | Obtiene la disponibilidad del usuario autenticado para el período indicado. Devuelve el objeto `Availability` mapeado. |
| `updateMyAvailability(updatedAvailabilities)` | PUT | `/api/Availabilities/update-status` | Persiste los cambios de disponibilidad. Body: array de `UpdatedAvailabilityDTO`. Devuelve el código HTTP de respuesta. |
| `getPeriodsForAvailability()` | GET | `/api/Periods/for-availability` | Obtiene los períodos activos para disponibilidad. Devuelve array de `Period` mapeado desde `UserPeriodDTO`. |
| `checkIsAllAvailable(periodId)` | GET | `/api/Availabilities/check-all-available/{periodId}` | Verifica si el usuario ha completado toda su disponibilidad para el período. Devuelve `boolean`. |

### Métodos de asignaciones (profesor)

| Método | HTTP | Endpoint | Descripción |
|---|---|---|---|
| `getPeriodsForAssignment()` | GET | `/api/Periods/for-assignments` | Obtiene los períodos activos para revisión de asignaciones. Devuelve array de `Period`. |
| `getMyAssignments(period)` | GET | `/api/Assignments/my-assignments-by-period/{periodId}` | Obtiene las asignaciones del usuario para el período. Mapea `AssignmentDTO` → `Assignment` con conversión de enums. HTTP 404 devuelve `undefined` (sin asignaciones, no error). |
| `acceptMyAssignment(assignmentId, sessionStructureQuestions, additionalInfo)` | PUT | `/api/Assignments/accept-assignment/{assignmentId}` | Acepta una asignación. Body: `{ acceptAssignmentSessionStructure, acceptAssignmentAditionalInfo }`. Devuelve `boolean`. |
| `rejectMyAssignment(assignmentId, rejectionReason)` | PUT | `/api/Assignments/reject-assignment/{assignmentId}` | Rechaza una asignación. Body: `{ rejectAssignmentReason }`. Devuelve `boolean`. |

### Métodos de períodos (admin)

| Método | HTTP | Endpoint | Descripción |
|---|---|---|---|
| `getPeriods()` | GET | `/api/Periods` | Obtiene todos los períodos (vista admin). Devuelve array de `Period` mapeado desde `PeriodDTO` (incluye `hoursPerDay`, `gapsCoefficient`, `hasAvailabilities`). |
| `createPeriod(periodDataForm)` | POST | `/api/Periods` | Crea un nuevo período. Body: campos del `PeriodDataForm` mapeados a Pascal Case. Las cadenas `Course` y `Name` se truncan a 100 caracteres. `Holidays` se envía como array de strings de fecha. HTTP 201 devuelve el `PeriodDTO` creado. |
| `updatePeriod(periodDataForm, periodId)` | PUT | `/api/Periods/{periodId}` | Actualiza un período existente. Mismo body que create. Devuelve `boolean`. |
| `deletePeriod(periodId)` | DELETE | `/api/Periods/{periodId}` | Elimina (baja lógica) un período. Devuelve `boolean`. |

### Métodos de tareas

| Método | HTTP | Endpoint | Descripción |
|---|---|---|---|
| `getMyTasks()` | GET | `/api/Tasks/my-tasks` | Obtiene las tareas del usuario autenticado. Devuelve array de `Task` mapeado desde `TaskDTO`. |

### Métodos de administración — Disponibilidad

| Método | HTTP | Endpoint | Descripción |
|---|---|---|---|
| `getUniqueUsersByPeriod_Availability(periodId)` | GET | `/api/Availabilities/period/{periodId}/unique-users` | Lista de usuarios únicos con disponibilidad en el período. |
| `getUsersWithAvailability(periodId)` | GET | `/api/Availabilities/user-with-availability` | Usuarios que tienen alguna disponibilidad registrada. |
| `exportAvailabilitiesByUserAndPeriod(userId, periodId)` | GET | `/api/Availabilities/export/user/{userId}/period/{periodId}` | Exportación de disponibilidad de un usuario en un período. |
| `exportAvailabilitiesByPeriod(periodId)` | GET | `/api/Availabilities/export/period/{periodId}` | Exportación de disponibilidad completa de un período. |

### Métodos de administración — Asignaciones

| Método | HTTP | Endpoint | Descripción |
|---|---|---|---|
| `getUniqueUsersByPeriod_Assignments(periodId)` | GET | `/api/Assignments/period/{periodId}/unique-users` | Lista de usuarios únicos con asignaciones en el período. |
| `getUsersWithAssignment(periodId)` | GET | `/api/Assignments/user-with-assignment` | Usuarios que tienen alguna asignación registrada. |
| `exportAssignmentsByUserAndPeriod(userId, periodId)` | GET | `/api/Assignments/export/user/{userId}/period/{periodId}` | Exportación de asignaciones de un usuario en un período. |
| `exportAssignmentsByPeriod(periodId)` | GET | `/api/Assignments/export/period/{periodId}` | Exportación de asignaciones completas de un período. |

---

## Servicio GraphService

Encapsula las tres consultas a Microsoft Graph API usadas en la solución. Utiliza `MSGraphClientFactory` obtenida del serviceScope.

| Método | Endpoint Graph | Descripción |
|---|---|---|
| `checkGroups(userId, groupIds[])` | `POST /me/checkMemberGroups` | Verifica pertenencia del usuario autenticado a los grupos indicados. Devuelve el subconjunto de GUIDs al que pertenece el usuario. Los IDs de grupo (AdminGroupId, UserGroupId, TaskUserGroupId) se leen de `appSettings`. |
| `getUserByEmail(email)` | `GET /users/{email}` | Obtiene datos básicos de un usuario por su email. Se usa para obtener el nombre visible del supervisor de las tareas. Devuelve `UserDTO`. |
| `getUserPhotoByEmail(email)` | `GET /users/{email}/photo/$value` | Obtiene la fotografía de perfil del usuario como blob. Se convierte a URL de objeto para uso en `<img>`. Se usa para mostrar la foto del supervisor en las tareas. |

---

## Modelo de tipos y DTOs

### Tipos internos (dominio)

**Period:** representa un período académico con todos sus campos de fecha ya convertidos a `Date`. Incluye `hoursPerDay`, `gapsCoefficient`, `hasAvailabilities` y array de `Holiday`.

**Availability:** agregación de disponibilidades de un usuario para un período. Contiene el `periodId`, `periodName`, `course`, el flag `openPeriod` y el array `dates` de objetos con `id`, `date` (Date), `status` (AvailabilityStatus) y `week` (número de semana ISO calculado con dayjs).

**Assignment:** asignación docente con `status` (AssignmentStatus enum: pending/accepted/rejected), `compatibilityStatus` (AvailabilityCompatibility enum: compatible/conflicted/unknown) y todos los campos de detalle de la asignación.

**Task:** tarea operativa con `type`, `description`, `status` (numérico: 0=pending, 1=completed, 2=expired), `url`, `dueDate` (Date opcional), `supervisor` (identificador) e `imageUrl` (URL de foto, enriquecida progresivamente por GraphService).

### DTOs del backend

Los DTOs representan exactamente el contrato JSON que devuelve o recibe el backend. Las diferencias clave respecto a los tipos internos son:

- Los campos de fecha en los DTOs son strings ISO; los tipos internos los convierten a `Date`.
- Los campos `status` y `compatibilityStatus` en los DTOs son numéricos; los tipos internos los mapean a enums de string.
- `PeriodDTO` incluye `hoursPerDay` y `gapsCoefficient` (que `UserPeriodDTO` para el profesor no necesita).

---

## Estrategia de autenticación HTTP

La solución soporta dos modos de ejecución controlados por el flag `Local` de `appSettings`:

**Modo producción (`Local: false`):** todas las llamadas al backend se realizan a través de `AadHttpClient`, instanciado mediante `AadHttpClientFactory.getClient(AzureAd.ApplicationUri)`. Esto añade automáticamente el token Bearer del usuario autenticado en la cabecera de cada petición, delegando en Azure AD la autenticación y autorización. El `ApplicationUri` es `api://c051e93e-10bb-4416-a05d-651ac7dd44f9`.

**Modo desarrollo local (`Local: true`):** las llamadas se realizan a través de `HttpClient` estándar (sin autenticación AAD). Esto permite ejecutar la solución localmente contra un backend de desarrollo sin necesidad de configurar el flujo AAD completo.

---

## Configuración de despliegue (appSettings y package-solution)

La configuración en tiempo de ejecución se inyecta a través del archivo `appSettings` (referenciado como módulo en TypeScript, declarado en `appSettings.d.ts`). Los campos configurables son:

| Campo | Descripción |
|---|---|
| FacultyTasksAPIURL | URL base del backend REST: `https://ie-fhub-dev-planni-api-svc-001.azurewebsites.net` |
| Local | Flag boolean para cambiar entre modo local y producción |
| AzureAd.ApplicationUri | URI de la aplicación AAD para AadHttpClient: `api://c051e93e-10bb-4416-a05d-651ac7dd44f9` |
| AdminGroupId | GUID del grupo Azure AD de administradores: `e1b2f3a2-dee7-43f2-b3fc-bd5389e438a9` |
| UserGroupId | GUID del grupo Azure AD de profesores de planificación: `15362c89-cf9f-4854-8627-a26a8cf5b35d` |
| TaskUserGroupId | GUID del grupo Azure AD de profesores de tareas: `15362c89-cf9f-4854-8627-a26a8cf5b35d` |

**Observación crítica de configuración:** `UserGroupId` y `TaskUserGroupId` comparten el mismo GUID (`15362c89-cf9f-4854-8627-a26a8cf5b35d`) en la configuración actual. Esto significa que en la práctica los roles `user` y `taskUser` se otorgan simultáneamente a las mismas personas. Si la intención del negocio es separar ambos perfiles, esta configuración requiere revisión con la administración del tenant.

---

## Permisos declarados en package-solution

| Recurso | Scope | Justificación |
|---|---|---|
| Microsoft Graph | Group.Read.All | Necesario para `POST /me/checkMemberGroups` (verificación de grupos del usuario) |
| Microsoft Graph | ProfilePhoto.Read.All | Necesario para `GET /users/{email}/photo/$value` (foto de perfil de supervisores) |
| IE-FacultyHubWebAPI-Dev | user_impersonation | Necesario para que AadHttpClient obtenga tokens de acceso a la API de negocio en nombre del usuario |

Todos los permisos requieren aprobación del administrador del tenant en el portal de SharePoint admin antes de que el WebPart pueda funcionar en producción.

---

## Riesgos técnicos identificados

| Riesgo | Descripción | Impacto | Mitigación recomendada |
|---|---|---|---|
| UserGroupId = TaskUserGroupId | Ambos roles comparten GUID en appSettings | Imposibilidad de tener usuarios solo con rol taskUser sin también tener rol user | Revisar con el administrador del tenant si la separación de grupos es necesaria |
| supportedHosts vacío en manifest | El WebPart no declara hosts objetivo en el manifest | Posibles problemas de visibilidad o publicación en entornos específicos | Declarar explícitamente `["SharePointWebPart", "TeamsPersonalApp", "TeamsTab"]` según el entorno objetivo |
| Sin modelo de error unificado en UI | Los servicios devuelven `undefined` o `false` en error; no hay componente de error genérico | El usuario puede ver pantallas vacías sin explicación en caso de error de API | Implementar un boundary de error React y mensajes de feedback al usuario |
| Contrato OpenAPI del backend no disponible | Los DTOs del frontend son inferidos del consumo observado | Si el backend cambia un campo, el frontend puede fallar silenciosamente | Generar y versionar el contrato OpenAPI del backend y usarlo como fuente de tipos |
| Sin política de reintentos HTTP | Las llamadas al backend no implementan reintentos en caso de error transitorio | Un error de red puntual puede dejar la aplicación en estado de carga fallida | Implementar reintentos con backoff exponencial para llamadas GET no críticas |
| Rutas parcialmente implementadas | Paths para MySessions, Requests y Evaluations definidos en constantes pero sin componentes activos | Los deep links a estas rutas no funcionarán hasta que se activen | Eliminar las constantes de rutas no activas o añadir un componente placeholder que informe al usuario |

---

## Información no disponible para análisis completo

| Elemento | Marcador | Impacto en el análisis |
|---|---|---|
| Contrato formal OpenAPI/Swagger del backend IE-FacultyHubWebAPI-Dev | NO PROPORCIONADO | No es posible validar cobertura completa de campos ni comportamiento de errores HTTP distintos de 200/404 |
| Política de reintentos y timeouts HTTP configurados en el backend | NO PROPORCIONADO | No se puede evaluar resiliencia de la solución ante degradación del servicio |
| Hosts soportados declarados en manifest del WebPart | NO DECLARADO | Requiere validación manual en los entornos de publicación previstos |
| Componentes de UI (React/TSX) internos de cada módulo | NO ANALIZADO en este documento | El análisis de componentes de presentación individuales requeriría un análisis adicional de nivel de componente |
