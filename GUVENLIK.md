# Güvenlik denetimi — Volkan's Doğaltaş web sitesi

Son denetim: **2026-10-08** (A ve B düzeltildi) · Kapsam: `web-sitesi/` (React + Vite), Git geçmişi, canlı site
(https://vlkgzn.github.io/volkans-dogaltas-atolyesi/) · Denetlenen commit: `c0a916e`

Her yeni denetimde bu dosyayı güncelleyin (tarih, commit, sonuçlar). Ayrı bir rapor dosyası açmayın.

## Özet

| Alan | Sonuç |
|---|---|
| Gizli bilgi sızıntısı (Git geçmişi, canlı site) | ✅ Sızıntı yok |
| XSS / injection (üye adı, adres çubuğu, tarayıcı deposu) | ✅ Hiçbir deneme çalışmadı |
| Bağımlılıklar (`npm audit`) | ✅ Sitede 0 açık · ⚠️ derleme aracında 3 uyarı (yaması yok, etkisiz) |
| Taşıma güvenliği (HTTPS) | ✅ HTTPS zorunlu, HSTS açık |
| Güvenlik politikası (CSP) | ✅ 2026-10-08'de eklendi (meta etiketi) · ⚠️ çerçeveleme koruması yok (GitHub Pages) |
| Sepet / favori verisinin doğrulanması | ✅ 2026-10-08'de düzeltildi |

## 1. Gizli bilgi sızıntısı

| Test | Sonuç |
|---|---|
| `.env` hiçbir commit'te var mı? (`git log --all --name-only`) | Yok; yalnız boş şablon `.env.example` |
| Tüm geçmişte anahtar kalıpları (JWT `eyJ…`, `sk_live`, `ghp_`, `AKIA…`, Make webhook adresi, `*.supabase.co`) | Yalnız yorumdaki örnek `xxxx.supabase.co` |
| Not dosyalarında şifre (`hesap-bilgileri.txt`, README, CLAUDE.md) | Yok |
| Başka firmaya ait görseller (`yeni-resimler/`) ve kaynak ekran görüntüleri | `.gitignore`'da, yayında değil |
| Canlı sitede `.env`, `.git/config`, `package.json`, `src/App.jsx`, kaynak haritası (`.map`) | Hepsi 404 |
| Canlı sayfanın içinde anahtar, webhook adresi, `service_role`, bilgisayar yolu (`/Users/`) | Yok |

**Bilinçli olarak açık olanlar:** telefon, e-posta ve adres sitede, README'de ve CLAUDE.md'de görünüyor (repo herkese açık).
Bunlar işletmenin iletişim bilgileri; kişisel e-postanın kodda durması istenmezse kaldırılabilir.

## 2. XSS / injection testleri

Yöntem: `.env` olmadan, sahte Supabase adresiyle ayrı bir test derlemesi (projedeki `dist/`'e dokunulmadı). Sayfa
yüklenmeden önce tarayıcı deposuna zararlı veri yazıldı ve headless Chrome'da çalıştırıldı. Zararlı yük:
`<img src=x onerror="window.__xss=…">`. Ayrıca `alert` yakalandı ve sayfa hataları kaydedildi.

| Girdi noktası | Denenen | Sonuç |
|---|---|---|
| Üye adı (`user_metadata.ad`, başlıkta "Merhaba, …") | Ad alanına HTML/JS yükü | ✅ Düz metin olarak göründü, çalışmadı |
| Adres çubuğu sorgusu `?q=` | `<img src=x onerror=alert(1)>` | ✅ Site kullanmıyor, etkisiz |
| Adres çubuğu `#` (hash) | `<img src=x onerror=alert(2)>` | ✅ Etkisiz |
| Sepet deposu (`volkans-dogaltas:sepet`) | Ürün kimliğinde HTML, `__proto__`, `null`, metin, eksi/ondalık/`"1e9"`/500 adet + 1 geçerli kalem | ✅ XSS yok · ✅ yalnız geçerli kalem kaldı: "2× Yeşim Tesbih — 3.000 TL" |
| Favori deposu (`volkans-dogaltas:favoriler`) | HTML, nesne, `null`, sayı + 1 geçerli kimlik | ✅ Yalnız geçerli kimlik kaldı |
| CSP'nin kendisi | Sayfaya özeti olmayan `<script>` ve `<img onerror>` eklendi | ✅ İkisi de engellendi |
| WhatsApp bağlantıları (`waLink`) | Mesaj içeriği | ✅ `encodeURIComponent` ile kodlanıyor |

Sonuç: `window.__xss` boş kaldı, sayfada `img[src="x"]` öğesi oluşmadı ve JavaScript hatası çıkmadı.

**Kod incelemesi:** `dangerouslySetInnerHTML`, `eval` ve `innerHTML` hiç kullanılmıyor. Tüm metinler React (JSX) ile basılıyor,
yani otomatik kaçışlanıyor. Dış bağlantıların hepsinde `target="_blank" rel="noopener"` var. Sitede arama kutusu yok;
kullanıcıdan metin alan tek form üyelik formu.

## 3. Bağımlılıklar

- `npm audit --omit=dev` (ziyaretçiye giden kod): **0 açık**.
- `npm audit` (tümü): `braces` → `micromatch` → `vite-plugin-singlefile` zincirinde **3 yüksek** uyarı (GHSA-vfj7-8cjw-p6xm,
  iç içe kalıplarla yığın taşırma).
  - `braces`'ın yamalı sürümü yok (en yeni 3.0.3 de etkileniyor). `npm audit fix --force`'un önerdiği eklenti 0.9.0'a düşürmek
    Vite 8 ile çalışmaz → **uygulanmadı**.
  - Etkisi yok: yalnız `npm run build` sırasında çalışıyor, kalıpları biz veriyoruz ve eklenti `micromatch`'i yalnız
    `inlinePattern` ayarı verildiğinde kullanıyor (bizde yok).
  - Yeni bir `braces` sürümü çıkınca `npm update` ile alınmalı.
- 2026-10-08'de yamalar uygulandı: vite 8.3.4, @vitejs/plugin-react 6.1.2, @supabase/supabase-js 2.117.3.

## 4. Canlı site (GitHub Pages)

| Kontrol | Sonuç |
|---|---|
| HTTP → HTTPS yönlendirme | ✅ 301 |
| `Strict-Transport-Security` | ✅ `max-age=31556952` |
| `Content-Security-Policy` | ✅ Meta etiketi (derleme sırasında, bkz. Bulgu A) |
| `X-Frame-Options` / `frame-ancestors` (tıklama hilesi) | ⚠️ Yok — site başka bir sayfaya çerçeve olarak gömülebilir |
| `Referrer-Policy` | ✅ Meta etiketi: `strict-origin-when-cross-origin` |
| `X-Content-Type-Options` | ⚠️ Yok (meta ile verilemez) |

GitHub Pages özel başlık eklemeye izin vermiyor. Bkz. Bulgu A.

## Bulgular ve öneriler

### A. Güvenlik başlıkları yok — ✅ DÜZELTİLDİ (2026-10-08), çerçeveleme açık kaldı
Supabase bağlanınca oturum anahtarı tarayıcı deposunda tutulacak; olası bir XSS bu anahtarı çalabilirdi.
**Yapılan:** `web-sitesi/vite.config.js`'teki `guvenlikPolitikasi` eklentisi her `npm run build`'de `dist/index.html`'e CSP ve
Referrer-Policy meta etiketi ekler:
- `script-src`: yalnız gömülü JS'nin SHA-256 özeti → başka hiçbir betik (enjekte edilen dahil) çalışamaz.
- `connect-src`: `'self'` + `.env`'deki Supabase ve webhook adresleri (derlemede otomatik eklenir).
- `font-src` Google Fonts · `img-src`/`media-src` kendi dosyaları · `object-src 'none'` · `base-uri 'none'`.
- `style-src`'de `'unsafe-inline'` var: React'in hesaplanan `style={{…}}` değerleri için gerekli; stil enjeksiyonu kod çalıştırmaz.
**Dikkat:** siteye yeni bir dış kaynak (analiz aracı, harita, başka font, YouTube vb.) eklenirse CSP'ye de eklenmeli, yoksa
tarayıcı engeller. Claude önizlemesinde sayfa gövdeye sarıldığı için CSP orada etkisizdir; canlı sitede ve dosya açılışında çalışır.
**Açık kalan:** `frame-ancestors` meta etiketiyle çalışmaz → site başka bir sayfaya çerçeve olarak gömülebilir (tıklama hilesi).
Gerekirse Cloudflare/Netlify gibi başlık eklenebilen bir barındırmaya geçilmeli.

### B. Sepet adetleri doğrulanmıyor — ✅ DÜZELTİLDİ (2026-10-08)
Önce depoya elle `"1e9"` yazılınca WhatsApp mesajı "1e9× Yeşim Tesbih — 1.500.000.000.000 TL" oluyordu.
**Yapılan:** `src/lib/sepet.js` depodan okurken yalnız `urunler.js`'te olan kimlikleri ve 1–99 arası tam sayı adetleri kabul eder
(`MAKS_ADET = 99`); ekleme/artırma da 99'da durur. `src/lib/favoriler.js` yalnız listedeki ürün kimliklerini kabul eder.
Ürün listeden kaldırılırsa sepetteki/favorideki kaydı da kendiliğinden düşer.

### C. Webhook adresi herkese açık olacak — orta (adres girilince)
`VITE_WEBHOOK_URL` derlenen sayfanın içine yazılır; adresi gören herkes Make'e sahte bildirim gönderebilir.
**Öneri:** Make senaryosunda `surum = "1.0"` ve `kaynak = "web-sitesi"` alanlarını süzün, işlem sınırı koyun. Bu adresi gizli
bilgi gibi değil, herkese açık bir posta kutusu gibi düşünün.

### D. Supabase kurulumu — yüksek (kurulumda mutlaka)
- `.env`'e yalnız **anon public** anahtar yazılmalı; `service_role` anahtarı asla.
- Favori/sepet tabloları açılınca her tabloda **RLS açık** olmalı ve kurallar `auth.uid() = kullanici_id` olmalı.
- Auth → URL Configuration'da **Redirect URLs** listesine yalnız sitenin adresi yazılmalı. Kod, doğrulama ve şifre yenileme
  bağlantısını `window.location.href`'ten üretiyor; listeyi Supabase denetliyor.
- Ad alanına uzunluk sınırı (ör. 80 karakter) konmalı.
- Kurulumdan sonra bu dosyanın 2. bölümündeki testler gerçek Supabase'le tekrar çalıştırılmalı, RLS başka bir kullanıcının
  verisini okumaya çalışılarak denenmeli.

## Testleri tekrar çalıştırma

1. Gizli bilgi taraması (proje kökünde):
   `git grep -nIE '(eyJ[A-Za-z0-9_-]{20,}|sk_live|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|hook\.[a-z0-9]+\.make\.com|service_role)' $(git rev-list --all)`
2. Bağımlılıklar: `cd web-sitesi && npm audit --omit=dev && npm audit`
3. CSP + XSS + sepet testi (`araclar/guvenlik_testi.py`): sayfayı `file://` ve `http://` ile açar; CSP ihlali, görsel/font/video
   yüklemesi, XSS denemeleri ve sepet/favori doğrulamasını raporlar. Beklenen: `ihlal: []`, `xss: []`, `zararli_img: 0`,
   `sepet_satir: 1` ("2× Yeşim Tesbih"), `gorsel` tam.
   ```bash
   cd web-sitesi && npm run build && cp -R dist /tmp/t1
   VITE_SUPABASE_URL=http://127.0.0.1:59999 VITE_SUPABASE_ANON_KEY=test npx vite build --outDir /tmp/t2 --emptyOutDir
   cd .. && python3 -I araclar/guvenlik_testi.py /tmp/t1 && python3 -I araclar/guvenlik_testi.py /tmp/t2 --oturum
   ```
   Projedeki `dist/`'i doğrudan vermeyin (betik içine geçici dosya yazar). Not: Chrome'a `--user-data-dir` verilince test takılıyor.
4. Canlı başlıklar: `curl -sI https://vlkgzn.github.io/volkans-dogaltas-atolyesi/`

## Kapsam dışı (henüz yapılmadı)

- Gerçek Supabase projesiyle kimlik doğrulama ve RLS testi (proje bekleniyor).
- Gerçek webhook adresiyle uçtan uca kötüye kullanım testi (adres bekleniyor).
- Otomatik tarayıcılarla (OWASP ZAP vb.) dinamik tarama.
