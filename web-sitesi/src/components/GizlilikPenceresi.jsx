import { useEffect, useRef } from 'react';
import { CloseIcon } from './Icons.jsx';
import { GIZLILIK_BASLIK, GIZLILIK_BOLUMLERI } from '../data/gizlilik.js';

// Gizlilik Politikası penceresi (Uyelik ile aynı görünüm). Esc, arka plana tıklama veya ✕ ile kapanır.
export default function GizlilikPenceresi({ onClose }) {
  const kapatRef = useRef(null);
  useEffect(() => {
    kapatRef.current?.focus();
    const tus = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', tus);
    return () => window.removeEventListener('keydown', tus);
  }, [onClose]);
  return (
    <div className="uyelik-arka" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="uyelik uyelik--genis" role="dialog" aria-modal="true" aria-labelledby="gizlilik-baslik">
        <div className="uyelik__head">
          <h2 id="gizlilik-baslik" className="uyelik__title">{GIZLILIK_BASLIK}</h2>
          <button ref={kapatRef} type="button" className="round-btn round-btn--small" onClick={onClose} aria-label="Kapat"><CloseIcon /></button>
        </div>
        <div className="uyelik__body uyelik__kvkk">
          {GIZLILIK_BOLUMLERI.map((b) => (
            <section key={b.baslik}>
              <h3 className="gizlilik__baslik">{b.baslik}</h3>
              {b.metin.map((p) => <p key={p}>{p}</p>)}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
