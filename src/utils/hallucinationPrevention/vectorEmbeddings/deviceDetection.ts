
/**
 * Device Detection for Vector Embeddings
 * 
 * Detects the best available device for running models
 */

import { DeviceType } from './types';

// WASM SIMD test binary
const WASM_SIMD_TEST = new Uint8Array([
  0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 9, 1, 7, 0, 
  65, 0, 65, 0, 253, 0, 26, 11
]);

/**
 * Detect the best available device for running models
 * Returns device type in order of preference: webgpu > wasm > cpu
 */
export const detectBestAvailableDevice = async (): Promise<DeviceType> => {
  try {
    // Check for WebGPU support
    if ('gpu' in navigator) {
      try {
        // Try to get a GPU adapter to confirm WebGPU is actually working
        const adapter = await (navigator as any).gpu.requestAdapter();
        if (adapter) {
          console.log("WebGPU support detected and confirmed working");
          return "webgpu";
        }
      } catch (gpuError) {
        console.warn("WebGPU detection error:", gpuError);
      }
    }
    
    // Check for WebAssembly SIMD support
    if (WebAssembly && typeof WebAssembly.instantiateStreaming === 'function') {
      try {
        const module = await WebAssembly.compile(WASM_SIMD_TEST);
        const hasSIMD = WebAssembly.Module.exports(module).some(
          ({ name }) => name === "simd"
        );
        if (hasSIMD) {
          console.log("WebAssembly SIMD support detected, using WASM");
          return "wasm";
        }
      } catch (e) {
        console.warn("WASM SIMD detection error:", e);
      }
    }

    // Fallback to CPU
    console.log("Using CPU as fallback");
    return "cpu";
  } catch (error) {
    console.error("Error detecting device capabilities:", error);
    return "cpu"; // Default to CPU
  }
};

/**
 * Get available memory info if possible
 * Returns undefined if not available
 */
export const getAvailableMemory = (): { total: number; used: number; available?: number } | undefined => {
  try {
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      return {
        total: memInfo.jsHeapSizeLimit,
        used: memInfo.usedJSHeapSize,
        available: memInfo.jsHeapSizeLimit - memInfo.usedJSHeapSize
      };
    }
    return undefined;
  } catch (error) {
    console.warn("Unable to get memory info:", error);
    return undefined;
  }
};
