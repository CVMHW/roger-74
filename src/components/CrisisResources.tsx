
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Phone, Info, HelpCircle, AlertTriangle, Heart } from 'lucide-react';

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
      className="w-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
    >
      <CollapsibleTrigger asChild>
        <Button 
          variant="outline" 
          className={`w-full flex justify-between items-center p-6 border-0 ${
            forceOpen 
              ? 'bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100' 
              : 'bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 hover:from-blue-100 hover:via-purple-100 hover:to-pink-100'
          } transition-all duration-300 relative`}
        >
          <div className="flex items-center gap-4 text-gray-700">
            <div className="relative">
              {forceOpen ? (
                <AlertTriangle size={28} className="text-red-500" />
              ) : (
                <div className="relative">
                  <Heart size={28} className="text-cvmhw-pink fill-cvmhw-pink" />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cvmhw-blue opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-cvmhw-blue"></span>
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col items-start">
              <span className={`font-semibold text-xl ${forceOpen ? 'text-red-700' : 'text-gray-800'}`}>
                {forceOpen ? 'IMMEDIATE Crisis Resources & Support' : 'Crisis Resources & Support'}
              </span>
              <span className="text-sm text-gray-600 font-medium">
                Professional help available anytime you need it
              </span>
            </div>
            <div className={`${
              forceOpen ? 'bg-red-100 border-red-200' : 'bg-gradient-to-r from-cvmhw-blue/10 to-cvmhw-purple/10 border-cvmhw-blue/20'
            } p-2 rounded-lg flex items-center border ml-auto`}>
              <HelpCircle size={18} className={forceOpen ? 'text-red-600 mr-2' : 'text-cvmhw-blue mr-2'} />
              <span className={`text-sm font-medium ${forceOpen ? 'text-red-700' : 'text-cvmhw-purple'}`}>Available 24/7</span>
            </div>
          </div>
          <div className="flex items-center ml-4">
            <div className={`mr-3 ${
              forceOpen ? 'bg-red-50 border-red-300' : 'bg-gradient-to-r from-white/80 to-blue-50/80 border-cvmhw-blue/30'
            } p-2 rounded-full border backdrop-blur-sm`}>
              <span className={`text-xs font-medium whitespace-nowrap ${
                forceOpen ? 'text-red-700' : 'bg-gradient-to-r from-cvmhw-blue to-cvmhw-purple bg-clip-text text-transparent'
              }`}>
                {isOpen ? 'Click to hide resources' : 'Click to view resources'}
              </span>
            </div>
            {isOpen ? (
              <ChevronUp size={24} className="text-gray-600" />
            ) : (
              <ChevronDown size={24} className="text-gray-600" />
            )}
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
            
            <p className="text-sm text-gray-600 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
              Please use the resources below for immediate relief of symptoms and contact one of the relevant crisis resources or 911 for immediate assistance.
            </p>
            
            <ResourceCategory 
              title="Ohio/National Crisis Support"
              resources={[
                { label: "National Suicide Prevention Hotline", phone: "988", isPrimary: true },
                { label: "National Suicide Prevention Hotline (Alternative)", phone: "1-800-273-8255" },
                { label: "Ohio Veteran Crisis Line", phone: "1-800-273-8255" },
                { label: "Ohio Crisis Text Line", phone: "Text 241-241" },
                { label: "Trevor Project LGBTQ+ Sensitive Crisis Emergencies", phone: "866-488-7386" },
                { label: "Ohio Trans Lifeline", phone: "877-565-8860" },
                { label: "Domestic Violence Lifeline", phone: "330-453-7233" },
                { label: "Opiate Hotline", phone: "330-453-4357" },
                { label: "Substance Abuse and Mental Health Hotline", phone: "1-800-622-4357" },
                { label: "Ohio Gambling Hotline", phone: "1-888-532-3500" },
                { label: "United Way of Ohio", phone: "211" },
                { label: "SMART Recovery (Mentor OH)", phone: "440-951-5357" }
              ]}
            />
            
            <ResourceCategory 
              title="Akron/Canton Crisis Support"
              resources={[
                { label: "Summit County Mobile Crisis", phone: "330-434-9144" },
                { label: "Akron Children's Crisis Line", phone: "330-543-7472" },
                { label: "Stark County Mobile Crisis", phone: "330-452-6000" },
                { label: "Homeless Hotline Stark County", phone: "330-452-4363" },
                { label: "Homeless Hotline Summit County", phone: "330-615-0577" },
                { label: "Akron Children's In-Patient Psychiatry", phone: "330-543-5015" },
                { label: "Akron Children's Psychiatric Intake Response Center", phone: "330-543-7472" },
                { label: "Portage Path Psychiatric Emergency Services", phone: "330-762-6110" },
                { label: "Alcoholics Anonymous Akron (9a-5p)", phone: "330-253-8181" }
              ]}
            />
            
            <ResourceCategory 
              title="Ashtabula/Jefferson Crisis Support"
              resources={[
                { label: "Ashtabula County 24/7 Substance Use Disorder Crisis Hotline", phone: "1-800-577-7849" },
                { label: "Ashtabula Rape Crisis Center Hotline", phone: "1-440-354-7364" },
                { label: "Ashtabula County Children Services 24/7 Hotline", phone: "1-888-998-1811" },
                { label: "Alcoholics Anonymous Ashtabula 24/7 Hotline", phone: "1-440-992-8383" },
                { label: "Ashtabula Homesafe Domestic Violence Hotline", phone: "1-800-952-2873" },
                { label: "Rock Creek Glenbeigh Substance Abuse Hospital", phone: "1-877-487-5126" },
                { label: "Ashtabula County Regional Medical Center Hospital", phone: "1-440-997-2262" },
                { label: "Chardon Ravenwood Psychiatric Hospital & Outpatient Clinic", phone: "1-440-285-4552" },
                { label: "Cleveland Ohio Guidestone Pediatric Residential Psychiatric Hospital", phone: "1-844-622-5564" },
                { label: "Ashtabula Samaritan House (Housing Assistance)", phone: "1-440-992-3178" },
                { label: "Ashtabula Beatitudes House (Housing Assistance)", phone: "1-440-992-0265" },
                { label: "Ashtabula Frontline Services", phone: "1-440-381-8347" },
                { label: "Ashtabula Catholic Charities (Non-Emergency)", phone: "1-440-992-2121" }
              ]}
            />
            
            <ResourceCategory 
              title="Cleveland/Mentor/Chardon Crisis Support"
              resources={[
                { label: "Cuyahoga County Mobile Crisis (Emergency)", phone: "1-216-623-6555" },
                { label: "Cleveland Emergency Medical Services (Emergency)", phone: "1-216-664-2555" },
                { label: "Cleveland National Alliance in Mental Health (NAMI) Hotline", phone: "1-216-875-7776" },
                { label: "Cleveland Emergency Children's Services Hotline", phone: "1-216-696-5437" },
                { label: "Cleveland Elder Abuse Hotline", phone: "1-216-420-6700" },
                { label: "Cleveland Emily Program Eating Disorders Residential Hospital Admissions", phone: "1-888-272-0836" },
                { label: "Cleveland Ohio Guidestone Pediatric Residential Psychiatric Hospital Admissions", phone: "1-844-622-5564" },
                { label: "Cleveland Windsor-Laurelwood Residential Psychiatric Hospital Admissions", phone: "1-440-953-3000" },
                { label: "Cleveland Highland Springs Residential Psychiatric Hospital Admissions", phone: "1-216-302-3070" },
                { label: "Cleveland Bluestone Residential Pediatric Psychiatric Hospital Admissions", phone: "1-216-200-5030" },
                { label: "Cleveland Veteran's Affairs Louis Stokes Mental Healthcare", phone: "1-216-791-3800", extension: "61035" },
                { label: "Chardon Ravenwood Psychiatric Hospital & Outpatient Clinic", phone: "1-440-285-4552" },
                { label: "Rock Creek Glenbeigh Substance Abuse Hospital", phone: "1-877-487-5126" },
                { label: "Cuyahoga County Catholic Charities (Non-Emergency)", phone: "1-216-334-2900" },
                { label: "Homeless Hotline Cuyahoga County", phone: "1-216-674-6700" },
                { label: "EDEN Long-Term Housing", phone: "1-216-961-9690" },
                { label: "Front-Steps Long-Term Housing", phone: "1-216-781-2250" },
                { label: "Cleveland Project DAWN Expanded Mobile Unit (Emergency)", phone: "1-216-387-6290" },
                { label: "Lake County Frontline Services", phone: "1-440-381-8347" },
                { label: "Cleveland Frontline Services", phone: "1-216-623-6555" },
                { label: "Alcoholics Anonymous Cleveland (9a-5p)", phone: "1-216-241-7387" }
              ]}
            />

            <ResourceCategory 
              title="Lorain/North Olmsted/Brook Park Crisis Support"
              resources={[
                { label: "Riveon/Nord Center Crisis Line (Emergency)", phone: "1-800-888-6161", isPrimary: true },
                { label: "Riveon/Nord Center Crisis Line (Emergency - Alternative)", phone: "988", isPrimary: true },
                { label: "Berea Ohio Guidestone Pediatric Residential Psychiatric Hospital Admissions", phone: "1-844-622-5564" },
                { label: "University Hospitals St. John Medical Center", phone: "888-496-3730" },
                { label: "Riveon/Nord Center (Non-Emergency) Scheduling", phone: "440-233-7232" },
                { label: "Homeless Hotline (Catholic Charities) Lorain County", phone: "440-242-0455" },
                { label: "Catholic Charities Lorain County", phone: "440-366-1106" },
                { label: "Alcoholics Anonymous Lorain (10a-2p)", phone: "440-246-1800" },
                { label: "Safe Harbor & Genesis House", phone: "440-323-3400" },
                { label: "The Gathering Place", phone: "216-595-9546" },
                { label: "The Navigator", phone: "440-240-7025" }
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
