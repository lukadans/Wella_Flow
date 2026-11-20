"""Comandos de desenvolvimento do projeto Wella; sem coleta automatica."""

import argparse
import importlib.metadata
from pathlib import Path
import sys


def doctor():
    raiz = Path(__file__).resolve().parent
    erros = []
    print(f"Projeto: {raiz}")
    print(f"Python: {sys.version.split()[0]}")
    if sys.version_info < (3, 14):
        erros.append("Use Python 3.14 ou superior.")
    for linha in (raiz / "requirements.txt").read_text(encoding="utf-8").splitlines():
        if not linha.strip() or linha.startswith("#"):
            continue
        nome, esperada = linha.split("==", 1)
        try:
            instalada = importlib.metadata.version(nome)
        except importlib.metadata.PackageNotFoundError:
            erros.append(f"Dependencia ausente: {nome}")
            continue
        if instalada != esperada:
            erros.append(f"{nome}: esperado {esperada}, instalado {instalada}")
        else:
            print(f"OK: {nome}=={instalada}")
    catalogo = raiz / "dados" / "bruto" / "catalogo_wella_raw.json"
    print(f"Catalogo local: {'presente' if catalogo.is_file() else 'ainda nao coletado (opcional)'}")
    for erro in erros:
        print(f"ERRO: {erro}", file=sys.stderr)
    return 1 if erros else 0


def main():
    parser = argparse.ArgumentParser(description="Ambiente de desenvolvimento Wella")
    parser.add_argument("comando", choices=["doctor"])
    parser.parse_args()
    return doctor()


if __name__ == "__main__":
    raise SystemExit(main())
