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

// Initialize from session storage if available
try {
  const storedMemory = sessionStorage.getItem('rogerFiveResponseMemory');
  if (storedMemory) {
    memoryStore = JSON.parse(storedMemory);
    console.log("5RESPONSEMEMORY: Initialized from sessionStorage");
  }
} catch (storageError) {
  console.error('Failed to initialize 5ResponseMemory from sessionStorage', storageError);
}
