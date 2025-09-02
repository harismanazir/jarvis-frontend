import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './client/src',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
