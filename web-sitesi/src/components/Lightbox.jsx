import { useEffect, useRef, useState } from 'react';
import { BagIcon, ChevronLeft, ChevronRight, CloseIcon, WhatsAppIcon } from './Icons.jsx';
import { CINSIYET, KATEGORI, foto, urunFiyati, urunMesaji, waLink } from '../data/site.js';
import { soruVerisi, webhookGonder } from '../lib/webhook.js';

// Ürün fotoğrafını büyük gösterir; birden fazla fotoğraf varsa oklarla gezilir.
export default function Lightbox({ urun, onClose, onSepeteEkle }) {
  const [sira, setSira] = useState(0);
  const kapatRef = useRef(null);
  const n = urun.fotograflar.length;
  const git = (d) => setSira((s) => (s + d + n) % n);

  useEffect(() => {
    kapatRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (n > 1 && e.key === 'ArrowRight') git(1);
      if (n > 1 && e.key === 'ArrowLeft') git(-1);
    };
    document.addEventListener('keydown', onKey);
    const eski = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = eski;
    };
  }, [onClose, n]);

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${urun.ad} fotoğrafı`}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <button ref={kapatRef} type="button" className="round-btn lightbox__close" onClick={onClose} aria-label="Kapat"><CloseIcon /></button>
      {n > 1 && (
        <>
          <button type="button" className="round-btn lightbox__prev" onClick={() => git(-1)} aria-label="Önceki fotoğraf"><ChevronLeft /></button>
          <button type="button" className="round-btn lightbox__next" onClick={() => git(1)} aria-label="Sonraki fotoğraf"><ChevronRight /></button>
        </>
      )}
      <div className="lightbox__body">
        <img className="lightbox__img" src={foto(urun.fotograflar[sira])} alt={urun.ad} />
        <div className="lightbox__caption">
          <div>
            <div className="lightbox__name">{urun.ad}</div>
            <div className="lightbox__meta">
              {CINSIYET[urun.cinsiyet]} · {KATEGORI[urun.kategori]} · {urunFiyati(urun)}
              {n > 1 && ` · ${sira + 1}/${n}`}
            </div>
          </div>
          {onSepeteEkle && (
            <button type="button" className="btn btn--gold" onClick={() => { onSepeteEkle(urun.id); onClose(); }}>
              <BagIcon size={16} />
              Sepete ekle
            </button>
          )}
          <a className="btn btn--outline" href={waLink(urunMesaji(urun))} target="_blank" rel="noopener"
            onClick={() => webhookGonder('soru.gonderildi', soruVerisi(urun, 'buyuk-fotograf'))}>
            <WhatsAppIcon size={16} />
            WhatsApp'tan sor
          </a>
        </div>
      </div>
    </div>
  );
}
