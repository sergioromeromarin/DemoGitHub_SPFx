---
name: html-bootstrap
description: "HTML Bootstrap 5 generation patterns for domain documentation. Use when generating HTML from Markdown, rendering functional or technical documentation as HTML, creating Bootstrap cards, accordions, nav-pills, hero headers, technology badges, Mermaid diagram containers, or responsive tables for any domain analysis output."
---

# Patrones HTML Bootstrap 5

Skill de conocimiento para generar HTML Bootstrap 5 a partir de documentación Markdown canónica (funcional, técnica o de estimación).

## Principios generales

- El HTML debe ser **autocontenido** salvo CDN de Bootstrap y Mermaid.
- **Fidelidad**: el HTML refleja exactamente las secciones y orden del Markdown fuente, sin inferir contenido nuevo.
- Si el Markdown dice `NO DISPONIBLE`, respetarlo tal cual.
- No generar código literal nuevo que no exista en el Markdown.

## Dependencias CDN

```html
<!-- Bootstrap 5 CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
<!-- Bootstrap 5 JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<!-- Mermaid -->
<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
```

## Inicialización Mermaid

```html
<script>
  mermaid.initialize({
    startOnLoad: true,
    securityLevel: 'loose',
    flowchart: { useMaxWidth: true },
    themeVariables: { fontSize: '18px' }
  });
</script>
```

## CSS obligatorio para Mermaid

```css
.mermaid {
  width: 100%;
  overflow-x: visible;
  overflow-y: visible;
  font-size: 1.05rem;
  line-height: 1.2;
}
.mermaid svg {
  max-width: 100%;
  height: auto;
}
```

No usar `overflow: auto` en contenedores Mermaid.

## Estructura base

### 1. Header Hero

```html
<header class="hero bg-dark text-white py-5">
  <div class="container">
    <h1>{Título del componente}</h1>
    <p class="lead">{Subtítulo contextual}</p>
  </div>
</header>
```

### 2. Cards superiores (row de 2-3 cards)

Usar `<div class="row g-4">` con cards Bootstrap.

### 3. Badges de tecnologías

- Orden obligatorio: primero las tecnologías en estado **Usado**, después el resto.
- Color: **Usado** → `text-bg-primary` (azul), resto → `text-bg-secondary` (gris).
- Texto del badge: incluir estado completo: `Graph API: Usado`, `PnP JS: No aplica`.

```html
<span class="badge text-bg-primary">Graph API: Usado</span>
<span class="badge text-bg-secondary">PnP JS: No aplica</span>
```

### 4. Acordeón para párrafos extensos

```html
<div class="accordion" id="accParrafos">
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#parrafo-1">
        {Nombre del componente}
      </button>
    </h2>
    <div id="parrafo-1" class="accordion-collapse collapse" data-bs-parent="#accParrafos">
      <div class="accordion-body">{Narrativa completa — NO recortar}</div>
    </div>
  </div>
</div>
```

### 5. Nav-pills sticky (navegación técnica)

```html
<nav class="sticky-top bg-white border-bottom py-2">
  <div class="container">
    <ul class="nav nav-pills flex-wrap">
      <li class="nav-item"><a class="nav-link" href="#resumen">Resumen</a></li>
      <li class="nav-item"><a class="nav-link" href="#arquitectura">Arquitectura</a></li>
      <li class="nav-item"><a class="nav-link" href="#dependencias-evidencias">Dependencias</a></li>
      <li class="nav-item"><a class="nav-link" href="#diccionario-datos">Diccionario</a></li>
      <li class="nav-item"><a class="nav-link" href="#matriz-io">Matriz I/O</a></li>
    </ul>
  </div>
</nav>
```

### 6. Tabla responsive

```html
<div class="table-responsive">
  <table class="table table-bordered table-hover">
    <thead class="table-dark">
      <tr><th>Col1</th><th>Col2</th></tr>
    </thead>
    <tbody>
      <tr><td>...</td><td>...</td></tr>
    </tbody>
  </table>
</div>
```

### 7. Cards de estimación (modo estimación)

```html
<div class="row g-3 mb-4">
  <div class="col-md-3">
    <div class="card text-center border-primary">
      <div class="card-body">
        <h5 class="card-title text-primary">T-Shirt</h5>
        <p class="card-text display-6">{M}</p>
      </div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="card text-center border-success">
      <div class="card-body">
        <h5 class="card-title text-success">Horas</h5>
        <p class="card-text display-6">{N} h</p>
      </div>
    </div>
  </div>
</div>
```

## Reglas de color por dominio

Adaptar los colores del hero según el dominio del proyecto:
- COBOL/mainframe: `bg-dark` (negro)
- SPFx/SharePoint: `bg-primary` (azul Microsoft)
- Java/backend: `bg-success` (verde)
- Power Platform: `bg-warning text-dark` (amarillo)
- Estimación de costes: `bg-info text-dark` (cian)
