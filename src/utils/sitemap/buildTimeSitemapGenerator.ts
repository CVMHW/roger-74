
import { generateSitemapXML, validateSitemapXML } from './sitemapGenerator';
import { getSitemapEntries } from './sitemapConfig';

/**
 * CRITICAL FIX #4: Build-time sitemap generator
 * Ensures sitemap is always current and properly formatted
 */
export class BuildTimeSitemapGenerator {
  private static instance: BuildTimeSitemapGenerator;
  
  public static getInstance(): BuildTimeSitemapGenerator {
    if (!BuildTimeSitemapGenerator.instance) {
      BuildTimeSitemapGenerator.instance = new BuildTimeSitemapGenerator();
    }
    return BuildTimeSitemapGenerator.instance;
  }
  
  async generateProductionSitemaps(): Promise<{
    success: boolean;
    sitemapContent: string;
    errors: string[];
    stats: {
      urlCount: number;
      fileSize: number;
      timestamp: string;
    };
  }> {
    console.log('🚀 CRITICAL FIX #4: Generating production sitemaps...');
    
    try {
      // Generate current sitemap content
      const entries = getSitemapEntries();
      const sitemapContent = generateSitemapXML(entries);
      
      // Validate the generated content
      const validation = validateSitemapXML(sitemapContent);
      
      if (!validation.isValid) {
        console.error('❌ Sitemap validation failed:', validation.errors);
        return {
          success: false,
          sitemapContent: '',
          errors: validation.errors,
          stats: {
            urlCount: 0,
            fileSize: 0,
            timestamp: new Date().toISOString()
          }
        };
      }
      
      const stats = {
        urlCount: entries.length,
        fileSize: sitemapContent.length,
        timestamp: new Date().toISOString()
      };
      
      console.log('✅ CRITICAL FIX #4: Sitemap generation successful');
      console.log('📊 Stats:', stats);
      
      return {
        success: true,
        sitemapContent,
        errors: [],
        stats
      };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('💥 CRITICAL FIX #4: Generation failed:', errorMessage);
      
      return {
        success: false,
        sitemapContent: '',
        errors: [errorMessage],
        stats: {
          urlCount: 0,
          fileSize: 0,
          timestamp: new Date().toISOString()
        }
      };
    }
  }
  
  async validateCurrentSitemap(): Promise<{
    isValid: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    console.log('🔍 CRITICAL FIX #4: Validating current sitemap...');
    
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    try {
      const response = await fetch('/sitemap.xml', {
        method: 'GET',
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        issues.push(`HTTP ${response.status}: Sitemap not accessible`);
        recommendations.push('Fix static file routing configuration');
        return { isValid: false, issues, recommendations };
      }
      
      const content = await response.text();
      const contentType = response.headers.get('content-type');
      
      // Check content type
      if (!contentType?.includes('xml')) {
        issues.push('Incorrect Content-Type header');
        recommendations.push('Configure proper XML content-type headers');
      }
      
      // Check XML validity
      if (!content.includes('<?xml')) {
        issues.push('Missing XML declaration');
        recommendations.push('Ensure XML declaration is present');
      }
      
      if (!content.includes('<urlset')) {
        issues.push('Missing urlset element');
        recommendations.push('Fix XML structure');
      }
      
      // Check for URLs
      const urlCount = (content.match(/<url>/g) || []).length;
      if (urlCount === 0) {
        issues.push('No URLs found in sitemap');
        recommendations.push('Add URLs to sitemap configuration');
      }
      
      const isValid = issues.length === 0;
      console.log(`${isValid ? '✅' : '❌'} CRITICAL FIX #4: Validation ${isValid ? 'passed' : 'failed'}`);
      
      return { isValid, issues, recommendations };
      
    } catch (error) {
      issues.push(`Validation error: ${error}`);
      recommendations.push('Check network connectivity and server configuration');
      return { isValid: false, issues, recommendations };
    }
  }
}

// Auto-initialize for immediate use
const generator = BuildTimeSitemapGenerator.getInstance();
generator.validateCurrentSitemap();
