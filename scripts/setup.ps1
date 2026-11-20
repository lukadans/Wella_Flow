param([string]$Python = 'python')
$ErrorActionPreference = 'Stop'
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$EnvironmentPath = Join-Path $ProjectRoot '.venv'
$EnvironmentPython = Join-Path $EnvironmentPath 'Scripts\python.exe'
if (-not (Test-Path -LiteralPath $EnvironmentPython)) {
    & $Python -m venv $EnvironmentPath
    if ($LASTEXITCODE -ne 0) { throw 'Falha ao criar o ambiente virtual.' }
}
& $EnvironmentPython -m pip --version
if ($LASTEXITCODE -ne 0) {
    & $EnvironmentPython -m ensurepip --upgrade --default-pip
    if ($LASTEXITCODE -ne 0) { throw 'Falha ao preparar pip no ambiente virtual.' }
}
& $EnvironmentPython -m pip install -r (Join-Path $ProjectRoot 'requirements.txt')
if ($LASTEXITCODE -ne 0) { throw 'Falha ao instalar as dependencias.' }
& $EnvironmentPython (Join-Path $ProjectRoot 'main.py') doctor
if ($LASTEXITCODE -ne 0) { throw 'Falha no diagnostico do ambiente.' }
