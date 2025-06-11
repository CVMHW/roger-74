
export class SitemapValidator {
  private static instance: SitemapValidator;
  
  public static getInstance(): SitemapValidator {
    if (!SitemapValidator.instance) {
      SitemapValidator.instance = new SitemapValidator();
    }
    return SitemapValidator.instance;
  }
  
  async validateSitemapAccessibility(domain: string): Promise<{
    sitemap: { accessible: boolean; status?: number; error?: string };
    robots: { accessible: boolean; status?: number; error?: string };
  }> {
    const results = {
      sitemap: { accessible: false, status: undefined as number | undefined, error: undefined as string | undefined },
      robots: { accessible: false, status: undefined as number | undefined, error: undefined as string | undefined }
    };
    
    try {
      // Test sitemap.xml
      const sitemapResponse = await fetch(`${domain}/sitemap.xml`);
      results.sitemap.status = sitemapResponse.status;
      results.sitemap.accessible = sitemapResponse.ok;
      
      if (!sitemapResponse.ok) {
        results.sitemap.error = `HTTP ${sitemapResponse.status}: ${sitemapResponse.statusText}`;
      }
    } catch (error) {
      results.sitemap.error = error instanceof Error ? error.message : 'Unknown error';
    }
    
    try {
      // Test robots.txt
      const robotsResponse = await fetch(`${domain}/robots.txt`);
      results.robots.status = robotsResponse.status;
      results.robots.accessible = robotsResponse.ok;
      
      if (!robotsResponse.ok) {
        results.robots.error = `HTTP ${robotsResponse.status}: ${robotsResponse.statusText}`;
      }
    } catch (error) {
      results.robots.error = error instanceof Error ? error.message : 'Unknown error';
    }
    
    return results;
  }
  
  validateXMLStructure(xmlContent: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Basic XML validation
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlContent, 'application/xml');
      const parserError = doc.querySelector('parsererror');
      
      if (parserError) {
        errors.push('Invalid XML structure: ' + parserError.textContent);
      }
    } catch (error) {
      errors.push('XML parsing failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
    
    // Sitemap-specific validation
    if (!xmlContent.includes('<urlset')) {
      errors.push('Missing <urlset> root element');
    }
    
    if (!xmlContent.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
      errors.push('Missing required sitemap namespace');
    }
    
    // Check for URLs
    const urlCount = (xmlContent.match(/<url>/g) || []).length;
    if (urlCount === 0) {
      errors.push('No URLs found in sitemap');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  async testSitemapInBrowser(): Promise<void> {
    console.log('🔍 Testing sitemap accessibility...');
    
    // For development, test localhost
    const devResults = await this.validateSitemapAccessibility('http://localhost:8080');
    console.log('Development server results:', devResults);
    
    // Log instructions for production testing
    console.log('📋 Production Testing Instructions:');
    console.log('1. Deploy your app to production');
    console.log('2. Visit https://yourdomain.com/sitemap.xml');
    console.log('3. Verify XML content loads');
    console.log('4. Test with Google Search Console');
    
    return Promise.resolve();
  }
}
