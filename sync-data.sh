#!/bin/bash
# Sincroniza os JSONs da pasta data/ (fonte de verdade) para os projetos
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"

cp "$ROOT/data/minerals.json"    "$ROOT/web/src/data/minerals.json"
cp "$ROOT/data/states/mg.json"   "$ROOT/web/src/data/states/mg.json"
cp "$ROOT/data/minerals.json"    "$ROOT/ios/Resources/minerals.json"
cp "$ROOT/data/states/mg.json"   "$ROOT/ios/Resources/mg.json"

cp "$ROOT/data/minerals.json"    "$ROOT/android/app/src/main/assets/minerals.json"
cp "$ROOT/data/states/mg.json"   "$ROOT/android/app/src/main/assets/mg.json"

# Sync mineral images: web/public/images/minerals/ → ios/Resources/ and android assets
cp "$ROOT/web/public/images/minerals/"*.png "$ROOT/ios/Resources/" 2>/dev/null || true
cp "$ROOT/web/public/images/minerals/"*.png "$ROOT/android/app/src/main/assets/images/minerals/" 2>/dev/null || true

echo "✓ data/ e imagens sincronizados para web/, ios/ e android/"
