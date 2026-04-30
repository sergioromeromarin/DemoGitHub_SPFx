#!/usr/bin/env bash
set -euo pipefail

FILE_PATH="${1:-}"
if [ -z "$FILE_PATH" ]; then exit 0; fi

# Solo validar archivos generados en output/
case "$FILE_PATH" in
    *output/*) ;;
    *) exit 0 ;;
esac

EXT="${FILE_PATH##*.}"
case "$EXT" in
    md|html) ;;
    *) exit 0 ;;
esac

if [ ! -s "$FILE_PATH" ]; then
    echo "QA: archivo vacio o no legible — $FILE_PATH" >&2
    exit 1
fi

CONTENT=$(cat "$FILE_PATH")
ERRORS=()

# Verificar idioma
if echo "$CONTENT" | grep -qiP '\bpurpose\b.*\bthis\b'; then
    ERRORS+=("Posible contenido en ingles detectado")
fi

# Verificar marcadores pendientes (variables de plantilla sin sustituir)
if echo "$CONTENT" | grep -qE '\{full_code_extra\}|\{trozo_sin\}|\{more_context\}|\{md_tecnico\}|\{md_funcional\}|\{costs_csv\}'; then
    ERRORS+=("Variables de plantilla sin sustituir detectadas")
fi

# Verificar Mermaid (solo en .md)
if [ "$EXT" = "md" ]; then
    if echo "$CONTENT" | grep -q '```mermaid'; then
        MERMAID_BLOCKS=$(echo "$CONTENT" | sed -n '/```mermaid/,/```/p')
        if echo "$MERMAID_BLOCKS" | grep -qP '[?:"'"'"']'; then
            ERRORS+=("Caracteres prohibidos en diagrama Mermaid")
        fi
    fi
fi

# Verificar HTML (solo en .html)
if [ "$EXT" = "html" ]; then
    if ! echo "$CONTENT" | grep -q '<html'; then
        ERRORS+=("Archivo HTML sin etiqueta <html>")
    fi
    if ! echo "$CONTENT" | grep -qi 'bootstrap'; then
        ERRORS+=("Archivo HTML sin referencia a Bootstrap")
    fi
fi

if [ ${#ERRORS[@]} -gt 0 ]; then
    echo "QA: ${#ERRORS[@]} problema(s) en $FILE_PATH" >&2
    for ERR in "${ERRORS[@]}"; do
        echo "  - $ERR" >&2
    done
    exit 1
fi

echo "QA: OK — $FILE_PATH"
exit 0
