import { useEffect } from 'react';
import { SEOManager, SEOConfig } from '../utils/seo/seoManager';

export const useSEO = (config: SEOConfig) => {
  // Defensive useEffect with error handling
  try {
    useEffect(() => {
      try {
        const seoManager = SEOManager.getInstance();
        seoManager.updatePageSEO(config);
      } catch (seoError) {
        console.warn('SEO update failed:', seoError);
      }
      
      // Cleanup function to reset meta tags when component unmounts
      return () => {
        // Keep core SEO tags but reset page-specific ones
      };
    }, [config]);
  } catch (hookError) {
    console.warn('SEO hook failed to initialize:', hookError);
  }
};

// Hook for technical documentation pages
export const useTechnicalSEO = (title: string, description: string, keywords: string[] = []) => {
  try {
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
  } catch (error) {
    console.warn('Technical SEO initialization failed:', error);
  }
};
