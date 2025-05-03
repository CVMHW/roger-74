/**
 * 5ResponseMemory System - Robust Short-Term Memory Failsafe
 * 
 * This system maintains a record of the 5 most recent patient messages and Roger responses
 * to ensure continuity even if primary memory systems fail.
 */

export interface MemoryEntry {
  role: 'patient' | 'roger';
  content: string;
  timestamp: number;
}

// In-memory storage for 5ResponseMemory
let memoryStore: MemoryEntry[] = [];

/**
 * Add an entry to the 5ResponseMemory system
 */
export const addToFiveResponseMemory = (role: 'patient' | 'roger', content: string): void => {
  try {
    console.log("5RESPONSEMEMORY: Adding entry");
    
    // Create new memory entry
    const newEntry: MemoryEntry = {
      role,
      content,
      timestamp: Date.now()
    };
    
    // Add to memory store
    memoryStore.unshift(newEntry);
    
    // Keep only the last 10 entries (5 pairs of interactions)
    if (memoryStore.length > 10) {
      memoryStore = memoryStore.slice(0, 10);
    }
    
    // Also persist to session storage as backup
    try {
      sessionStorage.setItem('rogerFiveResponseMemory', JSON.stringify(memoryStore));
    } catch (storageError) {
      console.error('Failed to persist 5ResponseMemory to sessionStorage', storageError);
    }
    
  } catch (error) {
    console.error('Error adding to 5ResponseMemory:', error);
  }
};

/**
 * Get all entries from the 5ResponseMemory system
 */
export const getFiveResponseMemory = (): MemoryEntry[] => {
  try {
    console.log("5RESPONSEMEMORY: Retrieving all entries");
    
    // If memory store is empty, try to recover from session storage
    if (memoryStore.length === 0) {
      try {
        const storedMemory = sessionStorage.getItem('rogerFiveResponseMemory');
        if (storedMemory) {
          memoryStore = JSON.parse(storedMemory);
        }
      } catch (storageError) {
        console.error('Failed to retrieve 5ResponseMemory from sessionStorage', storageError);
      }
    }
    
    return [...memoryStore];
  } catch (error) {
    console.error('Error retrieving from 5ResponseMemory:', error);
    return [];
  }
};

/**
 * Reset the 5ResponseMemory system for a new conversation
 */
export const resetFiveResponseMemory = (): void => {
  try {
    console.log("5RESPONSEMEMORY: Resetting for new conversation");
    
    // Clear memory store
    memoryStore = [];
    
    // Clear session storage
    try {
      sessionStorage.removeItem('rogerFiveResponseMemory');
    } catch (storageError) {
      console.error('Failed to clear 5ResponseMemory from sessionStorage', storageError);
    }
    
  } catch (error) {
    console.error('Error resetting 5ResponseMemory:', error);
  }
};

/**
 * Check if this appears to be a new conversation
 * Uses time-based heuristic: 30+ minutes since last interaction indicates new conversation
 */
export const isNewConversationFiveResponse = (): boolean => {
  if (memoryStore.length === 0) return true;
  
  const lastEntry = memoryStore[0];
  const currentTime = Date.now();
  const timeSinceLastEntry = currentTime - lastEntry.timestamp;
  
  // If more than 30 minutes have passed, consider it a new conversation
  const thirtyMinutesMs = 30 * 60 * 1000;
  return timeSinceLastEntry > thirtyMinutesMs;
};

/**
 * Get the most recent patient message
 */
export const getLastPatientMessage = (): string | null => {
  try {
    console.log("5RESPONSEMEMORY: Retrieving last patient message");
    
    // Find the most recent patient entry
    const patientEntries = memoryStore.filter(entry => entry.role === 'patient');
    if (patientEntries.length > 0) {
      return patientEntries[0].content;
    }
    
    return null;
  } catch (error) {
    console.error('Error retrieving last patient message from 5ResponseMemory:', error);
    return null;
  }
};

/**
 * Verify that the 5ResponseMemory system is operational
 */
export const verifyFiveResponseMemorySystem = (): boolean => {
  try {
    console.log("5RESPONSEMEMORY: Verifying system operational status");
    
    // Try to add a test entry
    const testContent = `SYSTEM_TEST_${Date.now()}`;
    const originalLength = memoryStore.length;
    
    // Add test entry
    addToFiveResponseMemory('roger', testContent);
    
    // Verify entry was added
    const newLength = memoryStore.length;
    const testEntry = memoryStore[0];
    
    // Check if entry was added successfully
    const systemWorking = newLength > originalLength && 
                         testEntry && 
                         testEntry.content === testContent;
    
    // Remove test entry
    memoryStore.shift();
    
    console.log(`5RESPONSEMEMORY: System operational: ${systemWorking}`);
    return systemWorking;
  } catch (error) {
    console.error('Error verifying 5ResponseMemory system:', error);
    return false;
  }
};

// Modified 5ResponseMemory initialization to check if this appears to be a new session
// Initialize from session storage if available and if it doesn't appear to be a new session
try {
  const storedMemory = sessionStorage.getItem('rogerFiveResponseMemory');
  
  if (storedMemory) {
    const parsedMemory = JSON.parse(storedMemory);
    
    // Check if this is potentially a new session (browser just opened)
    const lastEntryTime = parsedMemory[0]?.timestamp || 0;
    const currentTime = Date.now();
    const timeSinceLastEntry = currentTime - lastEntryTime;
    
    // If the last entry is recent (within 30 minutes), restore the memory
    // Otherwise, start fresh
    const thirtyMinutesMs = 30 * 60 * 1000;
    
    if (timeSinceLastEntry < thirtyMinutesMs) {
      memoryStore = parsedMemory;
      console.log("5RESPONSEMEMORY: Initialized from sessionStorage");
    } else {
      console.log("5RESPONSEMEMORY: Previous session detected but timed out, starting fresh");
      resetFiveResponseMemory();
    }
  }
} catch (storageError) {
  console.error('Failed to initialize 5ResponseMemory from sessionStorage', storageError);
}
