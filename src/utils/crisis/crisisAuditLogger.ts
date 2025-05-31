
/**
 * Enhanced Crisis Audit Logger with Comprehensive Clinical Documentation
 * 
 * Logs all crisis detections and sends email notifications to the psychologist
 */

import { LocationInfo } from './crisisResponseCoordinator';
import { extractLocationFromText, getBrowserLocation, getLocationDescription } from './locationDetection';
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
  locationInfo?: LocationInfo;
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
    
    // Enhance entry with additional clinical data
    const enhancedEntry = await enhanceEntryWithClinicalData(entry);
    
    // Store in local storage for immediate backup
    const existingLogs = getStoredCrisisLogs();
    existingLogs.push(enhancedEntry);
    localStorage.setItem('crisis_audit_logs', JSON.stringify(existingLogs));
    console.log('CRISIS AUDIT: Stored locally with enhanced clinical data');
    
    // Send comprehensive email notification matching your format
    await sendEnhancedCrisisEmailNotification(enhancedEntry);
    
    console.log('ENHANCED CRISIS AUDIT: Complete clinical documentation sent');
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
 * Enhance audit entry with additional clinical data
 */
const enhanceEntryWithClinicalData = async (entry: CrisisAuditEntry): Promise<CrisisAuditEntry> => {
  // Get session duration
  const sessionStart = sessionStorage.getItem('session_start_time');
  let sessionDuration = 'Unknown';
  
  if (sessionStart) {
    const duration = Date.now() - parseInt(sessionStart);
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    sessionDuration = `${minutes}m ${seconds}s`;
  }
  
  // Get message count from session
  const messageCount = sessionStorage.getItem('message_count') || '0';
  
  // Try to detect location if not provided
  let locationInfo = entry.locationInfo;
  if (!locationInfo) {
    locationInfo = extractLocationFromText(entry.userInput);
    if (!locationInfo) {
      try {
        locationInfo = await getBrowserLocation();
      } catch (error) {
        console.log('Could not get location for audit entry:', error);
      }
    }
  }
  
  return {
    ...entry,
    locationInfo,
    locationDescription: getLocationDescription(locationInfo),
    sessionDuration,
    messageCount: parseInt(messageCount)
  };
};

/**
 * Send comprehensive crisis email notification with enhanced clinical information
 */
const sendEnhancedCrisisEmailNotification = async (entry: CrisisAuditEntry): Promise<void> => {
  console.log('ENHANCED CRISIS EMAIL: Preparing comprehensive clinical notification');
  
  // Send email notification with comprehensive crisis information
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
    
    // Enhanced fallback with detailed information
    const subject = encodeURIComponent(getEnhancedCrisisSubjectLine(entry));
    const body = encodeURIComponent(createEnhancedClinicalEmailBody(entry));
    const mailtoUrl = `mailto:cvmindfulhealthandwellness@outlook.com?subject=${subject}&body=${body}`;
    
    try {
      window.open(mailtoUrl, '_blank');
      console.log('ENHANCED CRISIS EMAIL: Opened enhanced mailto fallback');
    } catch (mailtoError) {
      console.error('ENHANCED CRISIS EMAIL: All notification methods failed:', mailtoError);
      throw new Error('Failed to send crisis notification through any method');
    }
  }
};

/**
 * Create comprehensive clinical email body
 */
const createEnhancedClinicalEmailBody = (entry: CrisisAuditEntry): string => {
  return `
🚨 ENHANCED CRISIS DETECTION ALERT - Roger AI Clinical Documentation 🚨

=== IMMEDIATE CLINICAL ASSESSMENT ===
Timestamp: ${entry.timestamp}
Session ID: ${entry.sessionId}
Crisis Type: ${entry.crisisType}
Severity Level: ${entry.severity}
Risk Assessment: ${entry.riskAssessment || 'Standard assessment'}

=== SESSION CONTEXT ===
Session Duration: ${entry.sessionDuration || 'Unknown'}
Total Messages: ${entry.messageCount || 'Unknown'}
Patient Location: ${entry.locationDescription || 'Location not determined'}
Detection Method: ${entry.detectionMethod}

=== CLINICAL NOTES ===
${entry.clinicalNotes || 'Standard crisis presentation - no specific risk indicators noted'}

=== PATIENT PRESENTATION ===
User Message: "${entry.userInput}"

Roger's Response: "${entry.rogerResponse}"

=== TECHNICAL DATA ===
User Agent: ${entry.userAgent || 'Unknown'}
IP Context: ${entry.ipAddress || 'Client-side'}
Location Data: ${entry.locationInfo ? JSON.stringify(entry.locationInfo, null, 2) : 'None available'}

===================================================
IMMEDIATE ACTION REQUIRED - LICENSED CLINICAL REVIEW
===================================================

This automated alert requires immediate clinical assessment by a licensed professional.

---
Roger AI Enhanced Crisis Detection & Clinical Documentation System
Cuyahoga Valley Mindful Health and Wellness
Generated: ${new Date().toISOString()}
  `;
};

/**
 * Enhanced crisis subject line with clinical priority indicators
 */
const getEnhancedCrisisSubjectLine = (entry: CrisisAuditEntry): string => {
  const emoji = getEmergencyEmoji(entry.crisisType);
  const priority = entry.severity === 'critical' ? '🔴 CRITICAL' : '🟡 URGENT';
  const location = entry.locationDescription && entry.locationDescription !== 'Unknown' ? ` - ${entry.locationDescription}` : '';
  const duration = entry.sessionDuration ? ` (${entry.sessionDuration})` : '';
  
  return `${emoji} ${priority}: ${entry.crisisType.toUpperCase()} CRISIS${location}${duration} - Clinical Review Required`;
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
 * Get appropriate emergency emoji based on crisis type
 */
const getEmergencyEmoji = (crisisType: string): string => {
  switch (crisisType.toLowerCase()) {
    case 'suicide':
    case 'suicide-direct-detection':
      return '🚨';
    case 'self-harm':
    case 'cutting':
      return '⚠️';
    case 'eating-disorder':
    case 'eating_disorder':
      return '🆘';
    case 'substance-use':
    case 'substance_abuse':
      return '🚑';
    default:
      return '🚨';
  }
};
