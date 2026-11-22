#!/bin/sh
# Rigenera index.html (facoltativo, serve python3) e copia tutto in bozze/super-speedy/
set -e
cd "$(dirname "$0")"
if [ "$1" = "--gen" ]; then (cd tools && python3 gen.py); fi
rm -rf bozze/super-speedy
mkdir -p bozze/super-speedy
cp index.html bozze/super-speedy/index.html
cp -r assets bozze/super-speedy/assets
rm -f bozze/super-speedy/assets/img/meta.json
echo "ok: bozze/super-speedy/ aggiornato"
