// Ortak güvenlik yardımcıları (başında _ olduğu için Vercel bunu adres olarak yayınlamaz).
// 1) Basit JWT (HS256, Node crypto; ek paket yok) — sır: JWT_SECRET (yalnız sunucu).
// 2) Hız sınırı: IP başına dakikada en fazla SINIR istek.
import { createHmac, timingSafeEqual } from 'node:crypto';

const b64 = (o) => Buffer.from(typeof o === 'string' ? o : JSON.stringify(o)).toString('base64url');
const imza = (veri, sir) => createHmac('sha256', sir).update(veri).digest('base64url');

export const JETON_OMRU_SN = 10 * 60;

export function jetonUret(sir, simdi = Date.now()) {
  const sn = Math.floor(simdi / 1000);
  const govde = `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ aud: 'siparis', iat: sn, exp: sn + JETON_OMRU_SN })}`;
  return { jeton: `${govde}.${imza(govde, sir)}`, bitis: sn + JETON_OMRU_SN };
}

// Geçerliyse true: imza doğru, algoritma HS256, hedef 'siparis', süresi dolmamış.
export function jetonGecerli(jeton, sir, simdi = Date.now()) {
  if (!sir || typeof jeton !== 'string') return false;
  const p = jeton.split('.');
  if (p.length !== 3) return false;
  try {
    const beklenen = Buffer.from(imza(`${p[0]}.${p[1]}`, sir));
    const gelen = Buffer.from(p[2]);
    if (beklenen.length !== gelen.length || !timingSafeEqual(beklenen, gelen)) return false;
    const baslik = JSON.parse(Buffer.from(p[0], 'base64url').toString());
    const yuk = JSON.parse(Buffer.from(p[1], 'base64url').toString());
    return baslik.alg === 'HS256' && yuk.aud === 'siparis' && yuk.exp > Math.floor(simdi / 1000);
  } catch {
    return false;
  }
}

export const bearer = (req) => (req.headers.authorization || '').replace(/^Bearer\s+/i, '');

// Sabit pencere sayacı. Not: bellekte tutulur; Vercel'de her sunucu örneği kendi sayacını sayar.
// Sıkı koruma için Upstash/Vercel KV gibi ortak depo gerekir.
const SINIR = 10;
const PENCERE_MS = 60 * 1000;
const sayac = new Map();

export function hizSiniri(req, ad, simdi = Date.now()) {
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'bilinmiyor').split(',')[0].trim();
  const anahtar = `${ad}:${ip}`;
  for (const [k, v] of sayac) if (simdi - v.baslangic >= PENCERE_MS) sayac.delete(k);
  const kayit = sayac.get(anahtar) ?? { baslangic: simdi, adet: 0 };
  kayit.adet += 1;
  sayac.set(anahtar, kayit);
  return { izinli: kayit.adet <= SINIR, bekle: Math.ceil((kayit.baslangic + PENCERE_MS - simdi) / 1000) };
}
