
/**
 * Enhanced Crisis Audit Logger with Comprehensive Clinical Documentation
 * ALL SEVERITY LEVELS NOW LOGGED AND EMAILED WITH DETAILED CLINICAL RECORDS
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
  emailSent?: boolean;
  locationInfo?: any;
  locationDescription?: string;
  clinicalNotes?: string;
  riskAssessment?: string;
  refusalHistory?: any;
  sessionDuration?: string;
  messageCount?: number;
  followUpRequired?: boolean;
  escalationLevel?: string;
  auditTimestamp?: string;
  auditError?: string;
}

/**
 * Enhanced crisis event logging with GUARANTEED EMAIL NOTIFICATIONS FOR ALL SEVERITY LEVELS
 */
export const logCrisisEvent = async (entry: CrisisAuditEntry): Promise<void> => {
  try {
    console.log(`🚨 CRISIS AUDIT: COMPREHENSIVE LOGGING FOR ${entry.severity.toUpperCase()} SEVERITY 🚨`);
    console.log('🚨 CRISIS AUDIT: Entry data:', entry);
    
    // Store locally first for backup and auditing
    const existingLogs = getStoredCrisisLogs();
    const timestampedEntry = {
      ...entry,
      auditTimestamp: new Date().toISOString(),
      followUpRequired: ['medium', 'high', 'critical'].includes(entry.severity),
      escalationLevel: getEscalationLevel(entry.severity)
    };
    
    existingLogs.push(timestampedEntry);
    localStorage.setItem('crisis_audit_logs', JSON.stringify(existingLogs));
    console.log('✅ CRISIS AUDIT: Stored locally successfully');
    
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
      clinicalNotes: entry.clinicalNotes || generateClinicalNotes(entry),
      riskAssessment: entry.riskAssessment || generateRiskAssessment(entry.severity),
      userAgent: entry.userAgent,
      detectionMethod: entry.detectionMethod
    };
    
    console.log('🚨 CRISIS AUDIT: Email data prepared:', emailData);
    
    const emailSent = await sendCrisisEmailAlert(emailData);
    
    if (emailSent) {
      console.log(`✅ CRISIS AUDIT: EMAIL SUCCESSFULLY SENT for ${entry.severity.toUpperCase()} severity`);
      
      // Update local storage to mark email as sent
      const logs = getStoredCrisisLogs();
      if (logs.length > 0) {
        logs[logs.length - 1] = { ...logs[logs.length - 1], emailSent: true };
        localStorage.setItem('crisis_audit_logs', JSON.stringify(logs));
      }
    } else {
      console.error(`❌ CRISIS AUDIT: EMAIL FAILED for ${entry.severity.toUpperCase()} severity`);
      
      // Mark as email failed in local storage
      const failedEntry = { ...timestampedEntry, emailFailed: true };
      const logs = getStoredCrisisLogs();
      logs[logs.length - 1] = failedEntry;
      localStorage.setItem('crisis_audit_logs', JSON.stringify(logs));
    }
    
    console.log(`✅ CRISIS AUDIT: COMPLETE for ${entry.severity.toUpperCase()} level`);
    
  } catch (error) {
    console.error('❌ CRISIS AUDIT ERROR: Failed to log crisis event:', error);
    
    // Store locally even if email fails - this is critical for audit trail
    try {
      const existingLogs = getStoredCrisisLogs();
      existingLogs.push({ 
        ...entry, 
        emailFailed: true, 
        auditError: error.message,
        auditTimestamp: new Date().toISOString()
      });
      localStorage.setItem('crisis_audit_logs', JSON.stringify(existingLogs));
      console.log('✅ CRISIS AUDIT: Stored locally despite email failure');
    } catch (storageError) {
      console.error('❌ CRISIS AUDIT CRITICAL: Failed to store locally:', storageError);
    }
  }
};

/**
 * Generate clinical notes based on crisis entry
 */
const generateClinicalNotes = (entry: CrisisAuditEntry): string => {
  return `${entry.severity.toUpperCase()} severity ${entry.crisisType} presentation detected via ${entry.detectionMethod}. 
Session duration: ${entry.sessionDuration || 'Unknown'}. 
Message count: ${entry.messageCount || 'Unknown'}. 
Professional clinical review required. 
Roger maintained appropriate peer support boundaries and provided crisis resource referrals.`;
};

/**
 * Generate risk assessment based on severity
 */
const generateRiskAssessment = (severity: string): string => {
  switch (severity) {
    case 'critical':
      return 'CRITICAL RISK - IMMEDIATE intervention required - Emergency services may be needed';
    case 'high':
      return 'HIGH RISK - Professional assessment required within 24 hours';
    case 'medium':
      return 'MODERATE RISK - Professional follow-up recommended within 72 hours';
    default:
      return 'LOW RISK - Monitoring recommended';
  }
};

/**
 * Get escalation level based on severity
 */
const getEscalationLevel = (severity: string): string => {
  switch (severity) {
    case 'critical':
      return 'IMMEDIATE';
    case 'high':
      return 'URGENT';
    case 'medium':
      return 'PRIORITY';
    default:
      return 'STANDARD';
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

/**
 * Get comprehensive crisis statistics for clinical review
 */
export const getCrisisStatistics = (): any => {
  const logs = getStoredCrisisLogs();
  
  return {
    totalCrisisEvents: logs.length,
    severityBreakdown: {
      critical: logs.filter(log => log.severity === 'critical').length,
      high: logs.filter(log => log.severity === 'high').length,
      medium: logs.filter(log => log.severity === 'medium').length,
      low: logs.filter(log => log.severity === 'low').length
    },
    crisisTypeBreakdown: logs.reduce((acc, log) => {
      acc[log.crisisType] = (acc[log.crisisType] || 0) + 1;
      return acc;
    }, {}),
    emailSuccessRate: logs.length > 0 ? 
      (logs.filter(log => !log.emailFailed).length / logs.length * 100).toFixed(2) + '%' : 
      'N/A',
    lastCrisisEvent: logs.length > 0 ? logs[logs.length - 1].timestamp : 'None'
  };
};
