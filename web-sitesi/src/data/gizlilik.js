// Gizlilik Politikası ve Aydınlatma Metni — TASLAKTIR (v1). Yayına almadan önce bir hukukçuya kontrol ettirin.
// Bu metin sitenin gerçek veri akışını anlatır; akış değişirse (yeni form, yeni hizmet) burası da güncellenmelidir.
import { ILETISIM } from './site.js';

export const GIZLILIK_SURUMU = 'gizlilik-v1';
export const GIZLILIK_BASLIK = 'Gizlilik Politikası ve Aydınlatma Metni';

export const GIZLILIK_BOLUMLERI = [
  {
    baslik: 'Veri sorumlusu',
    metin: [`Volkan's Doğal Taş Atölyesi (${ILETISIM.adres.join(' ')}). İletişim: ${ILETISIM.eposta}, ${ILETISIM.telefon}.`],
  },
  {
    baslik: 'Hangi verileri topluyoruz?',
    metin: [
      'Sipariş formu: ad soyad, telefon numarası ve seçtiğiniz ürün.',
      'Stok bildirimi formu: ad soyad, e-posta adresi ve tükenen ürün.',
      'Üyelik (açıldığında): ad soyad, e-posta, şifre (şifrelenmiş saklanır).',
      'Cihazınızda saklananlar: favoriler ve sepet, yalnız tarayıcınızda tutulur; bize gönderilmez.',
      'WhatsApp ile yazdığınızda: WhatsApp\'ın kendi koşulları geçerlidir.',
    ],
  },
  {
    baslik: 'Neden kullanıyoruz?',
    metin: [
      'Sipariş formu: sizi arayıp siparişi, ödemeyi ve teslimatı netleştirmek.',
      'Stok bildirimi: tükenen ürün tekrar geldiğinde size e-posta ile haber vermek.',
      'Verileriniz pazarlama için kullanılmaz ve satılmaz.',
    ],
  },
  {
    baslik: 'Hukuki sebep',
    metin: ['Formlardaki kutuyu işaretleyerek verdiğiniz açık rıza (6698 sayılı KVKK md. 5/1). Rızanızı istediğiniz zaman geri alabilirsiniz; geri alma geçmişe etki etmez.'],
  },
  {
    baslik: 'Kimlerle paylaşılır?',
    metin: [
      'Form bilgileri sunucumuzdan geçerek sipariş ve stok kayıtlarını tuttuğumuz otomasyon hizmetine (Make, Zapier veya n8n) ve onun bağlı olduğu tabloya (ör. Google Sheets) iletilir. Bu hizmetlerin sunucuları yurt dışında olabilir.',
      'Site Vercel üzerinde yayınlanır; Vercel, ziyaret kayıtlarını (IP adresi gibi) teknik olarak tutabilir. Yazı tipleri Google Fonts\'tan yüklenir.',
      'Yasal zorunluluk dışında başka üçüncü kişilerle paylaşılmaz.',
    ],
  },
  {
    baslik: 'Ne kadar saklanır?',
    metin: ['Sipariş bilgileri sipariş tamamlandıktan sonra 1 yıl; stok bildirimi bilgileri ürün için haber verildikten veya talebiniz silindikten sonra en geç 30 gün. (Taslak süreler; atölye kararına göre güncellenecek.)'],
  },
  {
    baslik: 'Güvenlik',
    metin: ['Formlar doğrulanır, istekler hız sınırından geçer, gizli anahtarlar tarayıcıya gönderilmez, yalnız sunucuda tutulur. Hiçbir yöntem %100 güvenlik garantisi vermez.'],
  },
  {
    baslik: 'Haklarınız (KVKK md. 11)',
    metin: [`Verilerinizin işlenip işlenmediğini öğrenme, düzeltilmesini veya silinmesini isteme, itiraz etme ve şikâyet hakkınız vardır. Başvuru: ${ILETISIM.eposta}.`],
  },
  {
    baslik: 'Güncelleme',
    metin: ['Bu metin gerektiğinde güncellenir; geçerli sürüm: v1 (Ekim 2026).'],
  },
];
