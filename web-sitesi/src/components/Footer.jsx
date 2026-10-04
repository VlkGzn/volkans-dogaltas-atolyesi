import Logo from './Logo.jsx';
import { FacebookLogo, InstagramLogo, XLogo } from './Icons.jsx';
import { ILETISIM, waLink } from '../data/site.js';

export default function Footer({ onFiltre }) {
  const dis = { target: '_blank', rel: 'noopener' };
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="stack-10">
          <Logo size={52} buyuk={false} />
          <p className="footer__about">Erkek ve kadınlar için el yapımı doğal taş tesbih, bileklik, kolye ve yüzük.</p>
        </div>
        <div className="footer__col nav-col">
          <div className="footer__head">Koleksiyon</div>
          <a href="#koleksiyon" onClick={() => onFiltre('kadin')}>Kadın</a>
          <a href="#koleksiyon" onClick={() => onFiltre('erkek')}>Erkek</a>
          <a href="#koleksiyon" onClick={() => onFiltre('tesbih')}>Tesbih</a>
          <a href="#tasarla">Kendin Tasarla</a>
        </div>
        <div className="footer__col">
          <div className="footer__head">İletişim</div>
          <a className="plain" href={ILETISIM.telefonHref}>{ILETISIM.telefon}</a>
          <a className="plain" href={`https://instagram.com/${ILETISIM.instagram}`} {...dis}>@{ILETISIM.instagram}</a>
          <a className="plain" href={`mailto:${ILETISIM.eposta}`}>{ILETISIM.eposta}</a>
          <span className="muted">{ILETISIM.adres[0]}<br />{ILETISIM.adres[1]}</span>
        </div>
        <div className="footer__col nav-col">
          <div className="footer__head">Takip et</div>
          <a className="sosyal" href={`https://instagram.com/${ILETISIM.instagram}`} {...dis}><InstagramLogo /> Instagram</a>
          <a className="sosyal" href={`https://facebook.com/${ILETISIM.facebook}`} {...dis}><FacebookLogo /> Facebook</a>
          <a className="sosyal" href={ILETISIM.x ? `https://x.com/${ILETISIM.x}` : 'https://x.com/'} {...dis}><span className="sosyal__x"><XLogo size={14} /></span> X</a>
        </div>
        <div className="footer__col footer__col--qr">
          <div className="footer__head">Okut, yaz</div>
          <a href={waLink()} {...dis} aria-label="WhatsApp'tan yaz" className="footer__qr">
            <img src="./img/qr-whatsapp.svg" width="168" height="168" alt="WhatsApp QR kodu, ortada Volkan's Doğaltaş logosu" />
          </a>
          <div className="footer__note">Telefonunun kamerasıyla okut,<br />WhatsApp'tan doğrudan yaz.</div>
        </div>
      </div>
      <div className="container footer__bottom">© 2026 Volkan's Doğaltaş Atölyesi</div>
    </footer>
  );
}
