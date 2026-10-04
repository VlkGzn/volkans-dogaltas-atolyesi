# Volkan's Doğal Taş Atölyesi — AtölyeKart

Erkek ve kadınlar için el yapımı doğal taş **tesbih, bileklik, kolye ve yüzük** üreten atölyenin web sitesi, logosu ve sosyal medya görselleri.
Site **React 19 + Vite** ile yazılmıştır; siparişler WhatsApp üzerinden alınır.

**🌐 Canlı site:** https://vlkgzn.github.io/volkans-dogaltas-atolyesi/

## Özellikler

- **Animasyonlu giriş:** Erkek (tesbih videosu ↔ eldeki yüzük) ve Kadın (kolyeler ↔ yüzük) kartları sırayla, yakınlaşarak değişir.
  Tesbih videosu atölyenin kendi yeşim tesbih fotoğrafındaki gerçek tanelerden üretilmiştir (`araclar/tesbih_animasyonu.py`).
- **Menü:** Bileklik · Kolye · Yüzük · Tesbih; her birinin altında Kadın / Erkek alt kategorisi.
- **Koleksiyon:** 35 ürün, süzgeç düğmeleri, fotoğraf büyütme (Lightbox), fotoğrafı olmayan ürünlerde logolu "Fotoğraf yakında" kartı.
- **Ürün bileşenleri:** `ProductList` → `ProductCard` → `ProductImage` (tek kart bileşeni, her listede aynı).
- **Favoriler (kalp)** ve **sepet:** adet seçici, sağdan açılan sepet paneli, toplam tutar, siparişi tek mesajla WhatsApp'tan gönderme.
  İkisi de tarayıcıda saklanır.
- **Kendin tasarla:** 12 taşla kendi bilekliğini dizip WhatsApp'tan sipariş verme.
- **Üyelik:** Giriş yap / Üye ol / Şifremi unuttum (Supabase Auth) ve KVKK onayı. Supabase bilgileri girilmediyse form yerine
  "kuruluyor" bilgisi gösterilir.
- **Webhook:** Soru, bileklik tasarımı ve sepet siparişleri Make/Zapier/n8n'e (ör. Google Sheets) gönderilebilir; adres boşsa
  hiçbir veri gönderilmez. Format: `.claude/skills/atolyekart-standartlari/references/webhook-formati.md`.
- **Logo ve QR:** Tesbih halkası logosu, ortasında logo olan WhatsApp QR kodu (okunurluğu OpenCV ile doğrulandı).

## Çalıştırma

```bash
cd web-sitesi
npm install
npm run dev      # canlı önizleme (http://localhost:5173)
npm run build    # dist/index.html — çift tıklayınca da açılır (JS/CSS içine gömülü)
```

İsteğe bağlı ayarlar için `web-sitesi/.env.example` dosyasını `.env` olarak kopyalayın:

| Değişken | Ne işe yarar |
|---|---|
| `VITE_WEBHOOK_URL` | Make / Zapier / n8n webhook adresi |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | Üyelik (yalnız herkese açık *anon* anahtar; `service_role` asla) |

## Klasör yapısı

```
web-sitesi/                 React + Vite projesi (sitenin tek kaynağı)
  src/App.jsx               Bölümlerin sırası; süzgeç, sepet, favori, üyelik durumu
  src/components/           Header, Giris, Vitrin, Kategoriler, Koleksiyon, ProductList, ProductCard,
                            ProductImage, Lightbox, Sepet, AdetSecici, Uyelik, BileklikTasarla, Footer, Logo, Icons…
  src/data/urunler.js       Ürün listesi (tek yer)
  src/data/site.js          İletişim, fiyatlar, kategori adları, yardımcılar
  src/lib/                  sepet, favoriler, webhook, üyelik
  public/img/koleksiyon/    Ürün fotoğrafları (her fotoğraf tek kopya)
logo/                       Logo (SVG/PNG), logo seçenekleri, logolu WhatsApp QR
sosyal-medya/               Profil fotoğrafı, X/Facebook kapakları, Instagram gönderi ve hikâye kapakları, hesap bilgileri
araclar/                    Python yardımcıları: tesbih animasyonu, logo, QR, ürün kataloğu
.claude/skills/             Proje skill'i: bileşen standartları + webhook formatı (doğrulama betiğiyle)
CLAUDE.md                   Projenin kuralları ve ayrıntılı notları
```

## Yayınlama (GitHub Pages)

Site `gh-pages` dalından yayınlanır. Değişiklikten sonra `web-sitesi` klasöründe `npm run build`, ardından
`dist/` içeriği (+ boş `.nojekyll` dosyası) `gh-pages` dalına gönderilir.

## Notlar

- Fiyatlar sabittir (TL); kategori fiyatı `site.js` içindeki `FIYAT`, ürüne özel fiyat `urunler.js` içindeki `fiyat` alanıdır.
- Online kartla ödeme yoktur; ödeme ve teslimat WhatsApp'ta netleşir.
- `src/data/kvkk.js` içindeki KVKK aydınlatma metni taslaktır; yayına almadan önce hukuki kontrol gerekir.
- Görseller yalnızca atölyenin kendi ürünlerine aittir.
