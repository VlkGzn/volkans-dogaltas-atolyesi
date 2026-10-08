import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Güvenlik politikası (CSP, bkz. GUVENLIK.md): derleme bitince dist/index.html'e eklenir.
// Gömülü JS'nin SHA-256 özeti yazılır; böylece sayfada yalnız bizim kodumuz çalışabilir.
// Bağlantı izni yalnız .env'deki Supabase ve webhook adreslerine verilir.
function guvenlikPolitikasi(env) {
  let dosya;
  return {
    name: 'guvenlik-politikasi',
    apply: 'build',
    configResolved(c) { dosya = resolve(c.root, c.build.outDir, 'index.html'); },
    closeBundle() {
      const html = readFileSync(dosya, 'utf8');
      const ozetler = [...html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)]
        .map((m) => `'sha256-${createHash('sha256').update(m[1]).digest('base64')}'`);
      const baglanti = [env.VITE_SUPABASE_URL, env.VITE_WEBHOOK_URL]
        .filter(Boolean).map((u) => new URL(u).origin);
      const politika = [
        "default-src 'self'",
        `script-src ${ozetler.join(' ')}`,
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", // React'in style={{…}} değerleri için
        'font-src https://fonts.gstatic.com',
        "img-src 'self' data:",
        "media-src 'self'",
        `connect-src 'self' ${baglanti.join(' ')}`.trim(),
        "object-src 'none'",
        "base-uri 'none'",
        "form-action 'self'",
      ].join('; ');
      const meta = `<meta http-equiv="Content-Security-Policy" content="${politika}">\n`
        + '<meta name="referrer" content="strict-origin-when-cross-origin">';
      writeFileSync(dosya, html.replace('<meta charset="utf-8">', `<meta charset="utf-8">\n${meta}`));
    },
  };
}

// base './' + singlefile: dist/index.html, JS ve CSS'i içine gömülü tek dosya olur;
// böylece hem sunucuya yüklenebilir hem de çift tıklayınca tarayıcıda açılır.
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [react(), viteSingleFile(), guvenlikPolitikasi(loadEnv(mode, process.cwd(), 'VITE_'))],
}));
