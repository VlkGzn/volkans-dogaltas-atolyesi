// Sepet: [{ id, adet }] — müşterinin tarayıcısında saklanır; sipariş WhatsApp'tan gönderilir (online ödeme yok).
import { useCallback, useEffect, useState } from 'react';
import { URUNLER } from '../data/urunler.js';

const ANAHTAR = 'volkans-dogaltas:sepet';
export const MAKS_ADET = 99;

// Depodan gelen veri elle değiştirilmiş olabilir: yalnız listedeki ürünler ve 1–99 arası tam sayı adet kabul edilir.
const gecerliMi = (k) =>
  k && URUNLER.some((u) => u.id === k.id) && Number.isInteger(k.adet) && k.adet >= 1 && k.adet <= MAKS_ADET;

const oku = () => {
  try {
    const v = JSON.parse(localStorage.getItem(ANAHTAR) || '[]');
    return Array.isArray(v) ? v.filter(gecerliMi) : [];
  } catch {
    return [];
  }
};

export function useSepet() {
  const [kalemler, setKalemler] = useState(oku);

  useEffect(() => {
    try { localStorage.setItem(ANAHTAR, JSON.stringify(kalemler)); } catch { /* yok say */ }
  }, [kalemler]);

  useEffect(() => {
    const onStorage = (e) => { if (e.key === ANAHTAR) setKalemler(oku()); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const adetDegistir = useCallback((id, fark) => {
    setKalemler((s) => {
      const var_ = s.find((k) => k.id === id);
      if (!var_) return fark > 0 ? [...s, { id, adet: Math.min(fark, MAKS_ADET) }] : s;
      return s.map((k) => (k.id === id ? { ...k, adet: Math.min(k.adet + fark, MAKS_ADET) } : k)).filter((k) => k.adet > 0);
    });
  }, []);

  return {
    kalemler,
    ekle: useCallback((id, adet = 1) => adetDegistir(id, adet), [adetDegistir]),
    azalt: useCallback((id) => adetDegistir(id, -1), [adetDegistir]),
    sil: useCallback((id) => setKalemler((s) => s.filter((k) => k.id !== id)), []),
    bosalt: useCallback(() => setKalemler([]), []),
    adet: kalemler.reduce((t, k) => t + k.adet, 0),
  };
}
