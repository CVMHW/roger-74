
import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

// Safe mobile detection that doesn't use React hooks
function getIsMobileStatic(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < MOBILE_BREAKPOINT;
}

export function useIsMobile(): boolean {
  // Use static detection as fallback for initial render
  const [isMobile, setIsMobile] = useState<boolean>(getIsMobileStatic);

  useEffect(() => {
    // Only set up listeners after component mounts
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    mql.addEventListener("change", onChange);
    // Update state with current value
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
