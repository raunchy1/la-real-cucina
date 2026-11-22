#!/bin/sh
# Copia index.html e assets/ in bozze/muraiya-olbia/ per il deploy WebSardegna
set -e
cd "$(dirname "$0")"
rm -rf bozze/muraiya-olbia
mkdir -p bozze/muraiya-olbia
cp index.html bozze/muraiya-olbia/index.html
cp -r assets bozze/muraiya-olbia/assets
echo "ok: bozze/muraiya-olbia/ aggiornato"
