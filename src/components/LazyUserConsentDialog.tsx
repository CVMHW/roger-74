
import React, { lazy, Suspense } from 'react';

const UserConsentDialog = lazy(() => import('./UserConsentDialog'));

interface LazyUserConsentDialogProps {
  isOpen: boolean;
  onConsent: () => void;
}

const LazyUserConsentDialog: React.FC<LazyUserConsentDialogProps> = ({ isOpen, onConsent }) => {
  return (
    <Suspense fallback={<div className="text-center p-4">Loading consent dialog...</div>}>
      <UserConsentDialog isOpen={isOpen} onConsent={onConsent} />
    </Suspense>
  );
};

export default LazyUserConsentDialog;
