import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { URUNLER } from './veri/urunler.js';
import { urunFiyati } from './veri/site.js';
import { GIZLILIK_BASLIK, GIZLILIK_BOLUMLERI } from './veri/gizlilik.js';
import { epostaGecerli, siparisGonder, stokGonder, telefonGecerli } from './api.js';

const STOKTA = URUNLER.filter((u) => !u.tukendi);
const TUKENEN = URUNLER.filter((u) => u.tukendi);

function UrunSecici({ liste, secili, onSec }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.chips}>
      {liste.map((u) => (
        <Pressable key={u.id} onPress={() => onSec(u.id)} style={[s.chip, secili === u.id && s.chipOn]} accessibilityRole="button" accessibilityState={{ selected: secili === u.id }}>
          <Text style={[s.chipYazi, secili === u.id && s.chipYaziOn]}>{u.ad}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

function Riza({ deger, onDegis, onPolitika, veri }) {
  return (
    <View style={s.riza}>
      <Switch value={deger} onValueChange={onDegis} trackColor={{ true: '#C9A24B' }} accessibilityLabel="Açık rıza" />
      <Text style={s.rizaYazi}>
        <Text style={s.baglanti} onPress={onPolitika}>Gizlilik Politikası ve Aydınlatma Metni</Text>'ni okudum; {veri} bu talebi yanıtlamak için işlenmesine açık rızam var.
      </Text>
    </View>
  );
}

function Sonuc({ durum }) {
  if (!durum) return null;
  return <Text style={durum.ok ? s.tamam : s.hata} accessibilityRole="alert">{durum.mesaj}</Text>;
}

function SiparisFormu({ onPolitika }) {
  const [f, setF] = useState({ ad: '', telefon: '', urunId: STOKTA[0].id, riza: false });
  const [durum, setDurum] = useState(null);
  const [bekliyor, setBekliyor] = useState(false);
  const gonder = async () => {
    if (!f.ad.trim()) return setDurum({ ok: false, mesaj: 'Adını yaz.' });
    if (!telefonGecerli(f.telefon)) return setDurum({ ok: false, mesaj: 'Telefonu yalnız rakamla, alan koduyla yaz (ör. 0532 000 00 00).' });
    if (!f.riza) return setDurum({ ok: false, mesaj: 'Göndermek için açık rıza kutusunu işaretle.' });
    setBekliyor(true); setDurum(null);
    const r = await siparisGonder(f);
    setBekliyor(false);
    if (!r.ok) return setDurum(r);
    const urun = URUNLER.find((u) => u.id === f.urunId);
    setDurum({ ok: true, mesaj: `Teşekkürler ${f.ad.trim()}! "${urun.ad}" siparişin alındı; seni telefonla arayıp ödeme ve teslimatı netleştireceğiz.` });
    setF({ ad: '', telefon: '', urunId: STOKTA[0].id, riza: false });
  };
  return (
    <View style={s.kart}>
      <Text style={s.baslik}>Sipariş ver</Text>
      <Text style={s.etiket}>Ad soyad</Text>
      <TextInput style={s.girdi} value={f.ad} onChangeText={(ad) => setF({ ...f, ad })} maxLength={80} autoComplete="name" />
      <Text style={s.etiket}>Ürün</Text>
      <UrunSecici liste={STOKTA} secili={f.urunId} onSec={(urunId) => setF({ ...f, urunId })} />
      <Text style={s.etiket}>Telefon</Text>
      <TextInput style={s.girdi} value={f.telefon} onChangeText={(telefon) => setF({ ...f, telefon })} keyboardType="phone-pad" maxLength={20} placeholder="05xx xxx xx xx" placeholderTextColor="#777" autoComplete="tel" />
      <Riza deger={f.riza} onDegis={(riza) => setF({ ...f, riza })} onPolitika={onPolitika} veri="adım ve telefon numaramın" />
      <Sonuc durum={durum} />
      <Pressable style={[s.dugme, bekliyor && s.dugmePasif]} onPress={gonder} disabled={bekliyor} accessibilityRole="button">
        {bekliyor ? <ActivityIndicator color="#111" /> : <Text style={s.dugmeYazi}>Siparişi gönder</Text>}
      </Pressable>
    </View>
  );
}

function StokFormu({ onPolitika }) {
  const [f, setF] = useState({ ad: '', eposta: '', urunId: TUKENEN[0]?.id, riza: false });
  const [durum, setDurum] = useState(null);
  const [bekliyor, setBekliyor] = useState(false);
  if (TUKENEN.length === 0) return null;
  const gonder = async () => {
    if (!f.ad.trim()) return setDurum({ ok: false, mesaj: 'Adını yaz.' });
    if (!epostaGecerli(f.eposta)) return setDurum({ ok: false, mesaj: 'E-posta adresini tam yaz (ör. ad@ornek.com).' });
    if (!f.riza) return setDurum({ ok: false, mesaj: 'Göndermek için açık rıza kutusunu işaretle.' });
    setBekliyor(true); setDurum(null);
    const r = await stokGonder(f);
    setBekliyor(false);
    if (!r.ok) return setDurum(r);
    const urun = URUNLER.find((u) => u.id === f.urunId);
    setDurum({ ok: true, mesaj: `Teşekkürler ${f.ad.trim()}! "${urun.ad}" tekrar stoğa girdiğinde ${f.eposta.trim()} adresine haber vereceğiz.` });
    setF({ ad: '', eposta: '', urunId: TUKENEN[0].id, riza: false });
  };
  return (
    <View style={s.kart}>
      <Text style={s.baslik}>Stok bildirimi iste</Text>
      <Text style={s.etiket}>Ad soyad</Text>
      <TextInput style={s.girdi} value={f.ad} onChangeText={(ad) => setF({ ...f, ad })} maxLength={80} autoComplete="name" />
      <Text style={s.etiket}>Tükenen ürün</Text>
      <UrunSecici liste={TUKENEN} secili={f.urunId} onSec={(urunId) => setF({ ...f, urunId })} />
      <Text style={s.etiket}>E-posta</Text>
      <TextInput style={s.girdi} value={f.eposta} onChangeText={(eposta) => setF({ ...f, eposta })} keyboardType="email-address" autoCapitalize="none" maxLength={120} autoComplete="email" />
      <Riza deger={f.riza} onDegis={(riza) => setF({ ...f, riza })} onPolitika={onPolitika} veri="adım ve e-posta adresimin" />
      <Sonuc durum={durum} />
      <Pressable style={[s.dugme, bekliyor && s.dugmePasif]} onPress={gonder} disabled={bekliyor} accessibilityRole="button">
        {bekliyor ? <ActivityIndicator color="#111" /> : <Text style={s.dugmeYazi}>Haber ver</Text>}
      </Pressable>
    </View>
  );
}

export default function App() {
  const [politika, setPolitika] = useState(false);
  return (
    <SafeAreaView style={s.sayfa}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={s.icerik} keyboardShouldPersistTaps="handled">
        <Text style={s.marka}>Volkan's Doğaltaş</Text>
        <Text style={s.alt}>El yapımı doğal taş tesbih, bileklik, kolye ve yüzük</Text>

        <Text style={s.bolum}>Koleksiyon</Text>
        {URUNLER.map((u) => (
          <View key={u.id} style={s.urun}>
            <View style={{ flex: 1 }}>
              <Text style={s.urunAd}>{u.ad}</Text>
              <Text style={s.urunAlt}>{u.aciklama}</Text>
            </View>
            <Text style={u.tukendi ? s.tukendi : s.fiyat}>{u.tukendi ? 'Tükendi' : urunFiyati(u)}</Text>
          </View>
        ))}

        <SiparisFormu onPolitika={() => setPolitika(true)} />
        <StokFormu onPolitika={() => setPolitika(true)} />
        <Text style={s.baglantiAlt} onPress={() => setPolitika(true)}>Gizlilik Politikası</Text>
      </ScrollView>

      <Modal visible={politika} animationType="slide" onRequestClose={() => setPolitika(false)}>
        <SafeAreaView style={s.sayfa}>
          <ScrollView contentContainerStyle={s.icerik}>
            <Text style={s.marka}>{GIZLILIK_BASLIK}</Text>
            {GIZLILIK_BOLUMLERI.map((b) => (
              <View key={b.baslik}>
                <Text style={s.gizBaslik}>{b.baslik}</Text>
                {b.metin.map((p) => <Text key={p} style={s.gizMetin}>{p}</Text>)}
              </View>
            ))}
            <Pressable style={s.dugme} onPress={() => setPolitika(false)}><Text style={s.dugmeYazi}>Kapat</Text></Pressable>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const ALTIN = '#C9A24B';
const s = StyleSheet.create({
  sayfa: { flex: 1, backgroundColor: '#111114' },
  icerik: { padding: 20, paddingBottom: 60, gap: 8 },
  marka: { color: '#F3EEE4', fontSize: 28, fontWeight: '600', marginTop: 12 },
  alt: { color: '#A39E92', marginBottom: 12 },
  bolum: { color: ALTIN, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', marginTop: 12 },
  urun: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#2A2A2F', gap: 12 },
  urunAd: { color: '#F3EEE4', fontSize: 16 },
  urunAlt: { color: '#A39E92', fontSize: 13 },
  fiyat: { color: ALTIN, fontWeight: '600' },
  tukendi: { color: '#F08A7E', fontWeight: '600' },
  kart: { backgroundColor: '#1A1A1F', borderRadius: 12, padding: 16, marginTop: 20, gap: 6, borderWidth: 1, borderColor: '#2A2A2F' },
  baslik: { color: '#F3EEE4', fontSize: 22, fontWeight: '600', marginBottom: 4 },
  etiket: { color: '#A39E92', fontSize: 14, marginTop: 6 },
  girdi: { minHeight: 46, borderRadius: 8, borderWidth: 1, borderColor: '#3A3A40', backgroundColor: '#111114', color: '#F3EEE4', paddingHorizontal: 12, fontSize: 16 },
  chips: { flexGrow: 0, marginVertical: 4 },
  chip: { paddingHorizontal: 12, minHeight: 40, justifyContent: 'center', borderRadius: 20, borderWidth: 1, borderColor: '#3A3A40', marginRight: 8 },
  chipOn: { backgroundColor: ALTIN, borderColor: ALTIN },
  chipYazi: { color: '#F3EEE4' },
  chipYaziOn: { color: '#111114', fontWeight: '600' },
  riza: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginTop: 10 },
  rizaYazi: { flex: 1, color: '#A39E92', fontSize: 13.5, lineHeight: 19 },
  baglanti: { color: ALTIN, textDecorationLine: 'underline' },
  baglantiAlt: { color: ALTIN, textDecorationLine: 'underline', textAlign: 'center', marginTop: 24 },
  tamam: { color: '#8FD3A6', fontSize: 14, lineHeight: 20, marginTop: 6 },
  hata: { color: '#F08A7E', fontSize: 14, marginTop: 6 },
  dugme: { minHeight: 48, borderRadius: 8, backgroundColor: ALTIN, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  dugmePasif: { opacity: 0.6 },
  dugmeYazi: { color: '#111114', fontSize: 16, fontWeight: '600' },
  gizBaslik: { color: ALTIN, fontSize: 15, fontWeight: '600', marginTop: 14 },
  gizMetin: { color: '#CFCAC0', fontSize: 14, lineHeight: 20, marginTop: 2 },
});
