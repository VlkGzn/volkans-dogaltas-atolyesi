// Sepet: [{ id, adet }] — müşterinin tarayıcısında saklanır; sipariş WhatsApp'tan gönderilir (online ödeme yok).
import { useCallback, useEffect, useState } from 'react';

const ANAHTAR = 'volkans-dogaltas:sepet';

const oku = () => {
  try {
    const v = JSON.parse(localStorage.getItem(ANAHTAR) || '[]');
    return Array.isArray(v) ? v.filter((k) => k && typeof k.id === 'string' && k.adet > 0) : [];
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
      if (!var_) return fark > 0 ? [...s, { id, adet: fark }] : s;
      return s.map((k) => (k.id === id ? { ...k, adet: k.adet + fark } : k)).filter((k) => k.adet > 0);
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
