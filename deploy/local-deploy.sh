#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
GENERATED_DIR="$PROJECT_DIR/deploy/.generated"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.deploy.yml}"
PROJECT_ENV="$PROJECT_DIR/.env"
COMPOSE_ENV_FILE="$GENERATED_DIR/compose.env"

timestamp="$(date +%Y%m%d-%H%M%S)"
git_sha="$(git -C "$PROJECT_DIR" rev-parse --short HEAD 2>/dev/null || echo nogit)"
version="${VERSION:-${timestamp}-${git_sha}}"
project_name="${PROJECT_NAME:-yam}"

mkdir -p "$GENERATED_DIR"

cat > "$GENERATED_DIR/version.env" <<EOF
PROJECT_NAME=$project_name
VERSION=$version
EOF

if [ -f "$PROJECT_ENV" ]; then
  cat "$PROJECT_ENV" > "$COMPOSE_ENV_FILE"
else
  : > "$COMPOSE_ENV_FILE"
fi
cat "$GENERATED_DIR/version.env" >> "$COMPOSE_ENV_FILE"

echo "Using frontend version: $version"

cd "$PROJECT_DIR"
docker compose --env-file "$COMPOSE_ENV_FILE" -f "$COMPOSE_FILE" build
docker compose --env-file "$COMPOSE_ENV_FILE" -f "$COMPOSE_FILE" up -d --force-recreate

echo "Frontend local deployment completed."
