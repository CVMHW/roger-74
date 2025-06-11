
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, RefreshCw, AlertTriangle, Star } from 'lucide-react';
import { ComprehensiveTestRunner, TestResult, SolutionRating } from '../utils/sitemap/comprehensiveTestRunner';

const ComprehensiveTestDashboard: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [solutions, setSolutions] = useState<SolutionRating[]>([]);
  const [progress, setProgress] = useState(0);

  const runTests = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults([]);
    setSummary(null);
    setSolutions([]);

    const testRunner = new ComprehensiveTestRunner();
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 1, 99));
    }, 50);

    try {
      const testResults = await testRunner.runAllTests();
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setResults(testResults.results);
      setSummary(testResults.summary);
      setSolutions(testResults.solutions);
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getSeverityColor = (passRate: number) => {
    if (passRate >= 90) return 'text-green-600';
    if (passRate >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSolutionRating = (score: number) => {
    if (score >= 8) return { color: 'bg-green-500', label: 'Excellent' };
    if (score >= 7) return { color: 'bg-blue-500', label: 'Good' };
    if (score >= 6) return { color: 'bg-yellow-500', label: 'Fair' };
    return { color: 'bg-red-500', label: 'Poor' };
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="text-orange-500" />
            Comprehensive Sitemap Test Suite (100 Tests)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center mb-4">
            <Button 
              onClick={runTests} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
              {isRunning ? 'Running Tests...' : 'Run 100 Tests'}
            </Button>
            
            {isRunning && (
              <div className="flex-1">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-gray-600 mt-1">
                  Progress: {progress}% ({Math.floor(progress)} tests completed)
                </p>
              </div>
            )}
          </div>

          {summary && (
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{summary.total}</div>
                <div className="text-sm text-gray-600">Total Tests</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{summary.passed}</div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className={`text-2xl font-bold ${getSeverityColor(summary.passRate)}`}>
                  {summary.passRate}%
                </div>
                <div className="text-sm text-gray-600">Pass Rate</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {solutions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="text-yellow-500" />
              Rated Solutions (Best to Worst)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {solutions.map((solution, index) => {
                const rating = getSolutionRating(solution.overallScore);
                return (
                  <div key={solution.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <span className="text-lg font-bold">#{index + 1}</span>
                          <Badge className={`${rating.color} text-white`}>
                            {rating.label} ({solution.overallScore})
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold">{solution.name}</h3>
                      </div>
                      <span className="text-sm text-gray-600">{solution.timeToImplement}</span>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{solution.description}</p>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Feasibility:</span>
                        <div className="flex items-center gap-1">
                          <Progress value={solution.feasibility * 10} className="flex-1 h-2" />
                          <span>{solution.feasibility}/10</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Effectiveness:</span>
                        <div className="flex items-center gap-1">
                          <Progress value={solution.effectiveness * 10} className="flex-1 h-2" />
                          <span>{solution.effectiveness}/10</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Complexity (lower is better):</span>
                        <div className="flex items-center gap-1">
                          <Progress value={(10 - solution.complexity) * 10} className="flex-1 h-2" />
                          <span>{solution.complexity}/10</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((result) => (
                <div key={result.testId} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-3">
                    {result.passed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="text-sm">
                      <strong>Test {result.testId}:</strong> {result.testName}
                    </span>
                  </div>
                  {result.error && (
                    <span className="text-xs text-red-600 max-w-md truncate">
                      {result.error}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComprehensiveTestDashboard;
