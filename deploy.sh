#!/usr/bin/env bash
# Deploy the CapXRx marketing splash to the `capxrx-web` Cloudflare Pages project.
#
# This is the canonical way to ship this site. The Pages project's Git
# auto-deploy is intentionally DISCONNECTED (it had been wired to the wrong
# repo — the CapBx app — which clobbered capxrx.com with the unbuilt app).
# So we publish via direct upload instead. Zero build; just static files.
#
# Usage:
#   ./deploy.sh           # deploy current committed HEAD
#
# It exports the tracked files (excludes .git/.wrangler/node_modules) into a
# clean temp dir and uploads that, so nothing sensitive is ever published.
set -euo pipefail

PROJECT="capxrx-web"
STAGE="$(mktemp -d)/capxrx-web-deploy"

cleanup() { rm -rf "$(dirname "$STAGE")"; }
trap cleanup EXIT

echo "▸ Staging tracked files from HEAD..."
mkdir -p "$STAGE"
git archive HEAD | tar -x -C "$STAGE"

echo "▸ Deploying to Cloudflare Pages project '$PROJECT' (production / main)..."
npx --yes wrangler pages deploy "$STAGE" \
  --project-name="$PROJECT" \
  --branch=main \
  --commit-dirty=true

echo "✅ Done. Verify: https://capxrx.com  and  https://www.capxrx.com"
