
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Search, TrendingUp, Globe } from 'lucide-react';
import SEOMonitor from './SEOMonitor';
import StaticFileDebugger from './StaticFileDebugger';
import { ComprehensiveTestRunner } from '../utils/sitemap/comprehensiveTestRunner';

interface TestResult {
  testId: number;
  testName: string;
  passed: boolean;
  error?: string;
  details?: any;
  timestamp: number;
}

interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  passRate: number;
}

const ComprehensiveTestDashboard: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testSummary, setTestSummary] = useState<TestSummary | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [seoGrade, setSeoGrade] = useState<string>('');
  const [lastTestRun, setLastTestRun] = useState<Date | null>(null);

  const runComprehensiveTests = async () => {
    setIsRunning(true);
    console.log('🚀 Starting comprehensive SEO and technical tests...');
    
    try {
      const testRunner = new ComprehensiveTestRunner();
      const results = await testRunner.runAllTests();
      
      setTestResults(results.results);
      setTestSummary(results.summary);
      setLastTestRun(new Date());
      
      // Calculate SEO Grade
      const grade = calculateSEOGrade(results.summary.passRate);
      setSeoGrade(grade);
      
      console.log('✅ Comprehensive tests completed:', results);
    } catch (error) {
      console.error('💥 Test execution failed:', error);
      setTestSummary({
        total: 0,
        passed: 0,
        failed: 1,
        passRate: 0
      });
      setSeoGrade('F');
    } finally {
      setIsRunning(false);
    }
  };

  const calculateSEOGrade = (passRate: number): string => {
    if (passRate >= 97) return 'A+';
    if (passRate >= 93) return 'A';
    if (passRate >= 90) return 'A-';
    if (passRate >= 87) return 'B+';
    if (passRate >= 83) return 'B';
    if (passRate >= 80) return 'B-';
    if (passRate >= 77) return 'C+';
    if (passRate >= 73) return 'C';
    if (passRate >= 70) return 'C-';
    if (passRate >= 67) return 'D+';
    if (passRate >= 63) return 'D';
    if (passRate >= 60) return 'D-';
    return 'F';
  };

  const getGradeColor = (grade: string): string => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-100';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100';
    if (grade.startsWith('D')) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusIcon = (passed: boolean) => {
    return passed ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <XCircle className="w-4 h-4 text-red-500" />;
  };

  useEffect(() => {
    // Auto-run tests on mount
    runComprehensiveTests();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header with Grade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="text-blue-500" />
              Healthcare IT Platform - SEO Performance Dashboard
            </div>
            {seoGrade && (
              <div className={`px-4 py-2 rounded-lg font-bold text-2xl ${getGradeColor(seoGrade)}`}>
                SEO Grade: {seoGrade}
              </div>
            )}
          </CardTitle>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {testSummary && (
                <>
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    <span className="font-semibold">Pass Rate:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {testSummary.passRate}%
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {testSummary.passed}/{testSummary.total} tests passed
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={runComprehensiveTests} disabled={isRunning} size="sm">
                <RefreshCw className={`w-4 h-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
                {isRunning ? 'Running Tests...' : 'Run All Tests'}
              </Button>
            </div>
          </div>
          {lastTestRun && (
            <p className="text-sm text-gray-600">
              Last tested: {lastTestRun.toLocaleString()}
            </p>
          )}
        </CardHeader>
      </Card>

      {/* Tabbed Interface */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Results</TabsTrigger>
          <TabsTrigger value="seo-monitor">SEO Monitor</TabsTrigger>
          <TabsTrigger value="static-files">Static Files</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {testSummary && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Tests</p>
                      <p className="text-3xl font-bold">{testSummary.total}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Passed</p>
                      <p className="text-3xl font-bold text-green-600">{testSummary.passed}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Failed</p>
                      <p className="text-3xl font-bold text-red-600">{testSummary.failed}</p>
                    </div>
                    <XCircle className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Key Improvements */}
          <Card>
            <CardHeader>
              <CardTitle>Key SEO Improvements Implemented</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">✅ Technical Fixes</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Static file routing priority implemented</li>
                    <li>• Enhanced content-type headers</li>
                    <li>• XML sitemap properly formatted</li>
                    <li>• Robots.txt optimized for healthcare IT</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">✅ Content Optimization</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Healthcare IT keywords targeted</li>
                    <li>• Structured data implementation</li>
                    <li>• Page-specific SEO optimization</li>
                    <li>• Image sitemap integration</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          {testResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Detailed Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {testResults.map((result) => (
                    <div key={result.testId} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.passed)}
                        <span className="text-sm">{result.testName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={result.passed ? 'default' : 'destructive'}>
                          {result.passed ? 'PASS' : 'FAIL'}
                        </Badge>
                        <span className="text-xs text-gray-500">#{result.testId}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="seo-monitor">
          <SEOMonitor />
        </TabsContent>

        <TabsContent value="static-files">
          <StaticFileDebugger />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveTestDashboard;
