import { useEffect, useState } from 'react';
import { URUNLER } from '../data/urunler.js';
import { siparisGonder, siparisVerisi, stokVerisi, webhookGonder } from '../lib/webhook.js';

const STOKTA = URUNLER.filter((u) => !u.tukendi);
const TUKENEN = URUNLER.filter((u) => u.tukendi);
const ilk = (liste) => liste[0]?.id ?? '';
const telefonRakamlari = (t) => t.replace(/\D/g, '');
// Sunucudaki (api/webhook.js) kurallarla aynı olmalı; yoksa müşteri onay görür ama kayıt reddedilir.
const TELEFON = /^[0-9+()\s-]{10,20}$/;
const EPOSTA = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Sipariş ver (ad, ürün, telefon) ve Stok bildirimi iste (ad, e-posta, tükenen ürün).
// İkisi de ekranda onay gösterir ve webhook'a (/api/webhook) olay gönderir.
export default function Formlar({ onGizlilik }) {
  const [siparis, setSiparis] = useState({ ad: '', urun: ilk(STOKTA), telefon: '', riza: false });
  const [siparisDurum, setSiparisDurum] = useState({ hata: '', tamam: '', bekliyor: false });
  const [stok, setStok] = useState({ ad: '', urun: ilk(TUKENEN), eposta: '', riza: false });
  const [stokDurum, setStokDurum] = useState({ hata: '', tamam: '' });

  // Tükenen ürün kartındaki "Stok bildirimi iste" düğmesi ürünü bu forma seçtirir.
  useEffect(() => {
    const sec = (e) => setStok((s) => ({ ...s, urun: e.detail }));
    window.addEventListener('stok-bildirimi-sec', sec);
    return () => window.removeEventListener('stok-bildirimi-sec', sec);
  }, []);

  const siparisYolla = async (e) => {
    e.preventDefault();
    if (!siparis.riza) {
      setSiparisDurum({ hata: 'Göndermek için açık rıza kutusunu işaretlemeniz gerekir.', tamam: '', bekliyor: false });
      return;
    }
    if (!TELEFON.test(siparis.telefon.trim()) || telefonRakamlari(siparis.telefon).length < 10) {
      setSiparisDurum({ hata: 'Telefonu yalnız rakamla, alan koduyla yazın (ör. 0532 000 00 00).', tamam: '' });
      return;
    }
    const urun = URUNLER.find((u) => u.id === siparis.urun);
    setSiparisDurum({ hata: '', tamam: '', bekliyor: true });
    if (!(await siparisGonder(siparisVerisi(siparis, urun)))) {
      setSiparisDurum({ hata: 'Siparişin şu an gönderilemedi. Biraz sonra yeniden dene ya da WhatsApp\'tan yaz.', tamam: '', bekliyor: false });
      return;
    }
    setSiparisDurum({ hata: '', bekliyor: false, tamam: `Teşekkürler ${siparis.ad.trim()}! "${urun.ad}" siparişin alındı; seni telefonla arayıp ödeme ve teslimatı netleştireceğiz.` });
    setSiparis({ ad: '', urun: ilk(STOKTA), telefon: '', riza: false });
  };

  const stokGonder = (e) => {
    e.preventDefault();
    if (!stok.riza) {
      setStokDurum({ hata: 'Göndermek için açık rıza kutusunu işaretlemeniz gerekir.', tamam: '' });
      return;
    }
    if (!EPOSTA.test(stok.eposta.trim())) {
      setStokDurum({ hata: 'E-posta adresini tam yazın (ör. ad@ornek.com).', tamam: '' });
      return;
    }
    const urun = URUNLER.find((u) => u.id === stok.urun);
    webhookGonder('stok.bildirimi_istendi', stokVerisi(stok, urun));
    setStokDurum({ hata: '', tamam: `Teşekkürler ${stok.ad.trim()}! "${urun.ad}" tekrar stoğa girdiğinde ${stok.eposta.trim()} adresine haber vereceğiz.` });
    setStok({ ad: '', urun: ilk(TUKENEN), eposta: '', riza: false });
  };

  const degis = (set, alan) => (e) => set((f) => ({ ...f, [alan]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const riza = (form, set, veri) => (
    <label className="onay">
      <input type="checkbox" required checked={form.riza} onChange={degis(set, 'riza')} />
      <span><button type="button" className="metin-link" onClick={onGizlilik}>Gizlilik Politikası ve Aydınlatma Metni</button>'ni okudum; {veri} bu talebi yanıtlamak için işlenmesine açık rızam var.</span>
    </label>
  );
  const sifirla = (set) => () => set((d) => ({ ...d, hata: '', tamam: '' }));

  return (
    <section id="siparis" className="container section">
      <div className="section__head">
        <h2 className="h2 h2--48">Sipariş ver</h2>
        <p className="lead">Bilgilerini bırak, seni arayalım. Tükenen bir ürünü istiyorsan stoğa girince haber verelim.</p>
      </div>
      <div className="formlar">
        <form className="formlar__kart" onSubmit={siparisYolla} onChange={sifirla(setSiparisDurum)}>
          <h3 className="formlar__baslik">Sipariş ver</h3>
          <label className="alan">Ad soyad
            <input type="text" required maxLength={80} autoComplete="name" value={siparis.ad} onChange={degis(setSiparis, 'ad')} />
          </label>
          <label className="alan">Ürün
            <select required value={siparis.urun} onChange={degis(setSiparis, 'urun')}>
              {STOKTA.map((u) => <option key={u.id} value={u.id}>{u.ad}</option>)}
            </select>
          </label>
          <label className="alan">Telefon
            <input type="tel" required maxLength={20} autoComplete="tel" inputMode="tel" placeholder="05xx xxx xx xx" value={siparis.telefon} onChange={degis(setSiparis, 'telefon')} />
          </label>
          {riza(siparis, setSiparis, 'adım ve telefon numaramın')}
          {siparisDurum.hata && <p className="uyelik__hata" role="alert">{siparisDurum.hata}</p>}
          {siparisDurum.tamam && <p className="uyelik__tamam" role="status">{siparisDurum.tamam}</p>}
          <button type="submit" className="btn btn--gold btn--big" disabled={siparisDurum.bekliyor}>{siparisDurum.bekliyor ? 'Gönderiliyor…' : 'Siparişi gönder'}</button>
        </form>

        {TUKENEN.length > 0 && (
          <form id="stok-bildirimi" className="formlar__kart" onSubmit={stokGonder} onChange={sifirla(setStokDurum)}>
            <h3 className="formlar__baslik">Stok bildirimi iste</h3>
            <label className="alan">Ad soyad
              <input type="text" required maxLength={80} autoComplete="name" value={stok.ad} onChange={degis(setStok, 'ad')} />
            </label>
            <label className="alan">Tükenen ürün
              <select required value={stok.urun} onChange={degis(setStok, 'urun')}>
                {TUKENEN.map((u) => <option key={u.id} value={u.id}>{u.ad}</option>)}
              </select>
            </label>
            <label className="alan">E-posta
              <input type="email" required maxLength={120} autoComplete="email" value={stok.eposta} onChange={degis(setStok, 'eposta')} />
            </label>
            {riza(stok, setStok, 'adım ve e-posta adresimin')}
            {stokDurum.hata && <p className="uyelik__hata" role="alert">{stokDurum.hata}</p>}
            {stokDurum.tamam && <p className="uyelik__tamam" role="status">{stokDurum.tamam}</p>}
            <button type="submit" className="btn btn--gold btn--big">Haber ver</button>
          </form>
        )}
      </div>
      <p className="formlar__not">Bilgilerin yalnız siparişi yanıtlamak ve stok haberi vermek için kullanılır.</p>
    </section>
  );
}
