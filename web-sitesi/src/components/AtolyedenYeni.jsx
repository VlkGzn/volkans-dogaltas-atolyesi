import ProductList from './ProductList.jsx';
import { URUNLER } from '../data/urunler.js';

// Öne çıkan ürünler: urunler.js içinde `yeni: true` olanlar (ayrı bir liste tutulmaz).
export default function AtolyedenYeni({ onOpen, onTumu, favoriler, onFavori, onSepeteEkle }) {
  return (
    <section id="yeni" className="container section section--last">
      <div className="section__head">
        <h2 className="h2">Atölyeden yeni</h2>
        <a href="#koleksiyon" className="link-caps" onClick={onTumu}>Tümünü gör →</a>
      </div>
      <ProductList urunler={URUNLER.filter((u) => u.yeni)} onOpen={onOpen} bolum="atolyeden-yeni" favoriler={favoriler} onFavori={onFavori} onSepeteEkle={onSepeteEkle} />
    </section>
  );
}
