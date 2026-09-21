import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4300,
    strictPort: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Bootstrap's own Sass still uses deprecated colour functions.
        quietDeps: true,
        // The stylesheets still use Sass @import; silence the deprecation until they move to @use.
        silenceDeprecations: ['import'],
      },
    },
  },
  build: {
    outDir: 'build',
    sourcemap: false,
  },
});
