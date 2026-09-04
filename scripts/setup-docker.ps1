# ── Mateka: Script de Instalação e Inicialização do Docker ──
# Este script pode ser executado como Administrador para finalizar
# a instalação do Docker Desktop já baixado.

$ErrorActionPreference = "Continue"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  MATEKA - Setup do Docker Desktop       " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Verifica se o docker já está no PATH
$dockerCmd = Get-Command docker -ErrorAction SilentlyContinue
if ($dockerCmd) {
    Write-Host "Docker já está instalado: $(docker --version)" -ForegroundColor Green
    exit 0
}

# Caminho do instalador baixado pelo winget
$installer = Get-ChildItem -Path "$env:TEMP\WinGet" -Recurse -Filter "*Docker*Installer.exe" -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName

if (-not $installer -or -not (Test-Path $installer)) {
    Write-Host "Instalador não encontrado no cache temporário. Baixando via winget..." -ForegroundColor Yellow
    winget install Docker.DockerDesktop --accept-source-agreements --accept-package-agreements
    exit 0
}

Write-Host "Instalador encontrado em: $installer" -ForegroundColor Green
Write-Host "Iniciando instalação do Docker Desktop..." -ForegroundColor Cyan
Write-Host "Caso o Windows exiba uma confirmação de Administrador (UAC), clique em 'Sim'." -ForegroundColor Yellow

Start-Process -FilePath $installer -ArgumentList "install", "--quiet" -Wait

Write-Host "Instalação concluída! Inicie o Docker Desktop pelo menu Iniciar." -ForegroundColor Green
