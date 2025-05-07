
/**
 * Detects everyday situations that require practical support response
 */

import { EverydaySituationInfo } from '../types';
import { everydaySituationPatterns } from './constants';

/**
 * Detects everyday situations that require practical support response
 * @param input User message
 * @returns Information about everyday situation
 */
export const detectEverydaySituation = (input: string): EverydaySituationInfo => {
  for (const situation of everydaySituationPatterns) {
    if (situation.pattern.test(input)) {
      return {
        isEverydaySituation: true,
        situationType: situation.type,
        practicalSupportNeeded: situation.needsSupport
      };
    }
  }
  
  return {
    isEverydaySituation: false,
    situationType: null,
    practicalSupportNeeded: false
  };
};
