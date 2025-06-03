
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Heart, Phone, DollarSign, FileText, Users, Stethoscope, Info } from 'lucide-react';
import { patientRights, mandatedReportingInfo, getAffordabilityOptions } from '../utils/cvmhw/cvmhwKnowledgeBase';

const PatientRightsTab: React.FC = () => {
  const affordabilityOptions = getAffordabilityOptions();

  const getRightIcon = (title: string) => {
    if (title.includes('Respectful')) return <Heart className="h-5 w-5 text-cvmhw-pink drop-shadow-lg" />;
    if (title.includes('Confidentiality')) return <Shield className="h-5 w-5 text-cvmhw-blue drop-shadow-lg" />;
    if (title.includes('Grievances')) return <Phone className="h-5 w-5 text-cvmhw-purple drop-shadow-lg" />;
    if (title.includes('Sliding') || title.includes('Financial')) return <DollarSign className="h-5 w-5 text-green-600 drop-shadow-lg" />;
    if (title.includes('Estimates')) return <FileText className="h-5 w-5 text-cvmhw-orange drop-shadow-lg" />;
    if (title.includes('Disability')) return <Users className="h-5 w-5 text-cvmhw-blue drop-shadow-lg" />;
    if (title.includes('Level of Care')) return <Stethoscope className="h-5 w-5 text-cvmhw-purple drop-shadow-lg" />;
    return <Shield className="h-5 w-5 text-gray-500 drop-shadow-lg" />;
  };

  return (
    <div className="space-y-4 bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50 p-6 rounded-xl">
      {/* Educational Disclaimer with enhanced styling */}
      <Card className="border-blue-300 shadow-xl bg-gradient-to-r from-cyan-50/80 via-white to-blue-100/80 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cvmhw-blue/10 via-white/30 to-cyan-200/20 animate-pulse" />
        <CardContent className="p-4 relative z-10">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-cvmhw-blue mt-0.5 drop-shadow-lg filter brightness-110" />
            <div>
              <h3 className="font-medium text-blue-800 text-sm bg-gradient-to-r from-cvmhw-blue to-blue-900 bg-clip-text text-transparent font-semibold">Considering CVMHW Services?</h3>
              <p className="text-sm text-blue-700 mt-1 drop-shadow-sm">
                Roger is sharing this information to help you understand what to expect from Cuyahoga Valley Mindful Health and Wellness professional services. This helps you decide if their therapy, life coaching, or athletic coaching might be right for you.
              </p>
              <p className="text-xs text-blue-600 mt-1 font-medium bg-gradient-to-r from-cvmhw-blue to-blue-800 bg-clip-text text-transparent">
                Roger is peer support only - not a therapist or medical provider.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-cyan-200/60 shadow-2xl bg-gradient-to-br from-white via-cyan-50/40 to-slate-100/80 backdrop-blur-lg relative overflow-hidden">
        {/* Enhanced shimmering overlay with cyan */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cvmhw-blue/20 to-transparent transform -skew-x-12 animate-pulse" />
        {/* Metallic border effect with cyan accents */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-200/60 via-cvmhw-blue/30 to-slate-300/60 p-0.5 rounded-lg">
          <div className="bg-white rounded-lg h-full w-full" />
        </div>
        
        <CardHeader className="pb-3 relative z-10">
          <CardTitle className="text-lg font-semibold text-transparent bg-gradient-to-r from-cvmhw-blue via-cyan-600 to-slate-700 bg-clip-text flex items-center gap-2 drop-shadow-lg">
            <Shield className="h-5 w-5 text-cvmhw-blue drop-shadow-lg filter brightness-125" />
            Your Rights with CVMHW Professional Services
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 relative z-10">
          {patientRights.map((right, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-cyan-50/60 via-white to-slate-50/80 rounded-lg border border-cyan-200/40 shadow-md backdrop-blur-sm relative overflow-hidden hover:shadow-lg transition-all duration-300">
              {/* Subtle shine effect with cyan */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cvmhw-blue/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              {getRightIcon(right.title)}
              <div className="flex-1 relative z-10">
                <h3 className="font-medium text-gray-800 text-sm bg-gradient-to-r from-cvmhw-blue to-gray-800 bg-clip-text text-transparent">{right.title}</h3>
                <p className="text-sm text-gray-600 mt-1 drop-shadow-sm">{right.description}</p>
                {right.contact && (
                  <p className="text-xs text-cvmhw-blue mt-1 font-medium bg-gradient-to-r from-cvmhw-blue to-blue-700 bg-clip-text text-transparent">{right.contact}</p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-cyan-200/50 shadow-2xl bg-gradient-to-br from-white via-cyan-50/30 to-slate-100/70 backdrop-blur-lg relative overflow-hidden">
        {/* Metallic shimmer effect with cyan tones */}
        <div className="absolute inset-0 bg-gradient-to-45deg from-cyan-100/30 via-cvmhw-blue/20 to-slate-200/30 animate-pulse" />
        
        <CardHeader className="pb-3 relative z-10">
          <CardTitle className="text-lg font-semibold text-transparent bg-gradient-to-r from-green-600 via-cvmhw-blue to-emerald-700 bg-clip-text flex items-center gap-2 drop-shadow-lg">
            <DollarSign className="h-5 w-5 text-green-600 drop-shadow-lg filter brightness-125" />
            Financial Assistance Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 relative z-10">
          <div className="p-3 bg-gradient-to-r from-green-50/90 via-cyan-50/30 to-emerald-100/80 rounded-lg border border-green-200/60 shadow-md backdrop-blur-sm">
            <h3 className="font-medium text-green-800 text-sm bg-gradient-to-r from-green-700 to-cvmhw-blue bg-clip-text text-transparent">Sliding Scale Fees</h3>
            <p className="text-sm text-green-700 drop-shadow-sm">{affordabilityOptions.slidingScale}</p>
          </div>
          <div className="p-3 bg-gradient-to-r from-cyan-50/80 via-cvmhw-blue/10 to-blue-100/90 rounded-lg border border-cyan-200/50 shadow-md backdrop-blur-sm">
            <h3 className="font-medium text-blue-800 text-sm bg-gradient-to-r from-cvmhw-blue to-indigo-800 bg-clip-text text-transparent">Pro-Bono Services</h3>
            <p className="text-sm text-blue-700 drop-shadow-sm">{affordabilityOptions.proBono}</p>
          </div>
          <div className="p-3 bg-gradient-to-r from-purple-50/90 via-cyan-50/20 to-violet-100/80 rounded-lg border border-purple-200/60 shadow-md backdrop-blur-sm">
            <h3 className="font-medium text-purple-800 text-sm bg-gradient-to-r from-purple-700 to-cvmhw-blue bg-clip-text text-transparent">Payment Plans</h3>
            <p className="text-sm text-purple-700 drop-shadow-sm">{affordabilityOptions.paymentPlans}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-200/60 shadow-xl bg-gradient-to-r from-orange-50/80 via-cyan-50/20 to-amber-50/90 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cvmhw-blue/10 to-transparent animate-pulse" />
        <CardContent className="p-4 relative z-10">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-orange-600 mt-0.5 drop-shadow-lg filter brightness-110" />
            <div>
              <h3 className="font-medium text-orange-800 text-sm bg-gradient-to-r from-orange-700 to-cvmhw-blue bg-clip-text text-transparent">Important: Mandated Reporting</h3>
              <p className="text-sm text-orange-700 mt-1 drop-shadow-sm">{mandatedReportingInfo.description}</p>
              <p className="text-xs text-orange-600 mt-1 font-medium bg-gradient-to-r from-orange-600 to-cvmhw-blue bg-clip-text text-transparent">{mandatedReportingInfo.purpose}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-gray-600 mt-4 p-3 bg-gradient-to-r from-slate-50/90 via-cyan-50/30 to-gray-100/90 rounded-lg shadow-md backdrop-blur-sm border border-cyan-200/40">
        <p className="bg-gradient-to-r from-cvmhw-blue to-slate-700 bg-clip-text text-transparent font-medium">This information helps you understand CVMHW professional services.</p>
        <p className="mt-1 bg-gradient-to-r from-gray-600 to-cvmhw-blue bg-clip-text text-transparent">For specific questions, contact the practice directly at (440) 294-8068.</p>
      </div>
    </div>
  );
};

export default PatientRightsTab;
