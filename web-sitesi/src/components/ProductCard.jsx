import { useEffect, useState } from 'react';
import ProductImage from './ProductImage.jsx';
import AdetSecici from './AdetSecici.jsx';
import { HeartIcon, WhatsAppLogo } from './Icons.jsx';
import { CINSIYET, KATEGORI, kapakGorseli, urunFiyati, urunMesaji, waLink } from '../data/site.js';
import { soruVerisi, webhookGonder } from '../lib/webhook.js';

// bolum: kartın bulunduğu bölüm (webhook için) · favori/onFavori verilirse fotoğrafın köşesinde kalp düğmesi çıkar
// onSepeteEkle verilirse "Sepete ekle" düğmesi çıkar
export default function ProductCard({ urun, onOpen, bolum = 'koleksiyon', favori = false, onFavori, onSepeteEkle }) {
  const [eklendi, setEklendi] = useState(false);
  const [adet, setAdet] = useState(1);
  useEffect(() => {
    if (!eklendi) return undefined;
    const z = setTimeout(() => setEklendi(false), 1600);
    return () => clearTimeout(z);
  }, [eklendi]);
  return (
    <article className="product-card">
      <div className="product-card__media">
        <ProductImage
          src={kapakGorseli(urun)}
          alt={urun.fotograflar.length ? urun.ad : `${urun.ad} — fotoğraf yakında`}
          count={urun.fotograflar.length}
          onOpen={onOpen && urun.fotograflar.length > 0 ? () => onOpen(urun) : undefined}
        />
        {onFavori && (
          <button type="button" className={favori ? 'product-card__fav product-card__fav--on' : 'product-card__fav'}
            aria-pressed={favori} aria-label={favori ? `${urun.ad} favorilerden çıkar` : `${urun.ad} favorilere ekle`}
            onClick={() => onFavori(urun.id)}>
            <HeartIcon size={20} fill={favori ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>
      <div className="product-card__info">
        <div>
          <div className="product-card__name">{urun.ad}</div>
          <div className="product-card__meta">
            {CINSIYET[urun.cinsiyet]} · {KATEGORI[urun.kategori]} — {urun.aciklama}
          </div>
        </div>
        <div className="product-card__price">{urunFiyati(urun)}</div>
      </div>
      <div className={onSepeteEkle ? 'product-card__actions' : 'product-card__actions product-card__actions--tek'}>
        {onSepeteEkle && (
          <>
            <AdetSecici deger={adet} urunAdi={urun.ad} etiket="Adet" azaltPasif={adet <= 1}
              onAzalt={() => setAdet((a) => Math.max(1, a - 1))} onArtir={() => setAdet((a) => Math.min(99, a + 1))} />
            <button type="button" className="btn btn--gold btn--small" aria-live="polite"
              onClick={() => { onSepeteEkle(urun.id, adet); setEklendi(true); setAdet(1); }}>
              {eklendi ? 'Eklendi ✓' : 'Sepete ekle'}
            </button>
          </>
        )}
        <a className="btn btn--outline btn--small btn--wa" href={waLink(urunMesaji(urun))} target="_blank" rel="noopener"
          aria-label={`${urun.ad} hakkında WhatsApp'tan sor`} title="WhatsApp'tan sor"
          onClick={() => webhookGonder('soru.gonderildi', soruVerisi(urun, bolum))}>
          <WhatsAppLogo size={22} />
        </a>
      </div>
    </article>
  );
}
