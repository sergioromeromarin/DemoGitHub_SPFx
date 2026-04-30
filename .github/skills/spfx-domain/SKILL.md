---
name: spfx-domain
description: "SPFx (SharePoint Framework) domain knowledge for SharePoint Online, Teams, and Viva Connections. Use when analyzing SPFx Web Parts, Extensions, Adaptive Cards, Services, Graph API calls, SharePoint REST API, PnP JS, React hooks, property pane, and lifecycle methods."
---

# Conocimiento de dominio SPFx

Skill de conocimiento para análisis de soluciones SharePoint Framework (SPFx). Lee `spfx-project.yml` para determinar la versión y tecnologías activas del proyecto.

---

## Configuración del proyecto

Antes de analizar, lee `spfx-project.yml` para obtener:
- `spfx_version`: versión SPFx activa (determina APIs disponibles)
- `solution_folder`: carpeta con fuentes SPFx
- `technologies`: lista de tecnologías a detectar
- `cost_weights`: tabla de pesos por tipo de componente

---

## Tipos de componente SPFx

### WebPart

- Archivo principal: `src/webparts/<nombre>/<Nombre>WebPart.ts`
- Manifest: `src/webparts/<nombre>/<Nombre>WebPart.manifest.json`
- Props: interfaz `I<Nombre>WebPartProps`
- Métodos del ciclo de vida: `onInit()`, `render()`, `onDispose()`, `getPropertyPaneConfiguration()`
- Property Pane: configuración de propiedades editables por el usuario en el panel lateral

### Application Customizer (Extension)

- Archivo principal: `src/extensions/<nombre>/<Nombre>ApplicationCustomizer.ts`
- Placeholders: `Top`, `Bottom`
- Eventos: `onInit()`, `onRender()`
- Uso habitual: inyección de HTML global, notificaciones, estilos globales

### Field Customizer (Extension)

- Archivo principal: `src/extensions/<nombre>/<Nombre>FieldCustomizer.ts`
- Eventos: `onInit()`, `onRenderCell()`, `onDisposeCell()`
- Uso habitual: renderizado personalizado de columnas de lista SharePoint

### Command Set (Extension)

- Archivo principal: `src/extensions/<nombre>/<Nombre>CommandSet.ts`
- Comandos: definidos en el manifest (`items`)
- Eventos: `onInit()`, `onListViewUpdated()`, `onExecute()`
- Uso habitual: botones personalizados en barras de comandos de listas/librerías

### Adaptive Card Extension (Viva Connections)

- Archivo principal: `src/adaptiveCardExtensions/<nombre>/<Nombre>AdaptiveCardExtension.ts`
- Card view + Quick view
- Estado: `ICardState`
- Eventos: `onInit()`, `renderCard()`, `renderQuickView()`

### Service (SPFx Service)

- Implementa `ServiceKey.create<I<Nombre>Service>()`
- Registrado en `onInit()` del WebPart
- Responsabilidad: encapsula lógica de acceso a datos (Graph, SharePoint REST, PnP)

---

## Estructura de proyecto SPFx

```
spfx/
├── src/
│   ├── webparts/
│   │   └── <nombre>/
│   │       ├── <Nombre>WebPart.ts        ← Clase principal
│   │       ├── <Nombre>WebPart.manifest.json
│   │       └── components/
│   │           ├── <Nombre>.tsx          ← Componente React
│   │           └── <Nombre>.module.scss
│   ├── extensions/
│   │   └── <nombre>/
│   │       └── <Nombre>ApplicationCustomizer.ts
│   └── adaptiveCardExtensions/
│       └── <nombre>/
│           └── <Nombre>AdaptiveCardExtension.ts
├── config/
│   ├── config.json                       ← Bundles y externals
│   ├── package-solution.json             ← Metadata de la solución (.sppkg)
│   └── deploy-azure-storage.json
├── package.json
└── gulpfile.js
```

---

## Lifecycle hooks — detalle por tipo

### WebPart lifecycle

| Método | Cuándo se llama | Responsabilidad habitual |
|--------|-----------------|-------------------------|
| `onInit()` | Una vez al cargar la página | Inicializar servicios, obtener contexto, configurar MSGraphClientFactory |
| `render()` | Cada vez que cambia una prop | Renderizar el HTML/React del web part |
| `onPropertyPaneFieldChanged()` | Al cambiar una prop en el panel | Actualizar estado derivado |
| `onDispose()` | Al desmontar el web part | Limpiar listeners, instancias |

### Property Pane

```typescript
// Estructura típica del property pane
getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
  return {
    pages: [{
      groups: [{
        groupFields: [
          PropertyPaneTextField('title', { label: 'Título' }),
          PropertyPaneToggle('showFilter', { label: 'Mostrar filtro' }),
          PropertyPaneDropdown('listName', { label: 'Lista', options: [...] })
        ]
      }]
    }]
  };
}
```

---

## Integración con Microsoft Graph API

### Patrones de acceso

```typescript
// Desde onInit() o render():
const graphClient = await this.context.msGraphClientFactory.getClient('3');
const response = await graphClient.api('/me').get();
```

### Scopes de permisos habituales (documentar en análisis)

| Scope | Operación |
|-------|-----------|
| `User.Read` | Perfil del usuario actual |
| `User.ReadBasic.All` | Directorio de usuarios |
| `Sites.Read.All` | Lectura de sitios SharePoint |
| `Sites.ReadWrite.All` | Escritura en sitios SharePoint |
| `Files.Read.All` | Lectura de archivos |
| `Mail.Read` | Lectura de correo |
| `Calendars.Read` | Lectura de calendario |
| `Groups.Read.All` | Lectura de grupos Microsoft 365 |

Los scopes se declaran en `config/package-solution.json` bajo `webApiPermissionRequests`.

---

## Integración con SharePoint REST API

### Endpoints habituales

| Operación | Endpoint |
|-----------|---------|
| Lista de listas | `/_api/web/lists` |
| Items de lista | `/_api/web/lists/getbytitle('{name}')/items` |
| Item por ID | `/_api/web/lists/getbytitle('{name}')/items({id})` |
| Crear item | POST `/_api/web/lists/getbytitle('{name}')/items` |
| Actualizar item | PATCH `/_api/web/lists/getbytitle('{name}')/items({id})` |
| Eliminar item | DELETE `/_api/web/lists/getbytitle('{name}')/items({id})` |
| Perfil usuario | `/_api/SP.UserProfiles.PeopleManager/GetMyProperties` |
| Búsqueda | `/_api/search/query?querytext=...` |

```typescript
// Acceso vía SPHttpClient
const response = await this.context.spHttpClient.get(
  `${this.context.pageContext.web.absoluteUrl}/_api/web/lists`,
  SPHttpClient.configurations.v1
);
```

---

## PnP JS

```typescript
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

// Inicialización en onInit()
this._sp = spfi().using(SPFx(this.context));

// Uso
const items = await this._sp.web.lists.getByTitle("MiLista").items();
```

---

## React en SPFx — patrones habituales

### Hooks de estado

```typescript
// Estado local
const [items, setItems] = React.useState<IItem[]>([]);
const [isLoading, setIsLoading] = React.useState<boolean>(true);
const [error, setError] = React.useState<string | undefined>(undefined);

// Efecto de carga inicial
React.useEffect(() => {
  loadData().catch(e => setError(e.message));
}, [props.listName]);
```

### Props y contexto SPFx pasados al componente React

```typescript
export interface I<Nombre>Props {
  // Props de configuración (del property pane)
  title: string;
  listName: string;
  // Contexto SPFx (para acceso a APIs)
  context: WebPartContext;
  // Instancia de Graph/PnP (inyectada desde el WebPart)
  graphClient?: MSGraphClientV3;
}
```

---

## Integración con Microsoft Teams

- Detectar contexto Teams: `this.context.sdks.microsoftTeams?.context`
- Deep links: `microsoftTeams.executeDeepLink()`
- Temas Teams: adaptar CSS según `this.context.sdks.microsoftTeams?.context.theme`

---

## Integración con Viva Connections (ACE)

- Estado de la card: `ICardState` (definido en el componente ACE)
- Card view: `BaseBasicCardView` o `BasePrimaryTextCardView`
- Quick view: abre panel lateral con Adaptive Card JSON
- Datos: cargados en `onInit()`, actualizados con `setState()`

---

## package-solution.json — campos clave

| Campo | Descripción |
|-------|-------------|
| `id` | GUID único de la solución |
| `name` | Nombre visible en el App Catalog |
| `version` | Versión de la solución (semver) |
| `isDomainIsolated` | `true` para isolated web parts (iFrame) |
| `webApiPermissionRequests` | Lista de scopes Graph/AAD requeridos |
| `skipFeatureDeployment` | `true` para tenant-wide deployment |

---

## Regla de completitud

La unidad de análisis técnico es **cada componente activo** en `src/`:
- Cada WebPart → documentar lifecycle + props + API calls + state
- Cada Extension → documentar eventos + placeholders + DOM manipulations
- Cada Service → documentar métodos públicos + APIs que encapsula

**Regla anti-abreviación**: no resumir múltiples métodos React en un párrafo genérico. Cada hook `useEffect`, `useState`, método del ciclo de vida y llamada API se describe individualmente con propósito, entradas y salidas.

---

## Estandar de exhaustividad SPFx

Cuando el pipeline se ejecute en modo exhaustivo:

- Funcional: objetivo de profundidad >= 5000 palabras, lenguaje natural de negocio, cobertura por rol y ciclo de negocio completo.
- Tecnico: objetivo de profundidad >= 6000 palabras, inventario completo de componentes activos, stores, hooks, servicios y permisos.
- Riesgos: incluir matriz de riesgos tecnicos con mitigaciones (recomendado: minimo 6 riesgos).
- Prohibido entregar analisis superficial: no se aceptan textos breves que omitan modulos activos o dependencias clave.

Validar contra `.github/definitions/exhaustive-analysis.yml` cuando el archivo exista en el repositorio del framework.
