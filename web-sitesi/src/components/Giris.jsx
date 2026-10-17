import GecisKarti from './GecisKarti.jsx';
import { foto } from '../data/site.js';

export default function Giris() {
  return (
    <section className="intro" aria-label="Giriş">
      <div className="container intro__row">
        <GecisKarti
          className="intro__card in-l"
          katmanlar={[
            { video: true, src: './video/tesbih-cekiliyor.mp4', poster: './video/tesbih-cekiliyor.jpg', alt: 'Atölyemizin yeşim tesbihi, taneleri çekilirken', origin: '50% 50%' },
            { src: foto('09-kaplan-gozu-yosun-akik-seti.jpg'), alt: 'Atölyemizin kaplan gözü ve yosun akik bileklik seti', origin: '50% 50%', konum: '50% 50%' },
          ]}
          etiketler={['Erkek · Tesbih', 'Erkek · Bileklik']}
        />
        <div className="intro__text in-u">
          <div className="eyebrow">El yapımı · Doğal taş</div>
          <h2 className="intro__title">Taşın ritmi,<br />elin emeği.</h2>
          <p className="intro__lead">Erkekler için tane tane dizilen tesbihler, kadınlar için boyunda ışıldayan taş kolyeler. Hepsi atölyede, elde yapılır.</p>
          <div className="btn-row btn-row--center">
            <a href="#kategoriler" className="btn btn--gold btn--big">Koleksiyonu keşfet</a>
            <a href="#tasarla" className="btn btn--outline btn--big">Kendin tasarla</a>
          </div>
        </div>
        <GecisKarti
          className="intro__card in-r"
          katmanlar={[
            { src: foto('12-turkuaz-deniz-kabugu-kolye.jpg'), alt: 'Atölyemizin turkuaz ve deniz kabuğu kolyesi', origin: '50% 50%', konum: '50% 50%' },
            { src: foto('04-malakit-yuzuk.jpg'), alt: 'Atölyemizin iridyum malakit kadın yüzüğü', origin: '50% 50%', konum: '50% 50%' },
          ]}
          etiketler={['Kadın · Kolye', 'Kadın · Yüzük']}
        />
      </div>
    </section>
  );
}
