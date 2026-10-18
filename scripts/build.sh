#!/usr/bin/env bash
# Monta a pasta dist/ que vai para o ar (Cloudflare Pages).
# Copia só os arquivos do site, atualiza a versão (?v=) e, se SITE_URL estiver
# definida (ex.: https://www.sitos.com.br), deixa as URLs de compartilhamento
# absolutas e gera canonical, robots.txt e sitemap.xml.
#
#   SITE_URL=https://www.sitos.com.br ./scripts/build.sh
set -euo pipefail
cd "$(dirname "$0")/.."

saida=dist
site_url="${SITE_URL:-}"
site_url="${site_url%/}"

rm -rf "$saida"
mkdir -p "$saida"
cp -r index.html css js assets "$saida/"

# Versão nova a cada deploy, para o navegador não usar CSS/JS antigos do cache.
versao=$(date +%Y%m%d%H%M)
sed -i -E "s/\?v=[0-9]+/?v=${versao}/g" "$saida/index.html"

if [ -n "$site_url" ]; then
  # WhatsApp/Facebook só mostram a imagem de prévia com URL absoluta.
  sed -i "s#\"assets/img/og.jpg\"#\"${site_url}/assets/img/og.jpg\"#g" "$saida/index.html"
  sed -i "s#<meta property=\"og:type\" content=\"website\">#<link rel=\"canonical\" href=\"${site_url}/\">\n  <meta property=\"og:url\" content=\"${site_url}/\">\n  &#" "$saida/index.html"

  cat > "$saida/robots.txt" <<EOF
User-agent: *
Allow: /

Sitemap: ${site_url}/sitemap.xml
EOF

  cat > "$saida/sitemap.xml" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${site_url}/</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
  </url>
</urlset>
EOF
else
  echo "Aviso: SITE_URL não definida; sem canonical, robots.txt e sitemap.xml." >&2
fi

# Cabeçalhos do Cloudflare Pages: segurança básica e cache.
# CSS tem ?v= que muda a cada deploy, então pode ficar em cache por 1 ano.
# JS fica só 1 dia: os imports entre módulos dependem do importmap para pegar a versão.
cat > "$saida/_headers" <<'EOF'
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: camera=(), microphone=(), payment=()

/
  Cache-Control: public, max-age=0, must-revalidate

/index.html
  Cache-Control: public, max-age=0, must-revalidate

/css/*
  Cache-Control: public, max-age=31536000, immutable

/js/*
  Cache-Control: public, max-age=86400

/assets/*
  Cache-Control: public, max-age=604800
EOF

echo "Pronto: ${saida}/ (versão ${versao}${site_url:+, ${site_url}})"
