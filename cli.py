#!/usr/bin/env python3
"""
cli.py — CLI SPFx del modelo agéntico.
Extiende cli_base.py del framework agentic-framework.

Subcomandos:
  run-spfx <COMPONENT> --mode {funcional,tecnico,completo} [--costs <csv>] [--runtime {local,cloud,copilot-cli}]
  batch-spfx [--mode {funcional,tecnico,completo}] [--runtime {local,cloud,copilot-cli}]
  estimate <COMPONENT> [--costs <csv>] [--runtime {local,cloud,copilot-cli}]
"""
import argparse
import os
import sys
import datetime
import re

ROOT = os.path.dirname(os.path.abspath(__file__))
MANIFEST = os.path.join(ROOT, 'spfx-project.yml')

# Importar funciones base del framework
sys.path.insert(0, ROOT)
FRAMEWORK_ROOT = os.path.abspath(os.path.join(ROOT, '..', 'agentic-framework'))
if os.path.exists(os.path.join(FRAMEWORK_ROOT, 'cli_base.py')):
    sys.path.insert(0, FRAMEWORK_ROOT)
try:
    from cli_base import (
        read_manifest, ensure_dirs, write_markdown, write_html,
        write_cloud_payload, print_copilot_cli_hint, timestamp_now
    )
except ImportError:
    # Fallback: si cli_base.py no está en el mismo directorio,
    # definir stubs mínimos para no romper el CLI
    def read_manifest(root, path):
        return {
            'solution_folder': 'spfx', 'output_md_folder': os.path.join('output','md'),
            'output_html_folder': os.path.join('output','html'), 'costs_folder': 'costs',
            'language': 'es'
        }
    def ensure_dirs(*paths):
        for p in paths: os.makedirs(p, exist_ok=True)
    def write_markdown(path, title, body):
        with open(path, 'w', encoding='utf-8') as f: f.write(f"# {title}\n\n{body}")
    def write_html(path, title, body, hero_class="bg-primary text-white"):
        with open(path, 'w', encoding='utf-8') as f:
            f.write(f"<!doctype html><html><head><title>{title}</title></head><body>{body}</body></html>")
    def write_cloud_payload(path, program, mode, paths, domain="spfx", extra=None):
        import json
        payload = {"program": program, "mode": mode, "domain": domain}
        if extra: payload.update(extra)
        with open(path, 'w', encoding='utf-8') as f: json.dump(payload, f, indent=2)
    def print_copilot_cli_hint(program, mode, domain="spfx"):
        print(f"[copilot-cli] gh copilot suggest \"Analiza el componente {domain} {program} en modo {mode}\"")
    def timestamp_now():
        return datetime.datetime.now(datetime.timezone.utc).isoformat()

RUNTIMES = ('local', 'cloud', 'copilot-cli')
SPFx_EXTENSIONS = ('.ts', '.tsx')
SPFx_COMPONENT_DIRS = ('webparts', 'extensions', 'adaptiveCardExtensions')


def read_spfx_manifest():
    """Lee spfx-project.yml y retorna paths normalizados a absolutos."""
    defaults = read_manifest(ROOT, MANIFEST)
    # cli_base.read_manifest no parsea claves específicas de SPFx como solution_folder.
    try:
        with open(MANIFEST, 'r', encoding='utf-8') as f:
            manifest_text = f.read()
        m = re.search(r'^solution_folder:\s*(.+)$', manifest_text, re.MULTILINE)
        if m:
            defaults['solution_folder'] = m.group(1).strip().strip('"\'').rstrip('/\\')
    except Exception:
        pass
    # Añadir campos específicos de SPFx con defaults
    if 'solution_folder' not in defaults:
        defaults['solution_folder'] = 'spfx'
    if 'costs_folder' not in defaults:
        defaults['costs_folder'] = 'costs'
    # Normalizar a absolutos
    for k in ['solution_folder', 'output_md_folder', 'output_html_folder', 'costs_folder']:
        if k in defaults and not os.path.isabs(defaults[k]):
            defaults[k] = os.path.join(ROOT, defaults[k])
    return defaults


def detect_components(solution_folder: str) -> list:
    """
    Detecta todos los componentes SPFx activos en la carpeta src/ de la solución.
    Retorna lista de dicts: {name, type, path}
    """
    components = []
    src = os.path.join(solution_folder, 'src')
    if not os.path.isdir(src):
        return components
    for comp_dir in SPFx_COMPONENT_DIRS:
        comp_path = os.path.join(src, comp_dir)
        if not os.path.isdir(comp_path):
            continue
        for name in os.listdir(comp_path):
            full = os.path.join(comp_path, name)
            if os.path.isdir(full):
                components.append({
                    'name': name,
                    'type': comp_dir.rstrip('s'),  # webparts→webpart, etc.
                    'path': full
                })
    return components


def generate_spfx_funcional(name: str, md_path: str, html_path: str, exhaustive_mode: bool = False) -> None:
    """Genera artefacto funcional de plantilla para un componente SPFx."""
    now = timestamp_now()
    deep_hint = "/spfx-funcional" if not exhaustive_mode else "/exhaustive-funcional"
    depth_note = "Análisis profundo estandarizado activado." if exhaustive_mode else "Para análisis completo con extracción de lógica de negocio, usa /spfx-funcional en Copilot Chat."
    body_md = (
        f"**Generado por CLI local** — {now}\n\n"
        f"Documentación funcional del componente SPFx `{name}`.\n\n"
        f"> ⚠️ Este es un artefacto de plantilla generado por el CLI.\n"
        f"> {depth_note}\n"
        f"> Prompt recomendado: `{deep_hint}`\n\n"
        f"## Contexto funcional\n\nNO DISPONIBLE — requiere análisis de Copilot.\n\n"
        f"## Flujo de usuario\n\nNO DISPONIBLE\n\n"
        f"## Dependencias\n\nNO DISPONIBLE\n"
    )
    write_markdown(md_path, f"Funcional — {name}", body_md)
    html_hint = "/spfx-funcional" if not exhaustive_mode else "/exhaustive-funcional"
    body_html = f"<div class='alert alert-warning'>Artefacto de plantilla. Ejecuta {html_hint} en Copilot Chat para análisis completo.</div>"
    write_html(html_path, f"Funcional — {name}", body_html, hero_class="bg-primary text-white")


def generate_spfx_tecnico(name: str, md_path: str, html_path: str, exhaustive_mode: bool = False) -> None:
    """Genera artefacto técnico de plantilla para un componente SPFx."""
    now = timestamp_now()
    deep_hint = "/spfx-tecnico" if not exhaustive_mode else "/exhaustive-tecnico"
    depth_note = "Análisis profundo estandarizado activado." if exhaustive_mode else "Para análisis completo con lifecycle hooks, API calls y estado, usa /spfx-tecnico en Copilot Chat."
    body_md = (
        f"**Generado por CLI local** — {now}\n\n"
        f"Documentación técnica del componente SPFx `{name}`.\n\n"
        f"> ⚠️ Este es un artefacto de plantilla generado por el CLI.\n"
        f"> {depth_note}\n"
        f"> Prompt recomendado: `{deep_hint}`\n\n"
        f"## Lifecycle hooks\n\nNO DISPONIBLE — requiere análisis de Copilot.\n\n"
        f"## API calls\n\nNO DISPONIBLE\n\n"
        f"## Props e interfaces\n\nNO DISPONIBLE\n"
    )
    write_markdown(md_path, f"Técnico — {name}", body_md)
    html_hint = "/spfx-tecnico" if not exhaustive_mode else "/exhaustive-tecnico"
    body_html = f"<div class='alert alert-warning'>Artefacto de plantilla. Ejecuta {html_hint} en Copilot Chat para análisis completo.</div>"
    write_html(html_path, f"Técnico — {name}", body_html, hero_class="bg-primary text-white")


def generate_estimacion(name: str, md_path: str, html_path: str, costs_csv: str) -> None:
    """Genera artefacto de estimación de plantilla."""
    now = timestamp_now()
    has_history = os.path.exists(costs_csv) and os.path.getsize(costs_csv) > 0
    history_note = f"Histórico encontrado en `{costs_csv}`." if has_history else f"Sin histórico — usando valores de referencia del skill `cost-estimation`."
    body_md = (
        f"**Generado por CLI local** — {now}\n\n"
        f"Estimación de costes del componente SPFx `{name}`.\n\n"
        f"{history_note}\n\n"
        f"> ⚠️ Este es un artefacto de plantilla. Para estimación con análisis real del código,\n"
        f"> usa `/spfx-estimacion` en Copilot Chat.\n\n"
        f"## Resumen ejecutivo\n\n"
        f"| Métrica | Valor |\n|---------|-------|\n"
        f"| T-shirt size | NO DISPONIBLE |\n"
        f"| Horas de desarrollo | NO DISPONIBLE |\n"
        f"| Story Points | NO DISPONIBLE |\n"
        f"| Risk score | NO DISPONIBLE |\n\n"
        f"## Comparativa con histórico\n\n{history_note}\n"
    )
    write_markdown(md_path, f"Estimación — {name}", body_md)
    body_html = f"<div class='alert alert-info'>Artefacto de plantilla. Ejecuta /spfx-estimacion en Copilot Chat para estimación completa.</div>"
    write_html(html_path, f"Estimación — {name}", body_html, hero_class="bg-info text-dark")


def run_spfx(component: str, mode: str, paths: dict, runtime: str, costs_csv: str, exhaustive_mode: bool = False) -> None:
    """Ejecuta análisis de un componente SPFx."""
    md_base = paths['output_md_folder']
    html_base = paths['output_html_folder']
    ensure_dirs(md_base, html_base)

    if runtime == 'cloud':
        payload_path = os.path.join(md_base, f"{component}-cloud-payload.json")
        write_cloud_payload(payload_path, component, mode, paths, domain='spfx',
                    extra={'costs_csv': costs_csv, 'solution_type': 'spfx', 'exhaustive_mode': exhaustive_mode})
        print(f"[cloud] Payload generado: {payload_path}")
        print(f"[cloud] Enviar a la API/Container con:")
        print(f"  curl -X POST $CLOUD_ENDPOINT -d @{payload_path}")
        return

    if runtime == 'copilot-cli':
        print_copilot_cli_hint(component, mode, domain='spfx')
        if exhaustive_mode:
            print("[copilot-cli] Modo exhaustivo: usar prompts /exhaustive-funcional y /exhaustive-tecnico")
        return

    # runtime == 'local'
    if mode in ('funcional', 'completo'):
        md_path = os.path.join(md_base, f"{component}-funcional.md")
        html_path = os.path.join(html_base, f"{component}-funcional.html")
        generate_spfx_funcional(component, md_path, html_path, exhaustive_mode=exhaustive_mode)
        print(f"[OK] Funcional: {md_path}")
        print(f"     {html_path}")

    if mode in ('tecnico', 'completo'):
        md_path = os.path.join(md_base, f"{component}-tecnico.md")
        html_path = os.path.join(html_base, f"{component}-tecnico.html")
        generate_spfx_tecnico(component, md_path, html_path, exhaustive_mode=exhaustive_mode)
        print(f"[OK] Técnico:   {md_path}")
        print(f"     {html_path}")


def run_batch_spfx(mode: str, paths: dict, runtime: str, costs_csv: str, exhaustive_mode: bool = False) -> None:
    """Procesa todos los componentes SPFx detectados en la carpeta de la solución."""
    components = detect_components(paths['solution_folder'])
    if not components:
        print(f"No se encontraron componentes SPFx en {paths['solution_folder']}/src/")
        print("Asegúrate de que la solución tiene subcarpetas en webparts/, extensions/ o adaptiveCardExtensions/")
        return
    total = len(components)
    print(f"[batch] Procesando {total} componente(s) en {paths['solution_folder']}/src/...")
    for i, comp in enumerate(components, start=1):
        print(f"\n[{i}/{total}] {comp['name']} ({comp['type']})")
        run_spfx(comp['name'], mode, paths, runtime, costs_csv, exhaustive_mode=exhaustive_mode)


def run_estimate(component: str, paths: dict, costs_csv: str, runtime: str, exhaustive_mode: bool = False) -> None:
    """Genera estimación de costes para un componente SPFx."""
    md_base = paths['output_md_folder']
    html_base = paths['output_html_folder']
    ensure_dirs(md_base, html_base)

    if runtime == 'cloud':
        payload_path = os.path.join(md_base, f"{component}-estimacion-cloud-payload.json")
        write_cloud_payload(payload_path, component, 'estimacion', paths, domain='spfx',
                    extra={'costs_csv': costs_csv, 'solution_type': 'spfx', 'exhaustive_mode': exhaustive_mode})
        print(f"[cloud] Payload de estimación generado: {payload_path}")
        return

    if runtime == 'copilot-cli':
        print_copilot_cli_hint(component, 'estimacion', domain='spfx')
        return

    # runtime == 'local' — primero documentación completa, luego estimación
    run_spfx(component, 'completo', paths, runtime, costs_csv, exhaustive_mode=exhaustive_mode)
    md_path = os.path.join(md_base, f"{component}-estimacion.md")
    html_path = os.path.join(html_base, f"{component}-estimacion.html")
    generate_estimacion(component, md_path, html_path, costs_csv)
    print(f"[OK] Estimación: {md_path}")
    print(f"     {html_path}")
    if not os.path.exists(costs_csv):
        print(f"\n[!] Aviso: no se encontró histórico de costes en '{costs_csv}'.")
        print(f"    Copia 'costs/historico-template.csv' como '{costs_csv}' y rellénalo.")
        print(f"    Para estimación real, usa /spfx-estimacion en Copilot Chat con datos históricos.")


def main():
    parser = argparse.ArgumentParser(
        prog='spfx-cli',
        description='CLI agéntico para soluciones SPFx (SharePoint Framework)'
    )
    sub = parser.add_subparsers(dest='cmd')

    # Subcomando: run-spfx
    p_run = sub.add_parser('run-spfx', help='Analizar un componente SPFx')
    p_run.add_argument('component', help='Nombre del componente (WebPart, Extension, etc.)')
    p_run.add_argument('--mode', choices=['funcional', 'tecnico', 'completo'], default='completo')
    p_run.add_argument('--runtime', choices=RUNTIMES, default='local')
    p_run.add_argument('--exhaustive-mode', action='store_true',
                       help='Activa hints y metadatos para pipeline de analisis profundo con agentes/prompts exhaustivos')
    p_run.add_argument('--costs', default=None, help='Ruta al CSV histórico de costes')

    # Subcomando: batch-spfx
    p_batch = sub.add_parser('batch-spfx', help='Analizar todos los componentes SPFx de la solución')
    p_batch.add_argument('--mode', choices=['funcional', 'tecnico', 'completo'], default='completo')
    p_batch.add_argument('--runtime', choices=RUNTIMES, default='local')
    p_batch.add_argument('--exhaustive-mode', action='store_true',
                         help='Activa hints y metadatos para pipeline de analisis profundo con agentes/prompts exhaustivos')
    p_batch.add_argument('--costs', default=None, help='Ruta al CSV histórico de costes')

    # Subcomando: estimate
    p_est = sub.add_parser('estimate', help='Generar estimación de costes de un componente SPFx')
    p_est.add_argument('component', help='Nombre del componente')
    p_est.add_argument('--costs', default=None, help='Ruta al CSV histórico de costes')
    p_est.add_argument('--runtime', choices=RUNTIMES, default='local')
    p_est.add_argument('--exhaustive-mode', action='store_true',
                       help='Activa hints y metadatos para pipeline de analisis profundo con agentes/prompts exhaustivos')

    args = parser.parse_args()
    paths = read_spfx_manifest()
    ensure_dirs(paths['output_md_folder'], paths['output_html_folder'])

    # Resolver ruta al CSV de costes
    def resolve_costs(arg_costs):
        if arg_costs:
            return arg_costs if os.path.isabs(arg_costs) else os.path.join(ROOT, arg_costs)
        return os.path.join(paths['costs_folder'], 'historico.csv')

    if args.cmd == 'run-spfx':
        run_spfx(args.component, args.mode, paths, args.runtime, resolve_costs(args.costs), exhaustive_mode=args.exhaustive_mode)
    elif args.cmd == 'batch-spfx':
        run_batch_spfx(args.mode, paths, args.runtime, resolve_costs(args.costs), exhaustive_mode=args.exhaustive_mode)
    elif args.cmd == 'estimate':
        run_estimate(args.component, paths, resolve_costs(args.costs), args.runtime, exhaustive_mode=args.exhaustive_mode)
    else:
        parser.print_help()


if __name__ == '__main__':
    main()
