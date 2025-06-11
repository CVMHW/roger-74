
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, RefreshCw, AlertTriangle, Zap, FileText } from 'lucide-react';
import { StaticFileVerifier } from '../utils/sitemap/staticFileVerifier';

const StaticFileDebugger: React.FC = () => {
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const runStaticFileTest = async () => {
    setIsRunning(true);
    console.log('🚀 Running static file accessibility test...');
    
    try {
      const verifier = StaticFileVerifier.getInstance();
      const results = await verifier.runComprehensiveStaticFileTest();
      setTestResults(results);
      setLastCheck(new Date());
      console.log('✅ Static file test completed:', results);
    } catch (error) {
      console.error('💥 Static file test failed:', error);
      setTestResults({
        sitemap: { accessible: false, error: 'Test execution failed' },
        robots: { accessible: false, error: 'Test execution failed' },
        analysis: ['❌ Test execution failed - check console for details']
      });
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    // Auto-run on mount
    runStaticFileTest();
  }, []);

  const getStatusBadge = (accessible: boolean, error?: string) => {
    if (accessible) {
      return <Badge className="bg-green-500 text-white"><CheckCircle size={12} className="mr-1" />Accessible</Badge>;
    } else {
      return <Badge variant="destructive"><XCircle size={12} className="mr-1" />Failed</Badge>;
    }
  };

  const openSitemapInNewTab = () => {
    window.open('/sitemap.xml', '_blank');
  };

  const openRobotsInNewTab = () => {
    window.open('/robots.txt', '_blank');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="text-red-500" />
          Static File Accessibility Debugger
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-3">
          <Button onClick={runStaticFileTest} disabled={isRunning} size="sm">
            <RefreshCw size={16} className={`mr-2 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Testing...' : 'Test Static Files'}
          </Button>
          <Button onClick={openSitemapInNewTab} variant="outline" size="sm">
            <FileText size={16} className="mr-2" />
            Open Sitemap.xml
          </Button>
          <Button onClick={openRobotsInNewTab} variant="outline" size="sm">
            <FileText size={16} className="mr-2" />
            Open Robots.txt
          </Button>
        </div>

        {lastCheck && (
          <p className="text-sm text-gray-600">
            Last checked: {lastCheck.toLocaleTimeString()}
          </p>
        )}

        {testResults && (
          <div className="space-y-4">
            {/* File Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">sitemap.xml</h3>
                  {getStatusBadge(testResults.sitemap.accessible)}
                </div>
                {testResults.sitemap.contentType && (
                  <p className="text-sm text-gray-600">Content-Type: {testResults.sitemap.contentType}</p>
                )}
                {testResults.sitemap.status && (
                  <p className="text-sm text-gray-600">Status: {testResults.sitemap.status}</p>
                )}
                {testResults.sitemap.error && (
                  <p className="text-sm text-red-600">Error: {testResults.sitemap.error}</p>
                )}
                {testResults.sitemap.content && (
                  <details className="mt-2">
                    <summary className="text-sm cursor-pointer">View Content Preview</summary>
                    <pre className="text-xs bg-gray-100 p-2 mt-1 rounded max-h-32 overflow-y-auto">
                      {testResults.sitemap.content.substring(0, 500)}...
                    </pre>
                  </details>
                )}
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">robots.txt</h3>
                  {getStatusBadge(testResults.robots.accessible)}
                </div>
                {testResults.robots.contentType && (
                  <p className="text-sm text-gray-600">Content-Type: {testResults.robots.contentType}</p>
                )}
                {testResults.robots.status && (
                  <p className="text-sm text-gray-600">Status: {testResults.robots.status}</p>
                )}
                {testResults.robots.error && (
                  <p className="text-sm text-red-600">Error: {testResults.robots.error}</p>
                )}
              </div>
            </div>

            {/* Analysis */}
            {testResults.analysis && testResults.analysis.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  Analysis & Recommendations
                </h4>
                <ul className="space-y-1">
                  {testResults.analysis.map((item: string, index: number) => (
                    <li key={index} className="text-sm text-yellow-700">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick Fix Recommendations */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Quick Test Methods</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="font-medium">Direct URL Test:</p>
                  <code className="text-xs bg-blue-100 px-1 rounded">https://peersupportai.com/sitemap.xml</code>
                </div>
                <div>
                  <p className="font-medium">Browser DevTools:</p>
                  <code className="text-xs bg-blue-100 px-1 rounded">Network tab → Clear → Reload</code>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StaticFileDebugger;
