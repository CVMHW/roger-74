
/**
 * 5ResponseMemory Module
 * 
 * CRITICAL: Maintains a rolling 5-response memory buffer as a redundant backup
 * to ensure conversation context is never lost even if primary memory fails.
 * 
 * This system operates in parallel with the main memory system and serves as a
 * fail-safe to guarantee memory retention in all cases.
 */

// Type definition for memory entries
export interface MemoryEntry {
  timestamp: number;
  role: 'patient' | 'roger';
  content: string;
}

// In-memory storage for 5 most recent interactions
const FIVE_RESPONSE_BUFFER: MemoryEntry[] = [];

// Maximum buffer size (5 total messages - both patient and roger)
const MAX_BUFFER_SIZE = 5;

/**
 * CRITICAL: Add new response to the memory buffer
 * @param role Who is speaking ('patient' or 'roger')
 * @param content The message content
 */
export const addToFiveResponseMemory = (role: 'patient' | 'roger', content: string): void => {
  try {
    console.log(`5RESPONSE_MEMORY: Recording ${role} message`);
    
    // Create new memory entry
    const newEntry: MemoryEntry = {
      timestamp: Date.now(),
      role,
      content
    };
    
    // Add to buffer
    FIVE_RESPONSE_BUFFER.push(newEntry);
    
    // Maintain buffer size by removing oldest entries
    if (FIVE_RESPONSE_BUFFER.length > MAX_BUFFER_SIZE) {
      FIVE_RESPONSE_BUFFER.shift(); // Remove oldest entry
    }
    
    // Save to localStorage as backup persistence
    try {
      localStorage.setItem('fiveResponseMemory', JSON.stringify(FIVE_RESPONSE_BUFFER));
      console.log(`5RESPONSE_MEMORY: Buffer saved to localStorage (${FIVE_RESPONSE_BUFFER.length} items)`);
    } catch (storageError) {
      console.error('5RESPONSE_MEMORY: Failed to save to localStorage', storageError);
    }
    
  } catch (error) {
    console.error('5RESPONSE_MEMORY: Failed to add to memory buffer', error);
  }
};

/**
 * CRITICAL: Retrieve all entries from the 5-response memory buffer
 * @returns Array of memory entries
 */
export const getFiveResponseMemory = (): MemoryEntry[] => {
  try {
    // Attempt to load from localStorage if buffer is empty (page refresh)
    if (FIVE_RESPONSE_BUFFER.length === 0) {
      const storedMemory = localStorage.getItem('fiveResponseMemory');
      if (storedMemory) {
        const parsedMemory = JSON.parse(storedMemory);
        // Validate and restore memory
        if (Array.isArray(parsedMemory)) {
          parsedMemory.forEach(entry => {
            if (entry.timestamp && entry.role && entry.content) {
              FIVE_RESPONSE_BUFFER.push(entry);
            }
          });
          console.log(`5RESPONSE_MEMORY: Restored ${FIVE_RESPONSE_BUFFER.length} items from localStorage`);
        }
      }
    }
    
    return [...FIVE_RESPONSE_BUFFER];
  } catch (error) {
    console.error('5RESPONSE_MEMORY: Failed to retrieve memory buffer', error);
    return [];
  }
};

/**
 * CRITICAL: Get the most recent patient message
 * @returns The most recent patient message or undefined if none exists
 */
export const getLastPatientMessage = (): string | undefined => {
  try {
    // Find most recent patient entry
    for (let i = FIVE_RESPONSE_BUFFER.length - 1; i >= 0; i--) {
      if (FIVE_RESPONSE_BUFFER[i].role === 'patient') {
        return FIVE_RESPONSE_BUFFER[i].content;
      }
    }
    return undefined;
  } catch (error) {
    console.error('5RESPONSE_MEMORY: Failed to get last patient message', error);
    return undefined;
  }
};

/**
 * CRITICAL: Get the most recent roger response
 * @returns The most recent roger response or undefined if none exists
 */
export const getLastRogerResponse = (): string | undefined => {
  try {
    // Find most recent roger entry
    for (let i = FIVE_RESPONSE_BUFFER.length - 1; i >= 0; i--) {
      if (FIVE_RESPONSE_BUFFER[i].role === 'roger') {
        return FIVE_RESPONSE_BUFFER[i].content;
      }
    }
    return undefined;
  } catch (error) {
    console.error('5RESPONSE_MEMORY: Failed to get last roger response', error);
    return undefined;
  }
};

/**
 * CRITICAL: Verify the 5ResponseMemory system is operational
 * @returns Boolean indicating if the memory system is functioning
 */
export const verifyFiveResponseMemorySystem = (): boolean => {
  try {
    // Test adding and retrieving from memory
    const testMessage = `TEST_MESSAGE_${Date.now()}`;
    addToFiveResponseMemory('roger', testMessage);
    
    const allMemory = getFiveResponseMemory();
    const lastRogerMessage = getLastRogerResponse();
    
    // Verify test message was stored and retrieved
    const systemOperational = 
      allMemory.length > 0 &&
      lastRogerMessage === testMessage;
    
    console.log(`5RESPONSE_MEMORY: System verification ${systemOperational ? 'PASSED' : 'FAILED'}`);
    return systemOperational;
  } catch (error) {
    console.error('5RESPONSE_MEMORY: System verification failed', error);
    return false;
  }
};

// Initialize the memory system on load
try {
  // Load from localStorage on startup
  const storedMemory = localStorage.getItem('fiveResponseMemory');
  if (storedMemory) {
    try {
      const parsedMemory = JSON.parse(storedMemory);
      if (Array.isArray(parsedMemory)) {
        parsedMemory.forEach(entry => {
          if (entry.timestamp && entry.role && entry.content) {
            FIVE_RESPONSE_BUFFER.push(entry);
          }
        });
        
        // Maintain buffer size
        while (FIVE_RESPONSE_BUFFER.length > MAX_BUFFER_SIZE) {
          FIVE_RESPONSE_BUFFER.shift();
        }
        
        console.log(`5RESPONSE_MEMORY: Initialized with ${FIVE_RESPONSE_BUFFER.length} entries from localStorage`);
      }
    } catch (parseError) {
      console.error('5RESPONSE_MEMORY: Failed to parse stored memory', parseError);
    }
  } else {
    console.log('5RESPONSE_MEMORY: No stored memory found, initialized empty buffer');
  }
  
  // Verify system is operational
  verifyFiveResponseMemorySystem();
} catch (initError) {
  console.error('5RESPONSE_MEMORY: Initialization failed', initError);
}

/**
 * Export a comprehensive memory interface
 */
export default {
  addToFiveResponseMemory,
  getFiveResponseMemory,
  getLastPatientMessage,
  getLastRogerResponse,
  verifyFiveResponseMemorySystem
};
