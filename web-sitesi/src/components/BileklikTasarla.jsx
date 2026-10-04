import { useState } from 'react';
import { FIYAT, HAZIR_DIZILIMLER, TASLAR, taneOzeti, tl, waLink } from '../data/site.js';
import { bileklikVerisi, webhookGonder } from '../lib/webhook.js';

const EN_FAZLA = 30;
const R = 130, C = 170;
const TAS = Object.fromEntries(TASLAR.map((t) => [t.id, t]));
const zemin = (renk) => `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.55) 0, rgba(255,255,255,0) 40%), ${renk}`;

export default function BileklikTasarla() {
  const [taneler, setTaneler] = useState([]);
  const n = taneler.length;
  const boy = n ? Math.min(36, ((2 * Math.PI * R) / n) * 0.94) : 36;

  const ozet = taneOzeti(taneler).map((o) => `${o.tas_adi} x${o.adet}`).join(', ');
  const ipucu = n >= EN_FAZLA ? `En fazla ${EN_FAZLA} taş ekleyebilirsin` : n ? ozet : 'Bileklik için önerilen: 20–24 taş';
  const mesaj = n
    ? `Merhaba, kendi tasarladığım bilekliği sipariş etmek istiyorum (${n} taş): ${ozet}`
    : 'Merhaba, kendi bilekliğimi tasarlamak istiyorum.';

  const oner = () => {
    const simdi = JSON.stringify(taneler);
    const secenek = HAZIR_DIZILIMLER.filter((d) => JSON.stringify(d) !== simdi);
    setTaneler([...secenek[Math.floor(Math.random() * secenek.length)]]);
  };

  return (
    <section id="tasarla" className="container section">
      <div className="designer">
        <div className="designer__preview">
          <div className="designer__ring">
            <div className="designer__guide" />
            {n === 0 && <div className="designer__empty">Sağdan bir taş seçerek başla</div>}
            {taneler.map((id, k) => {
              const a = -Math.PI / 2 + (2 * Math.PI * k) / n;
              return (
                <span key={k} className="designer__bead" style={{
                  left: C + R * Math.cos(a) - boy / 2, top: C + R * Math.sin(a) - boy / 2,
                  width: boy, height: boy, background: zemin(TAS[id].renk),
                }} />
              );
            })}
            {n > 0 && <div className="designer__count"><div className="designer__num">{n}</div><div className="designer__unit">taş</div></div>}
          </div>
          <div className="designer__hint">{ipucu}</div>
        </div>
        <div className="designer__panel">
          <div className="stack-10">
            <div className="eyebrow">Kendin tasarla</div>
            <h2 className="h2 h2--48">Bilekliğin, senin taşlarınla.</h2>
            <p className="lead lead--wide">Taşlara dokun, sırayla diziye eklensin. Beğendiğin dizilimi WhatsApp'tan gönder, atölyede elde örelim. Bileklik fiyatı {tl(FIYAT.bileklik)}.</p>
          </div>
          <div className="stones">
            {TASLAR.map((t) => (
              <button key={t.id} type="button" className="stone"
                onClick={() => setTaneler((x) => (x.length < EN_FAZLA ? [...x, t.id] : x))}>
                <span className="stone__dot" style={{ background: zemin(t.renk) }} />
                {t.ad}
              </button>
            ))}
          </div>
          <div className="btn-row">
            <button type="button" className="btn btn--outline" onClick={oner}>Bana öner</button>
            <button type="button" className="btn btn--outline" onClick={() => setTaneler((x) => x.slice(0, -1))}>Geri al</button>
            <button type="button" className="btn btn--outline" onClick={() => setTaneler([])}>Temizle</button>
            <a className="btn btn--gold" href={waLink(mesaj)} target="_blank" rel="noopener"
              onClick={() => n > 0 && webhookGonder('bileklik.tasarlandi', bileklikVerisi(taneler, mesaj))}>WhatsApp'tan sipariş ver</a>
          </div>
        </div>
      </div>
    </section>
  );
}
