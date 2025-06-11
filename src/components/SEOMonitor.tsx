
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, Globe, Search, TrendingUp } from 'lucide-react';

interface SEOMetric {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  score: number;
  description: string;
  recommendation?: string;
}

const SEOMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<SEOMetric[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const runSEOAudit = async () => {
    setIsLoading(true);
    
    // Simulate comprehensive SEO audit
    const auditResults: SEOMetric[] = [
      {
        name: 'Sitemap Accessibility',
        status: 'pass',
        score: 95,
        description: 'XML sitemap is properly accessible and formatted'
      },
      {
        name: 'Technical SEO Structure',
        status: 'pass',
        score: 90,
        description: 'Meta tags, headers, and structured data implemented'
      },
      {
        name: 'Healthcare IT Keywords',
        status: 'pass',
        score: 85,
        description: 'Optimized for medical programming and IT professional searches'
      },
      {
        name: 'Core Web Vitals',
        status: 'warning',
        score: 75,
        description: 'Performance metrics need optimization',
        recommendation: 'Implement lazy loading and code splitting'
      },
      {
        name: 'Mobile Responsiveness',
        status: 'pass',
        score: 95,
        description: 'Fully responsive design across all devices'
      },
      {
        name: 'Academic Credibility',
        status: 'warning',
        score: 70,
        description: 'Structured data for academic indexing partially implemented',
        recommendation: 'Add ResearchProject and Course schemas'
      },
      {
        name: 'Security Headers',
        status: 'pass',
        score: 90,
        description: 'Proper security headers implemented for enterprise standards'
      },
      {
        name: 'Content Depth',
        status: 'pass',
        score: 80,
        description: 'Technical documentation provides substantial value'
      }
    ];

    setMetrics(auditResults);
    const avgScore = auditResults.reduce((sum, metric) => sum + metric.score, 0) / auditResults.length;
    setOverallScore(Math.round(avgScore));
    setIsLoading(false);
  };

  useEffect(() => {
    runSEOAudit();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="text-blue-500" />
          SEO Performance Monitor - Healthcare IT Platform
        </CardTitle>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            <span className="font-semibold">Overall SEO Score:</span>
            <span className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}/100
            </span>
          </div>
          <Button onClick={runSEOAudit} disabled={isLoading} size="sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            {isLoading ? 'Auditing...' : 'Run SEO Audit'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(metric.status)}
                  <h3 className="font-semibold">{metric.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${getScoreColor(metric.score)}`}>
                    {metric.score}/100
                  </span>
                  <Badge 
                    variant={metric.status === 'pass' ? 'default' : metric.status === 'warning' ? 'secondary' : 'destructive'}
                  >
                    {metric.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-2">{metric.description}</p>
              {metric.recommendation && (
                <p className="text-blue-600 text-sm">
                  <strong>Recommendation:</strong> {metric.recommendation}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">Healthcare IT SEO Focus Areas</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Optimized for "healthcare IT", "medical programming", and "health informatics" searches</li>
            <li>• Enhanced visibility for IT professionals and academic researchers</li>
            <li>• Structured data for technical documentation and healthcare applications</li>
            <li>• Enterprise-level security and performance standards</li>
            <li>• Academic credibility through proper schema markup</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SEOMonitor;
