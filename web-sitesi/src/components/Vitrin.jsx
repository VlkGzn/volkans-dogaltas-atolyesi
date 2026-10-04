import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from './Icons.jsx';
import { VITRIN, foto } from '../data/site.js';
import { URUNLER } from '../data/urunler.js';

const SURE = 6000;

export default function Vitrin({ onFiltre }) {
  const [i, setI] = useState(0);
  const [tur, setTur] = useState(0); // elle geçişte zamanlayıcıyı baştan başlatmak için
  const git = (n) => { setI((n + VITRIN.length) % VITRIN.length); setTur((t) => t + 1); };

  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % VITRIN.length), SURE);
    return () => clearInterval(t);
  }, [tur]);

  const s = VITRIN[i];
  const urun = URUNLER.find((u) => u.id === s.urun);
  return (
    <section className="vitrin">
      <div className="vitrin__text">
        <div className="stack-20 vitrin__inner">
          <div className="eyebrow">{s.eyebrow}</div>
          <h1 className="vitrin__title">{s.baslik}</h1>
          <p className="vitrin__lead">{s.alt}</p>
          <div className="btn-row">
            <a href="#koleksiyon" className="btn btn--gold btn--big" onClick={() => onFiltre(s.filtre)}>{s.cta}</a>
            <a href="#tasarla" className="btn btn--outline btn--big">Kendin tasarla</a>
          </div>
          <div className="vitrin__controls">
            <button type="button" className="round-btn round-btn--small" onClick={() => git(i - 1)} aria-label="Önceki"><ChevronLeft size={18} /></button>
            <button type="button" className="round-btn round-btn--small" onClick={() => git(i + 1)} aria-label="Sonraki"><ChevronRight size={18} /></button>
            <div className="vitrin__dots">
              {VITRIN.map((_, k) => (
                <button key={k} type="button" className="vitrin__dot" onClick={() => git(k)} aria-label={`${k + 1}. görsel`} aria-current={k === i}>
                  <span className={k === i ? 'vitrin__bar vitrin__bar--on' : 'vitrin__bar'} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="vitrin__media">
        <img src={foto(urun.fotograflar[0])} alt={urun.ad} />
      </div>
    </section>
  );
}
