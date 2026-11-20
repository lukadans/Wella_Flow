# Desenvolvimento do Wella Flow

O GitHub guarda o codigo compartilhado. Use o Codespaces para trabalhar pelo
navegador; reabra o mesmo Codespace em https://github.com/codespaces ao trocar
de computador. Um Codespace novo recebe apenas o que foi enviado ao GitHub.

## Comecar uma tarefa

```bash
git switch main
git pull --ff-only
git switch -c tarefa/nome-curto
.venv/bin/python main.py doctor
```

Descreva a tarefa em uma issue, com o resultado esperado. Para trabalhar com
um assistente conectado ao GitHub, informe repositorio, branch e issue ou PR.
O historico de uma conversa e os arquivos nao enviados nao sao sincronizados
automaticamente pelo GitHub.

## Salvar e compartilhar

```bash
git status --short
git diff
git add caminho/do/arquivo
git commit -m "Descreve a mudanca"
git push -u origin HEAD
```

Abra um pull request para `main` e confira as verificacoes. Revise os arquivos
antes do commit, especialmente por se tratar de um repositorio publico.
Nao versione credenciais, tokens, arquivos `.env`, catalogos reais ou `test.py`.

## Validar

```bash
.venv/bin/python -m pip check
.venv/bin/python main.py doctor
.venv/bin/python -m compileall -q main.py scripts tratamento wella_test/salvos
.venv/bin/python wella_test/salvos/teste_catalogo_wella_ampliado.py --quantidades 10 100 --repeticoes 1
```

No Windows, substitua `.venv/bin/python` por `.venv\Scripts\python.exe`.
O benchmark usa dados sinteticos. Coleta HTTP e tratamento experimental
precisam de validacao propria antes de uso em producao.

Ao terminar, salve as alteracoes com commit e push e pare o Codespace no menu
do GitHub. Codespaces esta sujeito a cota e cobranca da conta; consulte
https://docs.github.com/en/billing/concepts/product-billing/github-codespaces.
