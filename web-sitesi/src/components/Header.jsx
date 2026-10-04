import { useState } from 'react';
import Logo from './Logo.jsx';
import { BagIcon, ChevronDown, FacebookIcon, HeartIcon, InstagramIcon, SearchIcon, TikTokIcon, UserIcon, WhatsAppIcon, XIcon } from './Icons.jsx';
import { CINSIYET, ILETISIM, KATEGORI, MENU_KATEGORILERI, altFiltre, urunFiltredeMi, waLink } from '../data/site.js';
import { URUNLER } from '../data/urunler.js';

export default function Header({ onFiltre, sepetAdedi = 0, onSepet, uyelik, onUyelik }) {
  const dis = { target: '_blank', rel: 'noopener' };
  // Dokunmatik ekranlarda alt menü ok düğmesiyle açılır; masaüstünde fareyle üzerine gelince de açılır.
  const [acik, setAcik] = useState(null);
  const sec = (filtre) => { onFiltre(filtre); setAcik(null); document.activeElement?.blur(); };
  return (
    <>
      <div className="topbar">Kendi bilekliğini tasarla — taşları sen seç, atölyede elde örelim.</div>
      <header className="header">
        <div className="container header__row">
          <div className="header__side">
            <a className="ico" href={`https://facebook.com/${ILETISIM.facebook}`} aria-label="Facebook" {...dis}><FacebookIcon /></a>
            <a className="ico" href={`https://instagram.com/${ILETISIM.instagram}`} aria-label="Instagram" {...dis}><InstagramIcon /></a>
            <a className="ico" href={ILETISIM.x ? `https://x.com/${ILETISIM.x}` : 'https://x.com/'} aria-label="X" {...dis}><XIcon /></a>
            <a className="ico" href={`https://tiktok.com/@${ILETISIM.tiktok}`} aria-label="TikTok" {...dis}><TikTokIcon /></a>
          </div>
          <a href="#" className="header__logo" aria-label="Volkan's Doğaltaş ana sayfa"><Logo /></a>
          <div className="header__side header__side--end">
            <button type="button" className="ico" aria-label="Ara"><SearchIcon /></button>
            {uyelik?.kullanici ? (
              <div className="hesap">
                <span className="hesap__ad"><UserIcon size={18} /> Merhaba, {uyelik.ad}</span>
                <button type="button" className="hesap__btn" onClick={uyelik.cikisYap}>Çıkış yap</button>
              </div>
            ) : (
              <div className="hesap">
                <button type="button" className="hesap__btn" onClick={() => onUyelik('giris')}>
                  <UserIcon size={18} /> Giriş yap
                </button>
                <button type="button" className="hesap__btn hesap__btn--uye" onClick={() => onUyelik('uye')}>Üye ol</button>
              </div>
            )}
            <a className="ico" href="#" aria-label="Favorilerim"><HeartIcon /></a>
            <button type="button" className="ico ico--rozetli" onClick={onSepet}
              aria-label={sepetAdedi ? `Sepetim, ${sepetAdedi} ürün` : 'Sepetim'}>
              <BagIcon />
              {sepetAdedi > 0 && <span className="ico__rozet" aria-hidden="true">{sepetAdedi}</span>}
            </button>
            <a className="ico" href={waLink()} aria-label="WhatsApp" {...dis}><WhatsAppIcon /></a>
          </div>
        </div>
        <nav className="container nav" aria-label="Ana menü">
          {MENU_KATEGORILERI.map((kategori) => {
            const altlar = ['kadin', 'erkek']
              .map((cinsiyet) => ({ cinsiyet, sayi: URUNLER.filter((u) => urunFiltredeMi(u, altFiltre(kategori, cinsiyet))).length }))
              .filter((a) => a.sayi > 0);
            const acikMi = acik === kategori;
            return (
              <div key={kategori} className={acikMi ? 'nav__item nav__item--open' : 'nav__item'}
                onMouseLeave={() => acikMi && setAcik(null)}>
                <a href="#koleksiyon" onClick={() => sec(kategori)}>{KATEGORI[kategori]}</a>
                <button type="button" className="nav__toggle" aria-expanded={acikMi}
                  aria-label={`${KATEGORI[kategori]} alt kategorileri`}
                  onClick={() => setAcik(acikMi ? null : kategori)}>
                  <ChevronDown size={14} />
                </button>
                <div className="nav__sub">
                  {altlar.map(({ cinsiyet, sayi }) => (
                    <a key={cinsiyet} href="#koleksiyon" onClick={() => sec(altFiltre(kategori, cinsiyet))}>
                      {CINSIYET[cinsiyet]} <span className="nav__count">{sayi}</span>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
          <a href="#tasarla" className="nav__accent">Kendin Tasarla</a>
        </nav>
      </header>
    </>
  );
}
