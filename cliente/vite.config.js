import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import babel from '@rollup/plugin-babel';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    babel({
      babelHelpers: 'bundled',
      include: ['src/**/*'],
    }),
    tailwindcss(),
  ],
});