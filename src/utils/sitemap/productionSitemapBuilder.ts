
import { generateSitemapXML, validateSitemapXML } from './sitemapGenerator';
import { getSitemapEntries } from './sitemapConfig';
import fs from 'fs';
import path from 'path';

/**
 * Build production sitemap files
 */
export const buildProductionSitemaps = async (): Promise<void> => {
  try {
    console.log('🚀 Building production sitemaps...');
    
    // Generate sitemap content
    const entries = getSitemapEntries();
    const sitemapContent = generateSitemapXML(entries);
    
    // Validate the generated content
    const validation = validateSitemapXML(sitemapContent);
    
    if (!validation.isValid) {
      throw new Error(`Sitemap validation failed: ${validation.errors.join(', ')}`);
    }
    
    // Write to public directory for static serving
    const publicDir = path.join(process.cwd(), 'public');
    
    // Write main sitemap
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent, 'utf8');
    
    // Write production variant
    fs.writeFileSync(path.join(publicDir, 'sitemap-production.xml'), sitemapContent, 'utf8');
    
    console.log('✅ Production sitemaps built successfully');
    console.log(`📄 Sitemap contains ${entries.length} URLs`);
    console.log(`📏 Sitemap size: ${(sitemapContent.length / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.error('❌ Failed to build production sitemaps:', error);
    throw error;
  }
};

// Auto-run if called directly
if (require.main === module) {
  buildProductionSitemaps();
}
