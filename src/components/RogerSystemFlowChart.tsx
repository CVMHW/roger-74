
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const RogerSystemFlowChart = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-blue-800">
            Roger's Unified Processing Pipeline
          </CardTitle>
          <p className="text-center text-gray-600">
            Comprehensive Integration of Legacy & Advanced Systems
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            
            {/* Input Layer */}
            <div className="text-center">
              <div className="inline-block bg-green-100 border-2 border-green-500 rounded-lg p-4 font-semibold">
                Patient Input
              </div>
              <div className="mt-2 text-sm text-gray-600">User message arrives</div>
            </div>

            {/* Crisis Detection Layer */}
            <div className="flex justify-center">
              <div className="bg-red-100 border-2 border-red-500 rounded-lg p-4 max-w-md text-center">
                <div className="font-semibold text-red-800">🚨 Crisis Detection Layer</div>
                <div className="text-sm mt-2">
                  • Refined Crisis Detection<br/>
                  • Safety Concern Processing<br/>
                  • Emergency Response Coordination
                </div>
              </div>
            </div>

            {/* Core Processing Engine */}
            <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
              <div className="text-center font-bold text-blue-800 mb-4">
                Unified Core Processing Engine
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Memory Systems */}
                <div className="bg-purple-100 border border-purple-300 rounded-lg p-3">
                  <div className="font-semibold text-purple-800 mb-2">Memory Systems</div>
                  <div className="text-xs space-y-1">
                    <div>• Working Memory</div>
                    <div>• Short-term Memory</div>
                    <div>• Long-term Memory</div>
                    <div>• Conversation Memory</div>
                    <div>• Educational Memory</div>
                    <div>• 5-Response Memory</div>
                  </div>
                </div>

                {/* RAG Systems */}
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3">
                  <div className="font-semibold text-yellow-800 mb-2">RAG Systems</div>
                  <div className="text-xs space-y-1">
                    <div>• Vector Database</div>
                    <div>• Semantic Chunking</div>
                    <div>• Advanced Reranking</div>
                    <div>• Hybrid Search</div>
                    <div>• Context Integration</div>
                  </div>
                </div>

                {/* Personality & Processing */}
                <div className="bg-orange-100 border border-orange-300 rounded-lg p-3">
                  <div className="font-semibold text-orange-800 mb-2">Personality & Processing</div>
                  <div className="text-xs space-y-1">
                    <div>• Rogerian Personality</div>
                    <div>• Emotion Detection</div>
                    <div>• Nervous System Integration</div>
                    <div>• Adaptive Response</div>
                    <div>• Rules Enforcement</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Evaluation & Feedback Layer */}
            <div className="flex justify-center space-x-4">
              <div className="bg-teal-100 border border-teal-300 rounded-lg p-3 text-center">
                <div className="font-semibold text-teal-800">Evaluation Framework</div>
                <div className="text-xs mt-1">Quality Assessment</div>
              </div>
              <div className="bg-indigo-100 border border-indigo-300 rounded-lg p-3 text-center">
                <div className="font-semibold text-indigo-800">Feedback System</div>
                <div className="text-xs mt-1">Continuous Improvement</div>
              </div>
            </div>

            {/* Output Layer */}
            <div className="text-center">
              <div className="inline-block bg-green-100 border-2 border-green-500 rounded-lg p-4 font-semibold">
                Enhanced Roger Response
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Empathetic, contextual, and therapeutically appropriate
              </div>
            </div>

            {/* Legacy Integration Note */}
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-center">
              <div className="font-semibold text-gray-800">Legacy System Integration</div>
              <div className="text-sm text-gray-600 mt-2">
                All existing hooks, processors, and components are preserved and enhanced
                through the unified pipeline while maintaining backward compatibility
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RogerSystemFlowChart;
