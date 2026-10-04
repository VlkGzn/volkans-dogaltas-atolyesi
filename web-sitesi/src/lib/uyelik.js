// Üyelik (Supabase Auth). Adres ve anahtar web-sitesi/.env içinde:
//   VITE_SUPABASE_URL=https://xxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=...   (herkese açık "anon" anahtar; gizli "service_role" anahtarı ASLA buraya konmaz)
// İkisi de yoksa üyelik kapalıdır: pencere "kuruluyor" bilgisi gösterir, hiçbir veri alınmaz.
import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const URL_ = import.meta.env.VITE_SUPABASE_URL;
const ANAHTAR = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = URL_ && ANAHTAR ? createClient(URL_, ANAHTAR) : null;

// Supabase hata mesajlarını Türkçeye çevirir.
const turkce = (hata) => {
  const m = (hata?.message || '').toLowerCase();
  if (m.includes('invalid login credentials')) return 'E-posta veya şifre hatalı.';
  if (m.includes('email not confirmed')) return 'E-posta adresiniz henüz doğrulanmadı. Gelen kutunuzdaki bağlantıya tıklayın.';
  if (m.includes('already registered') || m.includes('already been registered')) return 'Bu e-posta ile zaten üye olunmuş. Giriş yapmayı deneyin.';
  if (m.includes('password should be at least') || m.includes('weak')) return 'Şifre en az 8 karakter olmalı.';
  if (m.includes('rate limit') || m.includes('too many')) return 'Çok fazla deneme yapıldı. Lütfen biraz sonra tekrar deneyin.';
  if (m.includes('invalid email') || m.includes('unable to validate email')) return 'Geçerli bir e-posta adresi yazın.';
  if (m.includes('failed to fetch') || m.includes('network')) return 'Bağlantı kurulamadı. İnternetinizi kontrol edip tekrar deneyin.';
  return 'Bir sorun oluştu. Lütfen tekrar deneyin.';
};

export function useUyelik() {
  const [kullanici, setKullanici] = useState(null);

  useEffect(() => {
    if (!supabase) return undefined;
    supabase.auth.getSession().then(({ data }) => setKullanici(data.session?.user ?? null));
    const { data } = supabase.auth.onAuthStateChange((_olay, oturum) => setKullanici(oturum?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  const sonuc = (hata, mesaj) => (hata ? { hata: turkce(hata) } : { tamam: mesaj });

  const uyeOl = useCallback(async ({ ad, eposta, sifre }) => {
    const { error } = await supabase.auth.signUp({
      email: eposta, password: sifre,
      options: { data: { ad, kvkk_onay: new Date().toISOString() }, emailRedirectTo: window.location.href.split('#')[0] },
    });
    return sonuc(error, 'Üyeliğiniz oluşturuldu. E-posta adresinize gelen doğrulama bağlantısına tıklayın, sonra giriş yapabilirsiniz.');
  }, []);

  const girisYap = useCallback(async ({ eposta, sifre }) => {
    const { error } = await supabase.auth.signInWithPassword({ email: eposta, password: sifre });
    return sonuc(error, 'Giriş yapıldı.');
  }, []);

  const sifreSifirla = useCallback(async ({ eposta }) => {
    const { error } = await supabase.auth.resetPasswordForEmail(eposta, { redirectTo: window.location.href.split('#')[0] });
    return sonuc(error, 'Şifre yenileme bağlantısı e-posta adresinize gönderildi.');
  }, []);

  const cikisYap = useCallback(async () => { await supabase?.auth.signOut(); }, []);

  return {
    aktif: Boolean(supabase),
    kullanici,
    ad: kullanici?.user_metadata?.ad || kullanici?.email?.split('@')[0] || '',
    uyeOl, girisYap, sifreSifirla, cikisYap,
  };
}
