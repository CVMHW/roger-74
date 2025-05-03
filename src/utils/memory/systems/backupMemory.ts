/**
 * Backup Memory System
 * 
 * Provides redundant storage for critical memory items
 * Ensures recovery in case of system failure
 */

import { MemoryItem, MemoryBackupRecord } from '../types';

// Maximum number of backups to keep
const MAX_BACKUP_RECORDS = 10;

// In-memory storage for backup records
let backupRecords: MemoryBackupRecord[] = [];

/**
 * Create a backup of memory items
 */
export const createBackup = (
  items: MemoryItem[],
  systemId: string
): MemoryBackupRecord => {
  console.log(`BACKUP MEMORY: Creating backup for ${systemId}`);
  
  const backupRecord: MemoryBackupRecord = {
    timestamp: Date.now(),
    systemId,
    backupLocation: 'localStorage',
    itemCount: items.length,
    status: 'pending'
  };
  
  try {
    // Create backup in localStorage
    const backupKey = `rogerBackup_${systemId}_${Date.now()}`;
    localStorage.setItem(backupKey, JSON.stringify(items));
    
    // Update record
    backupRecord.status = 'success';
    
    // Store backup record
    backupRecords.unshift(backupRecord);
    
    // Maintain record limit
    if (backupRecords.length > MAX_BACKUP_RECORDS) {
      // Get oldest backup for same system
      const oldestSameSystemIndex = backupRecords
        .map((record, index) => ({ record, index }))
        .filter(item => item.record.systemId === systemId)
        .sort((a, b) => a.record.timestamp - b.record.timestamp)[0]?.index;
      
      if (oldestSameSystemIndex !== undefined) {
        // Remove the record
        const oldRecord = backupRecords[oldestSameSystemIndex];
        backupRecords.splice(oldestSameSystemIndex, 1);
        
        // Clean up the associated backup
        const oldBackupKey = `rogerBackup_${oldRecord.systemId}_${oldRecord.timestamp}`;
        localStorage.removeItem(oldBackupKey);
      }
    }
    
    // Persist backup records
    localStorage.setItem('rogerBackupRecords', JSON.stringify(backupRecords));
    
    console.log(`BACKUP MEMORY: Successfully created backup for ${systemId}`);
    return backupRecord;
    
  } catch (error) {
    console.error(`BACKUP MEMORY: Failed to create backup for ${systemId}`, error);
    
    // Update record
    backupRecord.status = 'failed';
    backupRecord.error = String(error);
    
    // Still store the record
    backupRecords.unshift(backupRecord);
    
    return backupRecord;
  }
};

/**
 * Restore memory items from backup
 */
export const restoreFromBackup = (
  systemId: string,
  timestamp?: number
): MemoryItem[] | null => {
  console.log(`BACKUP MEMORY: Attempting to restore backup for ${systemId}`);
  
  try {
    // Find the relevant backup record
    let targetRecord: MemoryBackupRecord | undefined;
    
    if (timestamp) {
      // Find specific backup by timestamp
      targetRecord = backupRecords.find(
        record => record.systemId === systemId && record.timestamp === timestamp
      );
    } else {
      // Find most recent successful backup for this system
      targetRecord = backupRecords
        .filter(record => record.systemId === systemId && record.status === 'success')
        .sort((a, b) => b.timestamp - a.timestamp)[0];
    }
    
    if (!targetRecord) {
      console.log(`BACKUP MEMORY: No suitable backup found for ${systemId}`);
      return null;
    }
    
    // Restore from backup
    const backupKey = `rogerBackup_${systemId}_${targetRecord.timestamp}`;
    const backupData = localStorage.getItem(backupKey);
    
    if (!backupData) {
      console.error(`BACKUP MEMORY: Backup data not found for key ${backupKey}`);
      return null;
    }
    
    const restoredItems = JSON.parse(backupData) as MemoryItem[];
    console.log(`BACKUP MEMORY: Successfully restored ${restoredItems.length} items for ${systemId}`);
    
    return restoredItems;
    
  } catch (error) {
    console.error(`BACKUP MEMORY: Failed to restore backup for ${systemId}`, error);
    return null;
  }
};

/**
 * Get all backup records
 */
export const getBackupRecords = (): MemoryBackupRecord[] => {
  return [...backupRecords];
};

/**
 * Initialize backup records from localStorage
 */
export const initializeBackupRecords = (): boolean => {
  try {
    const storedRecords = localStorage.getItem('rogerBackupRecords');
    if (storedRecords) {
      backupRecords = JSON.parse(storedRecords);
      console.log("BACKUP MEMORY: Initialized records from localStorage");
      return true;
    }
    return false;
  } catch (error) {
    console.error("BACKUP MEMORY: Failed to initialize records", error);
    return false;
  }
};

/**
 * Get system status
 */
export const getBackupStatus = () => {
  return {
    active: true,
    recordCount: backupRecords.length,
    lastBackup: backupRecords.length > 0 
      ? backupRecords[0].timestamp 
      : undefined
  };
};

// Initialize on module load
initializeBackupRecords();
