// Görseller (veya video + görseller) arasında sırayla, yakınlaşarak geçiş yapan kart.
// Giriş bölümü ve Kadın/Erkek kategori kartları bunu kullanır.
// katmanlar: [{ src, alt, video?: true, poster?, origin?, konum? }, ...]   (2 veya 3 katman; her biri 7 sn görünür)
//   origin: yakınlaşma merkezi · konum: kare kartta görüntünün hangi kısmı görünsün (CSS object-position)
// etiketler: katman başına bir etiket (isteğe bağlı) — görselle birlikte değişir
const SURE = 7; // saniye / katman

export default function GecisKarti({ katmanlar, etiketler, className = '', children }) {
  const n = katmanlar.length;
  // i. katman döngünün i*7. saniyesinde öne gelir: negatif gecikme ile hepsi aynı anda başlar
  const zaman = (i) => ({ animationDuration: `${SURE * n}s`, animationDelay: i === 0 ? '0s' : `${SURE * i - SURE * n}s` });
  const enUzun = etiketler ? etiketler.reduce((a, b) => (b.length > a.length ? b : a)) : '';
  return (
    <div className={`gecis gecis--${n} ${className}`}>
      {katmanlar.map((k, i) => {
        const cls = `gecis__layer${i === 0 ? ' gecis__layer--ilk' : ''}`;
        const style = { transformOrigin: k.origin, objectPosition: k.konum, ...zaman(i) };
        return k.video ? (
          <video key={i} className={cls} style={style} autoPlay muted loop playsInline preload="auto"
            poster={k.poster} aria-label={k.alt}>
            <source src={k.src} type="video/mp4" />
          </video>
        ) : (
          <img key={i} className={cls} style={style} src={k.src} alt={k.alt} />
        );
      })}
      <div className="shine" />
      {etiketler && (
        <div className="gecis__tag">
          <span className="gecis__tag-sizer">{enUzun}</span>
          {etiketler.map((e, i) => (
            <span key={i} className={`gecis__tag-text${i === 0 ? ' gecis__tag-text--ilk' : ''}`} style={zaman(i)}>{e}</span>
          ))}
        </div>
      )}
      {children}
    </div>
  );
}
