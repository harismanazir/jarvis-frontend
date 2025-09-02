import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // '@' points to client/src
    },
  },
  build: {
    outDir: path.resolve(__dirname, '../dist'), // output outside client folder
    emptyOutDir: true,
  },
  server: {
    port: 3000,
  },
});
