
/**
 * Security Headers Configuration
 * 
 * Implements Content Security Policy and other security headers
 */

export interface SecurityConfig {
  enableCSP: boolean;
  enableHSTS: boolean;
  enableXFrameOptions: boolean;
  enableXContentTypeOptions: boolean;
  developmentMode: boolean;
}

export class SecurityHeaders {
  private static config: SecurityConfig = {
    enableCSP: true,
    enableHSTS: true,
    enableXFrameOptions: true,
    enableXContentTypeOptions: true,
    developmentMode: import.meta.env.DEV
  };

  /**
   * Apply security headers to the document
   */
  static applySecurityHeaders(): void {
    if (typeof document === 'undefined') return;

    // Content Security Policy
    if (this.config.enableCSP) {
      this.setCSPMeta();
    }

    // X-Frame-Options equivalent for meta tag
    if (this.config.enableXFrameOptions) {
      this.addMetaTag('X-Frame-Options', 'DENY');
    }

    // X-Content-Type-Options equivalent
    if (this.config.enableXContentTypeOptions) {
      this.addMetaTag('X-Content-Type-Options', 'nosniff');
    }

    // Referrer Policy
    this.addMetaTag('referrer', 'strict-origin-when-cross-origin');

    console.log('🔒 Security headers applied');
  }

  /**
   * Set Content Security Policy
   */
  private static setCSPMeta(): void {
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://cdn.gpteng.co",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://uvyoyatygljyudljxdfb.supabase.co wss://uvyoyatygljyudljxdfb.supabase.co",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "object-src 'none'"
    ];

    // Add development-specific directives
    if (this.config.developmentMode) {
      cspDirectives[1] = "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.gpteng.co";
      cspDirectives.push("connect-src 'self' ws: wss: https://uvyoyatygljyudljxdfb.supabase.co");
    }

    this.addMetaTag('Content-Security-Policy', cspDirectives.join('; '));
  }

  /**
   * Add meta tag to document head
   */
  private static addMetaTag(name: string, content: string): void {
    const existingTag = document.querySelector(`meta[http-equiv="${name}"]`);
    if (existingTag) {
      existingTag.setAttribute('content', content);
      return;
    }

    const meta = document.createElement('meta');
    meta.setAttribute('http-equiv', name);
    meta.setAttribute('content', content);
    document.head.appendChild(meta);
  }

  /**
   * Validate current page security
   */
  static validateSecurity(): { secure: boolean; issues: string[] } {
    const issues: string[] = [];

    // Check if HTTPS is being used in production
    if (!this.config.developmentMode && location.protocol !== 'https:') {
      issues.push('Site should use HTTPS in production');
    }

    // Check for CSP meta tag
    const cspTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!cspTag) {
      issues.push('Content Security Policy not found');
    }

    // Check for X-Frame-Options
    const frameOptionsTag = document.querySelector('meta[http-equiv="X-Frame-Options"]');
    if (!frameOptionsTag) {
      issues.push('X-Frame-Options not set');
    }

    return {
      secure: issues.length === 0,
      issues
    };
  }

  /**
   * Update security configuration
   */
  static updateConfig(newConfig: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.applySecurityHeaders();
  }
}
