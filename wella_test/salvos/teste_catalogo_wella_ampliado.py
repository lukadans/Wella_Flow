import argparse
import json
import tempfile
import time
from pathlib import Path
from statistics import median

def medir(funcao, repeticoes):
    tempos = []
    for _ in range(repeticoes):
        inicio = time.perf_counter()
        funcao()
        tempos.append((time.perf_counter() - inicio) * 1000)
    return median(tempos)

def executar(quantidade, repeticoes):
    with tempfile.TemporaryDirectory(prefix="wella_teste_") as pasta:
        raiz = Path(pasta)
        for numero in range(quantidade):
            registro = {
                "id_linha": numero,
                "linha": f"Linha_{numero:06d}",
                "produtos": [{"sku": f"SKU-{numero:06d}", "nome": f"Produto {numero}"}],
            }
            (raiz / f"linha_{numero:06d}.json").write_text(
                json.dumps(registro, ensure_ascii=False), encoding="utf-8"
            )

        alvo = quantidade - 1
        nome_alvo = f"linha_{alvo:06d}.json"
        sku_alvo = f"SKU-{alvo:06d}"

        def buscar_nome():
            for caminho in sorted(raiz.glob("*.json")):
                if caminho.name == nome_alvo:
                    return json.loads(caminho.read_text(encoding="utf-8"))
            raise RuntimeError("Nome não encontrado")

        def buscar_id():
            for caminho in sorted(raiz.glob("*.json")):
                if caminho.stem == f"linha_{alvo:06d}":
                    return json.loads(caminho.read_text(encoding="utf-8"))
            raise RuntimeError("ID não encontrado")

        def buscar_sku():
            for caminho in sorted(raiz.glob("*.json")):
                registro = json.loads(caminho.read_text(encoding="utf-8"))
                if any(item["sku"] == sku_alvo for item in registro["produtos"]):
                    return registro
            raise RuntimeError("SKU não encontrado")

        print(f"\\n{quantidade:,} arquivos | mediana de {repeticoes} execuções")
        for rotulo, funcao in [
            ("Busca por nome", buscar_nome),
            ("Busca por ID", buscar_id),
            ("Busca por SKU", buscar_sku),
        ]:
            print(f"{rotulo}: {medir(funcao, repeticoes):.1f} ms")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Teste local de busca em arquivos JSON fictícios.")
    parser.add_argument("--quantidades", nargs="+", type=int, default=[20000, 50000])
    parser.add_argument("--repeticoes", type=int, default=7)
    args = parser.parse_args()
    if any(n < 1 or n > 100000 for n in args.quantidades) or not 1 <= args.repeticoes <= 100:
        parser.error("Use quantidades entre 1 e 100000 e repetições entre 1 e 100.")
    for quantidade in args.quantidades:
        executar(quantidade, args.repeticoes)
