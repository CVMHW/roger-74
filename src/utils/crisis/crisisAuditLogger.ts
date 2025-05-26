/**
 * Crisis Audit Logger with Email Notifications and Location Awareness
 * 
 * Logs all crisis detections and sends email notifications to the psychologist
 */

import { LocationInfo } from './crisisResponseCoordinator';
import { extractLocationFromText, getBrowserLocation, getLocationDescription } from './locationDetection';

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
}

/**
 * Log a crisis detection event with enhanced location tracking
 */
export const logCrisisEvent = async (entry: CrisisAuditEntry): Promise<void> => {
  try {
    console.log('CRISIS AUDIT: Starting crisis event logging with location detection', entry);
    
    // Try to detect location from user input
    let locationInfo = extractLocationFromText(entry.userInput);
    
    // If no location in text, try browser geolocation
    if (!locationInfo) {
      try {
        locationInfo = await getBrowserLocation();
      } catch (error) {
        console.log('Could not get browser location:', error);
      }
    }
    
    // Add location information to entry
    const enhancedEntry = {
      ...entry,
      locationInfo,
      locationDescription: getLocationDescription(locationInfo)
    };
    
    // Store in local storage for immediate backup
    const existingLogs = getStoredCrisisLogs();
    existingLogs.push(enhancedEntry);
    localStorage.setItem('crisis_audit_logs', JSON.stringify(existingLogs));
    console.log('CRISIS AUDIT: Stored locally successfully with location:', enhancedEntry.locationDescription);
    
    // Send email notification to psychologist
    await sendCrisisEmailNotification(enhancedEntry);
    
    console.log('CRISIS AUDIT: Event logged and email sent successfully', {
      timestamp: enhancedEntry.timestamp,
      crisisType: enhancedEntry.crisisType,
      severity: enhancedEntry.severity,
      location: enhancedEntry.locationDescription
    });
  } catch (error) {
    console.error('CRISIS AUDIT ERROR: Failed to log crisis event', error);
    // Still store locally even if email fails
    try {
      const existingLogs = getStoredCrisisLogs();
      existingLogs.push({ ...entry, emailFailed: true });
      localStorage.setItem('crisis_audit_logs', JSON.stringify(existingLogs));
      console.log('CRISIS AUDIT: Stored locally with email failure flag');
    } catch (storageError) {
      console.error('CRISIS AUDIT CRITICAL: Failed to store locally', storageError);
    }
  }
};

/**
 * Send crisis email notification to psychologist using EmailJS with location information
 */
const sendCrisisEmailNotification = async (entry: CrisisAuditEntry): Promise<void> => {
  console.log('CRISIS EMAIL: Starting email notification process with location data');
  
  // Enhanced email body with crisis-specific and location information
  const emailBody = `
CRISIS DETECTION ALERT - Roger AI

Timestamp: ${entry.timestamp}
Session ID: ${entry.sessionId}
Crisis Type: ${entry.crisisType}
Severity: ${entry.severity}
Detection Method: ${entry.detectionMethod}
Patient Location: ${entry.locationDescription || 'Unknown'}

User Message:
"${entry.userInput}"

Roger's Response:
"${entry.rogerResponse}"

${getCrisisSpecificInformation(entry.crisisType, entry.severity)}

${getLocationSpecificResources(entry.locationInfo)}

Technical Details:
- User Agent: ${entry.userAgent || 'Unknown'}
- IP Address: ${entry.ipAddress || 'Unknown'}
- Location Data: ${entry.locationInfo ? JSON.stringify(entry.locationInfo, null, 2) : 'None detected'}

Please review this crisis detection immediately.

---
This is an automated alert from Roger AI Crisis Detection System
Cuyahoga Valley Mindful Health and Wellness
  `;

  // Get crisis-specific subject line with location
  const subjectLine = getCrisisSubjectLine(entry.crisisType, entry.severity, entry.locationDescription);

  const emailJSData = {
    service_id: 'service_fqqp3ta',
    template_id: 'template_u3w9maq',
    user_id: 'eFkOj3YAK3s86h8hL',
    template_params: {
      to_email: 'cvmindfulhealthandwellness@outlook.com',
      from_name: 'Roger AI Crisis System',
      subject: subjectLine,
      message: emailBody,
      timestamp: entry.timestamp,
      crisis_type: entry.crisisType,
      severity: entry.severity,
      session_id: entry.sessionId,
      user_input: entry.userInput,
      roger_response: entry.rogerResponse,
      location: entry.locationDescription || 'Unknown'
    }
  };

  console.log('CRISIS EMAIL: Prepared EmailJS data with location information:', emailJSData);

  try {
    console.log('CRISIS EMAIL: Sending request to EmailJS API...');
    
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailJSData)
    });

    console.log('CRISIS EMAIL: EmailJS response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CRISIS EMAIL: EmailJS error response:', errorText);
      throw new Error(`EmailJS send failed: ${response.status} - ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('CRISIS EMAIL: EmailJS success response:', result);
    console.log(`✅ Crisis email sent successfully to cvmindfulhealthandwellness@outlook.com for ${entry.crisisType} in ${entry.locationDescription}`);
    
  } catch (error) {
    console.error('CRISIS EMAIL: Failed to send crisis email via EmailJS:', error);
    
    // Enhanced fallback: try using mailto (opens user's email client)
    const subject = encodeURIComponent(subjectLine);
    const body = encodeURIComponent(emailBody);
    const mailtoUrl = `mailto:cvmindfulhealthandwellness@outlook.com?subject=${subject}&body=${body}`;
    
    try {
      console.log('CRISIS EMAIL: Attempting mailto fallback...');
      window.open(mailtoUrl, '_blank');
      console.log('CRISIS EMAIL: Opened mailto fallback for crisis notification');
    } catch (mailtoError) {
      console.error('CRISIS EMAIL: Mailto fallback also failed:', mailtoError);
      throw error;
    }
  }
};

/**
 * Get crisis-specific subject line with location
 */
const getCrisisSubjectLine = (crisisType: string, severity: string, location?: string): string => {
  const emoji = getEmergencyEmoji(crisisType);
  const priority = severity === 'critical' ? 'URGENT' : 'ALERT';
  const locationText = location && location !== 'Unknown' ? ` - ${location}` : '';
  
  switch (crisisType.toLowerCase()) {
    case 'suicide':
    case 'suicide-direct-detection':
      return `${emoji} ${priority}: SUICIDE RISK${locationText} - Immediate Intervention Required`;
    case 'self-harm':
    case 'cutting':
      return `${emoji} ${priority}: SELF-HARM RISK${locationText} - ${severity} severity`;
    case 'eating-disorder':
    case 'eating_disorder':
      return `${emoji} ${priority}: EATING DISORDER CRISIS${locationText} - ${severity} severity`;
    case 'substance-use':
    case 'substance_abuse':
      return `${emoji} ${priority}: SUBSTANCE ABUSE CRISIS${locationText} - ${severity} severity`;
    default:
      return `${emoji} ${priority}: CRISIS DETECTION${locationText} - ${crisisType} - ${severity} severity`;
  }
};

/**
 * Get location-specific resources for email
 */
const getLocationSpecificResources = (locationInfo: LocationInfo | null): string => {
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
      return `
SUICIDE RISK ASSESSMENT:
- This patient has expressed suicidal ideation
- Immediate safety assessment required
- Consider involuntary hold if imminent risk
- Contact emergency services if patient has plan/means

IMMEDIATE ACTIONS RECOMMENDED:
- Call patient immediately
- Assess for plan, intent, and means
- Safety planning required
- Consider hospitalization`;

    case 'self-harm':
    case 'cutting':
      return `
SELF-HARM RISK ASSESSMENT:
- Patient has expressed self-harm intentions
- Risk of escalation to suicidal behavior
- Immediate safety planning needed

IMMEDIATE ACTIONS RECOMMENDED:
- Contact patient within 24 hours
- Assess frequency and severity of self-harm
- Safety planning and coping strategies
- Consider increased session frequency`;

    case 'eating-disorder':
    case 'eating_disorder':
      return `
EATING DISORDER CRISIS:
- Patient showing concerning eating behaviors
- Risk of medical complications
- May require specialized treatment

IMMEDIATE ACTIONS RECOMMENDED:
- Medical evaluation for physical complications
- Assessment of eating patterns and behaviors
- Consider referral to eating disorder specialist
- Monitor for suicidal ideation (high comorbidity)`;

    case 'substance-use':
    case 'substance_abuse':
      return `
SUBSTANCE ABUSE CRISIS:
- Patient showing concerning substance use patterns
- Risk of overdose or withdrawal complications
- May require detoxification support

IMMEDIATE ACTIONS RECOMMENDED:
- Assess current intoxication/withdrawal state
- Medical evaluation if withdrawal symptoms present
- Consider referral to addiction specialist
- Safety planning around substance use`;

    default:
      return `
GENERAL CRISIS SITUATION:
- Patient requires immediate attention
- Assess for safety risks
- Provide appropriate intervention`;
  }
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
  }
  return sessionId;
};
