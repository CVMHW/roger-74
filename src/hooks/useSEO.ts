import { useEffect } from 'react';
import { SEOManager, SEOConfig } from '../utils/seo/seoManager';

export const useSEO = (config: SEOConfig) => {
  useEffect(() => {
    const seoManager = SEOManager.getInstance();
    seoManager.updatePageSEO(config);
    
    // Cleanup function to reset meta tags when component unmounts
    return () => {
      // Keep core SEO tags but reset page-specific ones
    };
  }, [config]);
};

// Hook for technical documentation pages
export const useTechnicalSEO = (title: string, description: string, keywords: string[] = []) => {
  const seoManager = SEOManager.getInstance();
  
  const config: SEOConfig = {
    title: `${title} | Healthcare IT Platform`,
    description,
    keywords: [
      ...keywords,
      'healthcare IT documentation',
      'medical programming guide',
      'clinical system architecture',
      'health informatics tutorial'
    ],
    structuredData: seoManager.generateTechnicalArticleSchema(title, description),
    canonicalUrl: window.location.href
  };
  
  useSEO(config);
};
