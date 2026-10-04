// KVKK Aydınlatma Metni — TASLAKTIR. Yayına almadan önce bir hukukçuya kontrol ettirin.
import { ILETISIM } from './site.js';

export const KVKK_BASLIK = 'Kişisel Verilerin Korunması Aydınlatma Metni';

export const KVKK_METNI = [
  `Veri sorumlusu: Volkan's Doğal Taş Atölyesi (${ILETISIM.adres.join(' ')}, ${ILETISIM.eposta}).`,
  'İşlenen veriler: Üyelik sırasında verdiğiniz ad-soyad, e-posta adresi ve şifreniz (şifre şifrelenmiş olarak saklanır); sitede işaretlediğiniz favoriler ve sepet içeriği.',
  'İşleme amaçları: Üyelik hesabınızın oluşturulması ve yönetilmesi, giriş güvenliği, siparişlerinizin ve taleplerinizin takibi, size ait favori ve sepet bilgilerinin farklı cihazlarda gösterilmesi.',
  'Hukuki sebep: 6698 sayılı KVKK md. 5/2-c (sözleşmenin kurulması ve ifası) ve md. 5/2-f (meşru menfaat); ticari elektronik ileti gönderimi yalnızca ayrıca açık rızanız alınırsa yapılır.',
  'Aktarım: Verileriniz, üyelik altyapısını sağlayan hizmet sağlayıcının (Supabase) sunucularında saklanır; bu sunucular yurt dışında bulunabilir. Başka üçüncü kişilerle paylaşılmaz.',
  'Saklama süresi: Üyeliğiniz devam ettiği sürece; üyeliği sonlandırmanızdan itibaren yasal süreler kadar.',
  `Haklarınız (KVKK md. 11): Verilerinizin işlenip işlenmediğini öğrenme, düzeltilmesini veya silinmesini isteme, itiraz etme ve diğer haklarınız için ${ILETISIM.eposta} adresine yazabilirsiniz.`,
];
