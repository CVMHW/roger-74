
/**
 * CRITICAL FIX #5: Continuous Monitoring System
 * Implements automated monitoring and alerting for sitemap issues
 */
export class ContinuousMonitoringSystem {
  private static instance: ContinuousMonitoringSystem;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private alertThreshold = 3; // Number of consecutive failures before alert
  private consecutiveFailures = 0;
  
  public static getInstance(): ContinuousMonitoringSystem {
    if (!ContinuousMonitoringSystem.instance) {
      ContinuousMonitoringSystem.instance = new ContinuousMonitoringSystem();
    }
    return ContinuousMonitoringSystem.instance;
  }
  
  startMonitoring(intervalMinutes: number = 5): void {
    console.log('🔄 CRITICAL FIX #5: Starting continuous monitoring...');
    
    // Clear any existing monitoring
    this.stopMonitoring();
    
    this.monitoringInterval = setInterval(() => {
      this.performHealthCheck();
    }, intervalMinutes * 60 * 1000);
    
    // Immediate health check
    this.performHealthCheck();
  }
  
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('⏹️ CRITICAL FIX #5: Monitoring stopped');
    }
  }
  
  private async performHealthCheck(): Promise<void> {
    console.log('🩺 CRITICAL FIX #5: Performing sitemap health check...');
    
    try {
      const checks = await Promise.all([
        this.checkSitemapAccessibility(),
        this.checkRobotsAccessibility(),
        this.checkXMLValidity(),
        this.checkContentTypeHeaders(),
        this.checkCacheHeaders()
      ]);
      
      const failedChecks = checks.filter(check => !check.passed);
      
      if (failedChecks.length === 0) {
        console.log('✅ CRITICAL FIX #5: All health checks passed');
        this.consecutiveFailures = 0;
      } else {
        console.log(`❌ CRITICAL FIX #5: ${failedChecks.length} health checks failed`);
        this.consecutiveFailures++;
        
        if (this.consecutiveFailures >= this.alertThreshold) {
          this.triggerAlert(failedChecks);
        }
      }
      
    } catch (error) {
      console.error('💥 CRITICAL FIX #5: Health check error:', error);
      this.consecutiveFailures++;
    }
  }
  
  private async checkSitemapAccessibility(): Promise<{ name: string; passed: boolean; error?: string }> {
    try {
      const response = await fetch('/sitemap.xml', { 
        method: 'GET', 
        cache: 'no-cache' 
      });
      
      return {
        name: 'Sitemap Accessibility',
        passed: response.ok && response.status === 200
      };
    } catch (error) {
      return {
        name: 'Sitemap Accessibility',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  private async checkRobotsAccessibility(): Promise<{ name: string; passed: boolean; error?: string }> {
    try {
      const response = await fetch('/robots.txt', { 
        method: 'GET', 
        cache: 'no-cache' 
      });
      
      return {
        name: 'Robots.txt Accessibility',
        passed: response.ok && response.status === 200
      };
    } catch (error) {
      return {
        name: 'Robots.txt Accessibility',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  private async checkXMLValidity(): Promise<{ name: string; passed: boolean; error?: string }> {
    try {
      const response = await fetch('/sitemap.xml');
      const content = await response.text();
      
      const hasXMLDeclaration = content.includes('<?xml');
      const hasUrlset = content.includes('<urlset');
      const hasUrls = content.includes('<url>');
      
      return {
        name: 'XML Validity',
        passed: hasXMLDeclaration && hasUrlset && hasUrls
      };
    } catch (error) {
      return {
        name: 'XML Validity',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  private async checkContentTypeHeaders(): Promise<{ name: string; passed: boolean; error?: string }> {
    try {
      const response = await fetch('/sitemap.xml');
      const contentType = response.headers.get('content-type');
      
      return {
        name: 'Content-Type Headers',
        passed: contentType?.includes('xml') || contentType?.includes('text') || false
      };
    } catch (error) {
      return {
        name: 'Content-Type Headers',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  private async checkCacheHeaders(): Promise<{ name: string; passed: boolean; error?: string }> {
    try {
      const response = await fetch('/sitemap.xml');
      const cacheControl = response.headers.get('cache-control');
      
      return {
        name: 'Cache Headers',
        passed: cacheControl?.includes('max-age') || false
      };
    } catch (error) {
      return {
        name: 'Cache Headers',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  private triggerAlert(failedChecks: Array<{ name: string; passed: boolean; error?: string }>): void {
    console.error('🚨 CRITICAL FIX #5: SITEMAP ALERT TRIGGERED!');
    console.error(`❌ ${this.consecutiveFailures} consecutive failures detected`);
    console.error('📋 Failed checks:', failedChecks.map(check => `${check.name}: ${check.error || 'Failed'}`));
    
    // In a real implementation, this would send emails, notifications, etc.
    alert(`SITEMAP ALERT: ${failedChecks.length} critical issues detected. Check console for details.`);
  }
  
  getMonitoringStatus(): {
    isActive: boolean;
    consecutiveFailures: number;
    nextCheckIn: string;
  } {
    return {
      isActive: this.monitoringInterval !== null,
      consecutiveFailures: this.consecutiveFailures,
      nextCheckIn: this.monitoringInterval ? '5 minutes' : 'Not scheduled'
    };
  }
}

// Auto-start monitoring
const monitoring = ContinuousMonitoringSystem.getInstance();
monitoring.startMonitoring(2); // Check every 2 minutes for faster detection
