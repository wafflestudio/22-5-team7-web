import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://52.78.132.59:8080',
        changeOrigin: true,
        headers: {
          Origin: 'http://localhost:5173'
        },
      },
    },
  },
});
