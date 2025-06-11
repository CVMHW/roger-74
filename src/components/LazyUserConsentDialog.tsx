
import React, { lazy, Suspense } from 'react';

// Lazy load the UserConsentDialog to ensure React is ready
const UserConsentDialog = lazy(() => import('./UserConsentDialog'));

interface LazyUserConsentDialogProps {
  isOpen: boolean;
  onConsent: () => void;
}

const LazyUserConsentDialog: React.FC<LazyUserConsentDialogProps> = ({ isOpen, onConsent }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserConsentDialog isOpen={isOpen} onConsent={onConsent} />
    </Suspense>
  );
};

export default LazyUserConsentDialog;
