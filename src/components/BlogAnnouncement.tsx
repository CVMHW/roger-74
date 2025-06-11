
import React from 'react';
import { Brain, Heart, Shield, Users, AlertTriangle, Phone, MapPin, Calendar, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BlogAnnouncement = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cvmhw-light to-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* SEO Optimized Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img 
              src="/lovable-uploads/098e5a48-82bc-4b39-bd7c-491690a5c763.png" 
              alt="CVMHW Logo" 
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cvmhw-blue to-cvmhw-purple bg-clip-text text-transparent leading-tight">
                CVMHW Launches Roger AI: Ohio's First Professionally-Supervised AI Peer Support Companion
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Serving Cleveland, Lorain, Brook Park, Mentor, Hudson, Parma, Cuyahoga Falls, Madison, Jefferson, Ashtabula, Conneaut, Wickliffe, Richmond Heights, Willoughby, Chardon, and Burton
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-cvmhw-light/30 rounded-lg p-4 border border-cvmhw-blue/20">
            <p className="text-cvmhw-blue font-semibold text-lg">
              🎉 BETA LAUNCH: Experience the future of mental health peer support while you wait for therapy
            </p>
            <p className="text-sm text-gray-700 mt-2">
              Professional supervision by Eric Riesterer, LPC & Wendy Nathan, LPCC-S at Cuyahoga Valley Mindful Health and Wellness
            </p>
          </div>
        </header>

        {/* What Roger Does Section */}
        <Card className="mb-8 shadow-lg border-cvmhw-blue/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-cvmhw-blue">
              <Brain className="h-6 w-6" />
              What Roger AI Does: Your Methodical Mental Health Companion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
              <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                <Heart className="h-5 w-5 fill-green-600" />
                Evidence-Based Peer Support for Northeast Ohio
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• <strong>Systematic Emotional Processing:</strong> Roger's analytical personality helps organize complex feelings into manageable pieces</li>
                <li>• <strong>Cleveland Culture Integration:</strong> Understanding of local experiences from lake effect snow to Browns games</li>
                <li>• <strong>24/7 Availability:</strong> Support while waiting for professional therapy appointments in Cleveland, Lorain, and surrounding Ohio communities</li>
                <li>• <strong>Rogerian Principles:</strong> Evidence-based approach with genuine empathy and unconditional positive regard</li>
                <li>• <strong>Detail-Oriented Care:</strong> Careful attention to specific situations you share because every detail matters</li>
                <li>• <strong>Professional Supervision:</strong> Every interaction overseen by licensed mental health professionals at CVMHW</li>
              </ul>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-700 mb-2">Core Capabilities</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Structured conversation patterns</li>
                  <li>• Social communication assistance</li>
                  <li>• Routine and consistency advocacy</li>
                  <li>• Crisis detection with immediate handoff</li>
                  <li>• HIPAA-compliant conversations</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-purple-700 mb-2">Ohio Community Focus</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Understanding of Northeast Ohio experiences</li>
                  <li>• Cultural awareness of local communities</li>
                  <li>• Integration with CVMHW services</li>
                  <li>• Telehealth and in-person coordination</li>
                  <li>• Insurance navigation assistance</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What Roger Doesn't Do Section */}
        <Card className="mb-8 shadow-lg border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-red-600">
              <Shield className="h-6 w-6" />
              Important Limitations: What Roger AI Cannot Do
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border border-red-200">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-red-700 mb-2">Clinical Limitations</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• <strong>Not a Licensed Therapist:</strong> Cannot provide professional mental health treatment</li>
                    <li>• <strong>No Diagnosis:</strong> Cannot diagnose mental health conditions</li>
                    <li>• <strong>No Medical Advice:</strong> Cannot prescribe medications or medical treatments</li>
                    <li>• <strong>Not Crisis Intervention:</strong> Cannot handle emergency situations</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-700 mb-2">Technical Limitations</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• <strong>Experimental Beta Software:</strong> Responses may contain errors</li>
                    <li>• <strong>Not FDA Approved:</strong> Not clinically validated as medical device</li>
                    <li>• <strong>Memory Limitations:</strong> Cannot retain information between separate sessions</li>
                    <li>• <strong>Pattern Recognition:</strong> May miss subtle emotional cues</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-red-100 rounded border border-red-300">
                <p className="text-red-800 font-semibold text-center">
                  🚨 For Mental Health Emergencies: Call 911 or 988 Suicide & Crisis Lifeline Immediately
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technology & Professional Integration */}
        <Card className="mb-8 shadow-lg border-cvmhw-purple/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-cvmhw-purple">
              <Users className="h-6 w-6" />
              Professional Supervision & Technology Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-cvmhw-light/40 to-purple-50 rounded-lg p-4 border border-cvmhw-purple/20">
              <h3 className="font-semibold text-cvmhw-purple mb-3">Cuyahoga Valley Mindful Health and Wellness Integration</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-cvmhw-blue mb-2">Professional Oversight</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• <strong>Eric Riesterer, LPC:</strong> Licensed Professional Counselor providing direct supervision</li>
                    <li>• <strong>Wendy Nathan, LPCC-S:</strong> Licensed Clinical Counselor overseeing all operations</li>
                    <li>• <strong>Continuous Monitoring:</strong> All conversations reviewed for safety and appropriateness</li>
                    <li>• <strong>Seamless Referrals:</strong> Direct connection to CVMHW therapy services</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-cvmhw-blue mb-2">Service Integration</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• <strong>Insurance Accepted:</strong> Aetna, Anthem, Medicaid, UnitedHealthcare, and more</li>
                    <li>• <strong>Sliding Scale Available:</strong> Financial assistance for qualifying families</li>
                    <li>• <strong>Telehealth Ready:</strong> HIPAA-compliant Doxy.me integration</li>
                    <li>• <strong>Multiple Locations:</strong> Cuyahoga Falls & Jefferson Ohio offices</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-700 mb-2">Advanced Technology Features</h4>
              <div className="grid md:grid-cols-3 gap-3 text-sm text-gray-700">
                <div>
                  <strong>Hallucination Prevention:</strong> Advanced systems prevent inappropriate responses
                </div>
                <div>
                  <strong>Crisis Detection:</strong> Immediate professional handoff for safety concerns
                </div>
                <div>
                  <strong>Memory Systems:</strong> Contextual conversation tracking with privacy protection
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="shadow-lg border-cvmhw-blue">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-cvmhw-blue">Experience Roger AI Today</h2>
              <p className="text-gray-700 max-w-2xl mx-auto">
                Join the future of mental health peer support in Ohio. Roger is ready to provide systematic, 
                evidence-based support while you wait for professional therapy.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="bg-gradient-to-r from-cvmhw-blue to-cvmhw-purple rounded-lg p-4 text-white">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Try Roger AI Peer Support
                  </h3>
                  <p className="text-sm mb-3">
                    Experience Ohio's first AI peer support companion with professional supervision
                  </p>
                  <button className="bg-white text-cvmhw-blue px-4 py-2 rounded font-semibold hover:bg-gray-100 transition-colors">
                    Visit peersupportAI.com
                  </button>
                </div>
                
                <div className="bg-gradient-to-r from-cvmhw-orange to-cvmhw-pink rounded-lg p-4 text-white">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Schedule Professional Therapy
                  </h3>
                  <p className="text-sm mb-3">
                    Connect with licensed therapists at CVMHW for comprehensive mental health care
                  </p>
                  <button className="bg-white text-cvmhw-orange px-4 py-2 rounded font-semibold hover:bg-gray-100 transition-colors">
                    Visit CVMHW.com
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Geographic Coverage */}
        <div className="mt-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-cvmhw-blue" />
            Serving Northeast Ohio Communities
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Roger AI and CVMHW proudly serve mental health needs across <strong>Cleveland, Lorain, Brook Park, Mentor, Hudson, Parma, Cuyahoga Falls, Madison, Jefferson, Ashtabula, Conneaut, Wickliffe, Richmond Heights, Willoughby, Chardon, and Burton, Ohio</strong>. Our commitment to local communities drives our understanding of the unique challenges and strengths of Northeast Ohio residents.
          </p>
        </div>

        {/* Legal Footer */}
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-2 text-xs text-red-700">
            <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold mb-2">Legal Disclaimer & Safety Notice</p>
              <p className="leading-relaxed mb-2">
                Roger AI is experimental beta software developed by Cuyahoga Valley Mindful Health and Wellness. 
                Not FDA approved or clinically validated as a medical device. For informational purposes only. 
                Always consult licensed healthcare professionals for medical advice, diagnosis, or treatment.
              </p>
              <p className="leading-relaxed">
                <strong>Emergency Resources:</strong> For immediate mental health crises, call{' '}
                <a href="tel:911" className="underline font-semibold">911</a> or the{' '}
                <a href="tel:988" className="underline font-semibold">988 Suicide & Crisis Lifeline</a>. 
                Roger cannot provide emergency services or crisis intervention comparable to trained professionals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogAnnouncement;
