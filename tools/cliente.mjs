// Dados do cliente (cliente.config.json) aplicados ao HTML e ao JSON-LD. Usado por build.mjs e seo.mjs.
import { readFileSync } from "node:fs";
export const cliente = () => JSON.parse(readFileSync("cliente.config.json", "utf8"));
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

export function aplicarHtml(html) {
  const c = cliente();
  html = html.replace(/(<p class="s-local__horario"[^>]*>)[^<]*(<\/p>)/, `$1${esc(c.horario.texto)}$2`);
  if (c.pedidoOnline.url) html = html.replace(/<a class="s-local__cta"([^>]*) href="tel:[^"]*">[^<]*<\/a>/,
    `<a class="s-local__cta"$1 href="${esc(c.pedidoOnline.url)}" rel="noopener">${esc(c.pedidoOnline.rotulo)}</a>`);
  if (c.whatsapp.numero) html = html.replace(/(<p class="s-local__servicos"[^>]*>[^<]*<\/p>)/,
    `$1\n        <a class="s-local__whats" data-scrub href="https://wa.me/${esc(c.whatsapp.numero)}" rel="noopener">WhatsApp</a>`);
  return html;
}

export function aplicarLd(ld) {
  const c = cliente();
  if (c.horario.confirmado && c.horario.semana.length) ld.openingHoursSpecification = c.horario.semana.map(h => ({
    "@type": "OpeningHoursSpecification", dayOfWeek: h.dias.map(d => "https://schema.org/" + ({ Mo: "Monday", Tu: "Tuesday", We: "Wednesday", Th: "Thursday", Fr: "Friday", Sa: "Saturday", Su: "Sunday" })[d]), opens: h.abre, closes: h.fecha }));
  if (c.faixaDePreco.confirmado) ld.priceRange = c.faixaDePreco.valor;
  if (c.geo.lat != null && c.geo.lng != null) ld.geo = { "@type": "GeoCoordinates", latitude: c.geo.lat, longitude: c.geo.lng };
  if (c.reservas.aceita != null) ld.acceptsReservations = c.reservas.aceita;
  if (c.pedidoOnline.url) ld.potentialAction = { "@type": "OrderAction", target: c.pedidoOnline.url };
  const same = [c.redes.instagram, c.redes.facebook].filter(Boolean); if (same.length) ld.sameAs = same;
  if (c.email) ld.email = c.email;
  if (c.whatsapp.numero) ld.contactPoint = { "@type": "ContactPoint", contactType: "customer service", telephone: "+" + c.whatsapp.numero, contactOption: "WhatsApp" };
  return ld;
}

export function statusPublicacao(domain) {
  const c = cliente(), falta = [];
  if (!domain) falta.push("domínio (seo.config.json)");
  for (const [k, v] of Object.entries(c.autorizacoes)) if (k[0] !== "_" && !v) falta.push("autorização/arquivo: " + k);
  if (!c.horario.confirmado) falta.push("horário confirmado");
  return falta;
}
