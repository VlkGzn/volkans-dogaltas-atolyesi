import ProductList from './ProductList.jsx';
import { URUNLER } from '../data/urunler.js';
import { FILTRELER, filtreAdi, urunFiltredeMi } from '../data/site.js';

// Klasördeki tüm ürünler; Kadın/Erkek/kategori süzgeciyle.
export default function Koleksiyon({ filtre, setFiltre, onOpen, favoriler, onFavori, onSepeteEkle }) {
  const gorunen = URUNLER.filter((u) => urunFiltredeMi(u, filtre));
  return (
    <section id="koleksiyon" className="container section">
      <div className="section__head">
        <div className="stack-10">
          <div className="eyebrow">Koleksiyon</div>
          <h2 className="h2">Atölyeden tüm parçalar</h2>
        </div>
        <p className="lead">Her parça tek; fotoğraflar atölyede çekildi. Fotoğrafa dokun, büyüt. Beğendiğini WhatsApp'tan sor.</p>
      </div>
      <div className="chips" role="toolbar" aria-label="Koleksiyon süzgeci">
        {filtre.includes(':') && (
          <button type="button" className="chip chip--on" aria-pressed="true" onClick={() => setFiltre('tumu')}
            aria-label={`${filtreAdi(filtre)} süzgecini kaldır`}>
            {filtreAdi(filtre)} <span className="chip__count">{gorunen.length}</span> <span aria-hidden="true">✕</span>
          </button>
        )}
        {FILTRELER.map((f) => (
          <button key={f.id} type="button" className={f.id === filtre ? 'chip chip--on' : 'chip'}
            aria-pressed={f.id === filtre} onClick={() => setFiltre(f.id)}>
            {f.ad} <span className="chip__count">{URUNLER.filter((u) => urunFiltredeMi(u, f.id)).length}</span>
          </button>
        ))}
      </div>
      <ProductList urunler={gorunen} onOpen={onOpen} bolum="koleksiyon" favoriler={favoriler} onFavori={onFavori} onSepeteEkle={onSepeteEkle} />
    </section>
  );
}
