import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { fileURLToPath } from 'node:url'

// ARTIFACT_BUILD=true produces a fully self-contained single-file demo
// build (all JS/CSS/fonts/images inlined, no service worker) for hosting
// the app as one static HTML page.
const artifactBuild = process.env.ARTIFACT_BUILD === 'true'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ...(artifactBuild ? [viteSingleFile()] : []),
    VitePWA({
      disable: artifactBuild,
      registerType: 'prompt',
      includeAssets: ['brand/favicon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'TacEdge Budget',
        short_name: 'Budget',
        description:
          'Private budgeting and cashflow tool across Personal, Property and TacEdge.',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        theme_color: '#0E2114',
        background_color: '#FCF2E8',
        orientation: 'any',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: '/index.html',
        // Never cache Supabase API traffic — data freshness is handled by
        // TanStack Query; the service worker only owns the app shell.
        navigateFallbackDenylist: [/^\/supabase/],
        runtimeCaching: [],
      },
    }),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    assetsInlineLimit: artifactBuild ? 100_000_000 : undefined,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
