
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ThemeToggle: React.FC = () => {
  const [isModernTheme, setIsModernTheme] = useState(() => {
    const saved = localStorage.getItem('roger-modern-theme');
    return saved === 'true';
  });
  
  const { toast } = useToast();

  useEffect(() => {
    // Apply or remove the modern theme class based on state
    if (isModernTheme) {
      document.documentElement.classList.add('roger-modern');
    } else {
      document.documentElement.classList.remove('roger-modern');
    }
    
    // Save the preference
    localStorage.setItem('roger-modern-theme', isModernTheme.toString());
  }, [isModernTheme]);

  const toggleTheme = () => {
    setIsModernTheme(prev => !prev);
    toast({
      title: isModernTheme ? "Classic Theme Applied" : "Modern Theme Applied",
      description: isModernTheme 
        ? "Reverted to the original Roger design." 
        : "Enhanced Roger aesthetics enabled.",
      duration: 3000
    });
  };

  return (
    <Button 
      variant="ghost" 
      size="sm"
      className="flex items-center gap-1" 
      onClick={toggleTheme}
      title={isModernTheme ? "Switch to classic theme" : "Switch to modern theme"}
    >
      {isModernTheme ? <EyeOff size={16} /> : <Eye size={16} />}
      <span className="text-xs hidden sm:inline">
        {isModernTheme ? 'Classic View' : 'Modern View'}
      </span>
    </Button>
  );
};

export default ThemeToggle;
