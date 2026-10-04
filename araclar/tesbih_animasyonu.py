"""Tesbih çekilme animasyonu.
Yeşim tesbih fotoğrafındaki (web-sitesi/public/img/koleksiyon/01-yesim-tesbih.jpg) gerçek taneleri keser,
zemini tanesiz hâle getirir ve taneleri ip boyunca adım adım ilerleterek kareler üretir.

Kullanım:
  python3 tesbih_animasyonu.py <calisma_klasoru> preview   # 3 karelik önizleme
  python3 tesbih_animasyonu.py <calisma_klasoru>           # tüm kareler -> <calisma_klasoru>/tsp/
  ffmpeg -framerate 25 -i <calisma_klasoru>/tsp/f%04d.jpg -c:v libx264 -crf 24 -pix_fmt yuv420p \
         -movflags +faststart web-sitesi/public/video/tesbih-cekiliyor.mp4
Başka bir tesbih için: SLOTS (tane merkezleri, 900px görsel koordinatı) ve imame kutusu `bx` değişir.
"""
import sys, math, numpy as np
from PIL import Image, ImageDraw, ImageFilter
S = sys.argv[1]; OUT = S + '/tsp'
import os; os.makedirs(OUT, exist_ok=True)
import os
KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = Image.open(os.path.join(KOK, 'web-sitesi', 'public', 'img', 'koleksiyon', '01-yesim-tesbih.jpg')).convert('RGB')
A = np.asarray(src).astype(np.float32)
SLOTS = [(527,109),(479,91),(427,91),(377,109),(332,127),(289,150),(245,191),(218,241),(198,289),(180,338),(168,386),(150,435),
 (141,486),(136,536),(135,585),(131,634),(137,681),(157,732),(192,775),(244,805),(310,812),(374,806),(429,777),(452,722),
 (462,665),(460,610),(452,555),(437,503),(420,436),(405,382),(402,327),(420,268),(447,218),(475,177),(514,145),(546,122)]
N = len(SLOTS); R = 30
# --- background with beads removed (normalized blur fill + slate grain) ---
mask = Image.new('L', src.size, 0); d = ImageDraw.Draw(mask)
for x,y in SLOTS: d.ellipse((x-R-4,y-R-4,x+R+4,y+R+4), fill=255)
M = np.asarray(mask).astype(np.float32)/255
keep = 1-M
fill = A.copy()
for rad in (6,12,24,40):
    num = np.stack([np.asarray(Image.fromarray((A[...,c]*keep).astype(np.uint8)).filter(ImageFilter.GaussianBlur(rad))).astype(np.float32) for c in range(3)],-1)
    den = np.asarray(Image.fromarray((keep*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(rad))).astype(np.float32)[...,None]/255
    est = num/np.maximum(den,1e-3)
    ok = (den[...,0] > 0.15) & (M > 0.5) & (fill.sum(-1) == A.sum(-1))
    fill[ok] = est[ok]
# slate grain from a clean patch
patch = A[600:880, 500:680]; hp = patch - np.asarray(Image.fromarray(patch.astype(np.uint8)).filter(ImageFilter.GaussianBlur(4))).astype(np.float32)
grain = np.tile(hp, (src.size[1]//hp.shape[0]+2, src.size[0]//hp.shape[1]+2, 1))[:src.size[1], :src.size[0]]
fill = fill + grain*M[...,None]
soft = np.asarray(mask.filter(ImageFilter.GaussianBlur(3))).astype(np.float32)[...,None]/255
bg = (A*(1-soft) + fill*soft).clip(0,255).astype(np.uint8)
bg = Image.fromarray(bg).convert('RGBA')
# --- bead sprites (real texture from each slot) ---
SZ = 2*R+6
cm = Image.new('L', (SZ,SZ), 0); ImageDraw.Draw(cm).ellipse((3,3,SZ-3,SZ-3), fill=255); cm = cm.filter(ImageFilter.GaussianBlur(1.2))
sprites = []
for x,y in SLOTS:
    sp = src.crop((x-SZ//2, y-SZ//2, x-SZ//2+SZ, y-SZ//2+SZ)).convert('RGBA'); sp.putalpha(cm); sprites.append(sp)
shadow = Image.new('RGBA', (SZ+16,SZ+16), (0,0,0,0)); ImageDraw.Draw(shadow).ellipse((8,12,SZ+8,SZ+12), fill=(0,0,0,120)); shadow = shadow.filter(ImageFilter.GaussianBlur(5))
# --- imame overlay (bright silver over dark slate) ---
bx = (540,88,840,222)
im = src.crop(bx); L = np.asarray(im.convert('L')).astype(np.float32)
am = ((L-55)/40).clip(0,1)
am_img = Image.fromarray((am*255).astype(np.uint8)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(1))
# keep only right of the mouth
amn = np.asarray(am_img).astype(np.float32); amn[:, :8] = 0
imame = im.convert('RGBA'); imame.putalpha(Image.fromarray(amn.astype(np.uint8)))
# --- uniform slots along the polyline loop ---
pts = SLOTS + [SLOTS[0]]
seg = [math.dist(pts[i], pts[i+1]) for i in range(N)]
cum = np.concatenate([[0], np.cumsum(seg)]); Ltot = cum[-1]
def at(s):
    s %= Ltot; i = int(np.searchsorted(cum, s, side='right')-1); i = min(i, N-1)
    t = (s-cum[i])/seg[i]; (x0,y0),(x1,y1) = pts[i], pts[i+1]
    return x0+(x1-x0)*t, y0+(y1-y0)*t
step = Ltot/N
FPS, STEP_T, HOLD = 25, 0.72, 0.5
frames_per_step = round(FPS*STEP_T); total = frames_per_step*N
def ease(u): return u*u*(3-2*u)
def frame(f):
    k, r = divmod(f, frames_per_step); u = r/frames_per_step
    prog = k + (0 if u < HOLD else ease((u-HOLD)/(1-HOLD)))
    img = bg.copy()
    order = sorted(range(N), key=lambda i: at((i+prog)*step)[1])
    for i in order:
        x,y = at((i+prog)*step)
        img.alpha_composite(shadow, (int(round(x-SZ/2-8)), int(round(y-SZ/2-6))))
    for i in order:
        x,y = at((i+prog)*step)
        img.alpha_composite(sprites[i], (int(round(x-SZ/2)), int(round(y-SZ/2))))
    img.alpha_composite(imame, (bx[0], bx[1]))
    return img.convert('RGB').crop((0,0,894,894)).resize((720,720), Image.LANCZOS)
if len(sys.argv) > 2 and sys.argv[2] == 'preview':
    ims = [frame(f) for f in (0, int(frames_per_step*0.8), frames_per_step*10)]
    sheet = Image.new('RGB', (2160,720)); [sheet.paste(im,(720*j,0)) for j,im in enumerate(ims)]
    sheet.save(S+'/tsp_preview.jpg', quality=88); bg.convert('RGB').save(S+'/tsp_bg.jpg'); print('frames', total, 'spacing', round(step,1))
else:
    for f in range(total): frame(f).save(f'{OUT}/f{f:04d}.jpg', quality=92)
    print('done', total)
