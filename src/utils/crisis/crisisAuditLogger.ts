
/**
 * Enhanced Crisis Audit Logger with Comprehensive Clinical Documentation
 * 
 * Logs all crisis detections and sends email notifications to the psychologist
 */

import { sendCrisisEmailAlert } from './emailNotificationService';

export interface CrisisAuditEntry {
  timestamp: string;
  sessionId: string;
  userInput: string;
  crisisType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  rogerResponse: string;
  detectionMethod: string;
  userAgent?: string;
  ipAddress?: string;
  emailFailed?: boolean;
  locationInfo?: any;
  locationDescription?: string;
  clinicalNotes?: string;
  riskAssessment?: string;
  refusalHistory?: any;
  sessionDuration?: string;
  messageCount?: number;
}

/**
 * Enhanced crisis event logging with comprehensive clinical documentation
 */
export const logCrisisEvent = async (entry: CrisisAuditEntry): Promise<void> => {
  try {
    console.log('ENHANCED CRISIS AUDIT: Starting comprehensive crisis logging', entry);
    
    // Store in local storage for immediate backup
    const existingLogs = getStoredCrisisLogs();
    existingLogs.push(entry);
    localStorage.setItem('crisis_audit_logs', JSON.stringify(existingLogs));
    console.log('CRISIS AUDIT: Stored locally with enhanced clinical data');
    
    // Send comprehensive email notification
    const emailSent = await sendCrisisEmailAlert({
      timestamp: entry.timestamp,
      sessionId: entry.sessionId,
      crisisType: entry.crisisType,
      severity: entry.severity,
      userMessage: entry.userInput,
      rogerResponse: entry.rogerResponse,
      locationInfo: entry.locationInfo,
      clinicalNotes: entry.clinicalNotes,
      riskAssessment: entry.riskAssessment,
      userAgent: entry.userAgent,
      detectionMethod: entry.detectionMethod
    });
    
    if (emailSent) {
      console.log("ENHANCED CRISIS AUDIT: Email notification sent successfully");
    } else {
      console.error("ENHANCED CRISIS AUDIT: Failed to send email notification");
      // Mark as email failed but still store locally
      const failedEntry = { ...entry, emailFailed: true };
      const logs = getStoredCrisisLogs();
      logs[logs.length - 1] = failedEntry;
      localStorage.setItem('crisis_audit_logs', JSON.stringify(logs));
    }
    
    console.log('ENHANCED CRISIS AUDIT: Complete clinical documentation processed');
  } catch (error) {
    console.error('CRISIS AUDIT ERROR: Failed to log crisis event', error);
    // Store locally even if email fails
    try {
      const existingLogs = getStoredCrisisLogs();
      existingLogs.push({ ...entry, emailFailed: true });
      localStorage.setItem('crisis_audit_logs', JSON.stringify(existingLogs));
    } catch (storageError) {
      console.error('CRISIS AUDIT CRITICAL: Failed to store locally', storageError);
    }
  }
};

/**
 * Get stored crisis logs from localStorage
 */
export const getStoredCrisisLogs = (): CrisisAuditEntry[] => {
  try {
    const stored = localStorage.getItem('crisis_audit_logs');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to retrieve stored crisis logs:', error);
    return [];
  }
};

/**
 * Generate unique session ID
 */
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get current session ID or create new one
 */
export const getCurrentSessionId = (): string => {
  let sessionId = sessionStorage.getItem('roger_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('roger_session_id', sessionId);
    sessionStorage.setItem('session_start_time', Date.now().toString());
    sessionStorage.setItem('message_count', '0');
  }
  return sessionId;
};
