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
    
    // Send comprehensive email notification
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
  
  // Get crisis-specific clinical information
  const crisisSpecificInfo = getCrisisSpecificInformation(entry.crisisType, entry.severity);
  const locationSpecificResources = getLocationSpecificClinicalResources(entry.locationInfo);
  
  // Send email notification with comprehensive crisis type information
  const emailSent = await sendCrisisEmailAlert({
    timestamp: entry.timestamp,
    sessionId: entry.sessionId,
    crisisType: entry.crisisType,
    severity: entry.severity,
    userMessage: entry.userInput,
    rogerResponse: entry.rogerResponse,
    locationInfo: entry.locationInfo,
    clinicalNotes: `${entry.clinicalNotes || 'Standard crisis presentation'}\n\n${crisisSpecificInfo}\n\n${locationSpecificResources}`,
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

${getCrisisSpecificClinicalGuidance(entry.crisisType, entry.severity)}

${getLocationSpecificClinicalResources(entry.locationInfo)}

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
 * Get crisis-specific clinical guidance
 */
const getCrisisSpecificClinicalGuidance = (crisisType: string, severity: string): string => {
  switch (crisisType.toLowerCase()) {
    case 'suicide':
    case 'suicide-direct-detection':
    case 'suicidal-ideation':
      return `
=== SUICIDE RISK CLINICAL GUIDANCE ===
IMMEDIATE ASSESSMENT PRIORITIES:
• Suicidal ideation, plan, intent, and means (SPIM assessment)
• Protective factors vs. risk factors balance
• Previous suicide attempts or self-harm history
• Current substance use or intoxication
• Access to lethal means
• Social support and safety planning capability

RECOMMENDED CLINICAL ACTIONS:
• Immediate safety assessment via phone contact
• Consider involuntary commitment if imminent risk
• Collaborate with emergency services if patient has specific plan/means
• Document detailed risk assessment and safety plan
• Arrange for increased contact frequency`;

    case 'eating-disorder':
    case 'eating_disorder':
    case 'anorexia':
    case 'bulimia':
    case 'binge-eating':
      return `
=== EATING DISORDER CRISIS CLINICAL GUIDANCE ===
MEDICAL STABILITY ASSESSMENT NEEDED:
• Vital signs and cardiac status
• Electrolyte imbalance risk
• BMI and nutritional status
• Purging behaviors and frequency
• Exercise compulsion patterns

RECOMMENDED CLINICAL ACTIONS:
• Medical evaluation for physical complications
• Assessment of eating behaviors, restriction patterns
• Evaluation for concurrent mood disorders
• Consider referral to specialized ED treatment (Emily Program)
• Monitor for suicidal ideation (high comorbidity rate)`;

    case 'substance-use':
    case 'substance_abuse':
    case 'addiction':
    case 'overdose':
      return `
=== SUBSTANCE ABUSE CRISIS CLINICAL GUIDANCE ===
IMMEDIATE MEDICAL ASSESSMENT:
• Current intoxication level
• Withdrawal risk assessment
• Overdose potential
• Drug interactions
• Medical complications

RECOMMENDED CLINICAL ACTIONS:
• Medical evaluation for withdrawal management
• Assessment of substance use patterns and triggers
• Evaluation for dual diagnosis conditions
• Consider referral to addiction specialist or detox
• Safety planning around substance access`;

    case 'self-harm':
    case 'cutting':
    case 'self-injury':
      return `
=== SELF-HARM CRISIS CLINICAL GUIDANCE ===
IMMEDIATE ASSESSMENT:
• Methods and frequency of self-harm
• Medical attention needed for current injuries
• Escalation patterns
• Suicidal intent vs. non-suicidal self-injury
• Access to self-harm tools

RECOMMENDED CLINICAL ACTIONS:
• Medical evaluation for wound care if needed
• Assessment of underlying emotional regulation issues
• Safety planning and coping strategies development
• Consider increased session frequency
• Monitor for escalation to suicidal behavior`;

    case 'psychosis':
    case 'hallucinations':
    case 'delusions':
      return `
=== PSYCHOSIS CRISIS CLINICAL GUIDANCE ===
IMMEDIATE ASSESSMENT:
• Reality testing and insight level
• Command hallucinations or violent delusions
• Medication compliance
• Risk to self or others
• Substance-induced vs. primary psychosis

RECOMMENDED CLINICAL ACTIONS:
• Psychiatric evaluation for medication adjustment
• Assessment of safety risks from psychotic symptoms
• Coordination with psychiatrist or emergency services
• Environmental safety assessment
• Consider higher level of care if severe`;

    default:
      return `
=== GENERAL CRISIS CLINICAL GUIDANCE ===
• Comprehensive risk assessment required
• Evaluate for underlying mental health conditions
• Assess social support and coping resources
• Document detailed clinical presentation
• Provide appropriate level of care recommendations`;
  }
};

/**
 * Get location-specific clinical resources
 */
const getLocationSpecificClinicalResources = (locationInfo: LocationInfo | null): string => {
  if (!locationInfo) {
    return `
=== CLINICAL RESOURCE RECOMMENDATIONS ===
• Location unknown - recommend obtaining patient location for targeted referrals
• Default to statewide Ohio crisis resources until location confirmed
• Consider transportation barriers when making referrals`;
  }
  
  return getLocationSpecificResources(locationInfo);
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

/**
 * Get location-specific resources for email
 */
const getLocationSpecificResources = (locationInfo: LocationInfo): string => {
  if (!locationInfo) {
    return `
LOCATION-SPECIFIC RESOURCES:
- Location unknown - recommend asking patient for location to provide targeted local resources
- Default to national resources until location is determined`;
  }
  
  const region = locationInfo.region?.toLowerCase();
  const city = locationInfo.city?.toLowerCase();
  
  if (region?.includes('ashtabula')) {
    return `
ASHTABULA COUNTY SPECIFIC RESOURCES:
- Ashtabula County 24/7 Crisis Hotline: 1-800-577-7849
- Rock Creek Glenbeigh Hospital (Substance Abuse): 1-877-487-5126
- Ashtabula County Regional Medical Center: 1-440-997-2262
- Frontline Services: 1-440-381-8347
- Ashtabula Rape Crisis Center: 1-440-354-7364`;
  }
  
  if (region?.includes('cuyahoga') || city?.includes('cleveland')) {
    return `
CLEVELAND/CUYAHOGA COUNTY SPECIFIC RESOURCES:
- Cuyahoga County Mobile Crisis: 1-216-623-6555
- Cleveland Emily Program (Eating Disorders): 1-888-272-0836
- Windsor-Laurelwood Hospital: 1-440-953-3000
- Cleveland Project DAWN: 1-216-387-6290
- Highland Springs Hospital: 1-216-302-3070`;
  }
  
  if (region?.includes('summit') || city?.includes('akron')) {
    return `
AKRON/SUMMIT COUNTY SPECIFIC RESOURCES:
- Summit County Mobile Crisis: 330-434-9144
- Akron Children's Crisis Line: 330-543-7472
- Homeless Hotline Summit County: 330-615-0577`;
  }
  
  if (region?.includes('stark') || city?.includes('canton')) {
    return `
CANTON/STARK COUNTY SPECIFIC RESOURCES:
- Stark County Mobile Crisis: 330-452-6000
- Homeless Hotline Stark County: 330-452-4363`;
  }
  
  if (region?.includes('lake') || city?.includes('mentor')) {
    return `
LAKE COUNTY SPECIFIC RESOURCES:
- Lake County Frontline Services: 1-440-381-8347
- Chardon Ravenwood Hospital: 1-440-285-4552`;
  }
  
  return `
OHIO STATEWIDE RESOURCES:
- Patient location: ${getLocationDescription(locationInfo)}
- Recommend contacting local crisis services in patient's area
- Default to statewide Ohio resources`;
};

/**
 * Get crisis-specific information for email body
 */
const getCrisisSpecificInformation = (crisisType: string, severity: string): string => {
  switch (crisisType.toLowerCase()) {
    case 'suicide':
    case 'suicide-direct-detection':
    case 'suicidal-ideation':
      return `
SUICIDE RISK ASSESSMENT:
- This patient has expressed suicidal ideation
- Immediate safety assessment required
- Consider involuntary hold if imminent risk
- Contact emergency services if patient has plan/means`;

    case 'eating-disorder':
    case 'eating_disorder':
    case 'anorexia':
    case 'bulimia':
    case 'binge-eating':
      return `
EATING DISORDER CRISIS:
- Patient showing concerning eating behaviors
- Risk of medical complications
- May require specialized treatment
- High comorbidity with mood disorders`;

    case 'substance-use':
    case 'substance_abuse':
    case 'addiction':
    case 'overdose':
      return `
SUBSTANCE ABUSE CRISIS:
- Patient showing concerning substance use patterns
- Risk of overdose or withdrawal complications
- May require detoxification support
- Assess for dual diagnosis conditions`;

    case 'self-harm':
    case 'cutting':
    case 'self-injury':
      return `
SELF-HARM CRISIS:
- Patient has expressed self-harm intentions/behaviors
- Risk of escalation to suicidal behavior
- Immediate safety planning needed
- May require medical attention for injuries`;

    case 'psychosis':
    case 'hallucinations':
    case 'delusions':
      return `
PSYCHOSIS CRISIS:
- Patient showing signs of psychotic symptoms
- Risk assessment for reality testing
- May require psychiatric evaluation
- Consider medication compliance issues`;

    default:
      return `
GENERAL CRISIS SITUATION:
- Patient requires immediate attention
- Assess for safety risks
- Provide appropriate intervention`;
  }
};
