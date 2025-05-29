
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUnifiedRoger } from '../hooks/useUnifiedRoger';
import RogerSystemFlowChart from './RogerSystemFlowChart';

export const UnifiedRogerDashboard = () => {
  const {
    processMessage,
    isProcessing,
    getSystemStatus,
    resetConversation,
    getConversationHistory,
    getSessionMetrics
  } = useUnifiedRoger();

  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [testInput, setTestInput] = useState('');
  const [lastResponse, setLastResponse] = useState<any>(null);
  const conversationHistory = getConversationHistory();
  const sessionMetrics = getSessionMetrics();

  // Load system status
  useEffect(() => {
    const loadStatus = async () => {
      const status = await getSystemStatus();
      setSystemStatus(status);
    };
    loadStatus();
    
    const interval = setInterval(loadStatus, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [getSystemStatus]);

  const handleTestMessage = async () => {
    if (!testInput.trim()) return;
    
    const response = await processMessage(testInput);
    setLastResponse(response);
    setTestInput('');
  };

  const handleReset = async () => {
    await resetConversation();
    setLastResponse(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">
          Roger's Unified Architecture Dashboard
        </h1>
        <p className="text-gray-600">
          Monitoring and testing the integrated therapeutic AI system
        </p>
      </div>

      {/* System Flowchart */}
      <RogerSystemFlowChart />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              System Status
              <Badge variant={systemStatus?.unified?.health?.healthy ? 'default' : 'destructive'}>
                {systemStatus?.unified?.health?.healthy ? 'Healthy' : 'Issues Detected'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {systemStatus ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Architecture Status</h4>
                  <div className="text-sm space-y-1">
                    <div>Initialized: {systemStatus.architecture?.initialized ? '✅' : '❌'}</div>
                    <div>Total Requests: {systemStatus.architecture?.stats?.totalRequests || 0}</div>
                    <div>Avg Processing Time: {Math.round(systemStatus.architecture?.stats?.averageProcessingTime || 0)}ms</div>
                    <div>Avg Confidence: {(systemStatus.architecture?.stats?.averageConfidence || 0).toFixed(2)}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Memory Systems</h4>
                  <div className="text-sm space-y-1">
                    <div>Working: {systemStatus.memory?.unified?.layers?.working || 0}</div>
                    <div>Short-term: {systemStatus.memory?.unified?.layers?.shortTerm || 0}</div>
                    <div>Long-term: {systemStatus.memory?.unified?.layers?.longTerm || 0}</div>
                    <div>Educational: {systemStatus.memory?.unified?.layers?.educational || 0}</div>
                    <div>Legacy Messages: {systemStatus.memory?.legacy?.messageCount || 0}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">System Engagement</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(systemStatus.architecture?.systemEngagement || {}).map(([system, count]) => (
                      <Badge key={system} variant="outline" className="text-xs">
                        {system}: {count as number}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>Loading system status...</div>
            )}
          </CardContent>
        </Card>

        {/* Session Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Current Session Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Session Overview</h4>
                <div className="text-sm space-y-1">
                  <div>Total Messages: {sessionMetrics.totalMessages}</div>
                  <div>Average Confidence: {sessionMetrics.averageConfidence.toFixed(2)}</div>
                  <div>Total Processing Time: {sessionMetrics.processingTime}ms</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Systems Used</h4>
                <div className="flex flex-wrap gap-2">
                  {sessionMetrics.systemsUsed.map((system, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {system}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Conversation History</h4>
                <div className="text-xs text-gray-600">
                  {conversationHistory.length} total exchanges
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Interface */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Test Unified Roger</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  placeholder="Enter a test message for Roger..."
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                  onKeyPress={(e) => e.key === 'Enter' && handleTestMessage()}
                />
                <Button 
                  onClick={handleTestMessage} 
                  disabled={isProcessing || !testInput.trim()}
                >
                  {isProcessing ? 'Processing...' : 'Send'}
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              </div>
              
              {lastResponse && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="mb-2">
                    <Badge variant="default">Roger's Response</Badge>
                    <Badge variant="outline" className="ml-2">
                      Confidence: {((lastResponse.metadata?.confidence || 0) * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  <div className="text-sm mb-3">{lastResponse.text}</div>
                  
                  {lastResponse.metadata && (
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>Processing Time: {lastResponse.metadata.processingTime}ms</div>
                      <div>Systems Engaged: {lastResponse.metadata.systemsEngaged?.join(', ') || 'None'}</div>
                      <div>Memory Layers: {lastResponse.metadata.memoryLayers?.join(', ') || 'None'}</div>
                      <div>RAG Enhanced: {lastResponse.metadata.ragEnhanced ? 'Yes' : 'No'}</div>
                      <div>Crisis Detected: {lastResponse.metadata.crisisDetected ? 'Yes' : 'No'}</div>
                      <div>Evaluation Score: {lastResponse.metadata.evaluationScore?.toFixed(2) || 'N/A'}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UnifiedRogerDashboard;
