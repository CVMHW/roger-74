
import React from 'react';
import { Heart, Brain, Shield, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RogerBio = () => {
  return (
    <Card className="shadow-md border-cvmhw-blue border">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-gradient-to-br from-cvmhw-blue to-cvmhw-purple h-12 w-12 flex items-center justify-center shadow-md border border-white/30">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <div>
            <CardTitle className="text-xl font-semibold bg-gradient-to-r from-cvmhw-blue to-cvmhw-purple bg-clip-text text-transparent">
              Meet Roger - Your Peer Support Companion
            </CardTitle>
            <p className="text-sm text-gray-600">Licensed Professional Counselor in Training</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-cvmhw-light/30 rounded-lg p-4 border border-cvmhw-light/50">
          <p className="text-gray-700 leading-relaxed">
            Life can be challenging, and sometimes we all need a little help navigating its ups and downs. 
            As a peer support specialist working toward my Licensed Professional Counselor certification under 
            the supervision of Wendy Nathan, LPCC-S, I'm here to support you on your journey to better mental health. 
            Together, we'll work collaboratively to identify your strengths and develop personalized strategies for growth and resilience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <Brain className="text-cvmhw-blue h-6 w-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-cvmhw-blue mb-1">Evidence-Based Approaches</h3>
              <p className="text-sm text-gray-600">
                I specialize in teaching psychoeducational skills and using evidence-based therapies like 
                cognitive-processing therapy, mindfulness, and play therapy to empower you with the tools you need.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Users className="text-cvmhw-purple h-6 w-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-cvmhw-blue mb-1">Comprehensive Age Range</h3>
              <p className="text-sm text-gray-600">
                Working with clients ages 4 to retirement, I address a wide range of issues, including anxiety, 
                depression, family dynamics, boys' and men's mental health, and autism spectrum concerns.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Shield className="text-cvmhw-orange h-6 w-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-cvmhw-blue mb-1">Military & Athletic Background</h3>
              <p className="text-sm text-gray-600">
                My background in the Army Reserves and as a track/cross-country coach gives me unique insight 
                into challenges faced by military families and student-athletes.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Heart className="text-cvmhw-pink fill-cvmhw-pink h-6 w-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-cvmhw-blue mb-1">Safe, Supportive Environment</h3>
              <p className="text-sm text-gray-600">
                I believe in creating a safe, supportive space where you can feel heard and understood, 
                whether you're a child adjusting to new situations, a teen facing life's pressures, or an adult seeking balance and purpose.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-cvmhw-light/40 to-blue-50/60 rounded-lg p-4 border border-cvmhw-light/40">
          <p className="text-sm text-gray-700 italic text-center">
            "Every person has the capacity for growth and healing. My role is to walk alongside you as you discover your own strengths and develop the skills to thrive in all areas of life."
          </p>
          <p className="text-xs text-gray-600 text-center mt-2 font-medium">- Roger, Peer Support Specialist</p>
        </div>
        
        <div className="text-xs text-gray-500 bg-gray-50 rounded-md p-3">
          <p className="font-medium text-gray-600 mb-1">Professional Note:</p>
          <p>
            Roger is a peer support specialist working toward licensure under the supervision of Wendy Nathan, LPCC-S, 
            through Group Supervision and Work Supervision at Cuyahoga Valley Mindful Health and Wellness.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RogerBio;
