
import { ConcernType } from '../../../utils/reflection/reflectionTypes';

/**
 * Handles generation of young adult specific responses when appropriate
 */
export const generateYoungAdultResponse = async (
  userInput: string,
  concernType: ConcernType,
  youngAdultConcern: any
): Promise<string | null> => {
  if (!youngAdultConcern || !youngAdultConcern.category) {
    return null;
  }
  
  try {
    // Use dynamic import 
    const youngAdultModule = await import('../../../utils/response/youngAdultResponses');
    
    if (youngAdultModule.generateYoungAdultResponse) {
      const youngAdultResponse = youngAdultModule.generateYoungAdultResponse({
        concernInfo: youngAdultConcern,
        userMessage: userInput,
        concernType
      });
      
      if (youngAdultResponse) {
        return youngAdultResponse;
      }
    }
    
    return null;
  } catch (e) {
    console.log("Young adult response module not available:", e);
    return null;
  }
};
