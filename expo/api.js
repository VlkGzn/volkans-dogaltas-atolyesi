// Mobil uygulamanın API istemcisi: web sitesiyle AYNI sunucu uçlarını kullanır (/api/token, /api/webhook).
// Adres: EXPO_PUBLIC_API_URL (yoksa canlı site). Gizli anahtar yok; secret'lar yalnız sunucudadır.
import { GIZLILIK_SURUMU } from './veri/gizlilik.js';

export const API_URL = (process.env.EXPO_PUBLIC_API_URL || 'https://volkans-dogaltas-atolyesi.vercel.app').replace(/\/$/, '');

// Sunucudaki (web-sitesi/api/webhook.js) kurallarla aynı; yoksa kullanıcı onay görür ama kayıt reddedilir.
export const TELEFON = /^[0-9+()\s-]{10,20}$/;
export const EPOSTA = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const telefonGecerli = (t) => TELEFON.test(t.trim()) && t.replace(/\D/g, '').length >= 10;
export const epostaGecerli = (e) => EPOSTA.test(e.trim()) && e.trim().length <= 120;

const yeniKimlik = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  const r = (Math.random() * 16) | 0;
  return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
});
const turkiyeZamani = () => new Date(Date.now() + 3 * 3600 * 1000).toISOString().replace(/\.\d{3}Z$/, '+03:00');
const rizaKaydi = () => ({ riza: true, riza_zamani: turkiyeZamani(), riza_metni: GIZLILIK_SURUMU });
const zarf = (olay, veri) => JSON.stringify({
  surum: '1.0', olay, kimlik: yeniKimlik(), zaman: turkiyeZamani(), kaynak: 'web-sitesi', veri: { ...veri, platform: 'mobil' },
});

// Her iki fonksiyon { ok, mesaj } döner. Ürün adı/fiyat gönderilmez; sunucu urun_id'den kendi listesiyle yazar.
async function yolla(olay, veri, jetonGerek) {
  try {
    const basliklar = { 'Content-Type': 'text/plain' };
    if (jetonGerek) {
      const t = await fetch(`${API_URL}/api/token`, { method: 'POST' });
      if (!t.ok) return { ok: false, mesaj: 'Sunucuya bağlanılamadı. Biraz sonra yeniden dene.' };
      basliklar.Authorization = `Bearer ${(await t.json()).jeton}`;
    }
    const r = await fetch(`${API_URL}/api/webhook`, { method: 'POST', headers: basliklar, body: zarf(olay, veri) });
    if (r.status === 429) return { ok: false, mesaj: 'Çok fazla deneme yapıldı. Bir dakika sonra yeniden dene.' };
    if (r.status === 400) return { ok: false, mesaj: 'Bilgiler kabul edilmedi. Alanları kontrol et.' };
    return r.ok ? { ok: true } : { ok: false, mesaj: 'Gönderilemedi. Biraz sonra yeniden dene.' };
  } catch {
    return { ok: false, mesaj: 'İnternet bağlantını kontrol et.' };
  }
}

export const siparisGonder = (f) => yolla('siparis.verildi',
  { musteri_adi: f.ad.trim(), telefon: f.telefon.trim(), urun_id: f.urunId, ...rizaKaydi(), kanal: 'form' }, true);

export const stokGonder = (f) => yolla('stok.bildirimi_istendi',
  { musteri_adi: f.ad.trim(), eposta: f.eposta.trim(), urun_id: f.urunId, ...rizaKaydi(), kanal: 'form' }, false);
