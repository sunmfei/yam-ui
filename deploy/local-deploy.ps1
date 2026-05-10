$ErrorActionPreference = "Stop"

$ProjectDir = Split-Path -Parent $PSScriptRoot
$GeneratedDir = Join-Path $ProjectDir "deploy/.generated"
$ComposeFile = if ($env:COMPOSE_FILE) { $env:COMPOSE_FILE } else { "docker-compose.deploy.yml" }
$ProjectEnv = Join-Path $ProjectDir ".env"
$ComposeEnvFile = Join-Path $GeneratedDir "compose.env"

$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
try {
  $GitSha = (git -C $ProjectDir rev-parse --short HEAD).Trim()
} catch {
  $GitSha = "nogit"
}

$Version = if ($env:VERSION) { $env:VERSION } else { "$Timestamp-$GitSha" }
$ProjectName = if ($env:PROJECT_NAME) { $env:PROJECT_NAME } else { "yam" }

New-Item -ItemType Directory -Force -Path $GeneratedDir | Out-Null
@"
PROJECT_NAME=$ProjectName
VERSION=$Version
"@ | Set-Content -Path (Join-Path $GeneratedDir "version.env") -Encoding UTF8

if (Test-Path $ProjectEnv) {
  Get-Content $ProjectEnv | Set-Content -Path $ComposeEnvFile -Encoding UTF8
} else {
  "" | Set-Content -Path $ComposeEnvFile -Encoding UTF8
}
Add-Content -Path $ComposeEnvFile -Value "PROJECT_NAME=$ProjectName"
Add-Content -Path $ComposeEnvFile -Value "VERSION=$Version"

Write-Host "Using frontend version: $Version"

Push-Location $ProjectDir
docker compose --env-file $ComposeEnvFile -f $ComposeFile build
docker compose --env-file $ComposeEnvFile -f $ComposeFile up -d --force-recreate
Pop-Location

Write-Host "Frontend local deployment completed."
