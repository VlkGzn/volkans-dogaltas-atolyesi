// Ürün fotoğrafı: sabit oranlı kutu, kapak gibi doldurur, tembel yüklenir.
// onOpen verilirse fotoğraf büyütmek için tıklanabilir bir düğme olur.
export default function ProductImage({ src, alt, ratio = '4 / 5', count = 1, onOpen, eager = false }) {
  const img = (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className="product-image__img"
    />
  );
  const badge = count > 1 && <span className="product-image__badge">{count} fotoğraf</span>;

  if (!onOpen) {
    return (
      <div className="product-image" style={{ aspectRatio: ratio }}>
        {img}
        {badge}
      </div>
    );
  }
  return (
    <button
      type="button"
      className="product-image product-image--zoom"
      style={{ aspectRatio: ratio }}
      onClick={onOpen}
      aria-label={`${alt} fotoğrafını büyüt`}
    >
      {img}
      {badge}
    </button>
  );
}
