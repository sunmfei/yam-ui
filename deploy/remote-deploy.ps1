param(
  [Parameter(Mandatory = $true)]
  [string]$HostName,
  [Parameter(Mandatory = $true)]
  [string]$UserName,
  [string]$RemoteDir = "/tmp/yam-frontend-deploy"
)

$ErrorActionPreference = "Stop"

$ProjectDir = Split-Path -Parent $PSScriptRoot
$GeneratedDir = Join-Path $ProjectDir "deploy/.generated"
$ArchivePath = Join-Path $GeneratedDir "yam-frontend.tar.gz"
$ComposeFile = if ($env:COMPOSE_FILE) { $env:COMPOSE_FILE } else { "docker-compose.deploy.yml" }

$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
try {
  $GitSha = (git -C $ProjectDir rev-parse --short HEAD).Trim()
} catch {
  $GitSha = "nogit"
}

$Version = if ($env:VERSION) { $env:VERSION } else { "$Timestamp-$GitSha" }
$ProjectName = if ($env:PROJECT_NAME) { $env:PROJECT_NAME } else { "yam-ui" }

New-Item -ItemType Directory -Force -Path $GeneratedDir | Out-Null
@"
PROJECT_NAME=$ProjectName
VERSION=$Version
"@ | Set-Content -Path (Join-Path $GeneratedDir "version.env") -Encoding UTF8

Write-Host "Packing frontend project..."
$env:COPYFILE_DISABLE = "1"
tar `
  --exclude='.git' `
  --exclude='**/node_modules' `
  --exclude='**/.idea' `
  --exclude='**/dist' `
  --exclude='deploy/.generated' `
  -czf $ArchivePath `
  -C $ProjectDir `
  .

ssh "$UserName@$HostName" "mkdir -p '$RemoteDir'"
scp $ArchivePath (Join-Path $GeneratedDir "version.env") "$UserName@$HostName`:$RemoteDir/"

$RemoteCommand = @"
set -euo pipefail
cd '$RemoteDir'
rm -rf current
mkdir -p current/deploy/.generated
tar -xzf yam-frontend.tar.gz -C current
cp version.env current/deploy/.generated/version.env
if [ -f current/.env ]; then
  cat current/.env > current/deploy/.generated/compose.env
else
  : > current/deploy/.generated/compose.env
fi
cat current/deploy/.generated/version.env >> current/deploy/.generated/compose.env
cd current
docker compose --env-file deploy/.generated/compose.env -f '$ComposeFile' build
docker compose --env-file deploy/.generated/compose.env -f '$ComposeFile' up -d --force-recreate
"@

ssh "$UserName@$HostName" $RemoteCommand

Write-Host "Frontend remote deployment completed. Version: $Version"
