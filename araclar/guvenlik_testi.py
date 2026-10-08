"""Kullanım: python3 -I araclar/guvenlik_testi.py <dist kopyası> [--oturum]   (bkz. GUVENLIK.md)
Projedeki web-sitesi/dist yerine bir KOPYASINI verin (betik içine geçici test.html yazar).
--oturum: sahte Supabase adresiyle derlenmiş kopyada (VITE_SUPABASE_URL=http://127.0.0.1:59999) oturum açık hâli dener.
Derlenmiş sayfanın test kopyasını üretir (CSP'ye test betiklerinin özeti eklenir), file:// ve http:// ile açar,
CSP ihlallerini, görsel/font yüklemesini, XSS denemelerini ve sepet doğrulamasını raporlar."""
import base64, hashlib, html, http.server, json, os, re, subprocess, sys, threading, time, functools

dist = os.path.abspath(sys.argv[1]); oturum_var = '--oturum' in sys.argv
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
P = '<img src=x onerror="window.__xss=(window.__xss||[]).concat(\'{}\')">'

def b64(o): return base64.urlsafe_b64encode(json.dumps(o).encode()).decode().rstrip('=')
exp = int(time.time()) + 86400 * 30
jwt = b64({"alg": "HS256", "typ": "JWT"}) + '.' + b64({"sub": "u1", "exp": exp, "role": "authenticated", "aud": "authenticated"}) + '.sig'
oturum = {"access_token": jwt, "refresh_token": "r", "expires_at": exp, "expires_in": 2592000, "token_type": "bearer",
          "user": {"id": "u1", "aud": "authenticated", "role": "authenticated", "email": "test@ornek.com",
                   "user_metadata": {"ad": P.format('ad')}, "app_metadata": {}, "created_at": "2026-01-01T00:00:00Z"}}
sepet = [{"id": P.format('sepet-id'), "adet": 1}, {"id": "yesim-tesbih", "adet": "1e9"}, {"id": "lapis-lazuli-tesbih", "adet": 2.5},
         {"id": "__proto__", "adet": 1}, {"id": "sitrin-tesbih", "adet": -3}, {"id": "malakit-yuzuk", "adet": 500},
         {"id": "yesim-tesbih", "adet": 2}, None, "metin"]
fav = [P.format('fav'), {"x": 1}, None, 123, "yesim-tesbih"]

bas = ("window.__ihlal=[];document.addEventListener('securitypolicyviolation',e=>window.__ihlal.push(e.violatedDirective+' '+e.blockedURI));"
       "window.__hata=[];window.addEventListener('error',e=>window.__hata.push(String(e.message)));"
       "window.alert=()=>{window.__xss=(window.__xss||[]).concat('alert')};"
       "try{" + (f"localStorage.setItem('sb-127-auth-token',{json.dumps(json.dumps(oturum))});" if oturum_var else "") +
       f"localStorage.setItem('volkans-dogaltas:sepet',{json.dumps(json.dumps(sepet))});"
       f"localStorage.setItem('volkans-dogaltas:favoriler',{json.dumps(json.dumps(fav))});}}catch(e){{window.__hata.push('ls '+e)}}")
son = """setTimeout(async()=>{const r={};try{
 r.csp=!!document.querySelector('meta[http-equiv="Content-Security-Policy"]');
 const ad=document.querySelector('.hesap__ad');r.ad_metni=ad?ad.textContent.trim():'(oturum yok)';
 const imgs=[...document.images];r.gorsel=imgs.filter(i=>i.complete&&i.naturalWidth>0).length+'/'+imgs.filter(i=>i.complete).length;
 r.font_jost=document.fonts.check('16px Jost');r.font_cormorant=document.fonts.check('16px "Cormorant Garamond"');
 const v=document.querySelector('video');r.video=v?v.readyState:-1;
 const fav=document.querySelectorAll('.product-card__fav--on').length;r.favori_isaretli=fav;
 const torba=document.querySelector('.ico--rozetli');r.rozet=torba?torba.textContent.trim():'(yok)';torba&&torba.click();
 await new Promise(x=>setTimeout(x,600));
 const s=document.querySelector('.sepet');r.sepet_satir=s?s.querySelectorAll('.sepet__item').length:-1;
 r.sepet_toplam=s?(s.querySelector('.sepet__total')||{}).textContent:'';
 const a=s&&s.querySelector('a.sepet__gonder');r.wa=a?decodeURIComponent(a.href).split('text=')[1]:'';
 r.zararli_img=document.querySelectorAll('img[src="x"]').length;r.xss=window.__xss||[];
 r.ihlal=window.__ihlal;r.hata=window.__hata;r.kok_dolu=document.getElementById('root').children.length>0;
}catch(e){r.HATA=String(e)}document.title='SONUC '+JSON.stringify(r);},2500);"""

def ozet(js): return "'sha256-" + base64.b64encode(hashlib.sha256(js.encode()).digest()).decode() + "'"
h = open(os.path.join(dist, 'index.html'), encoding='utf-8').read()
h = h.replace("script-src ", f"script-src {ozet(bas)} {ozet(son)} ", 1)
h = re.sub(r'(<meta http-equiv="Content-Security-Policy"[^>]*>)', lambda m: m.group(1) + f'<script>{bas}</script>', h, count=1) \
    if 'Content-Security-Policy' in h else h.replace('<head>', f'<head><script>{bas}</script>', 1)
h = h.replace('</body>', f'<script>{son}</script></body>', 1)
open(os.path.join(dist, 'test.html'), 'w', encoding='utf-8').write(h)

def calistir(url):
    try:
        out = subprocess.run([CHROME, '--headless=new', '--virtual-time-budget=9000', '--dump-dom', url],
                             capture_output=True, text=True, timeout=60).stdout
    except subprocess.TimeoutExpired:
        return 'ZAMAN AŞIMI'
    m = re.search(r'<title>SONUC (.*?)</title>', out)
    return json.dumps(json.loads(html.unescape(m.group(1))), ensure_ascii=False, indent=1) if m else 'SONUÇ YOK'

sorgu = '?q=%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E#%3Cimg%20src%3Dx%20onerror%3Dalert(2)%3E'
print('== file://\n' + calistir('file://' + os.path.join(dist, 'test.html') + sorgu))
sunucu = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(type('H',(http.server.SimpleHTTPRequestHandler,),{'log_message':lambda *a:None}), directory=dist))
threading.Thread(target=sunucu.serve_forever, daemon=True).start()
print('== http://\n' + calistir(f'http://127.0.0.1:{sunucu.server_address[1]}/test.html' + sorgu))
sunucu.shutdown(); os.remove(os.path.join(dist, 'test.html'))
