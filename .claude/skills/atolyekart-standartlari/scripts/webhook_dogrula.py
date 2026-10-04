#!/usr/bin/env python3
"""AtölyeKart v1 webhook mesajlarını doğrular (yalnız Python standart kütüphanesi).

Kullanım:
  python3 webhook_dogrula.py mesaj.json [mesaj2.json ...]
  python3 webhook_dogrula.py --urunler web-sitesi/src/data/urunler.js mesaj.json

Bir dosya tek mesaj (nesne) ya da mesaj listesi içerebilir. Hata yoksa "TAMAM", varsa Türkçe hata listesi;
çıkış kodu hata sayısı > 0 ise 1.
"""
import json, re, sys, uuid
from datetime import datetime

OLAYLAR = {
    'soru.gonderildi': ['urun_id', 'urun_adi', 'kategori', 'cinsiyet', 'kanal', 'mesaj'],
    'bileklik.tasarlandi': ['tane_sayisi', 'taneler', 'ozet', 'kanal', 'mesaj'],
    'sepet.gonderildi': ['kalemler', 'kalem_sayisi', 'urun_adedi', 'toplam_tutar', 'kanal', 'mesaj'],
    'urun.eklendi': ['urun_id', 'ad', 'kategori', 'cinsiyet', 'aciklama', 'fotograflar'],
    'urun.guncellendi': ['urun_id', 'degisiklikler'],
    'urun.kaldirildi': ['urun_id', 'sebep'],
    'fiyat.guncellendi': ['kategori', 'fiyat_metni'],
    'sosyal.paylasim_hazir': ['urun_id', 'platformlar'],
}
KAYNAKLAR = {'web-sitesi', 'tablo', 'otomasyon', 'yonetici'}
KATEGORILER = {'tesbih', 'bileklik', 'kolye', 'yuzuk'}
CINSIYETLER = {'erkek', 'kadin'}
BOLUMLER = {'koleksiyon', 'atolyeden-yeni', 'buyuk-fotograf'}
SEBEPLER = {'satildi', 'stokta-yok', 'hatali-kayit'}
TASLAR = {'ametist', 'lapis', 'yesim', 'malakit', 'turkuaz', 'kaplan', 'sitrin', 'akik', 'oniks', 'havlit', 'kehribar', 'zebercet'}
URUN_ALANLARI = {'ad', 'kategori', 'cinsiyet', 'aciklama', 'fotograflar', 'yeni', 'fiyat'}
KISISEL = {'telefon', 'ad_soyad', 'musteri_adi', 'eposta', 'ip', 'ip_adresi', 'musteri_telefon'}
KEBAB = re.compile(r'^[a-z0-9]+(-[a-z0-9]+)*$')
FOTO = re.compile(r'^\d{2}-[a-z0-9-]+\.jpg$')


def metinler(o, yol=''):
    if isinstance(o, str):
        yield yol, o
    elif isinstance(o, dict):
        for k, v in o.items():
            yield from metinler(v, f'{yol}.{k}' if yol else k)
    elif isinstance(o, list):
        for i, v in enumerate(o):
            yield from metinler(v, f'{yol}[{i}]')


def anahtarlar(o):
    if isinstance(o, dict):
        for k, v in o.items():
            yield k
            yield from anahtarlar(v)
    elif isinstance(o, list):
        for v in o:
            yield from anahtarlar(v)


def dogrula(m, urun_idleri=None):
    h = []
    if not isinstance(m, dict):
        return ['Mesaj bir JSON nesnesi olmalı']
    for alan in ('surum', 'olay', 'kimlik', 'zaman', 'kaynak', 'veri'):
        if alan not in m:
            h.append(f'Zarfta "{alan}" eksik')
    fazla = set(m) - {'surum', 'olay', 'kimlik', 'zaman', 'kaynak', 'veri'}
    if fazla:
        h.append(f'Zarfta tanımsız alan(lar): {", ".join(sorted(fazla))} (olaya özel bilgi "veri" içine konur)')
    if m.get('surum') not in (None, '1.0'):
        h.append(f'"surum" "1.0" olmalı, gelen: {m.get("surum")!r}')
    olay = m.get('olay')
    if olay is not None and olay not in OLAYLAR:
        h.append(f'Bilinmeyen olay "{olay}". Geçerli olaylar: {", ".join(OLAYLAR)}')
    if 'kimlik' in m:
        try:
            uuid.UUID(str(m['kimlik']))
        except ValueError:
            h.append('"kimlik" geçerli bir UUID olmalı')
    if 'zaman' in m:
        z = str(m['zaman'])
        try:
            dt = datetime.fromisoformat(z.replace('Z', '+00:00'))
            if dt.tzinfo is None:
                h.append('"zaman" saat dilimi içermeli (ör. +03:00)')
        except ValueError:
            h.append(f'"zaman" ISO 8601 olmalı (ör. 2026-10-04T14:32:05+03:00), gelen: {z!r}')
    if 'kaynak' in m and m['kaynak'] not in KAYNAKLAR:
        h.append(f'"kaynak" şunlardan biri olmalı: {", ".join(sorted(KAYNAKLAR))}')

    v = m.get('veri')
    if not isinstance(v, dict):
        if 'veri' in m:
            h.append('"veri" bir nesne olmalı')
        return h
    if olay in OLAYLAR:
        for alan in OLAYLAR[olay]:
            if alan not in v:
                h.append(f'{olay}: veri.{alan} eksik')

    if 'kategori' in v and v['kategori'] not in KATEGORILER:
        h.append(f'veri.kategori şunlardan biri olmalı: {", ".join(sorted(KATEGORILER))}')
    if 'cinsiyet' in v and v['cinsiyet'] not in CINSIYETLER:
        h.append('veri.cinsiyet "erkek" ya da "kadin" olmalı')
    if 'urun_id' in v and not KEBAB.match(str(v['urun_id'])):
        h.append('veri.urun_id kebab-case ve Türkçe karaktersiz olmalı (ör. yesim-tesbih)')
    if 'kanal' in v and v['kanal'] != 'whatsapp':
        h.append('veri.kanal şu an yalnız "whatsapp" olabilir')
    if olay == 'soru.gonderildi' and 'bolum' in v and v['bolum'] not in BOLUMLER:
        h.append(f'veri.bolum şunlardan biri olmalı: {", ".join(sorted(BOLUMLER))}')
    if olay == 'bileklik.tasarlandi':
        t = v.get('taneler')
        if isinstance(t, list):
            if len(t) > 30:
                h.append('Bileklik en fazla 30 tane olabilir')
            bilinmeyen = sorted(set(t) - TASLAR)
            if bilinmeyen:
                h.append(f'Bilinmeyen taş kimliği: {", ".join(map(str, bilinmeyen))}')
            if v.get('tane_sayisi') != len(t):
                h.append('veri.tane_sayisi, taneler listesinin uzunluğuna eşit olmalı')
    if olay == 'sepet.gonderildi':
        k = v.get('kalemler')
        if not isinstance(k, list) or not k:
            h.append('veri.kalemler boş olmayan bir liste olmalı')
        else:
            toplam = 0
            for i, x in enumerate(k):
                for alan in ('urun_id', 'urun_adi', 'adet', 'birim_fiyat', 'tutar'):
                    if alan not in x:
                        h.append(f'veri.kalemler[{i}].{alan} eksik')
                if all(isinstance(x.get(a), int) for a in ('adet', 'birim_fiyat', 'tutar')):
                    if x['adet'] < 1: h.append(f'veri.kalemler[{i}].adet en az 1 olmalı')
                    if x['tutar'] != x['adet'] * x['birim_fiyat']: h.append(f'veri.kalemler[{i}].tutar = adet × birim_fiyat olmalı')
                    toplam += x['tutar']
                elif any(a in x for a in ('adet', 'birim_fiyat', 'tutar')):
                    h.append(f'veri.kalemler[{i}]: adet, birim_fiyat ve tutar TL cinsinden tam sayı olmalı')
                if urun_idleri is not None and x.get('urun_id') not in urun_idleri:
                    h.append(f'veri.kalemler[{i}].urun_id "{x.get("urun_id")}" urunler.js içinde yok')
            if isinstance(v.get('toplam_tutar'), int) and v['toplam_tutar'] != toplam:
                h.append(f'veri.toplam_tutar ({v["toplam_tutar"]}) kalem tutarlarının toplamına ({toplam}) eşit olmalı')
            if v.get('kalem_sayisi') != len(k):
                h.append('veri.kalem_sayisi, kalemler listesinin uzunluğuna eşit olmalı')
            if isinstance(v.get('urun_adedi'), int) and v['urun_adedi'] != sum(x.get('adet', 0) for x in k if isinstance(x.get('adet'), int)):
                h.append('veri.urun_adedi, adetlerin toplamına eşit olmalı')
    if olay == 'urun.kaldirildi' and v.get('sebep') not in SEBEPLER:
        h.append(f'veri.sebep şunlardan biri olmalı: {", ".join(sorted(SEBEPLER))}')
    if olay == 'urun.guncellendi':
        d = v.get('degisiklikler')
        if isinstance(d, dict):
            if not d:
                h.append('veri.degisiklikler boş olamaz')
            if 'urun_id' in d or 'id' in d:
                h.append('urun_id değiştirilemez; yeni ürün olarak ekleyin')
            yabanci = set(d) - URUN_ALANLARI
            if yabanci:
                h.append(f'veri.degisiklikler içinde tanımsız alan(lar): {", ".join(sorted(yabanci))}')
            for k in ('kategori', 'cinsiyet'):
                if k in d and d[k] not in (KATEGORILER if k == 'kategori' else CINSIYETLER):
                    h.append(f'veri.degisiklikler.{k} geçersiz')
        elif d is not None:
            h.append('veri.degisiklikler bir nesne olmalı')
    fotolar = v.get('fotograflar', (v.get('degisiklikler') or {}).get('fotograflar') if isinstance(v.get('degisiklikler'), dict) else None)
    if fotolar is not None:
        if not isinstance(fotolar, list):
            h.append('fotograflar bir liste olmalı (fotoğraf yoksa boş liste: "Fotoğraf yakında" kartı)')
        else:
            for f in fotolar:
                if not FOTO.match(str(f)):
                    h.append(f'Fotoğraf adı "NN-ad.jpg" biçiminde olmalı (public/img/koleksiyon/), gelen: {f!r}')
    if olay == 'fiyat.guncellendi':
        for k in ('fiyat_min', 'fiyat_max'):
            if k in v and not isinstance(v[k], int):
                h.append(f'veri.{k} TL cinsinden tam sayı olmalı')
    if olay == 'sosyal.paylasim_hazir':
        p = v.get('platformlar')
        if isinstance(p, dict):
            yabanci = set(p) - {'instagram', 'facebook', 'x'}
            if yabanci:
                h.append(f'Tanımsız platform: {", ".join(sorted(yabanci))}')
            x = (p.get('x') or {}).get('metin')
            if isinstance(x, str) and len(x) > 280:
                h.append(f'X metni 280 karakteri aşıyor ({len(x)})')
            ig = p.get('instagram') or {}
            if isinstance(ig.get('metin'), str) and len(ig['metin']) > 2200:
                h.append('Instagram metni 2200 karakteri aşıyor')
            if len(ig.get('hashtagler', [])) > 30:
                h.append('Instagram en fazla 30 hashtag kabul eder')
            for ad, icerik in p.items():
                if not isinstance(icerik, dict) or not icerik.get('metin'):
                    h.append(f'platformlar.{ad}.metin eksik')

    for yol, s in metinler(v):
        if yol.endswith('hashtagler') or '.hashtagler[' in yol or yol.startswith('hashtagler'):
            continue
        if re.search(r'tesp[iİı]h', s, re.IGNORECASE):
            h.append(f'veri.{yol}: "Tespih" yerine "Tesbih" yazılmalı')
    kisisel = sorted(set(anahtarlar(v)) & KISISEL)
    if kisisel:
        h.append(f'Kişisel veri alanı gönderilmemeli (KVKK): {", ".join(kisisel)}')

    if urun_idleri is not None and 'urun_id' in v and olay != 'bileklik.tasarlandi':
        var = v['urun_id'] in urun_idleri
        if olay == 'urun.eklendi' and var:
            h.append(f'"{v["urun_id"]}" zaten urunler.js içinde; urun.guncellendi kullanın')
        if olay != 'urun.eklendi' and not var:
            h.append(f'"{v["urun_id"]}" urunler.js içinde yok')
    return h


def main(argv):
    urun_idleri = None
    if '--urunler' in argv:
        i = argv.index('--urunler')
        urun_idleri = set(re.findall(r"id:\s*'([^']+)'", open(argv[i + 1], encoding='utf-8').read()))
        argv = argv[:i] + argv[i + 2:]
    if not argv:
        print(__doc__)
        return 2
    toplam = 0
    for yol in argv:
        try:
            veri = json.load(open(yol, encoding='utf-8'))
        except (OSError, json.JSONDecodeError) as e:
            print(f'{yol}: okunamadı / geçersiz JSON — {e}')
            toplam += 1
            continue
        mesajlar = veri if isinstance(veri, list) else [veri]
        for n, m in enumerate(mesajlar, 1):
            etiket = f'{yol}' + (f' #{n}' if len(mesajlar) > 1 else '')
            hatalar = dogrula(m, urun_idleri)
            toplam += len(hatalar)
            if hatalar:
                print(f'{etiket}: {len(hatalar)} hata')
                for x in hatalar:
                    print(f'  - {x}')
            else:
                print(f'{etiket}: TAMAM ({m.get("olay")})')
    return 1 if toplam else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
