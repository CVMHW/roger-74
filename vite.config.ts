
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
  // Ensure static files are properly handled
  publicDir: 'public',
  build: {
    // Ensure public directory files are copied to dist
    copyPublicDir: true,
    rollupOptions: {
      // Don't try to bundle static files
      external: ['/sitemap.xml', '/sitemap-production.xml', '/robots.txt']
    },
  },
}));
