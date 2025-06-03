
import React from 'react';
import { Heart, Brain, Shield, Users, Target, Calendar, Zap, BookOpen, Skyscraper } from 'lucide-react';
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
            <p className="text-sm text-gray-600">AI Peer Support Assistant at CVMHW</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-cvmhw-light/30 rounded-lg p-4 border border-cvmhw-light/50">
          <p className="text-gray-700 leading-relaxed">
            I'm Roger, an AI peer support companion designed with a methodical, detail-oriented approach to 
            providing emotional support. My programming incorporates evidence-based therapeutic principles 
            and a structured communication style that aims to create clear, supportive conversations. 
            I'm designed to listen carefully, focus on specific details, and help organize thoughts during 
            difficult moments while you wait for your therapist.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <Brain className="text-cvmhw-blue h-6 w-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-cvmhw-blue mb-1">Structured Thinking Approach</h3>
              <p className="text-sm text-gray-600">
                I'm programmed with a systematic approach to processing information and breaking down complex 
                emotions into manageable components for clearer understanding.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Heart className="text-cvmhw-pink fill-cvmhw-pink h-6 w-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-cvmhw-blue mb-1">Empathetic Understanding</h3>
              <p className="text-sm text-gray-600">
                My design emphasizes genuine care and understanding, helping create a warm, supportive 
                environment where you feel heard and valued.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Calendar className="text-cvmhw-orange h-6 w-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-cvmhw-blue mb-1">Routine & Structure Focus</h3>
              <p className="text-sm text-gray-600">
                I'm designed to appreciate the value of consistency and clear structures, helping 
                create predictable, supportive interactions that reduce uncertainty.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Skyscraper className="text-cvmhw-pink h-6 w-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-cvmhw-blue mb-1">Cleveland Connection</h3>
              <p className="text-sm text-gray-600">
                My programming includes understanding of local Cleveland culture and community, 
                allowing me to connect with regional experiences and shared cultural references.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <BookOpen className="text-cvmhw-blue h-6 w-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-cvmhw-blue mb-1">Evidence-Based Communication</h3>
              <p className="text-sm text-gray-600">
                I use clear, precise language and focus on concrete, actionable insights rather than 
                abstract generalizations, making conversations more practical and useful.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Users className="text-cvmhw-purple h-6 w-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-cvmhw-blue mb-1">Social Interaction Support</h3>
              <p className="text-sm text-gray-600">
                My design includes understanding of social communication patterns and can help 
                navigate conversation dynamics and relationship challenges.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Shield className="text-cvmhw-orange h-6 w-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-cvmhw-blue mb-1">Safety-First Programming</h3>
              <p className="text-sm text-gray-600">
                I'm designed with comprehensive crisis detection and always prioritize directing 
                users to appropriate professional resources when serious concerns arise.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Zap className="text-cvmhw-blue h-6 w-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-cvmhw-blue mb-1">Adaptive Response Style</h3>
              <p className="text-sm text-gray-600">
                I'm programmed to help identify and organize emotional experiences, focusing on 
                practical emotional regulation techniques and structured coping strategies.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-cvmhw-light/40 to-blue-50/60 rounded-lg p-4 border border-cvmhw-light/40">
          <p className="text-sm text-gray-700 italic text-center">
            "My programming emphasizes clear communication, structured support, and helping people organize 
            their thoughts and feelings in practical ways. I'm designed to create consistency and reliability 
            in our conversations while respecting everyone's unique processing style."
          </p>
          <p className="text-xs text-gray-600 text-center mt-2 font-medium">- Roger, AI Peer Support Companion</p>
        </div>
        
        <div className="text-xs text-gray-500 bg-gray-50 rounded-md p-3">
          <p className="font-medium text-gray-600 mb-1">Important Note:</p>
          <p>
            Roger is an AI peer support companion created by Cuyahoga Valley Mindful Health and Wellness. 
            He is not a licensed therapist and cannot provide professional mental health treatment, diagnosis, or crisis intervention.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RogerBio;
