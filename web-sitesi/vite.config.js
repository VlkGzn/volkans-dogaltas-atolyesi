import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// base './' + singlefile: dist/index.html, JS ve CSS'i içine gömülü tek dosya olur;
// böylece hem sunucuya yüklenebilir hem de çift tıklayınca tarayıcıda açılır.
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
});
