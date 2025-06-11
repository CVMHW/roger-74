
/**
 * Static File Verifier - Tests if static files are properly served
 */

export class StaticFileVerifier {
  private static instance: StaticFileVerifier;
  
  public static getInstance(): StaticFileVerifier {
    if (!StaticFileVerifier.instance) {
      StaticFileVerifier.instance = new StaticFileVerifier();
    }
    return StaticFileVerifier.instance;
  }
  
  async runComprehensiveStaticFileTest(): Promise<{
    sitemap: { accessible: boolean; content?: string; contentType?: string; status?: number; error?: string };
    robots: { accessible: boolean; content?: string; contentType?: string; status?: number; error?: string };
    analysis: string[];
  }> {
    console.log('🔬 RUNNING COMPREHENSIVE STATIC FILE TEST...');
    
    const results = {
      sitemap: { accessible: false } as any,
      robots: { accessible: false } as any,
      analysis: [] as string[]
    };
    
    // Test sitemap.xml with multiple methods
    results.sitemap = await this.testSitemapAccess();
    results.robots = await this.testRobotsAccess();
    
    // Analysis
    results.analysis = this.analyzeResults(results.sitemap, results.robots);
    
    console.log('📊 STATIC FILE TEST RESULTS:', results);
    
    return results;
  }
  
  private async testSitemapAccess(): Promise<any> {
    console.log('🧪 Testing sitemap.xml access...');
    
    const testMethods = [
      { name: 'Direct fetch', url: '/sitemap.xml' },
      { name: 'Cache busting', url: `/sitemap.xml?t=${Date.now()}` },
      { name: 'Static flag', url: '/sitemap.xml?static=true' },
      { name: 'Force XML', url: '/sitemap.xml', headers: { 'Accept': 'application/xml' } },
      { name: 'Raw request', url: '/sitemap.xml', headers: { 'Accept': '*/*' } }
    ];
    
    for (const method of testMethods) {
      try {
        console.log(`🔍 Testing: ${method.name}`);
        
        const response = await fetch(method.url, {
          method: 'GET',
          cache: 'no-cache',
          headers: method.headers || {}
        });
        
        const content = await response.text();
        const contentType = response.headers.get('content-type');
        const status = response.status;
        
        console.log(`📈 ${method.name}: Status=${status}, Content-Type=${contentType}, Length=${content.length}`);
        console.log(`📄 ${method.name}: Content preview:`, content.substring(0, 100));
        
        if (response.ok && content.includes('<?xml') && content.includes('<urlset')) {
          console.log(`✅ SUCCESS with ${method.name}!`);
          return {
            accessible: true,
            content,
            contentType,
            status,
            method: method.name
          };
        } else if (response.ok) {
          console.log(`⚠️ ${method.name}: Response OK but not XML content`);
        }
        
      } catch (error) {
        console.log(`❌ ${method.name}: Error -`, error);
      }
    }
    
    console.log('💀 ALL SITEMAP ACCESS METHODS FAILED');
    return {
      accessible: false,
      error: 'All access methods failed',
      status: 0
    };
  }
  
  private async testRobotsAccess(): Promise<any> {
    console.log('🧪 Testing robots.txt access...');
    
    try {
      const response = await fetch('/robots.txt', {
        method: 'GET',
        cache: 'no-cache'
      });
      
      const content = await response.text();
      const contentType = response.headers.get('content-type');
      
      console.log(`📈 Robots.txt: Status=${response.status}, Content-Type=${contentType}, Length=${content.length}`);
      
      return {
        accessible: response.ok,
        content,
        contentType,
        status: response.status
      };
      
    } catch (error) {
      console.log('❌ Robots.txt test failed:', error);
      return {
        accessible: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 0
      };
    }
  }
  
  private analyzeResults(sitemap: any, robots: any): string[] {
    const analysis = [];
    
    if (!sitemap.accessible) {
      analysis.push('🚨 CRITICAL: Sitemap.xml is NOT accessible - SPA routing is likely intercepting the request');
      analysis.push('🔧 FIX NEEDED: Update Vite config and deployment settings to serve static files first');
    } else {
      analysis.push('✅ Sitemap.xml is accessible');
      if (sitemap.contentType?.includes('xml')) {
        analysis.push('✅ Correct XML content-type header');
      } else {
        analysis.push('⚠️ WARNING: Incorrect content-type header for sitemap.xml');
      }
    }
    
    if (!robots.accessible) {
      analysis.push('🚨 Robots.txt is NOT accessible');
    } else {
      analysis.push('✅ Robots.txt is accessible');
    }
    
    if (!sitemap.accessible && !robots.accessible) {
      analysis.push('💥 SEVERE: Both static files are inaccessible - complete routing failure');
      analysis.push('🛠️ SOLUTION: Implement static file middleware with highest priority');
    }
    
    return analysis;
  }
}

// Auto-run test on import
const verifier = StaticFileVerifier.getInstance();
verifier.runComprehensiveStaticFileTest();
