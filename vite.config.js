import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'CrowdShield Citizen App',
        short_name: 'CrowdShield',
        description: 'AI-Powered Crowd Safety Companion',
        theme_color: '#0D1B2A',
        background_color: '#0D1B2A',
        display: 'standalone',
        icons: [
          {
            src: 'https://cdn-icons-png.flaticon.com/512/2065/2065224.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'https://cdn-icons-png.flaticon.com/512/2065/2065224.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  server: {
    port: 3000,
    host: true,
    // ── Proxy: forward /api/* calls to backend — no CORS issues ──────
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
