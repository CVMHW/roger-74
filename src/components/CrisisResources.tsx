
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Phone, Info } from 'lucide-react';

const CrisisResources = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={setIsOpen} 
      className="w-full bg-white rounded-lg shadow-md overflow-hidden border-2 border-roger-light"
    >
      <CollapsibleTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full flex justify-between items-center p-5 border-b bg-roger-surface hover:bg-blue-100"
        >
          <div className="flex items-center gap-3 text-roger-dark">
            <Info size={24} className="text-roger" />
            <span className="font-semibold text-lg">Crisis Resources & Support</span>
          </div>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <ScrollArea className="h-80 p-5">
          <div className="space-y-6">
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
                { label: "Ohio Gambling Hotline", phone: "888-532-3500" },
                { label: "Ohio Veteran Crisis Line", phone: "800-273-8255" },
                { label: "Ohio Crisis Text Line", phone: "Text 241-241" },
                { label: "Trevor Project LGBTQ+ Sensitive Crisis Emergencies", phone: "866-488-7386" },
                { label: "Ohio Trans Lifeline", phone: "877-565-8860" },
                { label: "Domestic Violence Lifeline", phone: "330-453-7233" },
                { label: "National Suicide Prevention Hotline", phone: "800-273-8255" },
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
}

const ResourceItem: React.FC<ResourceItemProps> = ({ label, phone, extension }) => {
  return (
    <div className="flex justify-between items-center py-2 px-3 text-sm hover:bg-gray-50 rounded transition-colors">
      <span className="font-medium">{label}</span>
      <a 
        href={`tel:${phone.replace(/\D/g, '')}`} 
        className="flex items-center gap-2 text-roger hover:text-roger-dark"
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
  }>;
}

const ResourceCategory: React.FC<ResourceCategoryProps> = ({ title, resources }) => {
  return (
    <div className="space-y-3 bg-white p-3 rounded-md border border-gray-100 shadow-sm">
      <h3 className="font-medium text-roger-dark border-b border-gray-200 pb-2 text-lg">{title}</h3>
      <div className="grid gap-1">
        {resources.map((resource) => (
          <ResourceItem 
            key={resource.label}
            label={resource.label}
            phone={resource.phone}
            extension={resource.extension}
          />
        ))}
      </div>
    </div>
  );
};

export default CrisisResources;
