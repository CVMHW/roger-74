
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
    // CRITICAL SEO FIX: Enhanced static file handler with aggressive priority
    {
      name: 'seo-optimized-static-handler',
      configureServer(server: any) {
        // HIGHEST PRIORITY: Intercept ALL SEO-critical files BEFORE any other middleware
        const seoFiles = ['/sitemap.xml', '/sitemap-production.xml', '/robots.txt', '/manifest.json'];
        
        seoFiles.forEach(filePath => {
          server.middlewares.use(filePath, async (req: any, res: any, next: any) => {
            console.log(`🚨 SEO INTERCEPT: ${filePath} request detected`);
            
            try {
              // Use dynamic import instead of require for fs
              const { readFileSync } = await import('fs');
              const staticPath = path.join(process.cwd(), 'public', filePath.substring(1));
              
              // Set appropriate headers based on file type
              if (filePath.includes('.xml')) {
                res.setHeader('Content-Type', 'application/xml; charset=utf-8');
                res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
                res.setHeader('X-Content-Type-Options', 'nosniff');
                res.setHeader('X-Robots-Tag', 'index, follow');
              } else if (filePath.includes('.txt')) {
                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
              } else if (filePath.includes('.json')) {
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.setHeader('Cache-Control', 'public, max-age=86400');
              }
              
              const content = readFileSync(staticPath, 'utf8');
              console.log(`✅ SERVING SEO FILE: ${filePath} (${content.length} bytes)`);
              res.end(content);
            } catch (error) {
              console.error(`❌ SEO FILE ERROR: ${filePath}`, error);
              res.status(404).end(`${filePath.substring(1)} not found`);
            }
          });
        });
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // SEO OPTIMIZATION: Enhanced build configuration
  publicDir: 'public',
  build: {
    copyPublicDir: true,
    rollupOptions: {
      external: [],
      output: {
        // Ensure SEO-critical files maintain their names
        assetFileNames: (assetInfo: any) => {
          if (assetInfo.name?.match(/\.(xml|txt|json)$/)) {
            return '[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        // Code splitting for better Core Web Vitals
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-tabs']
        }
      }
    },
    // Performance optimization
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production'
      }
    }
  },
  preview: {
    open: false,
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY'
    }
  },
  assetsInclude: ['**/*.xml', '**/*.txt', '**/*.json']
}));
