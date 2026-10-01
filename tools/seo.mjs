// SEO a partir de seo.config.json (usado por tools/build.mjs). Só dado confirmado do CLIENTE.md.
import { readFileSync, writeFileSync } from "node:fs";
import { aplicarLd } from "./cliente.mjs";
export function seo() {
  const cfg = JSON.parse(readFileSync("seo.config.json", "utf8"));
  const D = cfg.domain ? cfg.domain.replace(/\/$/, "") : null;
  const B = D || "https://<domínio>";            // placeholder legível enquanto não há domínio
  const abs = p => `${B}/${p}`;
  const desc = "Restaurante japonês na Av. Antártico, 240, Jardim do Mar, São Bernardo do Campo (SP). Refeição no local, retirada e entrega. Telefone (11) 4121-5552.";
  const title = "Yukusue Sushi Antártico — Restaurante japonês em São Bernardo do Campo";
  const ifD = (tag, why) => D ? tag : `<!-- AGUARDA DOMÍNIO (seo.config.json): ${tag.replace(/--/g, "- -")} -->`;

  // JSON-LD: Restaurant — só campos confirmados na ficha oficial (CLIENTE.md)
  const ld = {
    "@context": "https://schema.org", "@type": "Restaurant",
    name: "Yukusue Sushi Antártico",
    servesCuisine: "Japonesa",
    telephone: "+55 11 4121-5552",
    address: { "@type": "PostalAddress", streetAddress: "Av. Antártico, 240 - Jardim do Mar", addressLocality: "São Bernardo do Campo",
      addressRegion: "SP", postalCode: "09726-150", addressCountry: "BR" },
    amenityFeature: ["Refeição no local", "Retirada na porta", "Entrega sem contato"].map(n => ({ "@type": "LocationFeatureSpecification", name: n, value: true })),
  };
  aplicarLd(ld);   // campos de cliente.config.json só quando confirmados
  if (D) Object.assign(ld, { "@id": `${D}/#restaurante`, url: `${D}/`, image: abs(cfg.ogImage) });

  const head = `
  ${ifD(`<link rel="canonical" href="${B}/">`)}
  <meta name="theme-color" content="${cfg.themeColor}">
  <meta name="robots" content="index, follow">
  <link rel="icon" href="favicon.ico" sizes="48x48">
  <link rel="icon" href="icons/icon-32.png" type="image/png" sizes="32x32">
  <link rel="apple-touch-icon" href="icons/icon-180.png">
  <link rel="manifest" href="site.webmanifest">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="${cfg.locale}">
  <meta property="og:site_name" content="${cfg.siteName}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  ${ifD(`<meta property="og:url" content="${B}/">`)}
  ${ifD(`<meta property="og:image" content="${abs(cfg.ogImage)}">`)}
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${cfg.ogImageAlt}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${desc}">
  ${ifD(`<meta name="twitter:image" content="${abs(cfg.ogImage)}">`)}
  <meta name="twitter:image:alt" content="${cfg.ogImageAlt}">
  <!-- Dados estruturados: só o que é oficial no Google Maps (CLIENTE.md).
       NÃO publicados até o cliente confirmar (PENDÊNCIA-CLIENTE):
         "priceRange": "R$ 80–160"           (informado por usuários, não pelo restaurante)
         "openingHoursSpecification": [...]  (só há "abre às 12:00" de um dia)
         "geo": {...}                        (só plus code 8C6Q+J3; sem coordenadas confirmadas)
         "acceptsReservations", "hasMenu", OrderAction (link do pedido on-line desconhecido)
       "aggregateRating" NÃO é usado: a nota 4,3 é do Google (avaliação de terceiros). -->
  <script type="application/ld+json">${JSON.stringify(ld)}</script>`;

  writeFileSync("site/robots.txt", `User-agent: *\nAllow: /\n${D ? `Sitemap: ${D}/sitemap.xml` : "# Sitemap: <domínio>/sitemap.xml  (ativa sozinho quando seo.config.json tiver \"domain\")"}\n`);
  writeFileSync("site/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${D ? `  <url><loc>${D}/</loc><changefreq>monthly</changefreq></url>` : "  <!-- AGUARDA DOMÍNIO: <url><loc>https://<domínio>/</loc></url> -->"}\n</urlset>\n`);
  writeFileSync("site/site.webmanifest", JSON.stringify({
    name: cfg.siteName, short_name: "Yukusue", lang: "pt-BR", start_url: "./", display: "browser",
    background_color: cfg.themeColor, theme_color: cfg.themeColor,
    icons: [{ src: "icons/icon-192.png", sizes: "192x192", type: "image/png" }, { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" }]
  }, null, 2));
  return head;
}
