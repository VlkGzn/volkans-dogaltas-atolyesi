import ProductCard from './ProductCard.jsx';

// Ürün kataloğu ızgarası. Hem "Koleksiyon" hem "Atölyeden yeni" bölümü bunu kullanır.
export default function ProductList({ urunler, onOpen, bolum, favoriler, onFavori, onSepeteEkle, bosMesaj = 'Bu seçimde ürün yok.' }) {
  if (urunler.length === 0) return <p className="product-list__empty">{bosMesaj}</p>;
  return (
    <div className="product-list">
      {urunler.map((urun) => (
        <ProductCard key={urun.id} urun={urun} onOpen={onOpen} bolum={bolum}
          favori={favoriler?.includes(urun.id)} onFavori={onFavori} onSepeteEkle={onSepeteEkle} />
      ))}
    </div>
  );
}
