
import { useState } from 'react';

/**
 * Hook for managing processing context (what Roger is "thinking" about)
 */
export const useProcessContext = () => {
  const [processingContext, setProcessingContext] = useState<string | null>(null);

  return {
    processingContext,
    setProcessingContext
  };
};
