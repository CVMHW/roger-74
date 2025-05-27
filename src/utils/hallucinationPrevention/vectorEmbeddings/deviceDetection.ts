
/**
 * Device Detection - Clean and Reliable
 */

import { DeviceType } from './types';

/**
 * Detect the best available device with reliable fallbacks
 */
export const detectBestAvailableDevice = async (): Promise<DeviceType> => {
  try {
    // Always default to CPU for maximum reliability
    // WebGPU and WASM can be enabled later when fully stable
    console.log("Vector embeddings: Using CPU for maximum reliability");
    return "cpu";
    
  } catch (error) {
    console.warn("Device detection error, defaulting to CPU:", error);
    return "cpu";
  }
};

/**
 * Get available memory info if possible
 */
export const getAvailableMemory = (): { total: number; used: number; available?: number } | undefined => {
  try {
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      return {
        total: memInfo.jsHeapSizeLimit || 0,
        used: memInfo.usedJSHeapSize || 0,
        available: (memInfo.jsHeapSizeLimit || 0) - (memInfo.usedJSHeapSize || 0)
      };
    }
    return undefined;
  } catch (error) {
    return undefined;
  }
};

/**
 * Check if device supports vector operations
 */
export const supportsVectorOperations = (): boolean => {
  try {
    // Test basic array operations
    const testArray = new Float32Array(10);
    testArray[0] = 1.0;
    return testArray[0] === 1.0;
  } catch (error) {
    return false;
  }
};
