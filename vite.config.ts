
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    middlewareMode: false,
    fs: {
      strict: false
    }
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    // CRITICAL FIX #1: Static file handler with proper types
    {
      name: 'static-file-priority-handler',
      configureServer(server: any) {
        // HIGHEST PRIORITY: Intercept sitemap.xml BEFORE any other middleware
        server.middlewares.use('/sitemap.xml', (req: any, res: any, next: any) => {
          console.log('🚨 CRITICAL INTERCEPT: sitemap.xml request detected');
          res.setHeader('Content-Type', 'application/xml; charset=utf-8');
          res.setHeader('Cache-Control', 'public, max-age=3600');
          res.setHeader('X-Robots-Tag', 'index, follow');
          
          const fs = require('fs');
          const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
          
          try {
            const content = fs.readFileSync(sitemapPath, 'utf8');
            console.log('✅ SERVING STATIC SITEMAP:', content.length, 'bytes');
            res.end(content);
          } catch (error) {
            console.error('❌ STATIC SITEMAP ERROR:', error);
            res.status(404).end('Sitemap not found');
          }
        });
        
        // HIGHEST PRIORITY: Intercept robots.txt 
        server.middlewares.use('/robots.txt', (req: any, res: any, next: any) => {
          console.log('🚨 CRITICAL INTERCEPT: robots.txt request detected');
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.setHeader('Cache-Control', 'public, max-age=3600');
          
          const fs = require('fs');
          const robotsPath = path.join(__dirname, 'public', 'robots.txt');
          
          try {
            const content = fs.readFileSync(robotsPath, 'utf8');
            console.log('✅ SERVING STATIC ROBOTS:', content.length, 'bytes');
            res.end(content);
          } catch (error) {
            console.error('❌ STATIC ROBOTS ERROR:', error);
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
  // CRITICAL FIX #2: Ensure static files are properly handled
  publicDir: 'public',
  build: {
    copyPublicDir: true,
    rollupOptions: {
      external: [],
      output: {
        assetFileNames: (assetInfo: any) => {
          if (assetInfo.name?.endsWith('.xml') || assetInfo.name?.endsWith('.txt')) {
            return '[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
  },
  preview: {
    open: false,
    headers: {
      'Cache-Control': 'public, max-age=3600'
    }
  },
  assetsInclude: ['**/*.xml', '**/*.txt']
}));
