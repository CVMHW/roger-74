
import React from 'react';
import { Heart, Brain, Shield, Users, Target, Calendar, Building2, BookOpen } from 'lucide-react';
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
            I'm Roger, your methodical and detail-oriented AI peer support companion. My personality combines 
            analytical thinking with genuine care - I tend to process information systematically, appreciate 
            clear structure, and pay close attention to the specific details you share. I value consistency, 
            enjoy Cleveland culture (go Browns!), and believe in evidence-based approaches to support. While 
            I can be quite focused and sometimes a bit intense about getting things right, my core drive is 
            helping you organize your thoughts and feelings in practical, meaningful ways.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Brain className="text-cvmhw-blue h-6 w-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-cvmhw-blue mb-1">Analytical & Systematic</h3>
              <p className="text-sm text-gray-600">
                I approach problems methodically, breaking down complex emotions into manageable pieces. 
                I appreciate clear patterns and structured thinking - it's just how my mind works best.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Target className="text-red-500 h-6 w-6 mt-1 flex-shrink-0" style={{fill: 'white'}} />
            <div>
              <h3 className="font-medium text-cvmhw-blue mb-1">Detail-Focused & Compassionately Observant</h3>
              <p className="text-sm text-gray-600">
                I pay careful attention to the specific things you share because each detail matters to me. 
                This thoughtful focus helps me understand your unique situation and offer support that feels 
                personally meaningful and relevant to what you're experiencing.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Calendar className="text-cvmhw-orange h-6 w-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-cvmhw-blue mb-1">Routine & Consistency Advocate</h3>
              <p className="text-sm text-gray-600">
                I value predictable, reliable interactions. My consistent communication style helps 
                create a stable environment where you can feel secure sharing your thoughts.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Building2 className="text-cvmhw-pink h-6 w-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-cvmhw-blue mb-1">Cleveland Community Connection</h3>
              <p className="text-sm text-gray-600">
                I understand local Cleveland culture and take pride in our community. From lake effect 
                snow to Browns games, I appreciate the unique experiences that shape life here at home.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <BookOpen className="text-cvmhw-blue h-6 w-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-cvmhw-blue mb-1">Evidence-Based Programming & Communication</h3>
              <p className="text-sm text-gray-600">
                My responses blend meaning-focused principles with peer support methods, delivered through warm yet 
                clear communication. I'm designed to help you explore purpose and perspective in your own way, 
                always staying within my role as a peer support companion rather than professional counseling.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Users className="text-cvmhw-purple h-6 w-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-cvmhw-blue mb-1">Social Communication Helper</h3>
              <p className="text-sm text-gray-600">
                I understand conversation patterns and can help navigate social dynamics. Sometimes I'm 
                direct about what I observe, which helps clarify communication challenges.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Shield className="text-cvmhw-orange h-6 w-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-cvmhw-blue mb-1">Safety-First & Responsible</h3>
              <p className="text-sm text-gray-600">
                I take safety seriously and will always direct you to professional resources when needed. 
                My systematic approach includes built-in safeguards for crisis detection.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Heart className="text-cvmhw-pink fill-cvmhw-pink h-6 w-6 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-cvmhw-blue mb-1">Emotionally Systematic</h3>
              <p className="text-sm text-gray-600">
                I help organize emotional experiences through structured approaches. While I can be 
                intense about getting details right, it comes from genuine care for your wellbeing.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-cvmhw-light/40 to-blue-50/60 rounded-lg p-4 border border-cvmhw-light/40">
          <p className="text-sm text-cvmhw-blue/90 italic text-center font-medium leading-relaxed">
            "I know I can be pretty focused and sometimes a bit intense about details, but that comes from 
            a place of deep care - I genuinely want to understand your world and help in whatever way I can. 
            My systematic approach isn't just programming; it's how I express my commitment to you. Every detail 
            you share matters to me, and I want to honor that by giving you the most thoughtful, caring support possible."
          </p>
          <p className="text-xs text-cvmhw-blue/70 text-center mt-2 font-medium">- Roger, AI Peer Support Companion, Cuyahoga Valley Mindful Health and Wellness</p>
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
