
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
            <p className="text-sm text-gray-600">AI Peer Support Assistant at CVMHW</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-cvmhw-light/30 rounded-lg p-4 border border-cvmhw-light/50">
          <p className="text-gray-700 leading-relaxed">
            Life can be challenging, and sometimes we all need a little help navigating its ups and downs. 
            As an AI peer support companion at Cuyahoga Valley Mindful Health and Wellness, I'm here to 
            provide a listening ear and supportive conversation while you wait for your therapist or explore 
            your thoughts. I'm designed to offer encouragement and basic emotional support using evidence-based 
            principles, but I'm not a replacement for professional therapy.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <Brain className="text-cvmhw-blue h-6 w-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-cvmhw-blue mb-1">Evidence-Based Responses</h3>
              <p className="text-sm text-gray-600">
                I'm trained on therapeutic principles including cognitive-behavioral techniques, mindfulness 
                concepts, and person-centered approaches to provide supportive conversations.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Users className="text-cvmhw-purple h-6 w-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-cvmhw-blue mb-1">All Ages Welcome</h3>
              <p className="text-sm text-gray-600">
                I can adapt my communication style for conversations with children, teens, adults, and seniors, 
                addressing various concerns from everyday stress to life transitions.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Shield className="text-cvmhw-orange h-6 w-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-cvmhw-blue mb-1">Safety-Focused Design</h3>
              <p className="text-sm text-gray-600">
                I'm programmed with crisis detection capabilities and will always direct you to appropriate 
                professional resources when serious concerns arise.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Heart className="text-cvmhw-pink fill-cvmhw-pink h-6 w-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-cvmhw-blue mb-1">Supportive Environment</h3>
              <p className="text-sm text-gray-600">
                I aim to create a judgment-free space where you can express your thoughts and feelings, 
                while always encouraging professional support when appropriate.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-cvmhw-light/40 to-blue-50/60 rounded-lg p-4 border border-cvmhw-light/40">
          <p className="text-sm text-gray-700 italic text-center">
            "I'm here to listen, support, and help you process your thoughts while you're on your mental health journey. 
            Remember, I'm a companion on this path, not a professional therapist."
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
