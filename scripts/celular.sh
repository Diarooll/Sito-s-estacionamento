#!/usr/bin/env bash
# Sobe o site na rede local para abrir no celular (mesmo Wi-Fi).
# Mostra o endereço e, se o qrencode estiver instalado, um QR code para escanear.
set -euo pipefail
cd "$(dirname "$0")/.."
porta=${1:-8000}
ip=$(hostname -I | awk '{print $1}')
url="http://${ip}:${porta}"
echo "Abra no celular: ${url}"
if command -v qrencode >/dev/null; then
  qrencode -t ansiutf8 "${url}"
fi
python3 -m http.server "${porta}" --bind 0.0.0.0
