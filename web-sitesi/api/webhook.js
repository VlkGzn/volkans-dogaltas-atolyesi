// Webhook aracısı (Vercel API route): tarayıcı yalnız /api/webhook'a yazar; gerçek adres ve sır sunucuda kalır.
// Ortam değişkenleri (Vercel → Settings → Environment Variables veya yerelde .env): WEBHOOK_URL, WEBHOOK_SECRET (isteğe bağlı).
// WEBHOOK_URL yoksa hiçbir yere veri gönderilmez (204 döner).
import { bearer, hizSiniri, jetonGecerli } from './_guvenlik.js';

const OLAYLAR = new Set(['soru.gonderildi', 'sepet.gonderildi', 'bileklik.tasarlandi', 'siparis.verildi', 'stok.bildirimi_istendi']);
const TELEFON = /^[0-9+()\s-]{10,20}$/;
const EPOSTA = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const metin = (v, en) => typeof v === 'string' && v.trim().length > 0 && v.length <= en;

// Form olaylarında kişi bilgisi sunucuda da doğrulanır (tarayıcı denetimi tek başına yetmez).
// Kişi bilgisi içeren iki form olayı açık rıza kaydı olmadan kabul edilmez.
const rizaVar = (v) => v.riza === true && metin(v.riza_metni, 40) && metin(v.riza_zamani, 40);

function formGecerli(o) {
  const v = o.veri;
  if (o.olay === 'siparis.verildi') return metin(v.musteri_adi, 80) && metin(v.urun_id, 80) && TELEFON.test(v.telefon ?? '') && rizaVar(v);
  if (o.olay === 'stok.bildirimi_istendi') return metin(v.musteri_adi, 80) && metin(v.urun_id, 80) && EPOSTA.test(v.eposta ?? '') && v.eposta.length <= 120 && rizaVar(v);
  return true;
}
const EN_FAZLA_BAYT = 20 * 1024;

// Origin'in sunucu adı (host) bizim adresimizle aynı mı? http/https ayrımı yapılmaz (yerel denemede http olur).
function kendiSitemiz(req, origin) {
  try {
    return new URL(origin).host === (req.headers['x-forwarded-host'] || req.headers.host);
  } catch {
    return false;
  }
}

function govdeyiOku(req) {
  const ham = typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? null);
  if (Buffer.byteLength(ham) > EN_FAZLA_BAYT) return null;
  try {
    const o = JSON.parse(ham);
    const gecerli = o && typeof o === 'object' && o.surum === '1.0' && o.kaynak === 'web-sitesi'
      && OLAYLAR.has(o.olay) && o.veri && typeof o.veri === 'object';
    return gecerli && formGecerli(o) ? o : null;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).setHeader('Allow', 'POST').end();

  // Başka bir siteden gelen istekleri reddet (Origin başlığı varsa kendi adresimiz olmalı).
  const origin = req.headers.origin;
  if (origin && !kendiSitemiz(req, origin)) return res.status(403).end();

  // Hız sınırı: IP başına dakikada 10 istek (_guvenlik.js).
  const h = hizSiniri(req, 'webhook');
  if (!h.izinli) return res.status(429).setHeader('Retry-After', String(h.bekle)).end();

  const zarf = govdeyiOku(req);
  if (!zarf) return res.status(400).end();
  // Sipariş formu JWT ister (Authorization: Bearer <jeton>, /api/token'dan).
  if (zarf.olay === 'siparis.verildi' && !jetonGecerli(bearer(req), process.env.JWT_SECRET)) return res.status(401).end();

  // Adres tanımlı değilse hiçbir yere veri gönderilmez (doğrulamalar yine de çalışır).
  const adres = process.env.WEBHOOK_URL;
  if (!adres) return res.status(204).end();

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
