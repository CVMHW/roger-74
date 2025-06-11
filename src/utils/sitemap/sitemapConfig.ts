
import { SitemapEntry } from './sitemapGenerator';

export const DOMAIN = 'https://peersupportai.com';

export const getSitemapEntries = (): SitemapEntry[] => {
  const currentDate = new Date().toISOString();
  
  return [
    {
      loc: `${DOMAIN}/`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '1.0',
      images: [
        {
          loc: `${DOMAIN}/lovable-uploads/098e5a48-82bc-4b39-bd7c-491690a5c763.png`,
          title: 'CVMHW Logo - Cuyahoga Valley Mindful Health and Wellness',
          caption: 'Logo for Cuyahoga Valley Mindful Health and Wellness, providing mental health services in Cleveland and surrounding Ohio areas',
          geo_location: 'Cleveland, OH'
        }
      ]
    },
    {
      loc: `${DOMAIN}/flowchart`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      loc: `${DOMAIN}/unified-flowchart`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      loc: `${DOMAIN}/conversation-processing`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.6'
    },
    {
      loc: `${DOMAIN}/mobile-desktop-analysis`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.5'
    },
    {
      loc: `${DOMAIN}/wrapping-hell-analysis`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.5'
    },
    {
      loc: `${DOMAIN}/test-dashboard`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.4'
    }
  ];
};
