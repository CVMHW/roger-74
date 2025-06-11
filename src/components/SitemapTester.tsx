
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, RefreshCw, Globe, FileText } from 'lucide-react';
import AutomatedSitemapManager from '../utils/sitemap/automatedSitemapManager';
import { SitemapValidator } from '../utils/sitemap/sitemapValidator';

const SitemapTester: React.FC = () => {
  const [testResults, setTestResults] = useState<{
    sitemap: { accessible: boolean; status?: number; error?: string };
    robots: { accessible: boolean; status?: number; error?: string };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const runSitemapTest = async () => {
    setIsLoading(true);
    try {
      const validator = SitemapValidator.getInstance();
      const results = await validator.validateSitemapAccessibility(window.location.origin);
      setTestResults(results);
      setLastChecked(new Date());
    } catch (error) {
      console.error('Error testing sitemap:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const runAutomatedFix = async () => {
    setIsLoading(true);
    try {
      const manager = AutomatedSitemapManager.getInstance();
      const result = await manager.generateAndValidateSitemaps();
      console.log('Automated fix result:', result);
      
      // Re-test after fix attempt
      await runSitemapTest();
    } catch (error) {
      console.error('Error running automated fix:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Auto-run test on component mount
    runSitemapTest();
  }, []);

  const getStatusBadge = (accessible: boolean, status?: number) => {
    if (accessible) {
      return <Badge variant="default" className="bg-green-500"><CheckCircle size={12} className="mr-1" />Accessible</Badge>;
    } else {
      return <Badge variant="destructive"><XCircle size={12} className="mr-1" />Failed {status && `(${status})`}</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe size={20} />
          Automated Sitemap Tester
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={runSitemapTest} disabled={isLoading} size="sm">
            <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Test Sitemap
          </Button>
          <Button onClick={runAutomatedFix} disabled={isLoading} variant="outline" size="sm">
            <FileText size={16} className="mr-2" />
            Auto-Fix & Test
          </Button>
        </div>

        {lastChecked && (
          <p className="text-sm text-gray-600">
            Last checked: {lastChecked.toLocaleTimeString()}
          </p>
        )}

        {testResults && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <FileText size={16} />
                <span className="font-medium">sitemap.xml</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(testResults.sitemap.accessible, testResults.sitemap.status)}
                {testResults.sitemap.error && (
                  <span className="text-sm text-red-600">{testResults.sitemap.error}</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <FileText size={16} />
                <span className="font-medium">robots.txt</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(testResults.robots.accessible, testResults.robots.status)}
                {testResults.robots.error && (
                  <span className="text-sm text-red-600">{testResults.robots.error}</span>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Testing Instructions:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Current test checks local development server</li>
            <li>• For production: Deploy and test https://yourdomain.com/sitemap.xml</li>
            <li>• Submit to Google Search Console for indexing</li>
            <li>• Monitor with automated health checks</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SitemapTester;
