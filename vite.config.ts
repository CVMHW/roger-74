import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
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
  // Ensure XML files are properly included in the build
  assetsInclude: ['**/*.xml', '**/*.txt'],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        sitemap: path.resolve(__dirname, 'public/sitemap.xml'),
        sitemapProduction: path.resolve(__dirname, 'public/sitemap-production.xml'),
        robots: path.resolve(__dirname, 'public/robots.txt'),
      },
      output: {
        assetFileNames: (assetInfo) => {
          // Keep XML and txt files in root directory with original names
          if (assetInfo.name?.endsWith('.xml') || assetInfo.name?.endsWith('.txt')) {
            return '[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    copyPublicDir: true,
  },
  // Configure dev server to serve XML files with correct headers
  preview: {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  },
}));
