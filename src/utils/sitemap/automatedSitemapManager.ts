
import { generateSitemapXML, validateSitemapXML } from './sitemapGenerator';
import { getSitemapEntries } from './sitemapConfig';
import { SitemapValidator } from './sitemapValidator';

export class AutomatedSitemapManager {
  private static instance: AutomatedSitemapManager;
  
  public static getInstance(): AutomatedSitemapManager {
    if (!AutomatedSitemapManager.instance) {
      AutomatedSitemapManager.instance = new AutomatedSitemapManager();
    }
    return AutomatedSitemapManager.instance;
  }
  
  async generateAndValidateSitemaps(): Promise<{
    success: boolean;
    sitemapContent: string;
    validationResult: { isValid: boolean; errors: string[] };
    message: string;
  }> {
    console.log('🚀 Starting automated sitemap generation...');
    
    try {
      // Generate sitemap content
      const entries = getSitemapEntries();
      const sitemapContent = generateSitemapXML(entries);
      
      // Validate the generated content
      const validationResult = validateSitemapXML(sitemapContent);
      
      if (validationResult.isValid) {
        console.log('✅ Sitemap generated and validated successfully');
        console.log('📄 Generated sitemap content length:', sitemapContent.length, 'characters');
        console.log('🔗 Found', entries.length, 'URLs in sitemap');
        
        // Test accessibility
        const validator = SitemapValidator.getInstance();
        await validator.testSitemapInBrowser();
        
        return {
          success: true,
          sitemapContent,
          validationResult,
          message: 'Sitemap generated and validated successfully'
        };
      } else {
        console.error('❌ Sitemap validation failed:', validationResult.errors);
        return {
          success: false,
          sitemapContent,
          validationResult,
          message: `Sitemap validation failed: ${validationResult.errors.join(', ')}`
        };
      }
    } catch (error) {
      console.error('💥 Error in automated sitemap generation:', error);
      return {
        success: false,
        sitemapContent: '',
        validationResult: { isValid: false, errors: [error instanceof Error ? error.message : 'Unknown error'] },
        message: 'Failed to generate sitemap'
      };
    }
  }
  
  async monitorSitemapHealth(): Promise<void> {
    console.log('🩺 Starting sitemap health monitoring...');
    
    const result = await this.generateAndValidateSitemaps();
    
    if (result.success) {
      console.log('💚 Sitemap health check: PASSED');
    } else {
      console.log('💔 Sitemap health check: FAILED');
      console.log('🔧 Issues found:', result.validationResult.errors);
    }
    
    // Schedule next health check (in a real app, this would be a proper scheduler)
    setTimeout(() => {
      this.monitorSitemapHealth();
    }, 5 * 60 * 1000); // Check every 5 minutes
  }
}

// Auto-start monitoring when imported
const manager = AutomatedSitemapManager.getInstance();
manager.monitorSitemapHealth();

export default AutomatedSitemapManager;
