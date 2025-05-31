
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Heart, Phone, DollarSign, FileText, Users, Stethoscope, Info } from 'lucide-react';
import { patientRights, mandatedReportingInfo, getAffordabilityOptions } from '../utils/cvmhw/cvmhwKnowledgeBase';

const PatientRightsTab: React.FC = () => {
  const affordabilityOptions = getAffordabilityOptions();

  const getRightIcon = (title: string) => {
    if (title.includes('Respectful')) return <Heart className="h-5 w-5 text-cvmhw-pink" />;
    if (title.includes('Confidentiality')) return <Shield className="h-5 w-5 text-cvmhw-blue" />;
    if (title.includes('Grievances')) return <Phone className="h-5 w-5 text-cvmhw-purple" />;
    if (title.includes('Sliding') || title.includes('Financial')) return <DollarSign className="h-5 w-5 text-green-600" />;
    if (title.includes('Estimates')) return <FileText className="h-5 w-5 text-cvmhw-orange" />;
    if (title.includes('Disability')) return <Users className="h-5 w-5 text-cvmhw-blue" />;
    if (title.includes('Level of Care')) return <Stethoscope className="h-5 w-5 text-cvmhw-purple" />;
    return <Shield className="h-5 w-5 text-gray-500" />;
  };

  return (
    <div className="space-y-4">
      {/* Educational Disclaimer */}
      <Card className="border-blue-200 shadow-sm bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800 text-sm">Considering CVMHW Services?</h3>
              <p className="text-sm text-blue-700 mt-1">
                Roger is sharing this information to help you understand what to expect from Cuyahoga Valley Mindful Health and Wellness professional services. This helps you decide if their therapy, life coaching, or athletic coaching might be right for you.
              </p>
              <p className="text-xs text-blue-600 mt-1 font-medium">
                Roger is peer support only - not a therapist or medical provider.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-cvmhw-light shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-cvmhw-blue flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Your Rights with CVMHW Professional Services
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {patientRights.map((right, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-cvmhw-light/20 to-white rounded-lg border border-cvmhw-light/50">
              {getRightIcon(right.title)}
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 text-sm">{right.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{right.description}</p>
                {right.contact && (
                  <p className="text-xs text-cvmhw-blue mt-1 font-medium">{right.contact}</p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-cvmhw-light shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-cvmhw-blue flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Financial Assistance Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-medium text-green-800 text-sm">Sliding Scale Fees</h3>
            <p className="text-sm text-green-700">{affordabilityOptions.slidingScale}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-800 text-sm">Pro-Bono Services</h3>
            <p className="text-sm text-blue-700">{affordabilityOptions.proBono}</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="font-medium text-purple-800 text-sm">Payment Plans</h3>
            <p className="text-sm text-purple-700">{affordabilityOptions.paymentPlans}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-200 shadow-sm bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-orange-800 text-sm">Important: Mandated Reporting</h3>
              <p className="text-sm text-orange-700 mt-1">{mandatedReportingInfo.description}</p>
              <p className="text-xs text-orange-600 mt-1 font-medium">{mandatedReportingInfo.purpose}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-gray-500 mt-4 p-3 bg-gray-50 rounded-lg">
        <p>This information helps you understand CVMHW professional services.</p>
        <p className="mt-1">For specific questions, contact the practice directly at (440) 409-4303.</p>
      </div>
    </div>
  );
};

export default PatientRightsTab;
