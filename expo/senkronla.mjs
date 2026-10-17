// Web sitesindeki veri dosyalarını (ürünler, site bilgileri, gizlilik metni) mobil uygulamaya kopyalar.
// Tek kaynak web-sitesi/src/data/ kalır; veri değişince: npm run senkronla
import { copyFileSync, mkdirSync } from 'node:fs';
mkdirSync('veri', { recursive: true });
for (const d of ['urunler.js', 'site.js', 'gizlilik.js']) copyFileSync(`../web-sitesi/src/data/${d}`, `veri/${d}`);
console.log('veri/ güncellendi');
