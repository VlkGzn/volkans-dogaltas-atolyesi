---
name: atolyekart-standartlari
description: Volkan's Doğaltaş (AtölyeKart) web sitesi için React bileşen standartları ve webhook JSON formatı. Bu projede bir bileşen yazarken/değiştirirken (ProductCard, ProductList, ProductImage, yeni bölüm, düğme, kart), ürün/fiyat/iletişim bilgisi eklerken, siteye form, bildirim veya entegrasyon bağlarken ve sipariş/soru bildirimi, ürün güncelleme ya da sosyal medya paylaşımı için webhook, Make, Zapier, n8n, Google Sheets bağlantısı kurarken MUTLAKA kullan — kullanıcı "standart", "webhook" ya da "skill" kelimesini söylemese bile, web-sitesi/src altına dokunan her işte geçerlidir.
---

# AtölyeKart standartları

Volkan's Doğal Taş Atölyesi'nin sitesi `web-sitesi/` altındaki React 19 + Vite projesidir ve **tek kaynaktır**.
Bu skill iki şeyi tanımlar: bileşenlerin nasıl yazılacağı ve dış servislerle konuşurken kullanılacak webhook formatı.
Kullanıcı yazılımcı değil; açıklamaları Türkçe, sade ve teknik terimleri kısaca açıklayarak yap.

## Önce bunları bil (projenin değişmez kuralları)

Bu kurallar kullanıcının açık istekleridir; her biri bir şikâyetten doğdu.

1. **Duplikasyon yok.** Her bilgi tek yerde durur:
   - ürünler → `src/data/urunler.js` · iletişim, fiyat, kategori adları, süzgeçler → `src/data/site.js`
   - her fotoğraf tek kopya → `public/img/koleksiyon/NN-ad.jpg`
   - ürün kartı her yerde `ProductCard` ile çizilir; ikinci bir kart bileşeni yazma.
   Bir metni/numarayı iki dosyaya yazmak üzereysen dur, `site.js`'e taşı ve oradan içe aktar.
2. **"Tesbih" yazılır, "Tespih" değil** (görünen her metin, webhook metinleri dahil). Tek istisna: hashtag listesinde ek olarak `#tespih`.
3. **Sadece atölyenin kendi ürünleri.** Stok fotoğraf/video ya da çizilmiş ürün kullanma; görsel yoksa yer tutucu koy ve kullanıcıdan fotoğraf iste.
4. **Statik site, gizli anahtar yok.** `src/` içindeki her şey tarayıcıda okunabilir. Webhook sırrı, API anahtarı, şifre koda/`.env`'e (VITE_ ile) konmaz.
   İstisna: tarayıcıda kullanılmak üzere tasarlanmış *herkese açık* anahtarlar (Supabase `anon` anahtarı, `VITE_SUPABASE_ANON_KEY`) —
   güvenlik veritabanı erişim kurallarıyla (RLS) sağlanır. Supabase `service_role` anahtarı ASLA siteye/`.env`'e girmez.
   Sahte giriş/üyelik formu yapma: arka uç bağlı değilse form yerine "kuruluyor" bilgisi göster.
5. **İstenen kadarını yap.** Kullanıcı bir düğme istediyse düğmeyi ekle; süzgeç, sayaç, yeni sayfa gibi ekleri kendiliğinden kurma — cevabın sonunda "isterseniz şunu da ekleyebilirim" diye öner. Standartlar *nasıl* yapılacağını söyler, işi büyütmek için gerekçe değildir.
6. **Değişiklikten sonra derle ve doğrula:** `npm run build` (web-sitesi klasöründe) hatasız bitmeli; mümkünse `dist/index.html`'i headless Chrome ile açıp ekran görüntüsüne bak.

## Bileşen yazarken

Ayrıntılar ve örnek kod: **`references/bilesen-standartlari.md`** — yeni bileşen yazmadan veya mevcut birini değiştirmeden önce oku.

Özet:
- Dosya: `src/components/BilesenAdi.jsx`, PascalCase, `export default function BilesenAdi(...)`. Ürünle ilgili ortak bileşenler İngilizce (`ProductCard`, `ProductList`, `ProductImage`), sayfa bölümleri Türkçe (`Koleksiyon`, `Vitrin`, `BileklikTasarla`).
- Prop ve değişken adları Türkçe (`urun`, `urunler`, `onFiltre`, `onOpen`); olay prop'ları `on` ile başlar.
- Veri prop olarak ya da `src/data/`'dan gelir; bileşen içinde ürün adı, fiyat, telefon gibi sabit yazılmaz.
- Stil `src/styles.css`'te sınıf olarak (`blok__oge--durum`); satır içi `style` yalnızca hesaplanan değerler için (konum, renk, oran).
- Renkler `:root` değişkenleriyle (`var(--gold)` vb.); yeni renk gerekiyorsa önce değişken ekle.
- Erişilebilirlik: tıklanan her şey `<button>` veya `<a href>`; simge düğmelerde `aria-label`; dokunma alanı en az 44px; görsellerde anlamlı `alt`.
- Fiyat her yerde `urunFiyati(urun)` ile gösterilir (ürüne özel `fiyat` varsa o, yoksa kategori fiyatı).
- WhatsApp bağlantısı her zaman `waLink(mesaj)` ile.

## Webhook kurarken

Format, olay türleri ve örnekler: **`references/webhook-formati.md`** — herhangi bir webhook gönderirken, alırken veya örnek JSON hazırlarken oku.

Üç olay ailesi var:

| Olay | Yön | Ne zaman |
|---|---|---|
| `soru.gonderildi`, `bileklik.tasarlandi`, `sepet.gonderildi` | site → dış servis | Müşteri "WhatsApp'tan sor" / "WhatsApp'tan sipariş ver" / sepette "Siparişi gönder"e basınca |
| `urun.eklendi`, `urun.guncellendi`, `urun.kaldirildi` | dış servis → proje | Tablodan/otomasyondan ürün değişikliği gelince |
| `sosyal.paylasim_hazir` | proje → dış servis | Yeni ürün eklenince Instagram/Facebook/X için paylaşım verisi |

Her mesaj aynı zarfı kullanır: `{ surum, olay, kimlik, zaman, kaynak, veri }`. Hazırladığın her örnek JSON'u şu betikle doğrula:

```bash
python3 .claude/skills/atolyekart-standartlari/scripts/webhook_dogrula.py ornek.json
```

Betik hataları Türkçe listeler (eksik alan, yanlış kategori, "Tespih" yazımı, X için 280 karakter sınırı vb.).

## Çıktıyı sunarken

- Ne değiştiğini dosya yoluyla birlikte söyle (`src/components/ProductCard.jsx`).
- Webhook işlerinde kullanıcının yapması gerekenleri (Make/Zapier'de URL oluşturma, `.env`'e yazma) numaralı adımlarla ver; teknik terimi ilk geçtiği yerde bir cümleyle açıkla.
- `CLAUDE.md`'yi yeni bir bileşen, dosya veya entegrasyon eklendiyse güncelle.
