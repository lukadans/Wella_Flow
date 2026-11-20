# Wella Flow

## Trabalhar de qualquer lugar

[Abrir no GitHub Codespaces](https://codespaces.new/lukadans/Wella_Flow)

Crie um Codespace na branch `main`. O container instala Python, Git e as
dependencias do projeto automaticamente. No terminal do navegador, execute:

```bash
.venv/bin/python main.py doctor
```

Para continuar em outro computador, entre na mesma conta e reabra seu ambiente
em https://github.com/codespaces. Consulte [CONTRIBUTING.md](CONTRIBUTING.md)
para branches, commits e colaboracao. Este ambiente serve ao desenvolvimento;
nao e hospedagem de uma aplicacao em producao.

Configuracao baseada na [documentacao do GitHub Codespaces](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/setting-up-your-python-project-for-codespaces).

Projeto Python para extrair e tratar o catalogo Wella/VTEX. A raiz deste
projeto e a pasta `wella`, independente dos demais projetos em `scrap`.

## Ambiente local (Windows / PowerShell)

Requisito: Python 3.14. Na pasta `wella`, execute:

```powershell
.\scripts\setup.ps1
.\.venv\Scripts\python.exe main.py doctor
```

Para selecionar um Python especifico, use `-Python C:\caminho\python.exe`.
No PyCharm, configure o interpretador `wella\.venv\Scripts\python.exe`
e o diretorio de trabalho como a pasta `wella`. Nao e necessario ativar
o ambiente virtual para os comandos acima.

## Estrutura atual

- `main.py`: diagnostico das dependencias e do ambiente, sem chamadas externas.
- `extracao/`: reservado para modularizar a coleta.
- `tratamento/tratamento_slv.py`: tratamento experimental existente.
- `integracao/`: reservado para futuras integracoes.
- `wella_test/salvos/atualizar_catalago.py`: coletor existente da API publica.
- `wella_test/salvos/teste_catalogo_wella_ampliado.py`: benchmark com dados ficticios temporarios.
- `dados/`: catalogos locais, excluidos do Git.

O tratamento experimental usa um caminho relativo ao projeto e ainda tem loops aninhados
que repetem os produtos. Ele nao faz parte do diagnostico nem e executado na CI.
O arquivo `test.py` e um rascunho local, nao uma suite de testes, e esta excluido
do versionamento por conter exemplos com dados sensiveis.

## Verificacao sem acesso a servicos externos

```powershell
.\.venv\Scripts\python.exe -m pip check
.\.venv\Scripts\python.exe main.py doctor
.\.venv\Scripts\python.exe -m compileall -q main.py tratamento wella_test/salvos
.\.venv\Scripts\python.exe wella_test/salvos/teste_catalogo_wella_ampliado.py --quantidades 10 100 --repeticoes 1
```

O benchmark verifica buscas por nome, ID e SKU em arquivos sinteticos.
Nao cobre a coleta HTTP nem a qualidade do tratamento.

## Coleta manual

```powershell
.\.venv\Scripts\python.exe wella_test/salvos/atualizar_catalago.py
```

Este comando acessa a loja Wella e pode substituir
`dados/bruto/catalogo_wella_raw.json`. A preparacao do ambiente nao executa a coleta.
O coletor atual nao depende das credenciais Google locais.

## Trabalho com GitHub

O repositorio deve ter esta pasta como raiz. Credenciais, catalogos, ambiente
virtual e rascunhos locais ficam fora do Git. Antes do primeiro commit,
revise os arquivos selecionados; nao publique `test.py` ou `credentials.json`.

Trabalhe em branches de tarefa e abra pull requests para `main`.
O workflow `.github/workflows/checks.yml` prepara verificacoes em Windows e Linux;
so sera executado quando o codigo estiver em um repositorio GitHub com Actions habilitado.
O repositorio compartilhado e https://github.com/lukadans/Wella_Flow.
Consulte a aba Actions para o resultado de cada execucao da CI.
