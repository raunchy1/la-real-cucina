#!/bin/bash
set -e
cd "$(dirname "$0")"
rm -rf bozze/istentales-alghero
mkdir -p bozze/istentales-alghero
cp index.html bozze/istentales-alghero/
cp -r assets bozze/istentales-alghero/
echo "ok: bozze/istentales-alghero/ aggiornato"
