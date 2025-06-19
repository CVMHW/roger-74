
import React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(): boolean {
  // Guard against React not being available
  if (!React || typeof React.useState !== 'function' || typeof React.useEffect !== 'function') {
    console.warn('React hooks not available, defaulting to non-mobile');
    return false;
  }

  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
