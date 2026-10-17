// Sipariş formu için kısa ömürlü JWT verir (10 dk). /api/webhook 'siparis.verildi' olayını bu jetonsuz kabul etmez.
import { hizSiniri, jetonUret } from './_guvenlik.js';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).setHeader('Allow', 'POST').end();
  const origin = req.headers.origin;
  try {
    if (origin && new URL(origin).host !== (req.headers['x-forwarded-host'] || req.headers.host)) return res.status(403).end();
  } catch {
    return res.status(403).end();
  }
  const h = hizSiniri(req, 'token');
  if (!h.izinli) return res.status(429).setHeader('Retry-After', String(h.bekle)).end();
  if (!process.env.JWT_SECRET) return res.status(503).end();
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json(jetonUret(process.env.JWT_SECRET));
}
