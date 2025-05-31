
/**
 * Enhanced Email Notification Service for Crisis Detection
 * Integrated with EmailJS for real-time crisis alerts
 */

import emailjs from '@emailjs/browser';

// EmailJS Configuration from your screenshots
const EMAILJS_SERVICE_ID = 'service_fqqp3ta';
const EMAILJS_TEMPLATE_ID = 'template_u3w9maq';
const EMAILJS_PUBLIC_KEY = 'eFkOj3YAK3s86h8hL';

interface CrisisEmailData {
  timestamp: string;
  sessionId: string;
  crisisType: string;
  severity: string;
  userMessage: string;
  rogerResponse: string;
  locationInfo?: any;
  clinicalNotes?: string;
  riskAssessment?: string;
  userAgent?: string;
  detectionMethod?: string;
}

/**
 * Initialize EmailJS service
 */
export const initializeEmailService = () => {
  try {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    console.log("CRISIS EMAIL: EmailJS initialized successfully");
  } catch (error) {
    console.error("CRISIS EMAIL: Failed to initialize EmailJS:", error);
  }
};

/**
 * Send comprehensive crisis detection email alert
 */
export const sendCrisisEmailAlert = async (crisisData: CrisisEmailData): Promise<boolean> => {
  try {
    console.log("CRISIS EMAIL: Preparing to send comprehensive email alert");
    
    // Format location information
    const locationText = crisisData.locationInfo 
      ? `${crisisData.locationInfo.city || 'Unknown'}, ${crisisData.locationInfo.region || 'Unknown'}`
      : 'Location not available';

    // Get crisis-specific clinical information
    const crisisSpecificInfo = getCrisisSpecificInformation(crisisData.crisisType, crisisData.severity);
    const locationSpecificResources = getLocationSpecificClinicalResources(crisisData.locationInfo);

    // Prepare comprehensive email template parameters
    const templateParams = {
      timestamp: crisisData.timestamp,
      session_id: crisisData.sessionId,
      crisis_type: crisisData.crisisType,
      severity: crisisData.severity.toUpperCase(),
      user_message: crisisData.userMessage,
      roger_response: crisisData.rogerResponse,
      location: locationText,
      clinical_notes: crisisData.clinicalNotes || 'Standard crisis presentation',
      risk_assessment: crisisData.riskAssessment || 'Standard risk assessment protocol applied',
      detection_method: crisisData.detectionMethod || 'multi-crisis-detection-with-location',
      user_agent: crisisData.userAgent || 'Unknown browser',
      
      // Comprehensive formatted message matching your example
      message: `
CRISIS DETECTION ALERT - Roger AI

Timestamp: ${crisisData.timestamp}
Session ID: ${crisisData.sessionId}
Crisis Type: ${crisisData.crisisType}
Severity: ${crisisData.severity.toUpperCase()}
Detection Method: ${crisisData.detectionMethod || 'multi-crisis-detection-with-location'}
Patient Location: ${locationText}

User Message:
"${crisisData.userMessage}"

Roger's Response:
"${crisisData.rogerResponse}"

${crisisSpecificInfo}

IMMEDIATE ACTIONS RECOMMENDED:
- Review this crisis detection immediately
- Assess for plan, intent, and means if contact information available
- Consider emergency services notification if imminent risk indicated
- Safety planning required for ongoing support

${locationSpecificResources}

Technical Details:
- User Agent: ${crisisData.userAgent || 'Unknown browser'}
- IP Address: client-side
- Location Data: ${JSON.stringify(crisisData.locationInfo, null, 2)}

Please review this crisis detection immediately.

---
This is an automated alert from Roger AI Crisis Detection System
Cuyahoga Valley Mindful Health and Wellness
      `
    };

    console.log("CRISIS EMAIL: Sending comprehensive email with template params:", templateParams);

    // Send email using EmailJS with correct configuration
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log("CRISIS EMAIL: Email sent successfully:", response);
    return true;

  } catch (error) {
    console.error("CRISIS EMAIL: Failed to send crisis email:", error);
    
    // Enhanced fallback logging
    console.log("CRISIS EMAIL FALLBACK: Crisis data that failed to send:", {
      ...crisisData,
      formattedAlert: `
CRISIS DETECTION ALERT - Roger AI

Timestamp: ${crisisData.timestamp}
Session ID: ${crisisData.sessionId}
Crisis Type: ${crisisData.crisisType}
Severity: ${crisisData.severity}
Location: ${crisisData.locationInfo ? `${crisisData.locationInfo.city}, ${crisisData.locationInfo.region}` : 'Unknown'}

User Message: "${crisisData.userMessage}"
Roger Response: "${crisisData.rogerResponse}"

Please review this crisis detection immediately.
      `
    });
    
    return false;
  }
};

/**
 * Get crisis-specific clinical information
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
EATING DISORDER CRISIS ASSESSMENT:
- Patient showing concerning eating behaviors
- Risk of medical complications
- May require specialized treatment
- High comorbidity with mood disorders`;

    case 'substance-use':
    case 'substance_abuse':
    case 'addiction':
    case 'overdose':
      return `
SUBSTANCE ABUSE CRISIS ASSESSMENT:
- Patient showing concerning substance use patterns
- Risk of overdose or withdrawal complications
- May require detoxification support
- Assess for dual diagnosis conditions`;

    case 'self-harm':
    case 'cutting':
    case 'self-injury':
      return `
SELF-HARM CRISIS ASSESSMENT:
- Patient has expressed self-harm intentions/behaviors
- Risk of escalation to suicidal behavior
- Immediate safety planning needed
- May require medical attention for injuries`;

    case 'psychosis':
    case 'hallucinations':
    case 'delusions':
      return `
PSYCHOSIS CRISIS ASSESSMENT:
- Patient showing signs of psychotic symptoms
- Risk assessment for reality testing
- May require psychiatric evaluation
- Consider medication compliance issues`;

    default:
      return `
GENERAL CRISIS ASSESSMENT:
- Patient requires immediate attention
- Assess for safety risks
- Provide appropriate intervention`;
  }
};

/**
 * Get location-specific clinical resources
 */
const getLocationSpecificClinicalResources = (locationInfo: any): string => {
  if (!locationInfo) {
    return `
GENERAL OHIO RESOURCES:
- Location unknown - recommend obtaining patient location for targeted referrals
- Default to statewide Ohio crisis resources until location confirmed`;
  }
  
  const region = locationInfo.region?.toLowerCase();
  const city = locationInfo.city?.toLowerCase();
  
  if (region?.includes('cuyahoga') || city?.includes('cleveland')) {
    return `
CLEVELAND/CUYAHOGA COUNTY SPECIFIC RESOURCES:
- Cuyahoga County Mobile Crisis: 1-216-623-6555
- Cleveland Emily Program (Eating Disorders): 1-888-272-0836
- Windsor-Laurelwood Hospital: 1-440-953-3000
- Cleveland Project DAWN: 1-216-387-6290
- Highland Springs Hospital: 1-216-302-3070`;
  }
  
  if (region?.includes('ashtabula')) {
    return `
ASHTABULA COUNTY SPECIFIC RESOURCES:
- Ashtabula County 24/7 Crisis Hotline: 1-800-577-7849
- Rock Creek Glenbeigh Hospital (Substance Abuse): 1-877-487-5126
- Ashtabula County Regional Medical Center: 1-440-997-2262
- Frontline Services: 1-440-381-8347`;
  }
  
  if (region?.includes('summit') || city?.includes('akron')) {
    return `
AKRON/SUMMIT COUNTY SPECIFIC RESOURCES:
- Summit County Mobile Crisis: 330-434-9144
- Akron Children's Crisis Line: 330-543-7472`;
  }
  
  if (region?.includes('stark') || city?.includes('canton')) {
    return `
CANTON/STARK COUNTY SPECIFIC RESOURCES:
- Stark County Mobile Crisis: 330-452-6000`;
  }
  
  if (region?.includes('lake') || city?.includes('mentor')) {
    return `
LAKE COUNTY SPECIFIC RESOURCES:
- Lake County Frontline Services: 1-440-381-8347
- Chardon Ravenwood Hospital: 1-440-285-4552`;
  }
  
  return `
OHIO STATEWIDE RESOURCES:
- Patient location: ${locationInfo.city || 'Unknown'}, ${locationInfo.region || 'Unknown'}
- Recommend contacting local crisis services in patient's area`;
};

/**
 * Test email service functionality
 */
export const testEmailService = async (): Promise<boolean> => {
  try {
    const testData: CrisisEmailData = {
      timestamp: new Date().toISOString(),
      sessionId: 'test_session_' + Date.now(),
      crisisType: 'test',
      severity: 'low',
      userMessage: 'This is a test message',
      rogerResponse: 'This is a test response',
      clinicalNotes: 'This is a test of the crisis email system',
      riskAssessment: 'Test risk assessment - no actual risk',
      detectionMethod: 'manual-test'
    };

    return await sendCrisisEmailAlert(testData);
  } catch (error) {
    console.error("CRISIS EMAIL TEST: Failed:", error);
    return false;
  }
};

// Initialize the service when module loads
initializeEmailService();
