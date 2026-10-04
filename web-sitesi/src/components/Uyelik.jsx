import { useEffect, useRef, useState } from 'react';
import { CloseIcon } from './Icons.jsx';
import { KVKK_BASLIK, KVKK_METNI } from '../data/kvkk.js';
import { ILETISIM, waLink } from '../data/site.js';

// Üye ol / Giriş yap / Şifremi unuttum penceresi. Üyelik kapalıysa (Supabase bağlanmadıysa) yalnız bilgi gösterir.
export default function Uyelik({ uyelik, baslangic = 'giris', onClose }) {
  const [sekme, setSekme] = useState(baslangic); // 'giris' | 'uye' | 'sifre' | 'kvkk'
  const [form, setForm] = useState({ ad: '', eposta: '', sifre: '', kvkk: false });
  const [durum, setDurum] = useState({ bekliyor: false, hata: '', tamam: '' });
  const kapatRef = useRef(null);
  const geriSekme = useRef('uye');

  useEffect(() => {
    kapatRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const eski = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = eski; };
  }, [onClose]);

  const degis = (alan) => (e) => setForm((f) => ({ ...f, [alan]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const sekmeyeGec = (s) => { setSekme(s); setDurum({ bekliyor: false, hata: '', tamam: '' }); };

  const gonder = async (e) => {
    e.preventDefault();
    if (sekme === 'uye' && !form.kvkk) { setDurum({ hata: 'Üye olmak için aydınlatma metnini onaylamanız gerekir.' }); return; }
    setDurum({ bekliyor: true, hata: '', tamam: '' });
    const islem = sekme === 'uye' ? uyelik.uyeOl : sekme === 'sifre' ? uyelik.sifreSifirla : uyelik.girisYap;
    const s = await islem(form);
    setDurum({ bekliyor: false, hata: s.hata || '', tamam: s.tamam || '' });
    if (s.tamam && sekme === 'giris') setTimeout(onClose, 600);
  };

  const basliklar = { giris: 'Giriş yap', uye: 'Üye ol', sifre: 'Şifremi unuttum', kvkk: KVKK_BASLIK };

  return (
    <div className="uyelik-arka" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="uyelik" role="dialog" aria-modal="true" aria-labelledby="uyelik-baslik">
        <div className="uyelik__head">
          <h2 id="uyelik-baslik" className="uyelik__title">{basliklar[sekme]}</h2>
          <button ref={kapatRef} type="button" className="round-btn round-btn--small" onClick={onClose} aria-label="Kapat"><CloseIcon /></button>
        </div>

        {!uyelik.aktif ? (
          <div className="uyelik__body">
            <p className="uyelik__bilgi">Üyelik sistemimiz kuruluyor, çok yakında buradan üye olup giriş yapabileceksiniz.</p>
            <p className="uyelik__bilgi">Şimdilik favorileriniz ve sepetiniz bu cihazda saklanıyor; siparişlerinizi sepetten WhatsApp ile gönderebilirsiniz.</p>
            <a className="btn btn--outline" href={waLink()} target="_blank" rel="noopener">WhatsApp: {ILETISIM.telefon}</a>
          </div>
        ) : sekme === 'kvkk' ? (
          <div className="uyelik__body uyelik__kvkk">
            {KVKK_METNI.map((p) => <p key={p}>{p}</p>)}
            <button type="button" className="btn btn--outline" onClick={() => sekmeyeGec(geriSekme.current)}>← Geri dön</button>
          </div>
        ) : (
          <form className="uyelik__body" onSubmit={gonder} noValidate={false}>
            {sekme !== 'sifre' && (
              <div className="uyelik__tabs" role="tablist">
                <button type="button" role="tab" aria-selected={sekme === 'giris'} className={sekme === 'giris' ? 'uyelik__tab uyelik__tab--on' : 'uyelik__tab'} onClick={() => sekmeyeGec('giris')}>Giriş yap</button>
                <button type="button" role="tab" aria-selected={sekme === 'uye'} className={sekme === 'uye' ? 'uyelik__tab uyelik__tab--on' : 'uyelik__tab'} onClick={() => sekmeyeGec('uye')}>Üye ol</button>
              </div>
            )}
            {sekme === 'uye' && (
              <label className="alan">Ad soyad
                <input type="text" required autoComplete="name" value={form.ad} onChange={degis('ad')} />
              </label>
            )}
            <label className="alan">E-posta
              <input type="email" required autoComplete="email" value={form.eposta} onChange={degis('eposta')} />
            </label>
            {sekme !== 'sifre' && (
              <label className="alan"><span>Şifre{sekme === 'uye' && <span className="alan__ipucu"> (en az 8 karakter)</span>}</span>
                <input type="password" required minLength={sekme === 'uye' ? 8 : undefined}
                  autoComplete={sekme === 'uye' ? 'new-password' : 'current-password'} value={form.sifre} onChange={degis('sifre')} />
              </label>
            )}
            {sekme === 'uye' && (
              <label className="onay">
                <input type="checkbox" checked={form.kvkk} onChange={degis('kvkk')} />
                <span><button type="button" className="metin-link" onClick={() => { geriSekme.current = 'uye'; sekmeyeGec('kvkk'); }}>Aydınlatma metnini</button> okudum, kişisel verilerimin üyelik için işlenmesini kabul ediyorum.</span>
              </label>
            )}
            {durum.hata && <p className="uyelik__hata" role="alert">{durum.hata}</p>}
            {durum.tamam && <p className="uyelik__tamam" role="status">{durum.tamam}</p>}
            <button type="submit" className="btn btn--gold btn--big" disabled={durum.bekliyor}>
              {durum.bekliyor ? 'Lütfen bekleyin…' : sekme === 'uye' ? 'Üye ol' : sekme === 'sifre' ? 'Bağlantı gönder' : 'Giriş yap'}
            </button>
            {sekme === 'giris' && <button type="button" className="metin-link uyelik__alt" onClick={() => sekmeyeGec('sifre')}>Şifremi unuttum</button>}
            {sekme === 'sifre' && <button type="button" className="metin-link uyelik__alt" onClick={() => sekmeyeGec('giris')}>← Giriş ekranına dön</button>}
          </form>
        )}
      </div>
    </div>
  );
}
