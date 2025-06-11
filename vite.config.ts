
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
    // Remove the problematic external function that was blocking sitemaps
    rollupOptions: {
      output: {
        // Ensure static assets are properly named
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.xml') || assetInfo.name?.endsWith('.txt')) {
            return '[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
  },
  // Configure dev server to properly serve static files
  preview: {
    open: false,
  },
}));
