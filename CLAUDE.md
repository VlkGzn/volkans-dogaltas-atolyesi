# Volkan's Doğal Taş Atölyesi

Erkek ve kadınlar için el yapımı doğal taş **tesbih, bileklik, kolye ve yüzük** satan atölye.
Bu klasörde atölyenin kartı, web sitesi ve sosyal medya görselleri var. Kullanıcıyla Türkçe konuş.

## Kurallar (kullanıcının açık istekleri)

- **Yazım "Tesbih"tir, "Tespih" değil.** Görünen her metinde Tesbih / TESBİH kullan.
  İstisna: hashtag'lerde ek olarak `#tespih`.
- **Sadece atölyenin kendi ürünleri.** Stok fotoğraf/video ya da çizim ürün kullanma.
  Animasyonlar atölyenin kendi fotoğraflarından üretilir (çizim el animasyonu "gerçekçi değil" diye reddedildi,
  stok tesbih videosu "bizim ürün değil" diye çıkarıldı).
- Kullanıcı çoğu oturuma sadece "devam et" diye başlar: önce bu dosyayı ve tasarım kartını oku.
- **Duplikasyon olmasın:** her bilgi/görsel tek yerde dursun (ürünler `src/data/urunler.js`, iletişim/fiyat `src/data/site.js`,
  her fotoğraf bir kez `public/img/koleksiyon/`). Aynı içeriği ikinci bir dosyaya kopyalama.

## İletişim bilgileri

| | |
|---|---|
| Telefon / WhatsApp | +90 532 738 96 73 (`https://wa.me/905327389673`) |
| Instagram | @volkansdogaltas |
| Facebook / TikTok | volkans.dogaltas (hesaplar henüz kesinleşmedi) |
| X | önerilen @volkansdogaltas (X adında nokta olamaz; sitede X linki henüz boş) |
| E-posta | vgozen44@gmail.com |
| Adres | Gürsu Mah. Atatürk Bulvarı, Konyaaltı / Antalya |

## Fiyatlar (2026-10-05, hepsi sabit — aralık yok)

Kategori fiyatı (`FIYAT`, site.js, sayı TL): Tesbih 1.500 · Bileklik 1.000 · Kolye 2.125 · Yüzük 2.250 (aralıkların ortalaması).
Ürüne özel fiyat `urunler.js`'te `fiyat: 7500` (sayı). Gösterim `urunFiyati(urun)` → "7.500 TL" (`tl()`), hesap `urunFiyatSayi(urun)`.
Özel fiyatlı ürünler: Özel Seri Yakut Doğal Taş Pırlantalı Yüzük 925 Ayar Gümüş 62.000 · Özel Seri Akik Doğal Taş Pırlantalı 925 Ayar
Gümüş Yüzük 38.000 · İridyum Malakit Yüzük (Kadın) 19.000 · Barok İnci Yüzük 15.000 · Kalp Malakit Kanatlı Yüzük 15.000 ·
Kaplan Gözü Kartal / Oval Yüzük 925 Ayar (Erkek) 7.500. (Tüm yüzüklerin artık özel fiyatı var.)

## Görsel kimlik

- Zemin `#17171A` / `#141416`, altın vurgu `#C9A35C`, krem metin `#ECE7DE`, ikincil metin `#BDB6AA`
- Yazı tipleri: **Cormorant Garamond** (başlıklar, "Volkan's" italik) + **Jost** (gövde, geniş aralıklı büyük harfler)
- **Logo (seçilen: 1 · Tesbih Halkası):** 33 altın taneli tesbih halkası, 4 yeşim tane, altta altın imame, ortada altın italik "V".
  Yanında "Volkan's" (altın italik) + "DOĞALTAŞ" (geniş aralıklı). Dosyalar `logo/`; üretici `araclar/logo_secenekleri.py` (`ring_icon`).
  Sitede üst başlıkta, alt bilgide ve sekme simgesinde (favicon) kullanılıyor. Seçilmeyen diğer seçenekler: Kesme Taş, Atölye Mührü, Taş "O".
- Marka logoları (Icons.jsx): `WhatsAppLogo` (kart düğmesi, yeşil `--whatsapp`), `InstagramLogo` (renk geçişli), `FacebookLogo`
  (`--facebook`), `XLogo` (beyaz, siyah kutuda) — alt bilgi "Takip et". Ürün kartı: [− adet +][Sepete ekle][WhatsApp logosu] yan yana, kart altına sabit, köşeler 8px.
- Slogan: "Her taş tek, her parça el emeği." · Giriş başlığı: "Taşın ritmi, elin emeği."

## Klasör yapısı

```
Screenshot 2026-10-03 at *.png   Ürün fotoğrafları (kaynak). 21.35.14 = bilekte bileklik,
                                 21.35.43 = boyunda kolye (ikisi de taş değil; siteden çıkarıldı)
web-sitesi/                      React + Vite projesi (TEK KAYNAK)
  package.json, vite.config.js   `npm install` · `npm run dev` (canlı önizleme) · `npm run build` → dist/
  index.html                     Vite giriş sayfası (meta, favicon, fontlar, #root)
  src/main.jsx, src/App.jsx      Uygulama; süzgeç (filtre) ve açık ürün (Lightbox) durumu App'te
  src/styles.css                 Tüm stiller (renk değişkenleri :root'ta)
  src/data/urunler.js            35 ürün (4'ü fotoğrafsız) (id, cinsiyet, kategori, ad, aciklama, fotograflar, yeni)
  src/data/site.js               İletişim, waLink(), fiyatlar, kategori adları, süzgeçler, vitrin, bileklik taşları
  src/lib/webhook.js             webhookGonder + soruVerisi/bileklikVerisi (AtölyeKart v1; adres .env VITE_WEBHOOK_URL)
  src/lib/uyelik.js              useUyelik (Supabase Auth): uyeOl/girisYap/sifreSifirla/cikisYap; .env VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
  src/data/kvkk.js               KVKK aydınlatma metni TASLAĞI (hukukçuya kontrol ettirilmeli)
  src/lib/sepet.js               useSepet: [{id, adet}] (localStorage, sekmeler arası eşitlenir); ekle/azalt/sil/bosalt/adet
  src/lib/favoriler.js           useFavoriler: kalp ile işaretlenen ürünler (localStorage, try/catch, sekmeler arası eşitlenir)
  .env.example                   VITE_WEBHOOK_URL= (doldurulup .env olarak kaydedilir; .env git'e girmez)
  src/components/
    ProductImage.jsx             Oranlı ürün fotoğrafı; onOpen verilirse büyütme düğmesi; çoklu foto rozeti
    ProductCard.jsx              Fotoğraf + kalp (favori) + ad + kategori + fiyat + "Sepete ekle" + "WhatsApp'tan sor" (soru.gonderildi webhook'u)
    ProductList.jsx              Ürün ızgarası (Koleksiyon ve Atölyeden yeni ikisi de bunu kullanır)
    Koleksiyon.jsx               Süzgeç düğmeleri + ProductList
    AtolyedenYeni.jsx            urunler.js'te `yeni: true` olanlar + ProductList
    Lightbox.jsx                 Büyük fotoğraf, oklar, Esc/ok tuşları, "Sepete ekle"
    AdetSecici.jsx               [ − | 1 | + ] adet seçici (ürün kartı + sepet paneli ortak)
    Uyelik.jsx                   Giriş yap / Üye ol / Şifremi unuttum penceresi + KVKK onayı; Supabase yoksa "kuruluyor" bilgisi
    Sepet.jsx                    Sağdan açılan sepet paneli: adet ±, kaldır, toplam, "Siparişi WhatsApp'tan gönder" (+ sepet.gonderildi webhook'u)
    GecisKarti.jsx               2–3 katman arasında sırayla yakınlaşarak geçen kart (katman başına 7 sn; giriş + Kadın/Erkek kartları)
    Header, Giris, Vitrin, Kategoriler (+Ozellikler), BileklikTasarla, Footer, Logo, Icons
  public/img/koleksiyon/NN-ad.jpg  Ürün fotoğrafları (her fotoğraf tek kopya; tesbihler 900px aslı)
  public/img/qr-whatsapp.svg     Ortasında logo olan WhatsApp QR (araclar/qr_logolu.py)
  public/video/tesbih-cekiliyor.mp4/.jpg  Yeşim tesbih çekilme videosu (araclar/tesbih_animasyonu.py)
  public/img/fotograf-yakinda.svg  Fotoğrafsız ürünlerin tek yer tutucusu (logolu)
  public/favicon.svg             Logo
  dist/                          `npm run build` ÇIKTISI — elle düzenleme; index.html çift tıklayınca açılır
                                 (vite-plugin-singlefile JS/CSS'i içine gömer). Siteyi yayınlarken dist/ yüklenir.
sosyal-medya/
  profil-fotografi.png, x-kapak.png, facebook-kapak.png, instagram-ilk-gonderi.png,
  instagram-hikaye-kapak-*.png (Tesbih, Bileklik, Kolye, Yuzuk, Tasarla, Fiyatlar)
  hesap-bilgileri.txt            Kullanıcı adları, bio'lar, ilk gönderi açıklamaları, hashtag'ler
logo/
  logo-ikon.svg / logo-ikon.png   Seçilen logo (şeffaf zemin, 1000px)
  logo-yatay.png                  Logo + yazı yan yana (krem yazı: koyu zeminde kullanın)
  logo-secenekleri.png            Gösterilen 4 seçenek
  qr-whatsapp-logolu.png          Ortasında logo olan WhatsApp QR (1200px, şeffaf köşeler)
araclar/
  urun_katalogu.py               Ürünlerin hangi ekran görüntüsünden geldiği (kaynak eşlemesi; site verisi src/data/urunler.js)
  qr_logolu.py                   Ortasında logo olan QR üreticisi (segno)
  logo_secenekleri.py            4 logo konseptinin SVG üreticisi
  tesbih_animasyonu.py           Tesbih çekilme videosunu üreten betik (kullanım içinde yazılı)
  guvenlik_testi.py              CSP/XSS/sepet güvenlik testi (headless Chrome; bkz. GUVENLIK.md)
```

## Tasarım kartı (Claude artifact)

https://claude.ai/artifact/2jetMGUjagqwT8fpbum9L2 — "Design" türünde kanvas. Board'lar:
`Main` (kart ön yüz), `Arka` (arka yüz + WhatsApp QR), `Dijital` (telefon kartı),
`Profil`, `InstagramGonderi`, `HikayeKapaklari`, `XKapak`, `FacebookKapak`. (Eski `WebSitesi` board'u 2026-10-04'te kaldırıldı.)

**Site önizlemesi (ayrı artifact):** https://claude.ai/artifact/UDY4qjEoPL4iwzefCkfWVg — `web-sitesi/dist/` derlemesinin yayını.
Sitede değişiklik yapınca: `npm run build`, sonra Artifact publish ile `file_path` = `web-sitesi/dist/index.html`, `root` = `web-sitesi/dist`,
`url` = bu adres, `files` = dist altındaki tüm dosyalar (img/, video/, favicon.svg). Elle kopya tutulmaz; önizleme hep derlemeden üretilir.

- Kullanıcı kanvası kendisi de düzenliyor: değiştirmeden önce Artifact `read` ile güncel hâlini al.
- Kanvastaki görseller `/_blob/<id>` asset'leri.
- **Sitenin tek kaynağı `web-sitesi/` React projesi.** Kanvasta site sayfası yok; önizleme yukarıdaki ayrı artifact (derleme çıktısı).
- Sosyal medya PNG'leri kanvas board'larından üretildi: board HTML'ini düz HTML'e çevirip
  headless Chrome ile tam boyutta ekran görüntüsü al (`--window-size=1500,500` vb.). Metin değişince PNG'leri yeniden üret.

## Web sitesi bölümleri (App.jsx sırasıyla)

1. `Header`: üst şerit, sosyal simgeler, logo, arama/hesap/favori/**sepet (çanta: ürün sayısı rozeti, tıklayınca Sepet paneli)**/WhatsApp, menü: **Bileklik · Kolye · Yüzük · Tesbih**
   (sıra `MENU_KATEGORILERI`), her birinin altında Kadın/Erkek alt menüsü (ürünü olmayan alt kategori gizlenir; masaüstünde
   üzerine gelince, dokunmatikte ok düğmesiyle açılır) + Kendin Tasarla. Alt kategori süzgeç değeri `kategori:cinsiyet`
   (`altFiltre()`, `filtreAdi()` site.js'te); Koleksiyon'da seçili alt kategori ✕'li düğme olarak görünür.
2. `Giris`: sol `GecisKarti` Erkek = tesbih videosu ↔ el figüründeki kaplan gözü oval yüzük (29); sağ Kadın = renkli taş kolyeli kadın → mavi taş kolyeli kadın → İridyum Malakit Yüzük (33-…-2, 36-…-2, 04; 21 sn döngü, etiketler birlikte değişir).
   Eski ahşap bileklik (21.35.14) ve hindistan cevizi kolye (21.35.43) "taş değil" diye kullanıcı isteğiyle siteden tamamen çıkarıldı.
   GecisKarti katmanında `konum` = object-position (kare kartta görünen bölüm)
3. `Vitrin`: 6 sn'de bir dönen büyük görsel (VITRIN, site.js; görseli ürün listesinden alır), CTA süzgeci açar.
   Sıra: Erkek tesbih → Kadın kolye → Yüzük (kullanıcı isteği)
4. `Ozellikler` şeridi · 5. `Kategoriler` "Kime, hangi taş?" (Kadın/Erkek "Keşfet" → süzgeç, Kendin Tasarla → #tasarla)
   Kadın kartı: renkli → mavi taş kolyeli kadın → İridyum Malakit Yüzük · Erkek kartı: lapis tesbih ↔ eldeki kaplan gözü oval yüzük (29)
6. `Koleksiyon` (#koleksiyon): 35 ürün (Erkek 16, Kadın 19; Havlit, Siyah Akik, Kehribar, Zebercet bileklik "Fotoğraf yakında" kartıyla), süzgeç düğmeleri, `ProductList` → `ProductCard` → `ProductImage`
7. `BileklikTasarla` (#tasarla): taş seç → halka dizilir → WhatsApp'a taş listesiyle mesaj
8. `AtolyedenYeni` (#yeni): `yeni: true` ürünler, aynı ProductList (ayrı fiyat listesi şeridi kullanıcı isteğiyle KALDIRILDI)
9. `Footer`: logo, koleksiyon linkleri, iletişim, takip et, "Okut, yaz" QR (WhatsApp'a gider, ortasında logo; H seviyesi,
   OpenCV ile okunduğu doğrulandı). Baskı için `logo/qr-whatsapp-logolu.png`.
10. `Lightbox`: Koleksiyon ve Atölyeden yeni'deki fotoğraflara tıklayınca açılır (App seviyesinde tek görüntüleyici)

Kontrol için: `npm run build`, sonra `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --screenshot=... --window-size=1440,800 file://.../web-sitesi/dist/index.html`.
Etkileşim testi: dist/index.html'in kopyasına tıklama yapan bir <script> ekleyip `--dump-dom` ile sonucu document.title'dan oku.
Headless Chrome CSS animasyonlarını güvenilir ilerletmez; bir anı görmek için animasyonu `animation-play-state:paused` +
negatif `animation-delay` ile sabitle. Pencere ~500px'ten dar açılmadığı için telefon görünümü bu yolla doğrulanamaz.

## Güvenlik

`GUVENLIK.md` (proje kökü) — tek güvenlik denetim dosyası: sızıntı, XSS/injection, bağımlılık, canlı site başlıkları, bulgular
ve testleri tekrar çalıştırma adımları. Son denetim 2026-10-08 (`c0a916e`). Her commit/yayından önce oradaki taramayı çalıştır,
sonuçları aynı dosyada güncelle. Test betiği `araclar/guvenlik_testi.py`.
CSP: `vite.config.js` → `guvenlikPolitikasi` derlemede dist/index.html'e meta ekler (JS özeti + .env'deki Supabase/webhook adresleri).
Siteye yeni dış kaynak (analiz, harita, font) eklenirse CSP'ye de ekle. Sepet/favori depodan okurken doğrulanır (sepet: 1–99 adet).
Açık bulgular: çerçeveleme koruması yok (GitHub Pages), webhook/Supabase kurulum şartları.

## Skill

`.claude/skills/atolyekart-standartlari/` — bileşen standartları + webhook formatı (AtölyeKart v1: soru/bileklik bildirimi,
ürün güncelleme, sosyal paylaşım). Webhook JSON'larını `scripts/webhook_dogrula.py` ile doğrula. Testleri `evals/evals.json`'da
(iterasyon 1: skill ile %100, skill'siz %67).

## Webhook (Make/Zapier/n8n) — 2026-10-05 kuruldu, ADRES BEKLENİYOR
- Gönderilen olaylar: `sepet.gonderildi` (sepet paneli), `soru.gonderildi` (kart: bolum=koleksiyon|atolyeden-yeni, büyük fotoğraf: buyuk-fotograf) ve
  `bileklik.tasarlandi` (en az 1 taş seçiliyken). Format: skill references/webhook-formati.md.
- `web-sitesi/.env` yokken/boşken derleyici gönderim kodunu tamamen çıkarır (site hiçbir yere veri göndermez).
- Kurulum: kullanıcı Make'te "Custom webhook" adresi verir → `.env`: `VITE_WEBHOOK_URL=<adres>` → `npm run build` → önizlemeyi yayınla.
  Gövde text/plain JSON gelir; Make'te gerekirse "Parse JSON" modülü eklenir.
- Uçtan uca test (yerel yakalama sunucusu + ayrı test derlemesi) geçti: 3 mesaj, doğrulayıcı TAMAM.

## Üyelik (Supabase Auth) — 2026-10-05 kuruldu, SUPABASE PROJESİ BEKLENİYOR
- Sağ üst: oturum yokken "Giriş yap" + "Üye ol", varken "Merhaba, [ad]" + "Çıkış yap" (Header, `hesap` sınıfları).
- Üye ol: ad soyad, e-posta, şifre (≥8), KVKK onayı zorunlu (onay zamanı user_metadata.kvkk_onay). E-posta doğrulaması Supabase'te açık.
- Kullanıcı Supabase'te proje açıp Project URL + anon public key verince `.env`'e yazılır → build → önizleme. Auth → URL Configuration'da
  Site URL = sitenin adresi olmalı (doğrulama/şifre yenileme bağlantıları için).
- Sahte Supabase sunucusuyla uçtan uca test edildi (üye ol, KVKK zorunlu, yanlış şifre, giriş, çıkış).
- Sonraki aşama (bekliyor): favori + sepetin üyeye bağlı senkronu (Supabase tabloları + RLS).

## GitHub ve canlı site
- Repo: https://github.com/VlkGzn/volkans-dogaltas-atolyesi (public, `main`). Canlı site (GitHub Pages, `gh-pages` dalı):
  https://vlkgzn.github.io/volkans-dogaltas-atolyesi/
- Siteyi güncelleme: `npm run build` → `dist/` kopyasını (+ `.nojekyll`) ayrı bir klasörde `gh-pages` dalı olarak commit'leyip
  `git push -f origin gh-pages`; kaynak değişikliklerini ayrıca `main`'e commit'le. (gh token'ında `workflow` izni yok →
  GitHub Actions ile otomatik yayın için kullanıcı `gh auth refresh -s workflow` yapmalı.)
- Claude önizlemesi (UDY4…) yalnız kullanıcıya açık; herkese açık adres GitHub Pages.

## Araçlar

- `ffmpeg` sistemde yok; `pip3 install --user imageio-ffmpeg` ile gelen ikili kullanılıyor
  (`python3 -c "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())"`).
- QR kod için `segno` (pip) kullanıldı; arka yüzdeki QR `https://wa.me/905327389673` adresine gider.
- Python'da PIL mevcut. Node.js 24 + npm kurulu (React projesi için).

## Bekleyenler

- Supabase projesi bilgileri (URL + anon key) bekleniyor; KVKK metni taslağı hukukçuya kontrol ettirilmeli.

- Taş olmayan ürünler (ahşap/tohum/hindistan cevizi) kullanıcı isteğiyle siteden çıkarıldı (2026-10-05). Sitede yalnız doğal taş ürün kalsın.
- Make webhook ADRESİ bekleniyor (kod hazır, bkz. Webhook bölümü).

- `yeni-resimler/` (2026-10-04): 12 temiz resim → ürün 27–36 olarak eklendi (kaynaklar klasörde duruyor). 5 resim (ametist, havlit,
  siyah akik, kehribar, zebercet bileklik) ŞİFAMTAŞ logolu tanıtım afişi + sağlık iddiası metni. Kullanıcı ŞİFAMTAŞ'ın kendi markası
  olmadığını ve izni olmadığını söyledi → bu görseller KULLANILMAZ, logo değiştirilmez. Yerine "Fotoğraf yakında" kartı + tasarlayıcıya
  Kehribar/Zebercet taşı eklendi. Kullanıcı kendi fotoğraflarını çekince yer tutucu kaldırılıp fotoğraf eklenecek. Kaynak dosya adlarındaki sağlık iddialı isimler (cilt bakım, nefes denge,
  duyu denge, etkili konuşma) ürün adı olarak kullanılmadı; renk/taşa göre adlandırıldı — kullanıcı teyit edecek.

- Ürün 17 ("İnci & Yeşil Taş Tılsımlı Tasarım") bileklik mi kolye mi fotoğraftan net değil; şimdilik Bileklik. Kullanıcıya teyit ettir.
- Ürün adları fotoğraftan tahmin edildi (taş türleri); kullanıcı düzeltirse `web-sitesi/src/data/urunler.js` (tek yer).

- Facebook / TikTok / X hesapları açılınca sitedeki bağlantıları kesin kullanıcı adlarıyla güncelle (X linki şu an boş).
- Web adresi yok (alan adı alınırsa siteye ve karta ekle).
- Kullanıcı kendi ürünleriyle kısa videolar (bilekte bileklik, boyunda kolye, elde tesbih) çekerse girişe yerleştir.
- Öneri bekliyor: aynı tesbih çekilme animasyonu lacivert ve sarı tesbihler için; vitrinin ilk görseli girişle aynı (yeşim tesbih).
