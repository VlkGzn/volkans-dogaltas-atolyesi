// [ − | 1 | + ] adet seçici — ürün kartı ve sepet paneli aynı bileşeni kullanır.
// etiket verilirse altında küçük bir başlık ("Adet") gösterilir.
export default function AdetSecici({ deger, onAzalt, onArtir, urunAdi, etiket, azaltPasif = false }) {
  return (
    <div className="adet-secici">
      <div className="adet" role="group" aria-label={`${urunAdi} adedi`}>
        <button type="button" onClick={onAzalt} disabled={azaltPasif} aria-label="Bir azalt">−</button>
        <span aria-live="polite">{deger}</span>
        <button type="button" onClick={onArtir} aria-label="Bir artır">+</button>
      </div>
      {etiket && <div className="adet-secici__etiket" aria-hidden="true">{etiket}</div>}
    </div>
  );
}
