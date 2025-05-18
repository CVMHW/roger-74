
/**
 * Device Detection for Vector Embeddings
 * 
 * Detects the best available device for running models
 */

/**
 * Detect the best available device for running models
 */
export const detectBestAvailableDevice = async (): Promise<"webgpu" | "wasm" | "cpu" | "auto"> => {
  try {
    // Check for WebGPU support
    if ('gpu' in navigator) {
      console.log("WebGPU support detected, will try to use it");
      return "webgpu";
    }
    
    // Check for WebAssembly SIMD support
    if (WebAssembly && typeof WebAssembly.instantiateStreaming === 'function') {
      try {
        const module = await WebAssembly.compile(new Uint8Array([
          0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 9, 1, 7, 0, 
          65, 0, 65, 0, 253, 0, 26, 11
        ]));
        const hasSIMD = WebAssembly.Module.exports(module).some(
          ({ name }) => name === "simd"
        );
        if (hasSIMD) {
          console.log("WebAssembly SIMD support detected, using WASM");
          return "wasm";
        }
      } catch (e) {
        // SIMD not supported
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
