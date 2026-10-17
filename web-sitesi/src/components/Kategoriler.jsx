import GecisKarti from './GecisKarti.jsx';
import { foto } from '../data/site.js';

const OZELLIKLER = ['Doğal taş', 'Atölyede el yapımı', 'Kişiye özel tasarım', "WhatsApp'tan sipariş"];

export function Ozellikler() {
  return (
    <section className="features">
      <div className="container features__row">
        {OZELLIKLER.map((o) => <span key={o} className="features__item"><span className="dot" />{o}</span>)}
      </div>
    </section>
  );
}

function KartAlti({ baslik, alt, eylem, altin }) {
  return (
    <div className={altin ? 'cat__bar cat__bar--gold' : 'cat__bar'}>
      <div><div className="cat__title">{baslik}</div><div className="cat__sub">{alt}</div></div>
      <span className="cat__action">{eylem}</span>
    </div>
  );
}

export default function Kategoriler({ onFiltre }) {
  return (
    <section id="kategoriler" className="container section section--first">
      <div className="section__head">
        <h2 className="h2">Kime, hangi taş?</h2>
        <p className="lead">Erkek ve kadın koleksiyonları, ya da tamamen sana ait bir tasarım.</p>
      </div>
      <div className="cats">
        <a href="#koleksiyon" className="cat" onClick={() => onFiltre('kadin')}>
          <GecisKarti className="cat__media" katmanlar={[
            { src: foto('12-turkuaz-deniz-kabugu-kolye.jpg'), alt: 'Atölyemizin turkuaz ve deniz kabuğu kolyesi', origin: '50% 50%', konum: '50% 50%' },
            { src: foto('04-malakit-yuzuk.jpg'), alt: 'Atölyemizin iridyum malakit kadın yüzüğü', origin: '50% 50%', konum: '50% 50%' },
          ]} />
          <KartAlti baslik="Kadın" alt="Kolye · Bileklik · Yüzük" eylem="Keşfet →" />
        </a>
        <a href="#koleksiyon" className="cat" onClick={() => onFiltre('erkek')}>
          <GecisKarti className="cat__media" katmanlar={[
            { src: foto('02-lapis-lazuli-tesbih.jpg'), alt: 'Atölyemizin lapis lazuli tesbihi', origin: '55% 50%' },
            { src: foto('09-kaplan-gozu-yosun-akik-seti.jpg'), alt: 'Atölyemizin kaplan gözü ve yosun akik bileklik seti', origin: '50% 50%', konum: '50% 50%' },
          ]} />
          <KartAlti baslik="Erkek" alt="Tesbih · Bileklik · Yüzük" eylem="Keşfet →" />
        </a>
        <a href="#tasarla" className="cat">
          <img className="cat__img" src={foto('09-kaplan-gozu-yosun-akik-seti.jpg')} alt="Doğal taş bileklik seti" />
          <KartAlti baslik="Kendin Tasarla" alt="Taşını seç, dizilimi gör" eylem="Başla →" altin />
        </a>
      </div>
    </section>
  );
}
