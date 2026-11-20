import json
from pathlib import Path

def colunas():
    caminho = Path(__file__).resolve().parents[1] / 'dados' / 'bruto' / 'catalogo_wella_raw.json'
    with caminho.open('r', encoding="UTF-8") as json_file:
        data = json.load(json_file)

        li = []

        for i in data:
            # print(len(i), type(i))

            """  Chaves que contem na primeira camada do json da VTEX  """
            # productId
            # productName
            # brand
            # brandId
            # brandImageUrl
            # linkText
            # productReference
            # productReferenceCode
            # categoryId
            # productTitle
            # metaTagDescription
            # releaseDate
            # clusterHighlights
            # productClusters
            # searchableClusters
            # categories
            # categoriesIds
            # link
            # Tipo
            # de
            # cabelo
            # Marca
            # Compre
            # Por
            # Informações
            # de
            # Produto
            # Contém
            # Descubra
            # mais
            # sobre
            # Indicação
            # Resultado
            # Composição
            # Como
            # Usar
            # allSpecifications
            # allSpecificationsGroups
            # description
            # items

            # for produtos in i['items']:
            # for produtos in i['items']:
            #     for produto in produtos['images']:
                    # salvar = {
                    #     'id_sku': produtos.get('itemId'),
                    #     'ean': produtos.get('ean'),
                    #     'nome': produtos.get('name'),
                    #     'marca': i.get('brand'),
                    #     'imagem': ...
                    # }

            for i in data:
                for produtos in i['items']:
                    if produtos.get('isKit') is True:
                        continue

                    imagens = produtos.get('images', [])
                    # volume = produtos.get('Tamanho', [])

                    salvar = {
                        'marca': i.get('brand'),
                        'marca_id': i.get('brandId'),
                        'full_descricao': i.get('productTitle'),

                        'id_sku': produtos.get('itemId'),
                        'ean': produtos.get('ean'),
                        'nome': produtos.get('nameComplete') or produtos.get('name'),
                        'volume': produtos.get('Tamanho'),
                        'imagem': imagens[0].get('imageUrl') if imagens else None
                    }

                    li.append(salvar)
    for i in li:
        print(i)
    print(len(li))

if __name__ == '__main__':
    colunas()
