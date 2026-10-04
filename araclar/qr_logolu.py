import sys, io, re
import os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import logo_secenekleri as L
import segno
def qr_svg(p='qr', size=180, url='https://wa.me/905327389673'):
    q = segno.make(url, error='h')
    m = q.matrix; n = len(m); B = 2; N = n + 2*B
    hole = 9 if n >= 29 else 7          # cleared center, in modules
    c0 = (n - hole)//2
    rects = []
    for y,row in enumerate(m):
        for x,v in enumerate(row):
            if v and not (c0 <= x < c0+hole and c0 <= y < c0+hole):
                rects.append(f'M{x+B},{y+B}h1v1h-1z')
    cx = N/2
    icon = L.ring_icon(p, None)
    icon = re.sub(r'<svg [^>]*>', f'<svg x="{cx-hole*0.43:.2f}" y="{cx-hole*0.43*1.025:.2f}" width="{hole*0.86:.2f}" height="{hole*0.86*1.025:.2f}" viewBox="0 0 200 205">', icon, 1)
    return (f'<svg viewBox="0 0 {N} {N}" width="{size}" height="{size}" role="img" aria-label="WhatsApp QR kodu, ortada Volkan\'s Doğaltaş logosu" shape-rendering="crispEdges" style="display: block">'
            f'<rect width="{N}" height="{N}" rx="1.2" fill="#F4EFE6"></rect><path d="{"".join(rects)}" fill="#17171A"></path>'
            f'<circle cx="{cx}" cy="{cx}" r="{hole/2-0.15:.2f}" fill="#17171A" shape-rendering="geometricPrecision"></circle>'
            f'<g shape-rendering="geometricPrecision">{icon}</g></svg>'), n
if __name__ == '__main__':
    svg, n = qr_svg('t', 600); print('modules', n)
    open(sys.argv[2], 'w').write('<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;background:#fff}</style></head><body><div style="padding:40px">' + svg + '</div></body></html>')
