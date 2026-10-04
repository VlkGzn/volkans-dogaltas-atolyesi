import { useCallback, useState } from 'react';
import Header from './components/Header.jsx';
import Giris from './components/Giris.jsx';
import Vitrin from './components/Vitrin.jsx';
import Kategoriler, { Ozellikler } from './components/Kategoriler.jsx';
import Koleksiyon from './components/Koleksiyon.jsx';
import BileklikTasarla from './components/BileklikTasarla.jsx';
import AtolyedenYeni from './components/AtolyedenYeni.jsx';
import Footer from './components/Footer.jsx';
import Lightbox from './components/Lightbox.jsx';
import { useFavoriler } from './lib/favoriler.js';
import { useSepet } from './lib/sepet.js';
import Sepet from './components/Sepet.jsx';
import Uyelik from './components/Uyelik.jsx';
import { useUyelik } from './lib/uyelik.js';

export default function App() {
  // Süzgeç burada tutulur: menü, kategori kartları, vitrin ve alt bilgi linkleri aynı süzgeci açar.
  const [filtre, setFiltre] = useState('tumu');
  // Büyütülen ürün (Lightbox) — Koleksiyon ve Atölyeden yeni aynı görüntüleyiciyi kullanır.
  const [acikUrun, setAcikUrun] = useState(null);
  const kapat = useCallback(() => setAcikUrun(null), []);
  // Favoriler tek yerde: Koleksiyon ve Atölyeden yeni'deki aynı ürünün kalbi birlikte değişir.
  const [favoriler, favoriDegistir] = useFavoriler();
  // Sepet tek yerde: kartlar ve büyük fotoğraf ekler, başlıktaki çanta açar.
  const sepet = useSepet();
  const [sepetAcik, setSepetAcik] = useState(false);
  const sepetiKapat = useCallback(() => setSepetAcik(false), []);
  // Üyelik: sağ üstteki Giriş yap / Üye ol düğmeleri pencereyi açar ('giris' | 'uye' | null).
  const uyelik = useUyelik();
  const [uyelikPencere, setUyelikPencere] = useState(null);
  const uyelikKapat = useCallback(() => setUyelikPencere(null), []);

  return (
    <div className="page">
      <Header onFiltre={setFiltre} sepetAdedi={sepet.adet} onSepet={() => setSepetAcik(true)} uyelik={uyelik} onUyelik={setUyelikPencere} />
      <Giris />
      <Vitrin onFiltre={setFiltre} />
      <Ozellikler />
      <Kategoriler onFiltre={setFiltre} />
      <Koleksiyon filtre={filtre} setFiltre={setFiltre} onOpen={setAcikUrun} favoriler={favoriler} onFavori={favoriDegistir} onSepeteEkle={sepet.ekle} />
      <BileklikTasarla />
      <AtolyedenYeni onOpen={setAcikUrun} onTumu={() => setFiltre('tumu')} favoriler={favoriler} onFavori={favoriDegistir} onSepeteEkle={sepet.ekle} />
      <Footer onFiltre={setFiltre} />
      {acikUrun && <Lightbox key={acikUrun.id} urun={acikUrun} onClose={kapat} onSepeteEkle={sepet.ekle} />}
      {sepetAcik && <Sepet sepet={sepet} onClose={sepetiKapat} />}
      {uyelikPencere && <Uyelik key={uyelikPencere} uyelik={uyelik} baslangic={uyelikPencere} onClose={uyelikKapat} />}
    </div>
  );
}
