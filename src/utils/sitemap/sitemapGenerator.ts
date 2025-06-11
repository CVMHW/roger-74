
export interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
  images?: Array<{
    loc: string;
    title: string;
    caption: string;
    geo_location?: string;
  }>;
}

export const generateSitemapXML = (entries: SitemapEntry[]): string => {
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;
  
  const xmlFooter = `\n</urlset>`;
  
  const urlEntries = entries.map(entry => {
    let urlXml = `  
  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>`;
    
    if (entry.images && entry.images.length > 0) {
      entry.images.forEach(image => {
        urlXml += `
    <image:image>
      <image:loc>${image.loc}</image:loc>
      <image:title>${image.title}</image:title>
      <image:caption>${image.caption}</image:caption>`;
        if (image.geo_location) {
          urlXml += `
      <image:geo_location>${image.geo_location}</image:geo_location>`;
        }
        urlXml += `
    </image:image>`;
      });
    }
    
    urlXml += `
  </url>`;
    
    return urlXml;
  }).join('');
  
  return xmlHeader + urlEntries + xmlFooter;
};

export const validateSitemapXML = (xmlContent: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check basic XML structure
  if (!xmlContent.includes('<?xml version="1.0"')) {
    errors.push('Missing XML declaration');
  }
  
  if (!xmlContent.includes('<urlset')) {
    errors.push('Missing urlset element');
  }
  
  if (!xmlContent.includes('</urlset>')) {
    errors.push('Missing closing urlset tag');
  }
  
  // Check for required namespaces
  if (!xmlContent.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
    errors.push('Missing required sitemap namespace');
  }
  
  // Check URL structure
  const urlMatches = xmlContent.match(/<url>/g);
  const urlCloseMatches = xmlContent.match(/<\/url>/g);
  
  if (urlMatches && urlCloseMatches) {
    if (urlMatches.length !== urlCloseMatches.length) {
      errors.push('Mismatched URL tags');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
