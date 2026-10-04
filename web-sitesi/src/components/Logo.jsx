import { useId } from 'react';

// "Tesbih Halkası" logosu: 33 altın tane, 4 yeşim tane, altın imame ve ortada "V".
const TANE_SAYISI = 33;
const YESIM = new Set([0, 11, 21, 32]);
const TANELER = Array.from({ length: TANE_SAYISI }, (_, i) => {
  const a = ((90 + 12 + ((360 - 24) * i) / (TANE_SAYISI - 1)) * Math.PI) / 180;
  return { x: 100 + 70 * Math.cos(a), y: 92 + 70 * Math.sin(a), yesim: YESIM.has(i) };
});

export function LogoIcon({ size = 62 }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  return (
    <svg viewBox="0 0 200 205" width={size} height={Math.round((size * 205) / 200)} role="img"
      aria-label="Volkan's Doğaltaş logosu" style={{ display: 'block', flexShrink: 0 }}>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F1DCA4" /><stop offset=".45" stopColor="#C9A35C" /><stop offset="1" stopColor="#8E6B2F" />
        </linearGradient>
        <radialGradient id={`${id}j`} cx="34%" cy="30%" r="75%">
          <stop offset="0" stopColor="#cdf2da" /><stop offset=".3" stopColor="#4fa57d" /><stop offset=".78" stopColor="#1d5a3e" /><stop offset="1" stopColor="#0c2a1b" />
        </radialGradient>
        <radialGradient id={`${id}b`} cx="34%" cy="30%" r="75%">
          <stop offset="0" stopColor="#FFF3CF" /><stop offset=".35" stopColor="#D9B46A" /><stop offset="1" stopColor="#7E5D25" />
        </radialGradient>
      </defs>
      {TANELER.map((t, i) => (
        <circle key={i} cx={t.x.toFixed(1)} cy={t.y.toFixed(1)} r={t.yesim ? 6.4 : 5} fill={`url(#${id}${t.yesim ? 'j' : 'b'})`} />
      ))}
      <path d="M100,158 C92,166 92,178 100,186 C108,178 108,166 100,158 Z" fill={`url(#${id}g)`} />
      <path d="M100,186 L90,200 M100,186 L96,202 M100,186 L104,202 M100,186 L110,200" stroke={`url(#${id}g)`} strokeWidth="1.6" strokeLinecap="round" />
      <text x="100" y="125" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontStyle="italic" fontWeight="600" fontSize="104" fill={`url(#${id}g)`}>V</text>
    </svg>
  );
}

export default function Logo({ size = 62, buyuk = true }) {
  return (
    <span className="logo">
      <LogoIcon size={size} />
      <span className="logo__text">
        <span className={buyuk ? 'logo__volkans' : 'logo__volkans logo__volkans--small'}>Volkan's</span>
        <span className={buyuk ? 'logo__dogaltas' : 'logo__dogaltas logo__dogaltas--small'}>DOĞALTAŞ</span>
      </span>
    </span>
  );
}
