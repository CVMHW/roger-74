
/**
 * SEO Manager - Comprehensive SEO optimization for Healthcare IT Platform
 * Optimized for Master's in IT with Medical Programming emphasis
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  structuredData?: any;
  canonicalUrl?: string;
}

export class SEOManager {
  private static instance: SEOManager;
  
  public static getInstance(): SEOManager {
    if (!SEOManager.instance) {
      SEOManager.instance = new SEOManager();
    }
    return SEOManager.instance;
  }

  // Core IT and Medical Programming Keywords
  private readonly coreKeywords = [
    'healthcare IT platform',
    'medical programming',
    'clinical data processing',
    'healthcare system architecture',
    'medical software development',
    'health informatics',
    'clinical decision support',
    'healthcare API development',
    'medical data integration',
    'healthcare cybersecurity',
    'HIPAA compliant systems',
    'electronic health records',
    'telemedicine platform',
    'clinical workflow automation',
    'healthcare database design',
    'medical AI implementation',
    'healthcare DevOps',
    'clinical research tools',
    'healthcare analytics platform',
    'medical device integration'
  ];

  updatePageSEO(config: SEOConfig): void {
    // Update title
    document.title = config.title;
    
    // Update meta description
    this.updateMetaTag('description', config.description);
    
    // Update keywords
    const allKeywords = [...this.coreKeywords, ...config.keywords].join(', ');
    this.updateMetaTag('keywords', allKeywords);
    
    // Update Open Graph tags
    this.updateMetaProperty('og:title', config.ogTitle || config.title);
    this.updateMetaProperty('og:description', config.ogDescription || config.description);
    this.updateMetaProperty('og:type', 'website');
    this.updateMetaProperty('og:url', config.canonicalUrl || window.location.href);
    
    if (config.ogImage) {
      this.updateMetaProperty('og:image', config.ogImage);
    }
    
    // Update Twitter Card tags
    this.updateMetaName('twitter:card', 'summary_large_image');
    this.updateMetaName('twitter:title', config.ogTitle || config.title);
    this.updateMetaName('twitter:description', config.ogDescription || config.description);
    
    // Update canonical URL
    if (config.canonicalUrl) {
      this.updateCanonicalUrl(config.canonicalUrl);
    }
    
    // Add structured data
    if (config.structuredData) {
      this.addStructuredData(config.structuredData);
    }
  }

  private updateMetaTag(name: string, content: string): void {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }

  private updateMetaProperty(property: string, content: string): void {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }

  private updateMetaName(name: string, content: string): void {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }

  private updateCanonicalUrl(url: string): void {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private addStructuredData(data: any): void {
    // Remove existing structured data
    const existing = document.querySelector('script[type="application/ld+json"]');
    if (existing) {
      existing.remove();
    }
    
    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  // Generate technical article structured data
  generateTechnicalArticleSchema(title: string, description: string, author: string = 'CVMHW IT Team'): any {
    return {
      "@context": "https://schema.org",
      "@type": "TechnicalArticle",
      "headline": title,
      "description": description,
      "author": {
        "@type": "Organization",
        "name": author
      },
      "publisher": {
        "@type": "Organization",
        "name": "Cuyahoga Valley Mindful Health and Wellness",
        "logo": {
          "@type": "ImageObject",
          "url": "https://peersupportai.com/lovable-uploads/098e5a48-82bc-4b39-bd7c-491690a5c763.png"
        }
      },
      "datePublished": new Date().toISOString(),
      "dateModified": new Date().toISOString(),
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": window.location.href
      },
      "keywords": this.coreKeywords.slice(0, 10).join(', ')
    };
  }

  // Generate software application schema
  generateSoftwareSchema(): any {
    return {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Healthcare IT Platform",
      "description": "Advanced healthcare information technology platform demonstrating enterprise-level medical programming and system architecture",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "creator": {
        "@type": "Organization",
        "name": "Cuyahoga Valley Mindful Health and Wellness"
      },
      "keywords": this.coreKeywords.join(', ')
    };
  }
}
