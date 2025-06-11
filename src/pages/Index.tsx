
import React from 'react';
import Header from '../components/Header';
import ChatInterface from '../components/ChatInterface';
import WelcomeCard from '../components/WelcomeCard';
import FloatingCrisisButton from '../components/FloatingCrisisButton';
import MainFooter from '../components/MainFooter';
import { useSEO } from '../hooks/useSEO';
import { SEOManager } from '../utils/seo/seoManager';

const Index = () => {
  // Comprehensive SEO for homepage
  const seoManager = SEOManager.getInstance();
  
  useSEO({
    title: 'Healthcare IT Platform | Advanced Medical Programming & System Architecture',
    description: 'Enterprise-level healthcare information technology platform demonstrating advanced medical programming, clinical data processing, and healthcare system architecture for IT professionals.',
    keywords: [
      'healthcare IT platform',
      'medical programming',
      'clinical data processing',
      'healthcare system architecture',
      'health informatics',
      'medical software development',
      'HIPAA compliant systems',
      'clinical decision support',
      'healthcare API development',
      'medical device integration'
    ],
    ogTitle: 'Healthcare IT Platform - Advanced Medical Programming',
    ogDescription: 'Explore enterprise-level healthcare IT solutions with advanced medical programming and system architecture',
    ogImage: 'https://peersupportai.com/lovable-uploads/098e5a48-82bc-4b39-bd7c-491690a5c763.png',
    structuredData: seoManager.generateSoftwareSchema(),
    canonicalUrl: 'https://peersupportai.com/'
  });

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log('Image failed to load:', e.currentTarget.src);
    e.currentTarget.style.display = 'none';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <div className="lg:col-span-1 space-y-4">
            <WelcomeCard onImageError={handleImageError} />
          </div>
          <div className="lg:col-span-2 min-h-[600px]">
            <div className="h-full">
              <ChatInterface />
            </div>
          </div>
        </div>
      </main>
      <FloatingCrisisButton />
      <MainFooter onImageError={handleImageError} />
    </div>
  );
};

export default Index;
