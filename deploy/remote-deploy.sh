#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: bash deploy/remote-deploy.sh <host> <user> [remote_dir]"
  exit 1
fi

HOST="$1"
USER_NAME="$2"
REMOTE_DIR="${3:-/tmp/yam-frontend-deploy}"

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
GENERATED_DIR="$PROJECT_DIR/deploy/.generated"
ARCHIVE_FILE="$GENERATED_DIR/yam-frontend.tar.gz"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.deploy.yml}"

timestamp="$(date +%Y%m%d-%H%M%S)"
git_sha="$(git -C "$PROJECT_DIR" rev-parse --short HEAD 2>/dev/null || echo nogit)"
version="${VERSION:-${timestamp}-${git_sha}}"
project_name="${PROJECT_NAME:-yam-ui}"

mkdir -p "$GENERATED_DIR"

cat > "$GENERATED_DIR/version.env" <<EOF
PROJECT_NAME=$project_name
VERSION=$version
EOF

echo "Packing frontend project..."
export COPYFILE_DISABLE=1
tar \
  --exclude='.git' \
  --exclude='**/node_modules' \
  --exclude='**/.idea' \
  --exclude='**/dist' \
  --exclude='deploy/.generated' \
  -czf "$ARCHIVE_FILE" \
  -C "$PROJECT_DIR" \
  .

echo "Uploading frontend package to $USER_NAME@$HOST:$REMOTE_DIR ..."
ssh "$USER_NAME@$HOST" "mkdir -p '$REMOTE_DIR'"
scp "$ARCHIVE_FILE" "$GENERATED_DIR/version.env" "$USER_NAME@$HOST:$REMOTE_DIR/"

echo "Deploying frontend on remote host..."
ssh "$USER_NAME@$HOST" "set -euo pipefail
cd '$REMOTE_DIR'
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
docker compose --env-file deploy/.generated/compose.env -f '$COMPOSE_FILE' build
docker compose --env-file deploy/.generated/compose.env -f '$COMPOSE_FILE' up -d --force-recreate
"

echo "Frontend remote deployment completed. Version: $version"
