import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { fileURLToPath } from 'node:url'

// Build variants:
// - default: full PWA served from a domain root (Vercel + Supabase).
// - VITE_FORCE_DEMO=true: demo-mode build with hash routing and relative
//   URLs, deployable under any subpath (e.g. GitHub Pages /Website/budget/).
//   Still a full installable PWA with a service worker.
// - ARTIFACT_BUILD=true (with VITE_FORCE_DEMO): single self-contained HTML
//   file, service worker disabled — for one-page static hosting.
const artifactBuild = process.env.ARTIFACT_BUILD === 'true'
const forceDemo = process.env.VITE_FORCE_DEMO === 'true'
const assetBase = forceDemo || artifactBuild ? './' : '/'

export default defineConfig({
  base: assetBase,
  plugins: [
    react(),
    tailwindcss(),
    ...(artifactBuild ? [viteSingleFile()] : []),
    VitePWA({
      disable: artifactBuild,
      registerType: 'prompt',
      includeAssets: ['brand/favicon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        name: forceDemo ? 'TacEdge Budget (demo)' : 'TacEdge Budget',
        short_name: 'Budget',
        description:
          'Private budgeting and cashflow tool across Personal, Property and TacEdge.',
        display: 'standalone',
        start_url: forceDemo ? '.' : '/',
        scope: forceDemo ? './' : '/',
        theme_color: '#0E2114',
        background_color: '#FCF2E8',
        orientation: 'any',
        icons: [
          {
            src: forceDemo ? 'icons/icon-192.png' : '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: forceDemo ? 'icons/icon-512.png' : '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: forceDemo ? 'icons/icon-maskable-512.png' : '/icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: forceDemo ? 'index.html' : '/index.html',
        // Never cache Supabase API traffic — data freshness is handled by
        // TanStack Query; the service worker only owns the app shell.
        navigateFallbackDenylist: [/^\/supabase/],
        runtimeCaching: [],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
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
