
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Ensure static files are served first in development
    middlewareMode: false,
    fs: {
      strict: false
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // CRITICAL: Ensure static files are properly handled
  publicDir: 'public',
  build: {
    // Ensure public directory files are copied to dist
    copyPublicDir: true,
    rollupOptions: {
      // Handle static files BEFORE any bundling
      external: ['/sitemap.xml', '/sitemap-production.xml', '/robots.txt'],
      output: {
        // Ensure static assets are properly named - keep XML and TXT files as-is
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.xml') || assetInfo.name?.endsWith('.txt')) {
            return '[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
  },
  // Configure dev server to properly serve static files FIRST
  preview: {
    open: false,
    // Ensure static files are served before SPA routing
    headers: {
      'Cache-Control': 'public, max-age=3600'
    }
  },
  // Add explicit static file handling
  assetsInclude: ['**/*.xml', '**/*.txt']
}));
