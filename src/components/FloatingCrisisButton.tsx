
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const FloatingCrisisButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const quickCrisisResources = [
    { label: "National Suicide Prevention", phone: "988", isPrimary: true },
    { label: "Crisis Text Line", phone: "Text 741741", isPrimary: true },
    { label: "Emergency Services", phone: "911", isPrimary: true },
    { label: "Ohio Veteran Crisis Line", phone: "1-800-273-8255", isPrimary: true },
    { label: "Ashtabula County 24/7 Substance Use Disorder Crisis Hotline", phone: "1-800-577-7849", isPrimary: true },
    { label: "Summit County Mobile Crisis", phone: "330-434-9144", isPrimary: true },
    { label: "Cuyahoga County Mobile Crisis", phone: "216-623-6555", isPrimary: true },
    { label: "Riveon/Nord Center Crisis Line", phone: "1-800-888-6161", isPrimary: true }
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-lg animate-pulse"
            size="lg"
          >
            <Phone size={24} />
            <span className="ml-2 font-semibold">Crisis Help</span>
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <Phone size={20} />
              Immediate Crisis Resources
            </DialogTitle>
            <DialogDescription>
              <strong>LEGAL NOTICE:</strong> Experimental beta software • Not FDA approved or clinically validated as a medical device • Informational only • Always consult healthcare professionals • 
              Emergency: <a href="tel:911" className="text-cvmhw-blue hover:underline font-medium">911</a> or <a href="tel:988" className="text-cvmhw-blue hover:underline font-medium">988 Crisis Lifeline</a> • Responses may contain errors • Not a substitute for professional care.
              <br /><br />
              If you're in immediate danger, please call one of these numbers right now.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3">
            {quickCrisisResources.map((resource, index) => (
              <div 
                key={index}
                className={`p-3 border rounded-lg ${resource.isPrimary ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-medium ${resource.isPrimary ? 'text-red-800' : 'text-gray-800'}`}>
                      {resource.label}
                    </p>
                    <p className={`text-lg font-bold ${resource.isPrimary ? 'text-red-600' : 'text-gray-600'}`}>
                      {resource.phone}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (resource.phone.startsWith('Text')) {
                        // Handle text messaging
                        window.open(`sms:741741`, '_blank');
                      } else {
                        // Handle phone calls
                        window.open(`tel:${resource.phone.replace(/\D/g, '')}`, '_blank');
                      }
                    }}
                    className={resource.isPrimary ? 'border-red-300 text-red-700 hover:bg-red-100' : ''}
                  >
                    <Phone size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-xs text-gray-600 text-center pt-3 border-t">
            All crisis lines are available 24/7 and are free to call
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingCrisisButton;
