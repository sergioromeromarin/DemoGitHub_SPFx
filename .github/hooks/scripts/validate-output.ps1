param(
    [Parameter(Mandatory=$true)]
    [string]$FilePath
)

# Solo validar archivos generados en output/
if ($FilePath -notmatch '\boutput[\\/]') { exit 0 }

$ext = [System.IO.Path]::GetExtension($FilePath).ToLower()
if ($ext -notin @('.md', '.html')) { exit 0 }

$content = Get-Content -Path $FilePath -Raw -ErrorAction SilentlyContinue
if (-not $content) {
    Write-Warning "QA: archivo vacio o no legible — $FilePath"
    exit 1
}

$errors = @()

# Verificar idioma: el contenido debe estar predominantemente en español
if ($content -match '(?i)\bpurpose\b.*\bthis\b') {
    $errors += "Posible contenido en ingles detectado"
}

# Verificar marcadores pendientes (variables de plantilla sin sustituir)
if ($content -match '\{full_code_extra\}|\{trozo_sin\}|\{more_context\}|\{md_tecnico\}|\{md_funcional\}|\{costs_csv\}') {
    $errors += "Variables de plantilla sin sustituir detectadas"
}

# Verificar Mermaid (solo en .md)
if ($ext -eq '.md') {
    $mermaidBlocks = [regex]::Matches($content, '```mermaid')
    foreach ($block in $mermaidBlocks) {
        $pos = $block.Index
        $endPos = $content.IndexOf('```', $pos + 10)
        if ($endPos -gt $pos) {
            $diagram = $content.Substring($pos, $endPos - $pos)
            if ($diagram -match '[?:"'']') {
                $errors += "Caracteres prohibidos en diagrama Mermaid"
            }
        }
    }
}

# Verificar HTML (solo en .html)
if ($ext -eq '.html') {
    if ($content -notmatch '<html') {
        $errors += "Archivo HTML sin etiqueta <html>"
    }
    if ($content -notmatch 'bootstrap') {
        $errors += "Archivo HTML sin referencia a Bootstrap"
    }
}

if ($errors.Count -gt 0) {
    Write-Warning "QA: $($errors.Count) problema(s) en $FilePath"
    $errors | ForEach-Object { Write-Warning "  - $_" }
    exit 1
}

Write-Output "QA: OK — $FilePath"
exit 0
