
/**
 * Enhanced Crisis Audit Logger with Comprehensive Clinical Documentation
 * ALL SEVERITY LEVELS NOW LOGGED AND EMAILED
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
 * Enhanced crisis event logging with EMAIL NOTIFICATIONS FOR ALL SEVERITY LEVELS
 */
export const logCrisisEvent = async (entry: CrisisAuditEntry): Promise<void> => {
  try {
    console.log(`🚨 CRISIS AUDIT: STARTING CRISIS LOGGING FOR ${entry.severity.toUpperCase()} SEVERITY 🚨`);
    console.log('CRISIS AUDIT: Entry data:', entry);
    
    // Store locally first for backup
    const existingLogs = getStoredCrisisLogs();
    existingLogs.push(entry);
    localStorage.setItem('crisis_audit_logs', JSON.stringify(existingLogs));
    console.log('CRISIS AUDIT: Stored locally successfully');
    
    // CRITICAL: Send email notification for ALL severity levels
    console.log(`🚨 CRISIS AUDIT: SENDING EMAIL NOTIFICATION FOR ${entry.severity.toUpperCase()} SEVERITY 🚨`);
    
    const emailData = {
      timestamp: entry.timestamp,
      sessionId: entry.sessionId,
      crisisType: entry.crisisType,
      severity: entry.severity,
      userMessage: entry.userInput,
      rogerResponse: entry.rogerResponse,
      locationInfo: entry.locationInfo,
      clinicalNotes: entry.clinicalNotes || `${entry.severity.toUpperCase()} severity crisis detected - professional review required`,
      riskAssessment: entry.riskAssessment || `${entry.severity.toUpperCase()} level risk assessment needed`,
      userAgent: entry.userAgent,
      detectionMethod: entry.detectionMethod
    };
    
    console.log('CRISIS AUDIT: Email data prepared:', emailData);
    
    const emailSent = await sendCrisisEmailAlert(emailData);
    
    if (emailSent) {
      console.log(`✅ CRISIS AUDIT: EMAIL SUCCESSFULLY SENT for ${entry.severity.toUpperCase()} severity`);
    } else {
      console.error(`❌ CRISIS AUDIT: EMAIL FAILED for ${entry.severity.toUpperCase()} severity`);
      
      // Mark as email failed in local storage
      const failedEntry = { ...entry, emailFailed: true };
      const logs = getStoredCrisisLogs();
      logs[logs.length - 1] = failedEntry;
      localStorage.setItem('crisis_audit_logs', JSON.stringify(logs));
    }
    
    console.log(`✅ CRISIS AUDIT: COMPLETE for ${entry.severity.toUpperCase()} level`);
    
  } catch (error) {
    console.error('❌ CRISIS AUDIT ERROR: Failed to log crisis event:', error);
    
    // Store locally even if email fails
    try {
      const existingLogs = getStoredCrisisLogs();
      existingLogs.push({ ...entry, emailFailed: true });
      localStorage.setItem('crisis_audit_logs', JSON.stringify(existingLogs));
      console.log('CRISIS AUDIT: Stored locally despite email failure');
    } catch (storageError) {
      console.error('❌ CRISIS AUDIT CRITICAL: Failed to store locally:', storageError);
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
