"""Run the code cells of notebooks/games.ipynb in order, without Jupyter.

The notebook is the only place that builds the Chroma collection (see docs/adr/0001). This runner exists so
the shop's `catalog:refresh` can rebuild it after an Ingestion without anyone opening the notebook.
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def main() -> None:
    os.chdir(ROOT)  # the notebook loads .env from the project root
    with open(os.path.join(ROOT, "notebooks", "games.ipynb"), encoding="utf-8") as file:
        cells = [cell for cell in json.load(file)["cells"] if cell["cell_type"] == "code"]

    namespace: dict = {"__name__": "__main__"}
    for number, cell in enumerate(cells, start=1):
        source = "".join(cell["source"])
        print(f"[{number}/{len(cells)}] {source.strip().splitlines()[0][:80] if source.strip() else ''}", flush=True)
        try:
            exec(compile(source, f"games.ipynb cell {number}", "exec"), namespace)
        except Exception:
            print(f"Cell {number} failed", file=sys.stderr)
            raise


if __name__ == "__main__":
    main()
