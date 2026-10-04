// Webhook gönderimi — AtölyeKart v1 zarfı (bkz. .claude/skills/atolyekart-standartlari/references/webhook-formati.md).
// Adres web-sitesi/.env içindeki VITE_WEBHOOK_URL'den okunur; boşsa hiçbir şey gönderilmez.
// Webhook hatası müşterinin WhatsApp'a geçmesini asla engellemez.
import { FIYAT, taneOzeti, tl, urunFiyatSayi, urunFiyati, urunMesaji } from '../data/site.js';

const ADRES = import.meta.env.VITE_WEBHOOK_URL;

const turkiyeZamani = () =>
  new Date(Date.now() + 3 * 3600 * 1000).toISOString().replace(/\.\d{3}Z$/, '+03:00');

// UUID v4; crypto.randomUUID yalnız https'te var, yoksa getRandomValues ile üretilir.
const yeniKimlik = () => {
  if (crypto.randomUUID) return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40; b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
};

export function webhookGonder(olay, veri) {
  if (!ADRES) return;
  try {
    const govde = JSON.stringify({
      surum: '1.0', olay, kimlik: yeniKimlik(), zaman: turkiyeZamani(), kaynak: 'web-sitesi', veri,
    });
    // text/plain: tarayıcı ek izin (CORS ön kontrolü) istemez; sendBeacon sayfa WhatsApp'a geçerken de gönderir.
    const gitti = navigator.sendBeacon?.(ADRES, new Blob([govde], { type: 'text/plain' }));
    if (!gitti) fetch(ADRES, { method: 'POST', body: govde, keepalive: true, mode: 'no-cors' });
  } catch {
    /* sessizce geç */
  }
}

// bolum: 'koleksiyon' | 'atolyeden-yeni' | 'buyuk-fotograf'
export const soruVerisi = (urun, bolum) => ({
  urun_id: urun.id,
  urun_adi: urun.ad,
  kategori: urun.kategori,
  cinsiyet: urun.cinsiyet,
  fiyat_metni: urunFiyati(urun),
  bolum,
  kanal: 'whatsapp',
  mesaj: urunMesaji(urun),
});

export const bileklikVerisi = (taneler, mesaj) => ({
  tane_sayisi: taneler.length,
  taneler,
  ozet: taneOzeti(taneler),
  fiyat_metni: tl(FIYAT.bileklik),
  kanal: 'whatsapp',
  mesaj,
});

// satirlar: [{ urun, adet }] (Sepet.jsx sepetSatirlari)
export const sepetVerisi = (satirlar, toplam, mesaj) => ({
  kalemler: satirlar.map(({ urun, adet }) => ({
    urun_id: urun.id,
    urun_adi: urun.ad,
    kategori: urun.kategori,
    cinsiyet: urun.cinsiyet,
    adet,
    birim_fiyat: urunFiyatSayi(urun),
    tutar: urunFiyatSayi(urun) * adet,
  })),
  kalem_sayisi: satirlar.length,
  urun_adedi: satirlar.reduce((t, s) => t + s.adet, 0),
  toplam_tutar: toplam,
  toplam_metni: tl(toplam),
  kanal: 'whatsapp',
  mesaj,
});
