import { useEffect, useRef } from 'react';
import { CloseIcon, WhatsAppIcon } from './Icons.jsx';
import AdetSecici from './AdetSecici.jsx';
import { URUNLER } from '../data/urunler.js';
import { CINSIYET, KATEGORI, kapakGorseli, tl, urunFiyatSayi, waLink } from '../data/site.js';
import { sepetVerisi, webhookGonder } from '../lib/webhook.js';

// Sepetteki kalemleri ürün bilgisiyle birleştirir (listeden kalkmış ürünler atlanır).
export const sepetSatirlari = (kalemler) =>
  kalemler
    .map((k) => ({ urun: URUNLER.find((u) => u.id === k.id), adet: k.adet }))
    .filter((s) => s.urun);

export const sepetMesaji = (satirlar, toplam) =>
  'Merhaba, sitenizden şu ürünleri sipariş etmek istiyorum:\n' +
  satirlar.map((s) => `${s.adet}× ${s.urun.ad} — ${tl(urunFiyatSayi(s.urun) * s.adet)}`).join('\n') +
  `\nToplam: ${tl(toplam)}`;

export default function Sepet({ sepet, onClose }) {
  const kapatRef = useRef(null);
  const satirlar = sepetSatirlari(sepet.kalemler);
  const toplam = satirlar.reduce((t, s) => t + urunFiyatSayi(s.urun) * s.adet, 0);
  const mesaj = sepetMesaji(satirlar, toplam);

  useEffect(() => {
    kapatRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const eski = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = eski; };
  }, [onClose]);

  return (
    <div className="sepet-arka" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="sepet" role="dialog" aria-modal="true" aria-label="Sepetim">
        <div className="sepet__head">
          <h2 className="sepet__title">Sepetim <span className="sepet__count">{sepet.adet}</span></h2>
          <button ref={kapatRef} type="button" className="round-btn round-btn--small" onClick={onClose} aria-label="Sepeti kapat"><CloseIcon /></button>
        </div>

        {satirlar.length === 0 ? (
          <p className="sepet__bos">Sepetin boş. Beğendiğin parçaları "Sepete ekle" ile buraya topla, siparişi tek mesajla WhatsApp'tan gönder.</p>
        ) : (
          <ul className="sepet__list">
            {satirlar.map(({ urun, adet }) => (
              <li key={urun.id} className="sepet__item">
                <img className="sepet__img" src={kapakGorseli(urun)} alt="" />
                <div className="sepet__info">
                  <div className="sepet__name">{urun.ad}</div>
                  <div className="sepet__meta">{CINSIYET[urun.cinsiyet]} · {KATEGORI[urun.kategori]} · {tl(urunFiyatSayi(urun))}</div>
                  <div className="sepet__row">
                    <AdetSecici deger={adet} urunAdi={urun.ad}
                      onAzalt={() => sepet.azalt(urun.id)} onArtir={() => sepet.ekle(urun.id)} />
                    <div className="sepet__line">{tl(urunFiyatSayi(urun) * adet)}</div>
                  </div>
                  <button type="button" className="sepet__sil" onClick={() => sepet.sil(urun.id)}>Kaldır</button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {satirlar.length > 0 && (
          <div className="sepet__foot">
            <div className="sepet__total"><span>Toplam</span><strong>{tl(toplam)}</strong></div>
            <a className="btn btn--gold btn--big sepet__gonder" href={waLink(mesaj)} target="_blank" rel="noopener"
              onClick={() => webhookGonder('sepet.gonderildi', sepetVerisi(satirlar, toplam, mesaj))}>
              <WhatsAppIcon size={18} /> Siparişi WhatsApp'tan gönder
            </a>
            <button type="button" className="sepet__bosalt" onClick={sepet.bosalt}>Sepeti boşalt</button>
            <p className="sepet__not">Ödeme ve teslimat WhatsApp'ta netleşir.</p>
          </div>
        )}
      </aside>
    </div>
  );
}
