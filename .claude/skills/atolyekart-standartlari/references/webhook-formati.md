# Webhook formatı — AtölyeKart v1

Webhook: bir olay olduğunda bilgiyi otomatik olarak başka bir servise (Make, Zapier, n8n, Google Apps Script…) HTTP POST ile gönderen bağlantı.

## İçindekiler
1. Zarf (her mesajda aynı)
2. Site → dış servis: `soru.gonderildi`, `bileklik.tasarlandi`
3. Dış servis → proje: `urun.eklendi`, `urun.guncellendi`, `urun.kaldirildi`
4. Proje → dış servis: `sosyal.paylasim_hazir`
5. Güvenlik ve kişisel veri
6. Sitede uygulama (React)
7. Doğrulama betiği

---

## 1. Zarf

```json
{
  "surum": "1.0",
  "olay": "soru.gonderildi",
  "kimlik": "2b0c6f0e-3a9d-4c1e-9f55-7e0a8d1b4c21",
  "zaman": "2026-10-04T14:32:05+03:00",
  "kaynak": "web-sitesi",
  "veri": { }
}
```

| Alan | Kural |
|---|---|
| `surum` | Şu an `"1.0"`. Alan kaldırma/anlam değiştirme = büyük sürüm (`"2.0"`); yeni isteğe bağlı alan = sürüm aynı kalır |
| `olay` | `nesne.eylem` biçiminde, küçük harf, Türkçe, ASCII (`urun.guncellendi`); listedeki adlardan biri |
| `kimlik` | UUID v4 (`crypto.randomUUID()`); alıcı aynı kimliği ikinci kez görürse yok sayar (tekrar gönderime karşı) |
| `zaman` | ISO 8601, saat dilimi ile, Türkiye saati `+03:00` |
| `kaynak` | `web-sitesi` · `tablo` (Google Sheets vb.) · `otomasyon` · `yonetici` |
| `veri` | Olaya özel içerik (aşağıda) |

Ortak değer kuralları:
- Alan adları Türkçe, ASCII, `snake_case` (`tane_sayisi`, `urun_id`).
- `kategori`: `tesbih` · `bileklik` · `kolye` · `yuzuk` — `cinsiyet`: `erkek` · `kadin`.
- Ürün kimliği `urun_id` = `urunler.js`'teki `id` (kebab-case).
- Fiyat sayısal alanlar TL cinsinden tam sayı (`1500`), görünen metin ayrı alanda (`"1.500 TL"`).
- Görünen metinlerde "Tesbih" yazımı.

## 2. Site → dış servis

### `soru.gonderildi`
Müşteri bir ürün kartında veya büyük fotoğrafta "WhatsApp'tan sor"a bastığında.

```json
{
  "surum": "1.0",
  "olay": "soru.gonderildi",
  "kimlik": "8f1d2c3b-1111-4a2b-9c3d-000000000001",
  "zaman": "2026-10-04T14:32:05+03:00",
  "kaynak": "web-sitesi",
  "veri": {
    "urun_id": "yesim-tesbih",
    "urun_adi": "Yeşim Tesbih",
    "kategori": "tesbih",
    "cinsiyet": "erkek",
    "fiyat_metni": "1.500 TL",
    "bolum": "koleksiyon",
    "kanal": "whatsapp",
    "mesaj": "Merhaba, sitenizdeki \"Yeşim Tesbih\" (Erkek · Tesbih) hakkında bilgi almak istiyorum."
  }
}
```
`bolum`: `koleksiyon` · `atolyeden-yeni` · `buyuk-fotograf`. `mesaj` = `urunMesaji(urun)`.

### `bileklik.tasarlandi`
"Kendin tasarla"da "WhatsApp'tan sipariş ver"e basıldığında.

```json
{
  "surum": "1.0",
  "olay": "bileklik.tasarlandi",
  "kimlik": "8f1d2c3b-1111-4a2b-9c3d-000000000002",
  "zaman": "2026-10-04T14:40:11+03:00",
  "kaynak": "web-sitesi",
  "veri": {
    "tane_sayisi": 3,
    "taneler": ["ametist", "kaplan", "kaplan"],
    "ozet": [{ "tas": "ametist", "tas_adi": "Ametist", "adet": 1 }, { "tas": "kaplan", "tas_adi": "Kaplan Gözü", "adet": 2 }],
    "fiyat_metni": "750 – 1.250 TL",
    "kanal": "whatsapp",
    "mesaj": "Merhaba, kendi tasarladığım bilekliği sipariş etmek istiyorum (3 taş): Ametist x1, Kaplan Gözü x2"
  }
}
```
`taneler` sırayla dizilim (en fazla 30); taş kimlikleri `TASLAR`'daki `id`'ler. `tane_sayisi` = `taneler.length`.

### `sepet.gonderildi`
Müşteri sepet panelinde "Siparişi WhatsApp'tan gönder"e bastığında (online ödeme yok; sipariş WhatsApp'ta netleşir).

```json
{
  "surum": "1.0",
  "olay": "sepet.gonderildi",
  "kimlik": "8f1d2c3b-1111-4a2b-9c3d-000000000007",
  "zaman": "2026-10-05T15:10:00+03:00",
  "kaynak": "web-sitesi",
  "veri": {
    "kalemler": [
      { "urun_id": "yesim-tesbih", "urun_adi": "Yeşim Tesbih", "kategori": "tesbih", "cinsiyet": "erkek", "adet": 2, "birim_fiyat": 1500, "tutar": 3000 },
      { "urun_id": "barok-inci-yuzuk", "urun_adi": "Barok İnci Yüzük", "kategori": "yuzuk", "cinsiyet": "kadin", "adet": 1, "birim_fiyat": 15000, "tutar": 15000 }
    ],
    "kalem_sayisi": 2,
    "urun_adedi": 3,
    "toplam_tutar": 18000,
    "toplam_metni": "18.000 TL",
    "kanal": "whatsapp",
    "mesaj": "Merhaba, sitenizden şu ürünleri sipariş etmek istiyorum:\n2× Yeşim Tesbih — 3.000 TL\n1× Barok İnci Yüzük — 15.000 TL\nToplam: 18.000 TL"
  }
}
```
Tutarlar TL cinsinden tam sayı; `tutar = adet × birim_fiyat`, `toplam_tutar` = tutarların toplamı (doğrulayıcı kontrol eder).
Google Sheets'te her kalem ayrı satır isteniyorsa Make'te "Iterator" ile `kalemler` dizisi açılır.

## 3. Dış servis → proje (ürün güncelleme)

Statik site webhook *alamaz*; bu mesajları bir otomasyon (n8n/Make) ya da Claude işler ve sonucu `src/data/urunler.js`'e yazar, ardından `npm run build` + yayın yapılır. Bu yüzden alanlar urunler.js ile birebir eşleşir.

### `urun.eklendi`
```json
{
  "surum": "1.0",
  "olay": "urun.eklendi",
  "kimlik": "8f1d2c3b-1111-4a2b-9c3d-000000000003",
  "zaman": "2026-10-05T10:00:00+03:00",
  "kaynak": "tablo",
  "veri": {
    "urun_id": "kirmizi-akik-tesbih",
    "ad": "Kırmızı Akik Tesbih",
    "kategori": "tesbih",
    "cinsiyet": "erkek",
    "aciklama": "Gümüş imame ve püsküllü",
    "fotograflar": ["27-kirmizi-akik-tesbih.jpg"],
    "yeni": true
  }
}
```

### `urun.guncellendi`
Yalnız değişen alanlar `degisiklikler` içinde; `urun_id` değiştirilemez.
```json
{
  "surum": "1.0",
  "olay": "urun.guncellendi",
  "kimlik": "8f1d2c3b-1111-4a2b-9c3d-000000000004",
  "zaman": "2026-10-05T10:05:00+03:00",
  "kaynak": "tablo",
  "veri": {
    "urun_id": "sitrin-tesbih",
    "degisiklikler": { "aciklama": "Gümüş ara taneli, el yapımı püskül", "yeni": true }
  }
}
```
Kategori fiyatı değişikliği ürün olayı değildir: `fiyat.guncellendi` ile `{ "kategori": "bileklik", "fiyat_min": 800, "fiyat_max": 1300, "fiyat_metni": "800 – 1.300 TL" }` gönderilir ve `site.js`'teki `FIYAT` güncellenir (tek ürüne fiyat verilmek isteniyorsa kullanıcıya sor — bkz. bileşen standartları §2).

### `urun.kaldirildi`
```json
{ "surum": "1.0", "olay": "urun.kaldirildi", "kimlik": "8f1d2c3b-1111-4a2b-9c3d-000000000005",
  "zaman": "2026-10-05T11:00:00+03:00", "kaynak": "yonetici",
  "veri": { "urun_id": "pastel-tas-bileklik-seti", "sebep": "satildi" } }
```
`sebep`: `satildi` · `stokta-yok` · `hatali-kayit`. Fotoğraf dosyası silinmez (başka ürün kullanıyor olabilir); kullanılmıyorsa kullanıcıya sorulur.

İşleme kuralları: bilinmeyen `urun_id` → hata, uydurma yok; `ad` içinde "Tespih" geçiyorsa "Tesbih"e düzeltilir ve bildirilir; fotoğraf dosyası `public/img/koleksiyon/`'da yoksa ürün eklenmez, kullanıcıdan fotoğraf istenir.

## 4. Proje → dış servis (sosyal medya)

### `sosyal.paylasim_hazir`
Yeni ürün eklendiğinde (veya istendiğinde) paylaşım otomasyonuna gider. Metinler platform sınırlarına uymalı: X ≤ 280 karakter, Instagram ≤ 2200 karakter ve ≤ 30 hashtag, Facebook ≤ 5000 karakter (pratikte kısa tut).

```json
{
  "surum": "1.0",
  "olay": "sosyal.paylasim_hazir",
  "kimlik": "8f1d2c3b-1111-4a2b-9c3d-000000000006",
  "zaman": "2026-10-05T10:01:00+03:00",
  "kaynak": "otomasyon",
  "veri": {
    "urun_id": "kirmizi-akik-tesbih",
    "gorsel_url": "https://SITE-ADRESI/img/koleksiyon/27-kirmizi-akik-tesbih.jpg",
    "baglanti": "https://wa.me/905327389673",
    "platformlar": {
      "instagram": { "metin": "Atölyeden yeni: Kırmızı Akik Tesbih 📿\nGümüş imame ve püsküllü, elde dizildi.\n1.500 TL · Sipariş için DM ya da WhatsApp 0532 738 96 73", "hashtagler": ["#doğaltaş", "#tesbih", "#tespih", "#akiktesbih", "#elyapımı", "#antalya"] },
      "facebook":  { "metin": "Atölyeden yeni: Kırmızı Akik Tesbih. Gümüş imame ve püsküllü, elde dizildi. 1.500 TL — WhatsApp: 0532 738 96 73" },
      "x":         { "metin": "Atölyeden yeni: Kırmızı Akik Tesbih 📿 Gümüş imameli, el yapımı. 1.500 TL · wa.me/905327389673 #doğaltaş #tesbih" }
    }
  }
}
```
`gorsel_url` herkese açık bir adres olmalı (site yayındaysa site adresi); yoksa alan boş bırakılır ve kullanıcıya görseli elle yüklemesi söylenir. Ses tonu: sıcak, kısa, "elde dizildi / atölyede" vurgusu; abartılı satış dili yok.

## 5. Güvenlik ve kişisel veri

- **Sitede sır yok.** Tarayıcıdan giden webhook'larda imza/anahtar kullanılamaz (kod herkese açık). Bunun yerine: tahmin edilemeyen webhook URL'si (Make/Zapier'in verdiği uzun adres) + alıcı tarafta zarf doğrulaması + `kimlik` ile tekrar engeli.
- URL, `web-sitesi/.env` dosyasında `VITE_WEBHOOK_URL=` olarak durur; `.env` `.gitignore`'a eklenir. Bu URL gizli sayılmaz ama koda gömülmez ki değiştirmek kolay olsun.
- **Sunucu tarafı (ürün güncelleme) imzalı olmalı:** gönderen `X-Atolye-Imza: sha256=<HMAC-SHA256(gövde, SIR)>` başlığı ekler; sır yalnızca otomasyon servisinde durur.
- **Kişisel veri (KVKK) toplanmaz:** müşterinin adı, telefonu, IP adresi webhook'a konmaz. Müşteri iletişimi WhatsApp üzerinden kendiliğinden olur.

## 6. Sitede uygulama (React)

Tek yardımcı dosya: `src/lib/webhook.js`. Bileşenler doğrudan `fetch` yazmaz, bunu çağırır.

```js
// Webhook gönderimi — AtölyeKart v1 zarfı. URL tanımlı değilse sessizce hiçbir şey yapmaz.
const URL_ = import.meta.env.VITE_WEBHOOK_URL;

const zaman = () => {
  const d = new Date(Date.now() + 3 * 3600 * 1000); // Türkiye saati
  return d.toISOString().replace(/\.\d{3}Z$/, '+03:00');
};

export function webhookGonder(olay, veri) {
  if (!URL_) return;
  const govde = JSON.stringify({ surum: '1.0', olay, kimlik: crypto.randomUUID(), zaman: zaman(), kaynak: 'web-sitesi', veri });
  try {
    // sendBeacon sayfa WhatsApp'a geçerken bile gönderimi tamamlar ve tıklamayı bekletmez
    const ok = navigator.sendBeacon?.(URL_, new Blob([govde], { type: 'text/plain' }));
    if (!ok) fetch(URL_, { method: 'POST', body: govde, keepalive: true, mode: 'no-cors' });
  } catch { /* webhook hatası müşterinin WhatsApp'a geçmesini asla engellemez */ }
}
```

Kullanım (ProductCard içinde):
```jsx
<a href={waLink(urunMesaji(urun))} target="_blank" rel="noopener"
   onClick={() => webhookGonder('soru.gonderildi', soruVerisi(urun, bolum))}>
```
- `Content-Type: text/plain` bilinçlidir: tarayıcı ön kontrol (CORS preflight) yapmaz; Make/Zapier/n8n gövdeyi JSON olarak ayrıştırabilir.
- Veri üreten küçük fonksiyonlar (`soruVerisi`, `bileklikVerisi`) da `src/lib/webhook.js`'te durur; mesaj metni için `urunMesaji` yeniden kullanılır (kopya metin yok).
- Webhook tıklamayı engellemez, `preventDefault` kullanılmaz.

## 7. Doğrulama betiği

```bash
python3 .claude/skills/atolyekart-standartlari/scripts/webhook_dogrula.py dosya.json [dosya2.json ...]
python3 .claude/skills/atolyekart-standartlari/scripts/webhook_dogrula.py --urunler web-sitesi/src/data/urunler.js dosya.json
```
Zarfı, olay adını, olaya özel zorunlu alanları, kategori/cinsiyet değerlerini, "Tespih" yazımını, X 280 karakter ve Instagram hashtag sınırlarını kontrol eder. `--urunler` verilirse `urun_id`'nin var olup olmadığına da bakar (`urun.eklendi` için olmaması gerekir). Hata yoksa `TAMAM` yazar ve 0 ile çıkar.
