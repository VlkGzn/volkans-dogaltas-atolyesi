// Atölyenin iletişim bilgileri, fiyatları ve sayfa metinleri — tek kaynak.

export const ILETISIM = {
  telefon: '+90 532 738 96 73',
  telefonHref: 'tel:+905327389673',
  whatsapp: '905327389673',
  instagram: 'volkansdogaltas',
  facebook: 'volkans.dogaltas',
  tiktok: 'volkans.dogaltas',
  x: '', // X hesabı açılınca kullanıcı adını yazın
  eposta: 'vgozen44@gmail.com',
  adres: ['Gürsu Mah. Atatürk Bulvarı,', 'Konyaaltı / Antalya'],
};

export const waLink = (mesaj) =>
  `https://wa.me/${ILETISIM.whatsapp}` + (mesaj ? `?text=${encodeURIComponent(mesaj)}` : '');

// Kategori fiyatları (TL, sabit). Ürüne özel fiyat urunler.js'te `fiyat` ile verilir.
export const FIYAT = {
  tesbih: 1500,
  bileklik: 1000,
  kolye: 2125,
  yuzuk: 2250,
};

// 1500 → "1.500 TL"
export const tl = (tutar) => `${tutar.toLocaleString('tr-TR')} TL`;

// Ürünün fiyatı: ürüne özel fiyat varsa o, yoksa kategori fiyatı.
export const urunFiyatSayi = (urun) => urun.fiyat ?? FIYAT[urun.kategori];
export const urunFiyati = (urun) => tl(urunFiyatSayi(urun));

// Ürünle ilgili WhatsApp mesajı — kart, büyük fotoğraf ve webhook aynı metni kullanır.
export const urunMesaji = (urun) =>
  `Merhaba, sitenizdeki "${urun.ad}" (${CINSIYET[urun.cinsiyet]} · ${KATEGORI[urun.kategori]}) hakkında bilgi almak istiyorum.`;

export const KATEGORI = { tesbih: 'Tesbih', bileklik: 'Bileklik', kolye: 'Kolye', yuzuk: 'Yüzük' };
export const CINSIYET = { erkek: 'Erkek', kadin: 'Kadın' };

export const FILTRELER = [
  { id: 'tumu', ad: 'Tümü' },
  { id: 'kadin', ad: 'Kadın' },
  { id: 'erkek', ad: 'Erkek' },
  { id: 'tesbih', ad: 'Tesbih' },
  { id: 'bileklik', ad: 'Bileklik' },
  { id: 'kolye', ad: 'Kolye' },
  { id: 'yuzuk', ad: 'Yüzük' },
];

// Üst menüdeki ana kategoriler (sırasıyla); her birinin altında Kadın / Erkek alt kategorisi açılır.
export const MENU_KATEGORILERI = ['bileklik', 'kolye', 'yuzuk', 'tesbih'];

// Süzgeç değerleri: 'tumu' · cinsiyet ('kadin') · kategori ('bileklik') · alt kategori ('bileklik:kadin')
export const altFiltre = (kategori, cinsiyet) => `${kategori}:${cinsiyet}`;

export const urunFiltredeMi = (urun, filtre) => {
  if (filtre.includes(':')) {
    const [kategori, cinsiyet] = filtre.split(':');
    return urun.kategori === kategori && urun.cinsiyet === cinsiyet;
  }
  return filtre === 'tumu' || urun.cinsiyet === filtre || urun.kategori === filtre;
};

export const filtreAdi = (filtre) => {
  if (filtre.includes(':')) {
    const [kategori, cinsiyet] = filtre.split(':');
    return `${KATEGORI[kategori]} · ${CINSIYET[cinsiyet]}`;
  }
  return FILTRELER.find((f) => f.id === filtre)?.ad ?? filtre;
};

export const foto = (dosya) => `./img/koleksiyon/${dosya}`;

// Fotoğrafı henüz çekilmemiş ürünlerde gösterilen tek yer tutucu (logolu "Fotoğraf yakında").
export const YAKINDA_GORSEL = './img/fotograf-yakinda.svg';
export const kapakGorseli = (urun) => (urun.fotograflar.length ? foto(urun.fotograflar[0]) : YAKINDA_GORSEL);

// Vitrin (büyük kayan görsel) — görseller ürün listesinden gelir.
export const VITRIN = [
  { eyebrow: 'Erkek tesbih', baslik: 'Her tanede\nbir hikâye.', alt: 'Yeşim, lapis ve sitrin taşlarından, gümüş püsküllü el yapımı tesbihler.', cta: 'Tesbihleri gör', filtre: 'tesbih', urun: 'yesim-tesbih' },
  { eyebrow: 'Kadın kolye', baslik: 'Denizden,\ntaştan, elden.', alt: 'Turkuaz ve deniz kabuğuyla örülmüş, hafif ve günlük kolyeler.', cta: 'Kolyeleri gör', filtre: 'kolye', urun: 'turkuaz-deniz-kabugu-kolye' },
  { eyebrow: 'Yüzük', baslik: 'Taşın gücü,\ngümüşün zarafeti.', alt: 'Malakit ve inci taşlı, tek tek işlenmiş yüzükler.', cta: 'Yüzükleri gör', filtre: 'yuzuk', urun: 'malakit-yuzuk' },
];

// Bileklik tasarlayıcı
export const TASLAR = [
  { id: 'ametist', ad: 'Ametist', renk: '#6B4A9B' },
  { id: 'lapis', ad: 'Lapis Lazuli', renk: '#2B4C9B' },
  { id: 'yesim', ad: 'Yeşim', renk: '#3E7B4F' },
  { id: 'malakit', ad: 'Malakit', renk: '#1F8A5B' },
  { id: 'turkuaz', ad: 'Turkuaz', renk: '#3FB0B0' },
  { id: 'kaplan', ad: 'Kaplan Gözü', renk: '#A8702A' },
  { id: 'sitrin', ad: 'Sitrin', renk: '#E3B341' },
  { id: 'akik', ad: 'Kırmızı Akik', renk: '#A3352B' },
  { id: 'oniks', ad: 'Oniks', renk: '#1C1C1E' },
  { id: 'havlit', ad: 'Havlit', renk: '#E9E6DF' },
  { id: 'kehribar', ad: 'Kehribar', renk: '#D08A2E' },
  { id: 'zebercet', ad: 'Zebercet', renk: '#9DBA3A' },
];

// Bileklik tasarımındaki taşların sayımı: [{ tas: 'ametist', tas_adi: 'Ametist', adet: 2 }, ...]
export const taneOzeti = (taneler) => {
  const sayilar = {};
  taneler.forEach((id) => { sayilar[id] = (sayilar[id] || 0) + 1; });
  return Object.keys(sayilar).map((id) => ({ tas: id, tas_adi: TASLAR.find((t) => t.id === id).ad, adet: sayilar[id] }));
};

const tekrar = (desen, n) => Array.from({ length: n }, (_, i) => desen[i % desen.length]);
export const HAZIR_DIZILIMLER = [
  tekrar(['oniks', 'oniks', 'kaplan'], 21),
  tekrar(['ametist', 'havlit'], 20),
  tekrar(['lapis', 'lapis', 'turkuaz', 'lapis', 'lapis', 'sitrin'], 21),
  tekrar(['yesim', 'malakit', 'yesim', 'havlit'], 20),
];
