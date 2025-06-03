
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Monitor, ArrowRight, ArrowDown, CheckCircle, XCircle } from 'lucide-react';

const MobileDesktopAestheticFlowchart = () => {
  return (
    <div className="p-4 max-w-6xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          Roger Mobile vs Desktop Aesthetic Analysis
        </h1>
        <p className="text-blue-700">
          Visual decision tree for responsive design optimization
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Desktop Version - Current State */}
        <Card className="border-2 border-green-500 shadow-lg">
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Monitor size={24} />
              Desktop Version (✅ Working)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-700">Header Layout:</h4>
              <ul className="text-sm space-y-1 text-green-600">
                <li>• Full navigation bar with all buttons visible</li>
                <li>• Adequate spacing between elements</li>
                <li>• Logo and branding properly sized</li>
                <li>• Crisis resources button accessible</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-green-700">Chat Interface:</h4>
              <ul className="text-sm space-y-1 text-green-600">
                <li>• Proper message bubble sizing</li>
                <li>• Good text readability</li>
                <li>• Adequate padding and margins</li>
                <li>• Profile bubbles well-positioned</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-green-700">Input Area:</h4>
              <ul className="text-sm space-y-1 text-green-600">
                <li>• Send button properly sized</li>
                <li>• Character count visible</li>
                <li>• Disclaimer text readable</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Version - Current Issues */}
        <Card className="border-2 border-red-500 shadow-lg">
          <CardHeader className="bg-red-50">
            <CardTitle className="flex items-center gap-2 text-red-800">
              <Smartphone size={24} />
              Mobile Version (❌ Issues)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-semibold text-red-700">Header Problems:</h4>
              <ul className="text-sm space-y-1 text-red-600">
                <li>• Buttons flowing off screen edge</li>
                <li>• Navigation elements overlapping</li>
                <li>• Logo/branding too large</li>
                <li>• Crisis button not properly positioned</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-red-700">Layout Issues:</h4>
              <ul className="text-sm space-y-1 text-red-600">
                <li>• Text wrapping poorly</li>
                <li>• Inadequate touch targets</li>
                <li>• Poor spacing/padding</li>
                <li>• Elements cut off at edges</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-red-700">User Experience:</h4>
              <ul className="text-sm space-y-1 text-red-600">
                <li>• Difficult to interact with</li>
                <li>• Poor visual hierarchy</li>
                <li>• Cluttered appearance</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Decision Flow */}
      <div className="space-y-6">
        <Card className="border-2 border-blue-500">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-800 text-center">
              Mobile Optimization Decision Flow
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              
              {/* Step 1 */}
              <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 w-full max-w-md text-center">
                <h3 className="font-bold text-yellow-800">Screen Size Detection</h3>
                <p className="text-sm text-yellow-700">Is viewport width < 768px?</p>
              </div>
              
              <ArrowDown className="text-blue-600" size={24} />
              
              {/* Branch */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                
                {/* Mobile Path */}
                <div className="space-y-3">
                  <div className="bg-orange-100 border-2 border-orange-400 rounded-lg p-4 text-center">
                    <h4 className="font-bold text-orange-800">Mobile Layout</h4>
                    <p className="text-xs text-orange-700">Apply mobile-specific styles</p>
                  </div>
                  
                  <ArrowDown className="text-orange-600 mx-auto" size={20} />
                  
                  <div className="space-y-2">
                    <div className="bg-green-100 border border-green-400 rounded p-2 text-xs">
                      <strong>Header:</strong> Hamburger menu, compact logo
                    </div>
                    <div className="bg-green-100 border border-green-400 rounded p-2 text-xs">
                      <strong>Buttons:</strong> Stack vertically, larger touch targets
                    </div>
                    <div className="bg-green-100 border border-green-400 rounded p-2 text-xs">
                      <strong>Chat:</strong> Full-width bubbles, larger text
                    </div>
                    <div className="bg-green-100 border border-green-400 rounded p-2 text-xs">
                      <strong>Input:</strong> Optimized keyboard, larger send button
                    </div>
                  </div>
                </div>
                
                {/* Desktop Path */}
                <div className="space-y-3">
                  <div className="bg-blue-100 border-2 border-blue-400 rounded-lg p-4 text-center">
                    <h4 className="font-bold text-blue-800">Desktop Layout</h4>
                    <p className="text-xs text-blue-700">Keep existing styles</p>
                  </div>
                  
                  <ArrowDown className="text-blue-600 mx-auto" size={20} />
                  
                  <div className="space-y-2">
                    <div className="bg-blue-100 border border-blue-400 rounded p-2 text-xs">
                      <strong>Header:</strong> Full navigation bar
                    </div>
                    <div className="bg-blue-100 border border-blue-400 rounded p-2 text-xs">
                      <strong>Buttons:</strong> Horizontal layout
                    </div>
                    <div className="bg-blue-100 border border-blue-400 rounded p-2 text-xs">
                      <strong>Chat:</strong> Constrained width
                    </div>
                    <div className="bg-blue-100 border border-blue-400 rounded p-2 text-xs">
                      <strong>Input:</strong> Standard sizing
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Implementation Strategy */}
        <Card className="border-2 border-purple-500">
          <CardHeader className="bg-purple-50">
            <CardTitle className="text-purple-800">
              Implementation Strategy for Roger Mobile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-700 flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Priority 1: Header
                </h4>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• Implement responsive navigation</li>
                  <li>• Add hamburger menu for mobile</li>
                  <li>• Optimize button placement</li>
                  <li>• Ensure nothing overflows</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-700 flex items-center gap-2">
                  <CheckCircle size={16} className="text-yellow-600" />
                  Priority 2: Layout
                </h4>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• Adjust chat container sizing</li>
                  <li>• Improve message spacing</li>
                  <li>• Optimize touch targets</li>
                  <li>• Fix text wrapping</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-700 flex items-center gap-2">
                  <CheckCircle size={16} className="text-blue-600" />
                  Priority 3: Polish
                </h4>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• Fine-tune animations</li>
                  <li>• Improve visual hierarchy</li>
                  <li>• Optimize loading states</li>
                  <li>• Test on real devices</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Approach */}
        <Card className="border-2 border-indigo-500">
          <CardHeader className="bg-indigo-50">
            <CardTitle className="text-indigo-800">
              Technical Implementation Approach
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">CSS Strategy:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Tailwind Responsive Classes:</strong>
                    <ul className="mt-1 space-y-1 text-gray-600">
                      <li>• Use sm:, md:, lg: prefixes</li>
                      <li>• Mobile-first approach</li>
                      <li>• Conditional class application</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Component Logic:</strong>
                    <ul className="mt-1 space-y-1 text-gray-600">
                      <li>• useIsMobile hook for detection</li>
                      <li>• Conditional rendering</li>
                      <li>• Separate mobile components</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Files to Modify:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <ul className="space-y-1 text-blue-700">
                      <li>• Header.tsx (navigation)</li>
                      <li>• ChatContainer.tsx (layout)</li>
                      <li>• MessageInput.tsx (input area)</li>
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-1 text-blue-700">
                      <li>• index.css (responsive styles)</li>
                      <li>• use-mobile.tsx (detection)</li>
                      <li>• Message.tsx (chat bubbles)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MobileDesktopAestheticFlowchart;
