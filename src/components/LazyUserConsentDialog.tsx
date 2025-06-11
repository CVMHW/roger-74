
import React, { lazy, Suspense, useEffect, useState } from 'react';

// Ensure React is fully ready before lazy loading
const UserConsentDialog = lazy(() => {
  console.log('Loading UserConsentDialog...');
  return import('./UserConsentDialog');
});

interface LazyUserConsentDialogProps {
  isOpen: boolean;
  onConsent: () => void;
}

const LazyUserConsentDialog: React.FC<LazyUserConsentDialogProps> = ({ isOpen, onConsent }) => {
  const [isReactReady, setIsReactReady] = useState(false);

  useEffect(() => {
    // Ensure React hooks are fully available
    const timer = setTimeout(() => {
      setIsReactReady(true);
      console.log('LazyUserConsentDialog: React is ready');
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isReactReady) {
    return <div className="text-center p-4">Loading consent dialog...</div>;
  }

  return (
    <Suspense fallback={<div className="text-center p-4">Loading consent dialog...</div>}>
      <UserConsentDialog isOpen={isOpen} onConsent={onConsent} />
    </Suspense>
  );
};

export default LazyUserConsentDialog;
