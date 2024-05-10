import glsl from 'vite-plugin-glsl';
import { resolve } from 'path';
import { defineConfig } from 'vite';

const root = resolve(__dirname, 'src');

export default defineConfig({
  root,
  publicDir: '../static/',
  base: './',
  server: {
    host: true, // Open to local network and display URL
    open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env), // Open if it's not a CodeSandbox
  },
  build: {
    outDir: '../docs',
    emptyOutDir: true, // Empty the folder first
    sourcemap: true, // Add sourcemap
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        bedroom: resolve(root, 'bedroom', 'index.html'),
      },
    },
  },
  plugins: [glsl()],
});
