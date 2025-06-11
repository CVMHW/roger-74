import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // CRITICAL: Static files must be served BEFORE any SPA routing
    middlewareMode: false,
    fs: {
      strict: false
    },
    // Add explicit static file handling
    proxy: mode === 'development' ? {
      '/sitemap.xml': {
        target: 'http://localhost:8080',
        changeOrigin: false,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Force static file serving
            if (req.url === '/sitemap.xml') {
              res.setHeader('Content-Type', 'application/xml; charset=utf-8');
            }
          });
        }
      },
      '/robots.txt': {
        target: 'http://localhost:8080',
        changeOrigin: false,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            if (req.url === '/robots.txt') {
              res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            }
          });
        }
      }
    } : undefined
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
  // Add explicit static file handling at the root level
  assetsInclude: ['**/*.xml', '**/*.txt'],
  // Add static file handling at the root level
  define: {
    __STATIC_FILES__: JSON.stringify(['sitemap.xml', 'sitemap-production.xml', 'robots.txt'])
  }
}));
