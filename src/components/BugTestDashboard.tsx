
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw, Bug } from 'lucide-react';
import { bugTester, BugTester } from '../utils/testing/bugTester';

interface SystemHealthReport {
  overallHealth: 'healthy' | 'warning' | 'critical';
  passedTests: number;
  totalTests: number;
  criticalIssues: any[];
  warnings: any[];
  results: any[];
}

const BugTestDashboard: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [report, setReport] = useState<SystemHealthReport | null>(null);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  useEffect(() => {
    // Auto-run tests on component mount
    runTests();
  }, []);

  const runTests = async () => {
    setIsRunning(true);
    try {
      console.log('🔍 Running comprehensive bug tests...');
      const testResults = await bugTester.runComprehensiveTests();
      setReport(testResults);
      setLastRun(new Date());
      console.log('✅ Bug testing completed', testResults);
    } catch (error) {
      console.error('❌ Bug testing failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (!report && !isRunning) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Bug className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <p>No test results available. Click "Run Tests" to start.</p>
          <Button onClick={runTests} className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Run Bug Tests
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bug className="h-6 w-6" />
              Bug Testing Dashboard
            </div>
            <Button onClick={runTests} disabled={isRunning} size="sm">
              <RefreshCw className={`mr-2 h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
              {isRunning ? 'Running...' : 'Run Tests'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lastRun && (
            <p className="text-sm text-gray-600 mb-4">
              Last run: {lastRun.toLocaleString()}
            </p>
          )}
          
          {isRunning && (
            <div className="text-center py-8">
              <RefreshCw className="mx-auto h-8 w-8 animate-spin text-blue-500 mb-4" />
              <p>Running comprehensive bug tests...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Health Overview */}
      {report && (
        <Card>
          <CardHeader>
            <CardTitle>System Health Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className={`text-center p-4 rounded-lg ${getHealthColor(report.overallHealth)}`}>
                <div className="text-2xl font-bold capitalize">{report.overallHealth}</div>
                <div className="text-sm">Overall Health</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{report.passedTests}</div>
                <div className="text-sm text-gray-600">Passed Tests</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{report.criticalIssues.length}</div>
                <div className="text-sm text-gray-600">Critical Issues</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{report.warnings.length}</div>
                <div className="text-sm text-gray-600">Warnings</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(report.passedTests / report.totalTests) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 text-center">
              {report.passedTests} of {report.totalTests} tests passed ({Math.round((report.passedTests / report.totalTests) * 100)}%)
            </p>
          </CardContent>
        </Card>
      )}

      {/* Critical Issues */}
      {report && report.criticalIssues.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Critical Issues ({report.criticalIssues.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {report.criticalIssues.map((issue, index) => (
                <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-red-800">{issue.testName}</h4>
                    <Badge className="bg-red-500 text-white">Critical</Badge>
                  </div>
                  <p className="text-red-700 text-sm mb-2">{issue.description}</p>
                  {issue.error && (
                    <p className="text-red-600 text-xs font-mono bg-red-100 p-2 rounded">
                      {issue.error}
                    </p>
                  )}
                  {issue.recommendation && (
                    <p className="text-red-800 text-sm mt-2">
                      <strong>Recommendation:</strong> {issue.recommendation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Results */}
      {report && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {report.results.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    {result.passed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <span className="font-medium">{result.testName}</span>
                      <p className="text-sm text-gray-600">{result.description}</p>
                    </div>
                  </div>
                  <Badge className={`${getSeverityColor(result.severity)} text-white`}>
                    {result.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BugTestDashboard;
