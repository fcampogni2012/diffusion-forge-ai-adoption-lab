import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/diffusion-forge-ai-adoption-lab/',
  plugins: [react()]
});
