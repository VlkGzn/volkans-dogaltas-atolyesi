// Webhook aracısı (Vercel API route): tarayıcı yalnız /api/webhook'a yazar; gerçek adres ve sır sunucuda kalır.
// Ortam değişkenleri (Vercel → Settings → Environment Variables veya yerelde .env): WEBHOOK_URL, WEBHOOK_SECRET (isteğe bağlı).
// WEBHOOK_URL yoksa hiçbir yere veri gönderilmez (204 döner).
const OLAYLAR = new Set(['soru.gonderildi', 'sepet.gonderildi', 'bileklik.tasarlandi']);
const EN_FAZLA_BAYT = 20 * 1024;

const sunucuOrigin = (req) => `https://${req.headers['x-forwarded-host'] || req.headers.host}`;

function govdeyiOku(req) {
  const ham = typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? null);
  if (Buffer.byteLength(ham) > EN_FAZLA_BAYT) return null;
  try {
    const o = JSON.parse(ham);
    const gecerli = o && typeof o === 'object' && o.surum === '1.0' && o.kaynak === 'web-sitesi'
      && OLAYLAR.has(o.olay) && o.veri && typeof o.veri === 'object';
    return gecerli ? o : null;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).setHeader('Allow', 'POST').end();

  // Başka bir siteden gelen istekleri reddet (Origin başlığı varsa kendi adresimiz olmalı).
  const origin = req.headers.origin;
  if (origin && origin !== sunucuOrigin(req)) return res.status(403).end();

  const adres = process.env.WEBHOOK_URL;
  if (!adres) return res.status(204).end();

  const zarf = govdeyiOku(req);
  if (!zarf) return res.status(400).end();

  try {
    const basliklar = { 'Content-Type': 'application/json' };
    if (process.env.WEBHOOK_SECRET) basliklar['X-Webhook-Secret'] = process.env.WEBHOOK_SECRET;
    await fetch(adres, {
      method: 'POST', headers: basliklar, body: JSON.stringify(zarf), signal: AbortSignal.timeout(5000),
    });
  } catch {
    /* webhook hatası müşteriyi etkilemesin */
  }
  return res.status(204).end();
}
