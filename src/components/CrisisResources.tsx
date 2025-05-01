
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
      className="w-full bg-white rounded-lg shadow-md overflow-hidden"
    >
      <CollapsibleTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full flex justify-between items-center p-4 border-b"
        >
          <div className="flex items-center gap-2 text-roger-dark">
            <Info size={18} />
            <span className="font-medium">Crisis Resources & Support</span>
          </div>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <ScrollArea className="h-64 p-4">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Please use the resources below for immediate relief of symptoms and contact one of the relevant crisis resources or 911 for immediate assistance.
            </p>
            
            <div className="space-y-2">
              <h3 className="font-medium text-roger-dark">Summit County</h3>
              <div className="grid gap-2">
                <ResourceItem 
                  label="Summit County Mobile Crisis" 
                  phone="330-434-9144" 
                />
                <ResourceItem 
                  label="Akron-Children's Crisis Line" 
                  phone="330-543-7472" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-roger-dark">Stark County</h3>
              <div className="grid gap-2">
                <ResourceItem 
                  label="Stark County Mobile Crisis" 
                  phone="330-452-6000" 
                />
                <ResourceItem 
                  label="Homeless Hotline Stark County" 
                  phone="330-452-4363" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-roger-dark">Cuyahoga County</h3>
              <div className="grid gap-2">
                <ResourceItem 
                  label="Cuyahoga County Mobile Crisis (Emergency)" 
                  phone="216-623-6555" 
                />
                <ResourceItem 
                  label="Homeless Hotline Cuyahoga County" 
                  phone="216-674-6700" 
                />
                <ResourceItem 
                  label="Cleveland Project DAWN Expanded Mobile Unit (Emergency)" 
                  phone="216-387-6290" 
                />
                <ResourceItem 
                  label="Cleveland Emergency Medical Services (Emergency)" 
                  phone="216-664-2555" 
                />
                <ResourceItem 
                  label="Cleveland Emily Program Eating Disorders Residential Admissions" 
                  phone="888-272-0836" 
                />
                <ResourceItem 
                  label="Cleveland Windsor-Laurelwood Residential Psychiatric Hospital" 
                  phone="440-953-3000" 
                />
                <ResourceItem 
                  label="Cleveland Highland Springs Residential Psychiatric Hospital" 
                  phone="216-302-3070" 
                />
                <ResourceItem 
                  label="Cleveland Bluestone Residential Pediatric Psychiatric Hospital" 
                  phone="216-200-5030" 
                />
                <ResourceItem 
                  label="Cleveland Veteran's Affairs Louis Stokes Mental Healthcare" 
                  phone="216-791-3800" 
                  extension="61035" 
                />
                <ResourceItem 
                  label="Cuyahoga County Catholic Charities (Non-Emergency)" 
                  phone="216-334-2900" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-roger-dark">Ohio State & National</h3>
              <div className="grid gap-2">
                <ResourceItem 
                  label="Ohio Veteran Crisis Line" 
                  phone="800-273-8255" 
                />
                <ResourceItem 
                  label="Ohio Crisis Text Line" 
                  phone="Text 241-241" 
                />
                <ResourceItem 
                  label="Trevor Project LGBTQ+ Sensitive Crisis Emergencies" 
                  phone="866-488-7386" 
                />
                <ResourceItem 
                  label="Ohio Trans Lifeline" 
                  phone="877-565-8860" 
                />
                <ResourceItem 
                  label="Domestic Violence Lifeline" 
                  phone="330-453-7233" 
                />
                <ResourceItem 
                  label="National Suicide Prevention Hotline" 
                  phone="800-273-8255" 
                />
                <ResourceItem 
                  label="Opiate Hotline" 
                  phone="330-453-4357" 
                />
                <ResourceItem 
                  label="United Way of Ohio" 
                  phone="211" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-roger-dark">Ashtabula County</h3>
              <div className="grid gap-2">
                <ResourceItem 
                  label="Ashtabula County 24/7 Substance Use Disorder Crisis Hotline" 
                  phone="800-577-7849" 
                />
                <ResourceItem 
                  label="Ashtabula Rape Crisis Center Hotline" 
                  phone="440-354-7364" 
                />
                <ResourceItem 
                  label="Ashtabula County Children Services 24/7 Hotline" 
                  phone="888-998-1811" 
                />
                <ResourceItem 
                  label="Ashtabula Homesafe Domestic Violence Hotline" 
                  phone="800-952-2873" 
                />
                <ResourceItem 
                  label="Ashtabula Catholic Charities (Non-Emergency)" 
                  phone="440-992-2121" 
                />
              </div>
            </div>
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
    <div className="flex justify-between items-center py-1 px-2 text-sm hover:bg-gray-50 rounded">
      <span>{label}</span>
      <a 
        href={`tel:${phone.replace(/\D/g, '')}`} 
        className="flex items-center gap-1 text-roger hover:text-roger-dark"
      >
        <Phone size={14} />
        <span>{phone}{extension ? `, ext. ${extension}` : ""}</span>
      </a>
    </div>
  );
};

export default CrisisResources;
