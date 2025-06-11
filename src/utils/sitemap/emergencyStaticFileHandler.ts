
/**
 * Emergency static file handler - ensures sitemap.xml is accessible
 * This is a fallback system for when normal static file serving fails
 */

export class EmergencyStaticFileHandler {
  private static instance: EmergencyStaticFileHandler;
  
  public static getInstance(): EmergencyStaticFileHandler {
    if (!EmergencyStaticFileHandler.instance) {
      EmergencyStaticFileHandler.instance = new EmergencyStaticFileHandler();
    }
    return EmergencyStaticFileHandler.instance;
  }
  
  /**
   * Check if we can access sitemap.xml and implement emergency measures if not
   */
  async ensureSitemapAccessibility(): Promise<{
    accessible: boolean;
    method: string;
    url?: string;
    content?: string;
  }> {
    console.log('🚨 EMERGENCY: Checking sitemap accessibility...');
    
    // Test 1: Direct file access
    try {
      const response = await fetch('/sitemap.xml', {
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'Accept': 'application/xml,text/xml,*/*'
        }
      });
      
      if (response.ok) {
        const content = await response.text();
        if (content.includes('<?xml') && content.includes('<urlset')) {
          console.log('✅ EMERGENCY: Sitemap accessible via direct file access');
          return {
            accessible: true,
            method: 'direct-file',
            url: '/sitemap.xml',
            content
          };
        }
      }
    } catch (error) {
      console.log('❌ EMERGENCY: Direct file access failed:', error);
    }
    
    // Test 2: Try with explicit extension
    try {
      const response = await fetch('/sitemap.xml?static=true', {
        method: 'GET',
        cache: 'no-cache'
      });
      
      if (response.ok) {
        const content = await response.text();
        if (content.includes('<?xml')) {
          console.log('✅ EMERGENCY: Sitemap accessible with query parameter');
          return {
            accessible: true,
            method: 'query-param',
            url: '/sitemap.xml?static=true',
            content
          };
        }
      }
    } catch (error) {
      console.log('❌ EMERGENCY: Query parameter access failed:', error);
    }
    
    // Test 3: Generate emergency inline sitemap
    console.log('🆘 EMERGENCY: Generating inline sitemap as last resort');
    const emergencyContent = this.generateEmergencySitemap();
    
    return {
      accessible: false,
      method: 'emergency-inline',
      content: emergencyContent
    };
  }
  
  private generateEmergencySitemap(): string {
    const currentDate = new Date().toISOString();
    const domain = 'https://peersupportai.com';
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${domain}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${domain}/lovable-uploads/098e5a48-82bc-4b39-bd7c-491690a5c763.png</image:loc>
      <image:title>CVMHW Logo - Cuyahoga Valley Mindful Health and Wellness</image:title>
      <image:caption>Logo for Cuyahoga Valley Mindful Health and Wellness, providing mental health services in Cleveland and surrounding Ohio areas</image:caption>
      <image:geo_location>Cleveland, OH</image:geo_location>
    </image:image>
  </url>
  <url>
    <loc>${domain}/flowchart</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${domain}/unified-flowchart</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${domain}/conversation-processing</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${domain}/mobile-desktop-analysis</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${domain}/wrapping-hell-analysis</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${domain}/test-dashboard</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>
</urlset>`;
  }
  
  /**
   * Test all possible access methods and report results
   */
  async runComprehensiveSitemapTest(): Promise<void> {
    console.log('🔬 RUNNING COMPREHENSIVE SITEMAP ACCESSIBILITY TEST...');
    
    const testMethods = [
      { name: 'Direct Access', url: '/sitemap.xml' },
      { name: 'With Cache Bust', url: '/sitemap.xml?t=' + Date.now() },
      { name: 'With Static Flag', url: '/sitemap.xml?static=true' },
      { name: 'With Accept Header', url: '/sitemap.xml', headers: { 'Accept': 'application/xml' } },
      { name: 'Production Variant', url: '/sitemap-production.xml' },
      { name: 'Robots.txt Test', url: '/robots.txt' }
    ];
    
    for (const method of testMethods) {
      try {
        console.log(`🧪 Testing: ${method.name}`);
        const response = await fetch(method.url, {
          method: 'GET',
          cache: 'no-cache',
          headers: method.headers || {}
        });
        
        const contentType = response.headers.get('content-type');
        const status = response.status;
        const ok = response.ok;
        
        console.log(`📊 ${method.name}: Status=${status}, OK=${ok}, Content-Type=${contentType}`);
        
        if (ok) {
          const content = await response.text();
          const isXML = content.includes('<?xml');
          const hasUrlset = content.includes('<urlset');
          console.log(`📄 ${method.name}: IsXML=${isXML}, HasUrlset=${hasUrlset}, Length=${content.length}`);
          
          if (method.name === 'Direct Access' && isXML && hasUrlset) {
            console.log('🎉 SUCCESS: Direct sitemap access is working!');
            return;
          }
        }
        
      } catch (error) {
        console.log(`❌ ${method.name}: Error - ${error}`);
      }
    }
    
    console.log('💀 ALL TESTS FAILED: Sitemap is not accessible through any method');
  }
}

// Auto-initialize and test
const handler = EmergencyStaticFileHandler.getInstance();
handler.runComprehensiveSitemapTest();
