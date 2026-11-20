# """Simulador de busca em arquivos JSON de linhas comerciais.
#
# Arquivos e produtos gerados são FICTÍCIOS: não são dados da API da Wella.
# Executar: python teste_catalogo_wella.py
#          python teste_catalogo_wella.py --buscar nome Oil
#          python teste_catalogo_wella.py --buscar id 10012
#          python teste_catalogo_wella.py --buscar sku 100009
# """
# import argparse
# import json
# import statistics
# import time
# from pathlib import Path
#
# ROOT = Path(__file__).resolve().parent
# DADOS = ROOT / 'catalogo_teste'
#
#
# def gerar(total=1000):
#     DADOS.mkdir(exist_ok=True)
#     for i in range(1, total + 1):
#         id_linha = 10000 + i
#         linha = {12:'Oil Reflections', 35:'NX Hidratacao'}.get(i, f'Linha Teste {i:04d}')
#         slug = linha.lower().replace(' ', '_')
#         arq = DADOS / f'{id_linha}_{slug}.json'
#         if arq.exists():
#             continue
#         produtos = []
#         for j in range(10):
#             sku = i * 100 + j
#             produtos.append({
#                 'sku': sku,
#                 'nome': f'{linha} - Produto Ficticio {j + 1}',
#                 'tipo': ['Shampoo','Condicionador','Mascara','Oleo','Tratamento'][j % 5],
#                 'gramatura': ['250 ml','500 ml','1000 ml'][j % 3],
#                 'preco_exemplo': None
#             })
#         dado = {'aviso': 'DADOS FICTICIOS PARA TESTE', 'id_linha': id_linha,
#                 'linha_comercial': linha, 'produtos': produtos}
#         arq.write_text(json.dumps(dado, ensure_ascii=False, indent=2), encoding='utf-8')
#
#
# def listar(qtd):
#     return sorted(DADOS.glob('*.json'))[:qtd]
#
#
# def buscar_nome(termo, qtd, abrir=True):
#     termo = termo.casefold()
#     examinados = 0
#     for arq in listar(qtd):
#         examinados += 1
#         if termo in arq.stem.casefold():
#             return arq, (json.loads(arq.read_text(encoding='utf-8')) if abrir else None), examinados
#     return None, None, examinados
#
#
# def buscar_id(id_linha, qtd, abrir=True):
#     prefixo = str(id_linha) + '_'
#     examinados = 0
#     for arq in listar(qtd):
#         examinados += 1
#         if arq.name.startswith(prefixo):
#             return arq, (json.loads(arq.read_text(encoding='utf-8')) if abrir else None), examinados
#     return None, None, examinados
#
#
# def buscar_sku(sku, qtd):
#     vistos = 0
#     for arq in listar(qtd):
#         vistos += 1
#         dado = json.loads(arq.read_text(encoding='utf-8'))
#         for produto in dado['produtos']:
#             if produto['sku'] == sku:
#                 return arq, produto, vistos
#     return None, None, vistos
#
#
# def medir(fn, repeticoes=15):
#     tempos = []
#     for _ in range(repeticoes):
#         inicio = time.perf_counter()
#         fn()
#         tempos.append((time.perf_counter()-inicio)*1000)
#     return statistics.median(tempos)
#
#
# def relatorio():
#     gerar(1000)
#     print('TESTE DE BUSCA — ARQUIVOS JSON FICTICIOS')
#     print('Resultados locais em milissegundos (mediana de 15 execucoes)')
#     print('Quantidade | Nome (ultimo) | ID (ultimo) | SKU (ultimo, leitura de JSON)')
#     for qtd in [500, 1000]:
#         nome = f'linha_teste_{qtd:04d}'
#         id_linha = 10000 + qtd
#         sku = qtd*100 + 9
#         t_nome = medir(lambda: buscar_nome(nome, qtd))
#         t_id = medir(lambda: buscar_id(id_linha, qtd))
#         t_sku = medir(lambda: buscar_sku(sku, qtd))
#         print(f'{qtd:10d} | {t_nome:12.3f} ms | {t_id:11.3f} ms | {t_sku:30.3f} ms')
#     print('Nota: os tempos variam por computador, disco e cache do sistema.')
#
#
# def main():
#     p = argparse.ArgumentParser(description='Busca por linha comercial ou SKU nos JSONs ficticios')
#     p.add_argument('--buscar', choices=['nome','id','sku'], help='tipo de pesquisa')
#     p.add_argument('termo', nargs='?', help='termo de pesquisa')
#     p.add_argument('--quantidade', type=int, choices=[500,1000], default=1000)
#     a = p.parse_args()
#     if a.buscar is None:
#         relatorio()
#         return
#     if not a.termo:
#         p.error('Informe o termo da busca, por exemplo: --buscar nome Oil')
#     gerar(a.quantidade)
#     t0 = time.perf_counter()
#     if a.buscar == 'nome':
#         arq, dado, n = buscar_nome(a.termo, a.quantidade)
#     elif a.buscar == 'id':
#         arq, dado, n = buscar_id(a.termo, a.quantidade)
#     else:
#         try:
#             sku = int(a.termo)
#         except ValueError:
#             p.error('O SKU do exemplo deve ser um numero inteiro')
#         arq, dado, n = buscar_sku(sku, a.quantidade)
#     ms = (time.perf_counter()-t0)*1000
#     print(f'Arquivos percorridos: {n}; tempo: {ms:.3f} ms')
#     if arq:
#         print(f'Arquivo: {arq.resolve()}')
#         if a.buscar == 'sku':
#             print('Produto:', json.dumps(dado, ensure_ascii=False, indent=2))
#         else:
#             print(f'Linha: {dado["linha_comercial"]}; produtos: {len(dado["produtos"])}')
#             print('SKUs:', ', '.join(str(p['sku']) for p in dado['produtos']))
#     else:
#         print('Nao encontrado')
#
#
# if __name__ == '__main__':
#     main()






























"""Benchmark ampliado da arquitetura JSON por linha comercial.

Uso:
    python teste_catalogo_wella_ampliado.py
    python teste_catalogo_wella_ampliado.py --quantidades 1000 5000 10000 --repeticoes 7
    python teste_catalogo_wella_ampliado.py --quantidades 20000 --repeticoes 3

Cria arquivos de exemplo FICTICIOS na pasta 'catalogo_teste_ampliado'.
Nao acessa internet, produtos reais nem arquivos pessoais.
"""
import argparse
import json
import statistics
import time
from pathlib import Path

RAIZ = Path(__file__).resolve().parent
DADOS = RAIZ / 'catalogo_teste_ampliado'


def gerar(total, pasta):
    pasta.mkdir(parents=True, exist_ok=True)
    novos = 0
    for i in range(1, total + 1):
        id_linha = 10000 + i
        linha = {12: 'Oil Reflections', 35: 'NX Hidratacao'}.get(i, f'Linha Teste {i:05d}')
        nome = linha.lower().replace(' ', '_')
        arquivo = pasta / f'{id_linha}_{nome}.json'
        if arquivo.exists():
            continue
        produtos = [
            {
                'sku': i * 100 + j,
                'nome': f'{linha} - Produto Ficticio {j + 1}',
                'tipo': ['Shampoo', 'Condicionador', 'Mascara', 'Oleo', 'Tratamento'][j % 5],
                'gramatura': ['250 ml', '500 ml', '1000 ml'][j % 3],
                'preco_exemplo': None,
            }
            for j in range(10)
        ]
        dados = {'aviso': 'DADOS FICTICIOS PARA TESTE', 'id_linha': id_linha,
                 'linha_comercial': linha, 'produtos': produtos}
        arquivo.write_text(json.dumps(dados, ensure_ascii=False, indent=2), encoding='utf-8')
        novos += 1
    return novos


def listar(pasta):
    # Mesmo algoritmo do teste anterior, mas apenas na pasta do tamanho em teste.
    return sorted(pasta.glob('*.json'))


def buscar_nome(termo, pasta):
    for arquivo in listar(pasta):
        if termo.casefold() in arquivo.stem.casefold():
            dados = json.loads(arquivo.read_text(encoding='utf-8'))
            return arquivo, dados
    return None, None


def buscar_id(id_linha, pasta):
    prefixo = str(id_linha) + '_'
    for arquivo in listar(pasta):
        if arquivo.name.startswith(prefixo):
            dados = json.loads(arquivo.read_text(encoding='utf-8'))
            return arquivo, dados
    return None, None


def buscar_sku(sku, pasta):
    for arquivo in listar(pasta):
        dados = json.loads(arquivo.read_text(encoding='utf-8'))
        for produto in dados['produtos']:
            if produto['sku'] == sku:
                return arquivo, produto
    return None, None


def medir(fn, repeticoes):
    tempos_ms = []
    for _ in range(repeticoes):
        inicio = time.perf_counter()
        arquivo, _ = fn()
        duracao_ms = (time.perf_counter() - inicio) * 1000
        if arquivo is None:
            raise RuntimeError('Busca falhou: nao encontrou o ultimo item esperado!')
        tempos_ms.append(duracao_ms)
    return statistics.median(tempos_ms)


def main():
    parser = argparse.ArgumentParser(description='Mede busca por nome, ID e SKU em JSONs ficticios')
    parser.add_argument('--quantidades', type=int, nargs='+', default=[1000, 5000, 10000],
                        help='quantidades de arquivos (padrao: 1000 5000 10000)')
    parser.add_argument('--repeticoes', type=int, default=7,
                        help='numero de repeticoes de cada busca (padrao: 7)')
