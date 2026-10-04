# Bileşen standartları — ayrıntı

## İçindekiler
1. Proje yapısı
2. Veri katmanı (`src/data/`)
3. Ürün bileşenleri: ProductImage · ProductCard · ProductList
4. Yeni bileşen şablonu
5. Stil kuralları
6. Erişilebilirlik ve metin
7. Durum (state) nerede tutulur
8. Ürün ekleme / değiştirme
9. Kontrol listesi

---

## 1. Proje yapısı

```
web-sitesi/
  index.html              Vite giriş sayfası (meta, favicon, fontlar, #root) — içerik buraya yazılmaz
  src/main.jsx            React kökü
  src/App.jsx             Bölümlerin sırası + paylaşılan durum (filtre, açık ürün)
  src/styles.css          TÜM stiller
  src/data/urunler.js     Ürün listesi (URUNLER)
  src/data/site.js        ILETISIM, waLink, FIYAT, KATEGORI, CINSIYET, FILTRELER, urunFiltredeMi, foto, VITRIN, TASLAR, HAZIR_DIZILIMLER
  src/components/         Bileşenler
  public/                 Statik dosyalar (img/koleksiyon, video, qr-whatsapp.svg, favicon.svg)
  dist/                   `npm run build` çıktısı — ELLE DÜZENLENMEZ
```

`dist/index.html` vite-plugin-singlefile ile JS/CSS'i içine gömer; çift tıklayınca açılır. Bu yüzden `vite.config.js`'deki `base: './'` ve göreli yollar (`./img/...`) korunmalı; `/img/...` gibi kök-mutlak yol yazma (file:// ile açınca kırılır).

## 2. Veri katmanı

Bileşenler sabit içerik barındırmaz. Ürün adı, fiyat, telefon, Instagram adı, adres, kategori etiketi gibi her şey `src/data/`'dan içe aktarılır.

```jsx
import { CINSIYET, FIYAT, KATEGORI, foto, waLink } from '../data/site.js';
import { URUNLER } from '../data/urunler.js';
```

Ürün nesnesinin şekli (urunler.js):

```js
{ id: 'yesim-tesbih',              // kebab-case, benzersiz, Türkçe karaktersiz
  cinsiyet: 'erkek',               // 'erkek' | 'kadin'
  kategori: 'tesbih',              // 'tesbih' | 'bileklik' | 'kolye' | 'yuzuk'
  ad: 'Yeşim Tesbih',              // görünen ad (Tesbih yazımı!)
  fiyat: 7500,                     // isteğe bağlı: ürüne özel fiyat, TL sayı (yoksa kategori fiyatı)
  aciklama: 'Gümüş imame ve püsküllü',
  fotograflar: ['01-yesim-tesbih.jpg'],  // public/img/koleksiyon/ altındaki dosyalar; ilki kapak; [] = "Fotoğraf yakında"
  yeni: true }                     // isteğe bağlı: "Atölyeden yeni" bölümünde de görünür
```

Fiyatlar sabit sayıdır (TL): kategori fiyatı `FIYAT` (site.js), ürüne özel fiyat `fiyat: 7500`. Gösterim her yerde `urunFiyati(urun)`
("7.500 TL", `tl()` biçimler), hesap (sepet toplamı, webhook tutarları) `urunFiyatSayi(urun)`. Fiyat aralığı yazma ("750 – 1.250 TL") — sepet toplamı bozulur.

Fotoğrafı olmayan ürün `fotograflar: []` ile eklenir; kapak görseli her yerde `kapakGorseli(urun)` (site.js) ile alınır —
boşsa tek yer tutucu `public/img/fotograf-yakinda.svg` (logolu) gösterilir ve büyütme kapalıdır. Başka firmanın görselini yer tutucu yerine koyma.

## 3. Ürün bileşenleri

Hiyerarşi: `ProductList` → her ürün için `ProductCard` → kapak fotoğrafı için `ProductImage`.
Koleksiyon, Atölyeden yeni ve ileride eklenecek her ürün listesi bu üçlüyü kullanır.

### ProductImage — `src/components/ProductImage.jsx`

| Prop | Tür | Varsayılan | Açıklama |
|---|---|---|---|
| `src` | string | — | `foto(dosya)` ile üretilmiş yol |
| `alt` | string | — | Ürün adı (ekran okuyucu için) |
| `ratio` | string | `'4 / 5'` | CSS aspect-ratio |
| `count` | number | `1` | >1 ise "N fotoğraf" rozeti |
| `onOpen` | () => void | — | Verilirse görsel büyütme düğmesi olur (`<button>`, zoom-in imleci) |
| `eager` | bool | `false` | İlk ekranda görünen görsellerde `true` (lazy yükleme kapanır) |

### ProductCard — `src/components/ProductCard.jsx`

| Prop | Tür | Açıklama |
|---|---|---|
| `urun` | ürün nesnesi | urunler.js'teki şekil |
| `onOpen` | (urun) => void | İsteğe bağlı; fotoğrafa tıklayınca Lightbox açar |

Gösterir: fotoğraf, ad, "Cinsiyet · Kategori — açıklama", fiyat, "WhatsApp'tan sor" düğmesi.
Ayrıca `urunMesaji(urun)` dışa aktarılır; ürünle ilgili WhatsApp mesajı gereken her yer (Lightbox, webhook) bunu kullanır.

### ProductList — `src/components/ProductList.jsx`

| Prop | Tür | Açıklama |
|---|---|---|
| `urunler` | ürün dizisi | Gösterilecek ürünler (süzme dışarıda yapılır) |
| `onOpen` | (urun) => void | ProductCard'a geçirilir |
| `bosMesaj` | string | Liste boşsa gösterilen metin |

Kart içeriğine bir şey eklemek (ör. favori düğmesi) → `ProductCard`'ı genişlet; yeni bir kart bileşeni yazma. Davranış isteğe bağlıysa prop ile aç/kapat (`favoriGoster`).

## 4. Yeni bileşen şablonu

```jsx
// Kısa açıklama: bu bileşen ne gösterir, nerede kullanılır.
import { ILETISIM } from '../data/site.js';

export default function YeniBolum({ onFiltre }) {
  return (
    <section id="yeni-bolum" className="container section">
      <div className="section__head">
        <h2 className="h2">Başlık</h2>
      </div>
      {/* içerik */}
    </section>
  );
}
```

- Bir dosya = bir varsayılan dışa aktarım. Küçük yardımcı bileşen aynı dosyada isimli dışa aktarım olabilir (`export function Ozellikler`).
- Yorumlar Türkçe ve kısa; neyin neden yapıldığını söyler.
- Sayfaya eklemek için `App.jsx`'te doğru sıraya yerleştir.
- İkiden fazla yerde tekrar eden JSX parçası → bileşene çıkar (ör. `GecisKarti`).

## 5. Stil kuralları

- Stil `src/styles.css`'te. Sınıf adları BEM benzeri: `blok`, `blok__oge`, `blok--durum` (`product-card__price`, `chip--on`).
- Satır içi `style` yalnız hesaplanan değerler için: konum (`left/top`), dinamik renk, `aspectRatio`, `transformOrigin`.
- Renkler `:root` değişkenleri: `--bg --bg-2 --card --footer --line --line-2 --gold --gold-hover --text --muted --dim`. Yazı tipleri `--serif` (Cormorant Garamond, başlık) ve `--sans` (Jost, gövde).
- Ortak sınıfları yeniden kullan: `container`, `section`, `section__head`, `eyebrow`, `h2`, `lead`, `btn btn--gold|--outline|--big|--small`, `round-btn`, `chip`.
- Animasyonlar `@keyframes` ile styles.css'te; `prefers-reduced-motion` bloğu tüm animasyonları kapatır — yeni animasyon da buna uyar.
- Telefon genişliği (≤600px) için ızgaralar `auto-fill/auto-fit + minmax` ile kendiliğinden kırılmalı; sabit genişlik verme.

## 6. Erişilebilirlik ve metin

- Tıklanan öğe `<button type="button">` ya da `<a href>`; `div`/`span`'a `onClick` verme.
- Yalnız simgeli düğmede `aria-label` (Türkçe: "Kapat", "Sonraki fotoğraf").
- Dışarı giden bağlantılar `target="_blank" rel="noopener"`.
- Metin dili Türkçe; "Tesbih" yazımı; fiyat biçimi `1.500 TL`, aralık `750 – 1.250 TL` (en tire, boşluklu).
- Kontrast: açık metin `--text` koyu zemin üzerinde; ikincil metin `--muted`.

## 7. Durum nerede tutulur

- Birden fazla bölümün paylaştığı durum `App.jsx`'te: `filtre` (koleksiyon süzgeci; menü, kategori kartları, vitrin, alt bilgi hepsi `onFiltre` ile değiştirir) ve `acikUrun` (tek `Lightbox`).
- Bölüme özel durum bölümün içinde (`Vitrin` slayt sırası, `BileklikTasarla` taneler).
- `localStorage` yalnız kişisel kolaylık için (ör. favoriler) ve try/catch ile.

## 8. Ürün ekleme / değiştirme

1. Fotoğrafı `public/img/koleksiyon/NN-ad.jpg` olarak kaydet (en uzun kenar ≤1000px, JPEG kalite ~84). Aynı fotoğraf zaten varsa yenisini ekleme.
2. `urunler.js`'e tek satır ekle/düzelt.
3. Başka hiçbir dosyaya ürün adı yazma; sayılar (süzgeç sayıları vb.) kendiliğinden güncellenir.
4. `npm run build`.

## 9. Kontrol listesi (teslimden önce)

- [ ] Sabit içerik yok; veri `src/data/`'dan geliyor
- [ ] Ürün kartı için `ProductCard` kullanıldı
- [ ] Yeni stil styles.css'te, renkler değişkenle
- [ ] "Tespih" geçmiyor (`grep -ri tespih src` yalnız dosya adları/hashtag)
- [ ] Gizli anahtar/sır yok
- [ ] `npm run build` hatasız
- [ ] CLAUDE.md gerekiyorsa güncellendi
