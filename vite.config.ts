
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // CRITICAL: Explicit static file serving BEFORE any middleware
    middlewareMode: false,
    fs: {
      strict: false
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    // Custom plugin to handle static files with highest priority
    {
      name: 'static-file-handler',
      configureServer(server: any) {
        server.middlewares.use('/sitemap.xml', (req: any, res: any, next: any) => {
          console.log('🚨 STATIC HANDLER: Intercepting sitemap.xml request');
          res.setHeader('Content-Type', 'application/xml; charset=utf-8');
          res.setHeader('Cache-Control', 'public, max-age=3600');
          
          // Force serve the static file
          const fs = require('fs');
          const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
          
          try {
            const content = fs.readFileSync(sitemapPath, 'utf8');
            console.log('✅ STATIC HANDLER: Serving sitemap.xml content');
            res.end(content);
          } catch (error) {
            console.error('❌ STATIC HANDLER: Error reading sitemap.xml:', error);
            res.status(404).end('Sitemap not found');
          }
        });
        
        server.middlewares.use('/robots.txt', (req: any, res: any, next: any) => {
          console.log('🚨 STATIC HANDLER: Intercepting robots.txt request');
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          
          const fs = require('fs');
          const robotsPath = path.join(__dirname, 'public', 'robots.txt');
          
          try {
            const content = fs.readFileSync(robotsPath, 'utf8');
            console.log('✅ STATIC HANDLER: Serving robots.txt content');
            res.end(content);
          } catch (error) {
            console.error('❌ STATIC HANDLER: Error reading robots.txt:', error);
            res.status(404).end('Robots not found');
          }
        });
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // CRITICAL: Ensure static files are properly handled
  publicDir: 'public',
  build: {
    // Ensure public directory files are copied to dist with exact names
    copyPublicDir: true,
    rollupOptions: {
      // Ensure static files are not processed by bundler
      external: [],
      output: {
        // Keep static assets with original names
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.xml') || assetInfo.name?.endsWith('.txt')) {
            return '[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
  },
  // Configure dev server to serve static files FIRST
  preview: {
    open: false,
    headers: {
      'Cache-Control': 'public, max-age=3600'
    }
  },
  // Add explicit static file handling
  assetsInclude: ['**/*.xml', '**/*.txt']
}));
