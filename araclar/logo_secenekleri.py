import math, sys, json
GOLD_DEFS = '''<linearGradient id="{p}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F1DCA4"></stop><stop offset=".45" stop-color="#C9A35C"></stop><stop offset="1" stop-color="#8E6B2F"></stop></linearGradient>
<radialGradient id="{p}j" cx="34%" cy="30%" r="75%"><stop offset="0" stop-color="#cdf2da"></stop><stop offset=".3" stop-color="#4fa57d"></stop><stop offset=".78" stop-color="#1d5a3e"></stop><stop offset="1" stop-color="#0c2a1b"></stop></radialGradient>
<radialGradient id="{p}b" cx="34%" cy="30%" r="75%"><stop offset="0" stop-color="#FFF3CF"></stop><stop offset=".35" stop-color="#D9B46A"></stop><stop offset="1" stop-color="#7E5D25"></stop></radialGradient>'''
def defs(p): return '<defs>' + GOLD_DEFS.format(p=p) + '</defs>'
SERIF = "'Cormorant Garamond', serif"; SANS = "'Jost', sans-serif"

def ring_icon(p, cream):
    out = [defs(p)]
    cx, cy, R = 100, 92, 70
    n = 33
    for i in range(n):
        a = math.radians(90 + 12 + (360-24)*i/(n-1))
        x, y = cx + R*math.cos(a), cy + R*math.sin(a)
        jade = i in (0, 11, 21, 32)
        out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{6.4 if jade else 5}" fill="url(#{p}{"j" if jade else "b"})"></circle>')
    out.append(f'<path d="M100,158 C92,166 92,178 100,186 C108,178 108,166 100,158 Z" fill="url(#{p}g)"></path>')
    out.append(f'<path d="M100,186 L90,200 M100,186 L96,202 M100,186 L104,202 M100,186 L110,200" stroke="url(#{p}g)" stroke-width="1.6" stroke-linecap="round"></path>')
    out.append(f'<text x="100" y="125" text-anchor="middle" font-family="{SERIF}" font-style="italic" font-weight="600" font-size="104" fill="url(#{p}g)">V</text>')
    return f'<svg viewBox="0 0 200 205" xmlns="http://www.w3.org/2000/svg">{"".join(out)}</svg>'

def gem_icon(p, cream):
    facets = [((70,30),(40,60),(70,60),'#2f8f63'),((70,30),(70,60),(100,60),'#57b98a'),((70,30),(100,60),(100,30),'#7fd1a6'),
              ((100,30),(100,60),(130,30),'#5fbf8f'),((130,30),(100,60),(130,60),'#3a9d6f'),((130,30),(130,60),(160,60),'#1f6b4a'),
              ((40,60),(70,60),(100,178),'#1d5a3e'),((70,60),(100,60),(100,178),'#3a9d6f'),((100,60),(130,60),(100,178),'#24734f'),((130,60),(160,60),(100,178),'#0f3d2a')]
    out = [defs(p)]
    for a,b,c,col in facets:
        out.append(f'<path d="M{a[0]},{a[1]} L{b[0]},{b[1]} L{c[0]},{c[1]} Z" fill="{col}" stroke="url(#{p}g)" stroke-width="1.1" stroke-linejoin="round"></path>')
    out.append(f'<path d="M70,30 L130,30 L160,60 L100,178 L40,60 Z" fill="none" stroke="url(#{p}g)" stroke-width="3" stroke-linejoin="round"></path>')
    out.append(f'<path d="M163,14 L166,26 L178,29 L166,32 L163,44 L160,32 L148,29 L160,26 Z" fill="#F4E3B5"></path>')
    return f'<svg viewBox="0 0 200 190" xmlns="http://www.w3.org/2000/svg">{"".join(out)}</svg>'

def seal_icon(p, cream):
    txt = '#ECE7DE' if cream is None else cream
    out = [defs(p)]
    out.append(f'<circle cx="110" cy="110" r="104" fill="none" stroke="url(#{p}g)" stroke-width="2.4"></circle>')
    out.append(f'<circle cx="110" cy="110" r="97" fill="none" stroke="url(#{p}g)" stroke-width="0.8"></circle>')
    out.append(f'<circle cx="110" cy="110" r="70" fill="none" stroke="url(#{p}g)" stroke-width="0.8"></circle>')
    out.append(f'<path id="{p}top" d="M30,110 A80,80 0 0 1 190,110" fill="none"></path><path id="{p}bot" d="M22,110 A88,88 0 0 0 198,110" fill="none"></path>')
    out.append(f'<text font-family="{SANS}" font-size="13" font-weight="500" letter-spacing="3" fill="{txt}"><textPath href="#{p}top" startOffset="50%" text-anchor="middle">VOLKAN\'S DOĞALTAŞ</textPath></text>')
    out.append(f'<text font-family="{SANS}" font-size="11" font-weight="500" letter-spacing="3.6" fill="url(#{p}g)"><textPath href="#{p}bot" startOffset="50%" text-anchor="middle">EL YAPIMI · ANTALYA</textPath></text>')
    for x in (26, 194): out.append(f'<circle cx="{x}" cy="110" r="4" fill="url(#{p}j)"></circle>')
    k = 7
    for side in (-1, 1):
        for i in range(k):
            t = i/(k-1)
            x = 110 + side*(40 - 40*t)*0.95; y = 70 + 60*t
            jade = i % 3 != 2
            out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{5.6 if jade else 4.2}" fill="url(#{p}{"j" if jade else "b"})"></circle>')
    out.append(f'<path d="M110,136 C104,142 104,152 110,158 C116,152 116,142 110,136 Z" fill="url(#{p}g)"></path>')
    out.append(f'<path d="M110,158 L103,170 M110,158 L108,172 M110,158 L112,172 M110,158 L117,170" stroke="url(#{p}g)" stroke-width="1.3" stroke-linecap="round"></path>')
    return f'<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">{"".join(out)}</svg>'

def word_logo(p, cream):
    txt = '#ECE7DE' if cream is None else cream
    out = [defs(p)]
    out.append(f'<text x="262" y="52" text-anchor="middle" font-family="{SERIF}" font-style="italic" font-weight="600" font-size="48" fill="url(#{p}g)">Volkan\'s</text>')
    out.append(f'<text x="98" y="128" text-anchor="end" font-family="{SANS}" font-size="64" font-weight="400" fill="{txt}">D</text>')
    out.append(f'<circle cx="131" cy="105" r="25" fill="url(#{p}j)"></circle><ellipse cx="122" cy="95" rx="7" ry="4.5" fill="#ffffff" fill-opacity=".55" transform="rotate(-30 122 95)"></ellipse>')
    out.append(f'<text x="166" y="128" font-family="{SANS}" font-size="64" font-weight="400" letter-spacing="11" fill="{txt}">ĞALTAŞ</text>')
    out.append(f'<path d="M150,150 L374,150" stroke="url(#{p}g)" stroke-width="1.2"></path>')
    return f'<svg viewBox="0 0 520 160" xmlns="http://www.w3.org/2000/svg">{"".join(out)}</svg>'

def lockup(icon_svg, cream='#ECE7DE', gold='#C9A35C'):
    return (f'<div style="display:flex;align-items:center;gap:14px"><div style="width:56px;height:56px;display:flex">{icon_svg}</div>'
            f'<div style="display:flex;flex-direction:column;gap:2px"><span style="font-family:{SERIF};font-style:italic;font-size:20px;line-height:1;color:{gold}">Volkan\'s</span>'
            f'<span style="font-family:{SANS};font-size:22px;letter-spacing:.3em;line-height:1.1;color:{cream}">DOĞALTAŞ</span></div></div>')

LOGOS = [
 ('1', 'Tesbih Halkası', 'Altın tanelerden bir tesbih halkası, içinde "V". Dört yeşim tane ve altın imame.', ring_icon, True),
 ('2', 'Kesme Taş', 'Yontulmuş zümrüt taş. Sivri ucuyla "V" harfini anlatıyor.', gem_icon, True),
 ('3', 'Atölye Mührü', 'Yuvarlak rozet: çevresinde isim ve "El yapımı · Antalya". Ortada tanelerden dizilmiş "V" ve imame.', seal_icon, False),
 ('4', 'Taş "O"', 'Yazı logo: DOĞALTAŞ\'taki "O" parlak bir yeşim tanesi.', word_logo, False),
]
if __name__ == '__main__':
    json.dump({k: {'dark': f(f'l{k}d', None), 'light': f(f'l{k}l', '#1C1A17')} for k,_,_,f,_ in LOGOS}, open(sys.argv[1], 'w'), ensure_ascii=False)
