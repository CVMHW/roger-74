
import React from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CreditCard, Heart } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

const insuranceProviders = [
  'Aetna',
  'Amerihealth Caritas', 
  'Anthem Ohio',
  'Anthem BCBS',
  'Beacon Health',
  'Buckeye',
  'Buckeye Ambetter',
  'Carelon',
  'Caresource',
  'Cigna',
  'Frontpath',
  'Medical Mutual',
  'Medicaid',
  'Medicare',
  'Molina',
  'OptumHealth',
  'Paramount',
  'UHC Choice',
  'UHC Corporate',
  'UHC Medicaid'
];

const InsuranceProviderButton: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`flex items-center gap-2 bg-gradient-to-r from-cvmhw-blue to-cvmhw-light text-white border-0 hover:from-cvmhw-light hover:to-cvmhw-blue hover:text-cvmhw-blue transition-all duration-300 shadow-md ${
            isMobile 
              ? 'text-sm px-4 py-3 min-h-[48px] min-w-[48px] w-full justify-center' 
              : 'text-sm px-3 py-2'
          }`}
        >
          <CreditCard size={isMobile ? 16 : 16} />
          <span className="font-medium leading-tight">
            {isMobile ? 'Insurance Accepted' : 'Insurance Accepted'}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 bg-gradient-to-b from-cvmhw-light/50 to-white border border-cvmhw-light shadow-lg">
        <h3 className="font-semibold text-cvmhw-blue mb-3 flex items-center gap-2">
          <Heart size={16} className="text-cvmhw-pink fill-cvmhw-pink" />
          Insurance Providers Accepted
        </h3>
        <div className="grid grid-cols-1 gap-1 max-h-60 overflow-y-auto">
          {insuranceProviders.map((provider, index) => (
            <div key={index} className="text-sm text-gray-700 py-1.5 px-2 rounded hover:bg-cvmhw-light/60 transition-colors border-b border-cvmhw-light/50 last:border-b-0">
              {provider}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-3 p-2 bg-cvmhw-light/40 rounded-md">
          💙 Contact us to verify coverage and benefits for your specific plan.
        </p>
      </PopoverContent>
    </Popover>
  );
};

export default InsuranceProviderButton;
