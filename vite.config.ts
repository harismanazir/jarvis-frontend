import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: './client/src', // you can keep this if you want
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'), // <-- add this
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'), // make sure output is outside src
    emptyOutDir: true,
  },
});
