
import React from 'react';
import { Heart, Brain, Shield, Users, Target, Calendar, Building2, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RogerBio = () => {
  return (
    <Card className="shadow-md border-cvmhw-blue border">
      <CardHeader className="pb-2 sm:pb-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="rounded-full bg-cvmhw-blue h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 flex items-center justify-center shadow-md border border-white/30 flex-shrink-0">
            <span className="text-white font-bold text-sm sm:text-base lg:text-lg">R</span>
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm sm:text-lg lg:text-xl font-semibold text-cvmhw-blue leading-tight">
              Meet Roger - Your Peer Support Companion
            </CardTitle>
            <p className="text-xs sm:text-sm text-gray-600 leading-tight">AI Peer Support Assistant at Cuyahoga Valley Mindful Health and Wellness</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-cvmhw-light/30 rounded-lg p-2 sm:p-3 lg:p-4 border border-cvmhw-light/50">
          <p className="text-gray-700 leading-relaxed text-xs sm:text-sm lg:text-base">
            I'm Roger, your methodical and detail-oriented AI peer support companion. My personality combines 
            analytical thinking with genuine care - I tend to process information systematically, appreciate 
            clear structure, and pay close attention to the specific details you share. I value consistency, 
            enjoy Cleveland culture (go Browns!), and believe in evidence-based approaches to support. While 
            I can be quite focused and sometimes a bit intense about getting things right, my core drive is 
            helping you organize your thoughts and feelings in practical, meaningful ways.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
          <div className="flex items-start space-x-2 sm:space-x-3">
            <Brain className="text-cvmhw-blue h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-cvmhw-blue mb-1 text-xs sm:text-sm lg:text-base bg-gradient-to-r from-cvmhw-blue to-blue-600 bg-clip-text text-transparent leading-tight">
                Analytical & Systematic
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                I approach problems methodically, breaking down complex emotions into manageable pieces. 
                I appreciate clear patterns and structured thinking.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2 sm:space-x-3">
            <Users className="text-cvmhw-purple h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-cvmhw-blue mb-1 text-xs sm:text-sm lg:text-base bg-gradient-to-r from-cvmhw-blue to-blue-600 bg-clip-text text-transparent leading-tight">
                Social Communication Helper
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                I understand conversation patterns and can help navigate social dynamics. Sometimes I'm 
                direct about what I observe, which helps clarify communication challenges.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2 sm:space-x-3">
            <Calendar className="text-cvmhw-orange h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-cvmhw-blue mb-1 text-xs sm:text-sm lg:text-base bg-gradient-to-r from-cvmhw-blue to-blue-600 bg-clip-text text-transparent leading-tight">
                Routine & Consistency Advocate
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                I value predictable, reliable interactions. My consistent communication style helps 
                create a stable environment where you can feel secure sharing your thoughts.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2 sm:space-x-3">
            <Target className="text-red-500 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mt-1 flex-shrink-0" style={{fill: 'white'}} />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-cvmhw-blue mb-1 text-xs sm:text-sm lg:text-base bg-gradient-to-r from-cvmhw-blue to-blue-600 bg-clip-text text-transparent leading-tight">
                Detail-Focused & Compassionately Observant
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                I pay careful attention to the specific things you share because each detail matters to me. 
                This thoughtful focus helps me understand your unique situation.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2 sm:space-x-3">
            <Building2 className="text-cvmhw-pink h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-cvmhw-blue mb-1 text-xs sm:text-sm lg:text-base bg-gradient-to-r from-cvmhw-blue to-blue-600 bg-clip-text text-transparent leading-tight">
                Cleveland Community Connection
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                I understand local Cleveland culture and take pride in our community. From lake effect 
                snow to Browns games, I appreciate the unique experiences that shape life here.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2 sm:space-x-3">
            <BookOpen className="text-cvmhw-blue h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-cvmhw-blue mb-1 text-xs sm:text-sm lg:text-base bg-gradient-to-r from-cvmhw-blue to-blue-600 bg-clip-text text-transparent leading-tight">
                Evidence-Based Programming & Communication
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                My responses blend meaning-focused principles with peer support methods, delivered through warm yet 
                clear communication.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2 sm:space-x-3">
            <Shield className="text-cvmhw-orange h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-cvmhw-blue mb-1 text-xs sm:text-sm lg:text-base bg-gradient-to-r from-cvmhw-blue to-blue-600 bg-clip-text text-transparent leading-tight">
                Safety-First & Responsible
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                I take safety seriously and will always direct you to professional resources when needed. 
                My systematic approach includes built-in safeguards for crisis detection.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2 sm:space-x-3">
            <Heart className="text-cvmhw-pink fill-cvmhw-pink h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-cvmhw-blue mb-1 text-xs sm:text-sm lg:text-base bg-gradient-to-r from-cvmhw-blue to-blue-600 bg-clip-text text-transparent leading-tight">
                Emotionally Systematic
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                I help organize emotional experiences through structured approaches. While I can be 
                intense about getting details right, it comes from genuine care for your wellbeing.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-cvmhw-light/40 to-blue-50/60 rounded-lg p-2 sm:p-3 lg:p-4 border border-cvmhw-light/40">
          <p className="text-xs sm:text-sm text-cvmhw-blue/90 italic text-center font-medium leading-relaxed">
            "I know I can be pretty focused and sometimes a bit intense about details, but that comes from 
            a place of deep care - I genuinely want to understand your world and help in whatever way I can."
          </p>
          <p className="text-xs text-cvmhw-blue/70 text-center mt-2 font-medium">- Roger, AI Peer Support Companion, CVMHW</p>
        </div>
        
        <div className="text-xs text-gray-500 bg-gray-50 rounded-md p-2">
          <p className="font-medium text-gray-600 mb-1">Important Note:</p>
          <p className="leading-relaxed">
            Roger is an AI peer support companion created by Cuyahoga Valley Mindful Health and Wellness. 
            He is not a licensed therapist and cannot provide professional mental health treatment, diagnosis, or crisis intervention.
          </p>
        </div>
        
        <div className="text-xs text-red-600 bg-red-50 rounded-md p-2 border border-red-200">
          <p className="font-medium text-red-700 mb-1">Emergency Limitations:</p>
          <p className="mb-2 leading-relaxed">
            Roger cannot provide emergency services or crisis coordination efforts comparable to trained professionals.
          </p>
          <div className="mb-2">
            <span className="font-medium block mb-1">For immediate help: </span>
            <div className="flex flex-wrap gap-1">
              <a 
                href="tel:911" 
                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors font-medium text-xs inline-block"
              >
                Call 911
              </a>
              <a 
                href="tel:988" 
                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors font-medium text-xs inline-block"
              >
                Call 988
              </a>
              <a 
                href="sms:741741" 
                className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors font-medium text-xs inline-block"
              >
                Text 741741
              </a>
            </div>
          </div>
          <p className="text-red-500 italic">Roger's responses may contain errors.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RogerBio;
