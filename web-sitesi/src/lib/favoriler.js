// Favoriler: müşterinin kalp ile işaretlediği ürünler, kendi tarayıcısında saklanır (sunucuya gitmez).
import { useCallback, useEffect, useState } from 'react';
import { URUNLER } from '../data/urunler.js';

const ANAHTAR = 'volkans-dogaltas:favoriler';

const oku = () => {
  try {
    const v = JSON.parse(localStorage.getItem(ANAHTAR) || '[]');
    // yalnız listedeki ürün kimlikleri (depo elle değiştirilmiş olabilir)
    return Array.isArray(v) ? v.filter((id) => URUNLER.some((u) => u.id === id)) : [];
  } catch {
    return []; // gizli pencere / engelli depolama: favoriler yalnız bu ziyarette tutulur
  }
};

export function useFavoriler() {
  const [favoriler, setFavoriler] = useState(oku);

  useEffect(() => {
    try { localStorage.setItem(ANAHTAR, JSON.stringify(favoriler)); } catch { /* yok say */ }
  }, [favoriler]);

  useEffect(() => {
    // site başka sekmede de açıksa favoriler eşitlenir
    const onStorage = (e) => { if (e.key === ANAHTAR) setFavoriler(oku()); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const degistir = useCallback((id) => {
    setFavoriler((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  }, []);

  return [favoriler, degistir];
}
