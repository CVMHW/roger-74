
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Phone, Info, HelpCircle, AlertTriangle } from 'lucide-react';

interface CrisisResourcesProps {
  forceOpen?: boolean;
}

const CrisisResources: React.FC<CrisisResourcesProps> = ({ forceOpen = false }) => {
  const [isOpen, setIsOpen] = useState(forceOpen);
  
  // If forceOpen prop changes, update isOpen state
  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
    }
  }, [forceOpen]);

  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={setIsOpen} 
      className="w-full bg-white rounded-lg shadow-md overflow-hidden border-2 border-cvmhw-blue"
    >
      <CollapsibleTrigger asChild>
        <Button 
          variant="outline" 
          className={`w-full flex justify-between items-center p-5 border-b ${forceOpen ? 'bg-red-50 hover:bg-red-100' : 'bg-cvmhw-light hover:bg-blue-100'} relative`}
        >
          <div className="flex items-center gap-3 text-cvmhw-purple">
            <div className="relative">
              {forceOpen ? (
                <AlertTriangle size={24} className="text-red-500" />
              ) : (
                <Info size={24} className="text-cvmhw-blue" />
              )}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${forceOpen ? 'bg-red-500' : 'bg-cvmhw-pink'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${forceOpen ? 'bg-red-500' : 'bg-cvmhw-pink'}`}></span>
              </span>
            </div>
            <span className={`font-semibold text-lg ${forceOpen ? 'text-red-700' : ''}`}>
              {forceOpen ? 'IMMEDIATE Crisis Resources & Support' : 'Crisis Resources & Support'}
            </span>
            <div className={`${forceOpen ? 'bg-red-100' : 'bg-blue-50'} p-1 rounded-md flex items-center border ${forceOpen ? 'border-red-200' : 'border-blue-100'} ml-2 animate-pulse`}>
              <HelpCircle size={16} className={forceOpen ? 'text-red-600 mr-1' : 'text-cvmhw-blue mr-1'} />
              <span className={`text-xs font-medium ${forceOpen ? 'text-red-700' : 'text-cvmhw-purple'}`}>Available 24/7</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className={`mr-3 ${forceOpen ? 'bg-red-50' : 'bg-cvmhw-light'} p-1.5 rounded-full border ${forceOpen ? 'border-red-300' : 'border-cvmhw-blue'}`}>
              <span className={`text-xs font-medium whitespace-nowrap ${forceOpen ? 'text-red-700' : 'text-cvmhw-purple'}`}>
                {isOpen ? 'Click to hide resources' : 'Click to view resources'}
              </span>
            </div>
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <ScrollArea className="h-80 p-5 crisis-resources-scroll">
          <div className="space-y-6">
            {forceOpen && (
              <div className="p-4 bg-red-50 border border-red-300 rounded-lg mb-4">
                <h3 className="text-red-700 font-bold flex items-center gap-2 mb-2">
                  <AlertTriangle size={20} />
                  <span>Immediate Help Available</span>
                </h3>
                <p className="text-red-700">
                  If you or someone you know is in immediate danger, please call 911 or your local emergency services immediately.
                  You can also call or text 988 to reach the Suicide and Crisis Lifeline, available 24/7.
                </p>
              </div>
            )}
            
            <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md border border-blue-100">
              Please use the resources below for immediate relief of symptoms and contact one of the relevant crisis resources or 911 for immediate assistance.
            </p>
            
            <ResourceCategory 
              title="Summit County"
              resources={[
                { label: "Summit County Mobile Crisis", phone: "330-434-9144" },
                { label: "Akron-Children's Crisis Line", phone: "330-543-7472" }
              ]}
            />
            
            <ResourceCategory 
              title="Stark County"
              resources={[
                { label: "Stark County Mobile Crisis", phone: "330-452-6000" },
                { label: "Homeless Hotline Stark County", phone: "330-452-4363" }
              ]}
            />
            
            <ResourceCategory 
              title="Cuyahoga County"
              resources={[
                { label: "Cuyahoga County Mobile Crisis (Emergency)", phone: "216-623-6555" },
                { label: "Homeless Hotline Cuyahoga County", phone: "216-674-6700" },
                { label: "Cleveland Project DAWN Expanded Mobile Unit (Emergency)", phone: "216-387-6290" },
                { label: "Cleveland Emergency Medical Services (Emergency)", phone: "216-664-2555" },
                { label: "Cleveland Emily Program Eating Disorders Residential Admissions", phone: "888-272-0836" },
                { label: "Cleveland Windsor-Laurelwood Residential Psychiatric Hospital", phone: "440-953-3000" },
                { label: "Cleveland Highland Springs Residential Psychiatric Hospital", phone: "216-302-3070" },
                { label: "Cleveland Bluestone Residential Pediatric Psychiatric Hospital", phone: "216-200-5030" },
                { label: "Cleveland Veteran's Affairs Louis Stokes Mental Healthcare", phone: "216-791-3800", extension: "61035" },
                { label: "Cuyahoga County Catholic Charities (Non-Emergency)", phone: "216-334-2900" }
              ]}
            />
            
            <ResourceCategory 
              title="Ohio State & National"
              resources={[
                { label: "National Suicide Prevention Hotline", phone: "988", isPrimary: true },
                { label: "Ohio Gambling Hotline", phone: "888-532-3500" },
                { label: "Ohio Veteran Crisis Line", phone: "800-273-8255" },
                { label: "Ohio Crisis Text Line", phone: "Text 241-241" },
                { label: "Trevor Project LGBTQ+ Sensitive Crisis Emergencies", phone: "866-488-7386" },
                { label: "Ohio Trans Lifeline", phone: "877-565-8860" },
                { label: "Domestic Violence Lifeline", phone: "330-453-7233" },
                { label: "Opiate Hotline", phone: "330-453-4357" },
                { label: "United Way of Ohio", phone: "211" }
              ]}
            />
            
            <ResourceCategory 
              title="Ashtabula County"
              resources={[
                { label: "Ashtabula County 24/7 Substance Use Disorder Crisis Hotline", phone: "800-577-7849" },
                { label: "Ashtabula Rape Crisis Center Hotline", phone: "440-354-7364" },
                { label: "Ashtabula County Children Services 24/7 Hotline", phone: "888-998-1811" },
                { label: "Ashtabula Homesafe Domestic Violence Hotline", phone: "800-952-2873" },
                { label: "Ashtabula Catholic Charities (Non-Emergency)", phone: "440-992-2121" }
              ]}
            />
          </div>
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  );
};

interface ResourceItemProps {
  label: string;
  phone: string;
  extension?: string;
  isPrimary?: boolean;
}

const ResourceItem: React.FC<ResourceItemProps> = ({ label, phone, extension, isPrimary }) => {
  return (
    <div className={`flex justify-between items-center py-2 px-3 text-sm ${isPrimary ? 'bg-red-50 rounded-md border border-red-200' : 'hover:bg-cvmhw-light rounded transition-colors'}`}>
      <span className={`font-medium ${isPrimary ? 'text-red-700' : ''}`}>{label}</span>
      <a 
        href={`tel:${phone.replace(/\D/g, '')}`} 
        className={`flex items-center gap-2 ${isPrimary ? 'text-red-600 hover:text-red-800' : 'text-cvmhw-blue hover:text-cvmhw-purple'}`}
      >
        <Phone size={16} className="shrink-0" />
        <span>{phone}{extension ? `, ext. ${extension}` : ""}</span>
      </a>
    </div>
  );
};

interface ResourceCategoryProps {
  title: string;
  resources: Array<{
    label: string;
    phone: string;
    extension?: string;
    isPrimary?: boolean;
  }>;
}

const ResourceCategory: React.FC<ResourceCategoryProps> = ({ title, resources }) => {
  return (
    <div className="space-y-3 bg-white p-3 rounded-md border border-gray-100 shadow-sm">
      <h3 className="font-medium text-cvmhw-purple border-b border-gray-200 pb-2 text-lg">{title}</h3>
      <div className="grid gap-1">
        {resources.map((resource) => (
          <ResourceItem 
            key={resource.label}
            label={resource.label}
            phone={resource.phone}
            extension={resource.extension}
            isPrimary={resource.isPrimary}
          />
        ))}
      </div>
    </div>
  );
};

export default CrisisResources;
