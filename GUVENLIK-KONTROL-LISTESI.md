# AtölyeKart (Volkan's Doğal Taş Atölyesi) — deploy öncesi güvenlik kontrol listesi

Tarih: 17 Ekim 2026 · Hafta 2 · Şablon: Ders 3 `GUVENLIK-KONTROL-LISTESI.md` (örnek proje Toprak Atölye için doldurulmuştu; burada bu projenin GERÇEK durumu yazıldı)
İşaret: [x] yapıldı ve doğrulandı · [ ] yapılmadı / açık · (n/a) bu projede yok

## Secret ve konfigürasyon

- [x] Webhook URL ve secret koddan çıkarıldı; sunucu değişkeni (`WEBHOOK_URL`, `WEBHOOK_SECRET`, `JWT_SECRET`), yerelde `web-sitesi/.env`
- [x] `.gitignore` içinde `.env*` var, `.env.example` commit ediliyor (`git check-ignore` ile doğrulandı)
- [ ] Secret'lar Vercel Environment Variables'a eklendi — **kısmen:** `WEBHOOK_SECRET` ve `JWT_SECRET` yalnız **Production**'a eklendi (yerelden ayrı değerler). Preview ayrı değeri YOK; `WEBHOOK_URL` henüz yok (Make adresi bekleniyor)
- [x] Tarayıcıya giden bundle'da secret yok: derlenen `dist/index.html` içinde secret değerleri/adları 0 kez geçiyor. `VITE_` önekli yalnız `VITE_SUPABASE_URL` ve `VITE_SUPABASE_ANON_KEY` var (ikisi de herkese açık olacak değerler; `service_role` yok)
- [x] Git geçmişinde secret kalmadı: `.env` hiçbir commit'te yok; `webhook.site`, `hook.make.com`, `eyJhbGci`, `WEBHOOK_SECRET=…`, `JWT_SECRET=…` 0 commit. `service_role`/`sk_live`/`ghp_` kalıpları yalnız GUVENLIK.md/README'deki uyarı metinlerinde (gerçek anahtar değil)

## API ve veri

- [x] Formlar doğrudan webhook'a değil, `/api/webhook` (+ `/api/token`) üzerinden gidiyor. (Şablondaki `/api/order` ve `/api/stock-request` yerine tek, olay tabanlı uç kullanıldı)
- [x] Sunucu tarafı validasyon: ad (≤80), telefon (biçim), e-posta (biçim, ≤120), açık rıza, olay türü, 20 KB gövde sınırı. (Adet: formlarda adet yok)
- [x] Ürün bilgisi istemciden alınmıyor: yalnız `urun_id` okunur; ad, kategori, cinsiyet, fiyat sunucudaki `urunler.js` listesinden yazılır (sahte ad/fiyat testte düzeltildi)
- [x] Tükenen ürüne sipariş ve stoktaki ürüne stok bildirimi 400 ile reddediliyor (test edildi)
- [x] Yalnız POST kabul ediliyor; diğerleri 405 (`/api/webhook`, `/api/token`)
- [x] Hata cevapları gövdesiz, yalnız durum kodu; teknik ayrıntı/stack sızmıyor
- [ ] `sepet.gonderildi`, `soru.gonderildi`, `bileklik.tasarlandi` olaylarının alanları sunucuda ayrıntılı doğrulanmıyor (yalnız zarf, boyut, hız sınırı). Kişi bilgisi taşımıyorlar, ama içerikleri istemciden geliyor

## Kötüye kullanım

- [x] Rate limit: IP başına dakikada 10 istek (webhook ve token ayrı sayaç), aşımda 429 + `Retry-After` (testte 11. istek 429)
- [ ] Not: sayaç bellekte, Vercel'de örnek başına çalışır; kalıcı çözüm için Upstash/Vercel KV gerekir (açık, Hafta 3+)
- [ ] Adet üst sınırı: sepette istemci tarafında 1–99; sepet siparişi sunucuda doğrulanmıyor (sipariş WhatsApp'tan gider)

## Yetkilendirme

- [x] JWT, **Sipariş Ver** formunda var (Hafta 2 / 2.4 ödevi istedi): `/api/token` 10 dk'lık HS256 jeton verir; jetonsuz, bozuk, süresi dolmuş, yanlış sırlı ve `alg=none` jeton 401. Not: Ders 3 örneği "public formlarda JWT yok" demişti; bu proje ödev gereği JWT kullanıyor ve `/api/token` herkese açık olduğu için tek başına bot koruması değil
- (n/a) Admin ucu (`/api/admin/orders`) bu projede yok
- [x] Token süresi 10 dakika

## KVKK

- [x] İki formda açık rıza kutusu var; işaretlenmeden tarayıcı göndermiyor, sunucu da `riza` kaydı olmayan isteği 400 ile reddediyor
- [x] Gizlilik Politikası yayında (site içi pencere), formdaki bağlantıdan ve alt bilgiden açılıyor
- [x] Toplanan alanlar minimumda: sipariş için ad/telefon, stok bildirimi için ad/e-posta
- [x] Saklama süreleri politikada yazılı (1 yıl / 30 gün — taslak değer)
- [ ] Gerçek firma unvanı ve hukukçu kontrolü: politika **taslaktır**; veri sorumlusu olarak "Volkan's Doğal Taş Atölyesi" ve iletişim bilgisi yazılı, resmî unvan teyit edilmedi

## AtölyeKart'a özel ek maddeler

- [x] Görsel hakları: ŞİFAMTAŞ kaynaklı 27–36 numaralı ürün fotoğrafları siteden ve `gh-pages` yayınından kaldırıldı
- [ ] Bu 12 fotoğraf eski commit'lerde (git geçmişinde) duruyor; repo herkese açık. Silmek geçmişi yeniden yazmayı (force push) gerektirir — karar bekliyor
- [x] CSP + Referrer-Policy derlemede ekleniyor (GUVENLIK.md); `connect-src` yalnız `'self'` ve Supabase
- [x] Çalışan ikinci yayın (GitHub Pages) statik: `/api` yok; formlar bu yayında "gönderilemedi" der, yalan onay vermez
- [ ] Vercel'in oluşturduğu yayın adresinin Deployment Protection ayarı kontrol edildi: canlı adres girişsiz açılıyor (HTTP 200)

## Deploy sonrası

- [ ] Canlı URL'de iki form denendi, webhook alıcısında iki event göründü — **henüz yapılmadı:** `WEBHOOK_URL` yok ve son kod henüz canlıya alınmadı. Yerelde tarayıcıyla (yerel alıcı) iki event göründü
- [ ] 11 istek arka arkaya gönderilip 429 alındığı canlıda doğrulandı — yerelde doğrulandı (11. istek 429); canlıda bekliyor
- [ ] Geçersiz e-posta ile 400 ve alan hatası canlıda doğrulandı — yerelde: `a@b` formda uyarı alır, sunucuya doğrudan gelirse 400
- (n/a) Expo Go: bu projede mobil port yok

## Özet
- Hazır: secret yönetimi, sunucu doğrulaması, JWT, hız sınırı, KVKK rızası, görsel haklarının düzeltilmesi.
- Açık (öncelik sırasıyla): ① son kodu canlıya al + canlı testler ② Vercel'e `WEBHOOK_URL` ③ Preview için ayrı secret ④ görsellerin git geçmişi kararı ⑤ hukukçu kontrolü ⑥ kalıcı rate limit (Upstash)
