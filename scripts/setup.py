"""Prepara o ambiente do projeto no Linux, macOS e Windows."""

from pathlib import Path
import subprocess
import sys
import venv


def main():
    raiz = Path(__file__).resolve().parents[1]
    ambiente = raiz / ".venv"
    python = ambiente / ("Scripts/python.exe" if sys.platform == "win32" else "bin/python")
    if not python.exists():
        venv.EnvBuilder(with_pip=True).create(ambiente)
    subprocess.run([str(python), "-m", "pip", "install", "-r", str(raiz / "requirements.txt")], check=True)
    subprocess.run([str(python), "-m", "pip", "check"], check=True)
    subprocess.run([str(python), str(raiz / "main.py"), "doctor"], check=True)


if __name__ == "__main__":
    main()
