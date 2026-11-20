# import requests
# import time
#
#
# def acessar_api():
#
#     # Configuração
#     inicio = 0
#
#     # Loop
#     # while True:
#     for i in range(1):  # Teste
#
#         try:
#             # Requisição no site da API.
#             req = requests.get(f"https://loja.wella.com.br/api/catalog_system/pub/products/search?_from={inicio}&_to={inicio + 49}", timeout=5)
#
#             #  Validação.
#             if req.status_code in (200, 206):
#                 print(f" ESTATUS >>> {req.status_code}")
#                 inicio += 50
#
#                 time.sleep(0.5)
#
#             else:
#                 print(f"Revisa aí que deu ruim: {req.status_code} > > > {req.text}")
#                 break
#
#         except Exception as ERRO:
#             print(ERRO)
#
# # acessar_api()  #  ========================================          Acima é a requisição encaminhando para o tratamento minimo.             ==================================================================================================================================================
#
#
# def tratamento():
#
#     dados_bruto = acessar_api().json()  # Todos os dados em formato lista/json.
#
#     # print(f" TIPO DE DADOS >>> {type(dados_bruto)}")
#     # print(f" TAMANHO >>> {len(dados_bruto)}")
#     # print(f" DADOS >>> {dados_bruto}")
#
#
#     for produto in dados_bruto:  # Faz um loop na lista com de json/list
#         print(f" DADOS >>> {produto["productId"]}, {produto["productName"]}" )
#         # print(f" TIPO DE DADOS >>> {type(produto)}, TAMANHO >>> {len(produto)}")
#         # print(produto)
#
#         for sku in produto["items"]:
#             des = sku["itemId"]
#             img = sku["images"][0]["imageUrl"]
#             nome = sku["name"]
#             valor = sku["sellers"][0]["commertialOffer"]["Price"]
#             print(f"        SKU_id:{des} > {nome}, R${valor} > {img}")
#             print("\n")
#
#
# acessar_api()
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
# from requests import get
# from time import sleep
#
#
# def access_api():
#     # Config index das páginas das requisições.
#     inicio = 0
#
#     try:
#         while True:
#
#             url = (f"https://loja.wella.com.br/api/catalog_system/pub/products/"
#                    f"search?_from={inicio}&_to={inicio + 50}")
#             req = get(url, timeout=5)
#
#             if req.status_code in (200, 206):
#                 print(f"STATUS: {req.status_code} 🚀")
#                 produtos = req.json()
#                 print(produtos)
#                 inicio += 50
#
#                 sleep(0.5)
#
#                 if not produtos:
#                     print(f"Fim de lista {produtos}")
#                     print(f"INDEX: inicio:{inicio} fim:{inicio + 50}")
#                     break
#             else:
#                 print(f"STATUS ERRO: >>>>>>>>>>> {req.status_code} <<<<<<<<<<")
#                 break
#
#     except Exception as ERRO:
#         print(ERRO)





# from requests import get
# from time import sleep
#
#
# def access_api():
#     # Config index das páginas das requisições.
#     inicio = 0
#     buff = []  # Lista dos produtos(oletados e salvos em .md)
#
#     try:
#         while True:
#             url = (
#                 "https://loja.wella.com.br/api/catalog_system/pub/products/search"
#                 f"?_from={inicio}&_to={inicio + 49}"
#             )
#
#             req = get(url, timeout=5)
#
#             if req.status_code in (200, 206):
#                 produtos = req.json()
#
#                 if not produtos:
#                     print(f"Fim da coleta: {inicio} até {inicio + 50}")
#                     break
#
#                 buff.extend(produtos)
#
#                 print(
#                     f"Coletados: {inicio} até {inicio + 50} 🚀"
#                     f"| Total no buffer: {len(buff)}"
#                 )
#
#                 inicio += 50
#
#                 sleep(0.5)
#
#             else:
#                 print(f"Erro HTTP: {req.status_code}")
#                 break
#
#     except Exception as erro:
#         print(f"Erro na coleta: {erro}")
#
#     print(f"Total coletado: {len(buff)}")
#     return buff
#
#
# def tratamento():
#     dados = access_api()
#     produtos = dados["produtos"]
#
#
#
#
#
#
#
#
#
#
#
#
#
#
# def tratamento():
#     dados_api = access_api()
#     dados = []
#
#     for produto in dados_api:
#
#         linha = {
#             "productId": produto.get("productId"),
#             "productName": produto.get("productName"),
#             "brand": produto.get("brand"),
#             "categories": produto.get("categories"),
#             "description": produto.get("description"),
#             "link": produto.get("link")
#         }
#
#         prudutos = []
#
#         for item in produto.get("items", []):
#
#             sellers = item.get("sellers", [])
#             oferta = (
#                 sellers[0].get("commertialOffer", {})
#                 if sellers else {}
#             )
#
#             imagens = item.get("images", [])
#
#             sku = {
#                 "itemId": item.get("itemId"),
#                 "name": item.get("name"),
#                 "ean": item.get("ean"),
#                 "measurementUnit": item.get("measurementUnit"),
#                 "unitMultiplier": item.get("unitMultiplier"),
#                 "Price": oferta.get("Price"),
#                 "ListPrice": oferta.get("ListPrice"),
#                 "IsAvailable": oferta.get("IsAvailable"),
#                 "imageUrl": (
#                     imagens[0].get("imageUrl")
#                     if imagens else None
#                 )
#             }
#
#             prudutos.append(sku)
#
#         dados.append({
#             "produto": linha,
#             "sku": prudutos
#         })
#
#     return dados
#
#
# if __name__ == "__main__":
#     resultado = tratamento()
#
#     print(f"\nProdutos tratados: {len(resultado)}")
#
#     if resultado:
#         print("\nPrimeiro produto:")
#         print(resultado[0])




























































from requests import get
from time import sleep
from pathlib import Path
import json


def access_api():
    # Config index das páginas das requisições.
    inicio = 0
    fim = 49
    buff = []

    try:
        while True:
        # for i in range(2):
            url = (f"https://loja.wella.com.br/api/catalog_system/pub/products/"
                   f"search?_from={inicio}&_to={fim}")

            req = get(url, timeout=5)

            if req.status_code in (200, 206):
                print(f"STATUS: {req.status_code} 🚀")
                produtos = req.json()

                if not isinstance(produtos, list):
                    print("ERRO: a API não retornou uma lista de produtos.")
                    return []

                if not produtos:
                    break

                buff.extend(produtos)
                print(f"Produtos coletados: {len(buff)}")

                inicio += 50
                fim += 50

                # sleep(0.5)

            else:
                print(f"ERRO HTTP: {req.status_code}")
                return []

    except Exception as erro:
        print(f"ERRO: {erro}")
        return []

    print(f"Total coletado: {len(buff)}")
    return buff


def tratamento():
    dados_api = access_api()

    for produto in dados_api:

        id = produto.get("productId")
        nome = produto.get("productName")
        brand = produto.get("brand")
        brandId = produto.get("brandId")

        print(id, nome, brand, brandId)
        print(type(produto))
        print(produto)

        f = json.dumps(produto, ensure_ascii=False, indent=4)
        print(f)

    return dados_api


def salvar_json():
    dados = tratamento()
    if not dados:
        print("Coleta falhou ou retornou vazia. Nenhum arquivo foi salvo.")
        return

    caminho = Path(__file__).resolve().parents[2] / "dados" / "bruto" / "catalogo_wella_raw.json"
    caminho.parent.mkdir(parents=True, exist_ok=True)

    with open(caminho, "w", encoding="utf-8") as arquivo:
        json.dump(dados, arquivo, ensure_ascii=False, indent=4)

    print(f"Arquivo salvo: {caminho}")


if __name__ == "__main__":
    salvar_json()


























# def tratamento():
#     dados_api = access_api()
#     skus = []
#
#     for produto in dados_api:
#         for item in produto.get("items", []):
#             skus.append(item)
#
#     print(f"Produtos recebidos: {len(dados_api)}")
#     print(f"SKUs recebidos: {len(skus)}")
#
#     return skus