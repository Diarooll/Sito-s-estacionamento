#!/usr/bin/env bash
# Atualiza o número de versão (?v=) de todos os CSS/JS no index.html.
# Rode antes de publicar para o navegador baixar os arquivos novos em vez do cache.
set -euo pipefail
cd "$(dirname "$0")/.."
novo=$(date +%Y%m%d%H%M)
sed -i -E "s/\?v=[0-9]+/?v=${novo}/g" index.html
echo "Versão atualizada para ${novo}"
