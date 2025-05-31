
/**
 * Enhanced Email Notification Service for Crisis Detection
 * ALL SEVERITY LEVELS NOW GET EMAIL NOTIFICATIONS
 */

import emailjs from '@emailjs/browser';

// EmailJS Configuration
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
 * Initialize EmailJS service with proper error handling
 */
export const initializeEmailService = () => {
  try {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    console.log("CRISIS EMAIL: EmailJS initialized successfully");
    return true;
  } catch (error) {
    console.error("CRISIS EMAIL: Failed to initialize EmailJS:", error);
    return false;
  }
};

/**
 * Send comprehensive crisis detection email alert for ALL severity levels
 */
export const sendCrisisEmailAlert = async (crisisData: CrisisEmailData): Promise<boolean> => {
  try {
    console.log("CRISIS EMAIL: Preparing to send email alert for severity:", crisisData.severity);
    console.log("CRISIS EMAIL: Crisis data:", crisisData);
    
    // Force initialize EmailJS
    emailjs.init(EMAILJS_PUBLIC_KEY);
    
    // Format location information
    const locationText = crisisData.locationInfo 
      ? `${crisisData.locationInfo.city || 'Unknown'}, ${crisisData.locationInfo.region || 'Unknown'}`
      : 'Location not available';

    // Get crisis-specific clinical information
    const crisisSpecificInfo = getCrisisSpecificInformation(crisisData.crisisType, crisisData.severity);
    const severityActions = getSeveritySpecificActions(crisisData.severity);

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
      detection_method: crisisData.detectionMethod || 'comprehensive-multi-level-crisis-detection',
      user_agent: crisisData.userAgent || 'Unknown browser',
      
      // Comprehensive formatted message with severity-specific actions
      message: createComprehensiveEmailBody(crisisData, locationText, crisisSpecificInfo, severityActions)
    };

    console.log("CRISIS EMAIL: Sending email with severity-specific template params");

    // Send email using EmailJS
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      {
        publicKey: EMAILJS_PUBLIC_KEY
      }
    );

    console.log("CRISIS EMAIL: Email sent successfully for severity level:", crisisData.severity, response);
    
    if (response.status === 200 || response.text === 'OK') {
      console.log("CRISIS EMAIL: Confirmed successful email delivery");
      return true;
    } else {
      console.error("CRISIS EMAIL: Unexpected response:", response);
      return false;
    }

  } catch (error) {
    console.error("CRISIS EMAIL: Failed to send crisis email:", error);
    return false;
  }
};

/**
 * Get severity-specific immediate actions
 */
const getSeveritySpecificActions = (severity: string): string => {
  switch (severity.toLowerCase()) {
    case 'critical':
      return `
IMMEDIATE CRITICAL ACTIONS REQUIRED:
- CONTACT PATIENT IMMEDIATELY if contact information available
- Consider emergency services notification (911) for imminent risk
- Involuntary hold assessment may be necessary
- HIGHEST PRIORITY - Review within 15 minutes`;

    case 'high':
      return `
URGENT ACTIONS REQUIRED:
- Contact patient within 1 hour if possible
- Safety assessment required today
- Consider crisis intervention team involvement
- HIGH PRIORITY - Review within 1 hour`;

    case 'medium':
      return `
MODERATE ACTIONS REQUIRED:
- Follow up with patient within 24 hours
- Safety planning needed
- Consider outpatient crisis services
- MODERATE PRIORITY - Review within 4 hours`;

    case 'low':
      return `
FOLLOW-UP ACTIONS REQUIRED:
- Check in with patient within 48 hours
- Monitor for escalation
- Provide appropriate resources
- STANDARD PRIORITY - Review within 24 hours`;

    default:
      return `
GENERAL ACTIONS REQUIRED:
- Review and assess as appropriate
- Standard follow-up protocols
- Monitor for changes`;
  }
};

/**
 * Create comprehensive clinical email body with severity-specific content
 */
const createComprehensiveEmailBody = (
  crisisData: CrisisEmailData, 
  locationText: string, 
  crisisSpecificInfo: string,
  severityActions: string
): string => {
  return `CRISIS DETECTION ALERT - Roger AI
SEVERITY LEVEL: ${crisisData.severity.toUpperCase()}

=== CRISIS SUMMARY ===
Timestamp: ${crisisData.timestamp}
Session ID: ${crisisData.sessionId}
Crisis Type: ${crisisData.crisisType}
Severity: ${crisisData.severity.toUpperCase()}
Detection Method: ${crisisData.detectionMethod || 'comprehensive-multi-level-crisis-detection'}
Patient Location: ${locationText}

=== PATIENT COMMUNICATION ===
User Message:
"${crisisData.userMessage}"

Roger's Response:
"${crisisData.rogerResponse}"

${crisisSpecificInfo}

${severityActions}

=== CLEVELAND/CUYAHOGA COUNTY RESOURCES ===
- Cuyahoga County Mobile Crisis: 1-216-623-6555
- Cleveland Emily Program (Eating Disorders): 1-888-272-0836
- Windsor-Laurelwood Hospital: 1-440-953-3000
- Cleveland Project DAWN: 1-216-387-6290
- Highland Springs Hospital: 1-216-302-3070

=== TECHNICAL DETAILS ===
- User Agent: ${crisisData.userAgent || 'Unknown browser'}
- Location Data: ${JSON.stringify(crisisData.locationInfo, null, 2)}
- Clinical Notes: ${crisisData.clinicalNotes}
- Risk Assessment: ${crisisData.riskAssessment}

This is an automated alert from Roger AI Crisis Detection System
ALL SEVERITY LEVELS now trigger immediate email notification
Cuyahoga Valley Mindful Health and Wellness`;
};

/**
 * Get crisis-specific clinical information with severity considerations
 */
const getCrisisSpecificInformation = (crisisType: string, severity: string): string => {
  const severityNote = `SEVERITY: ${severity.toUpperCase()} LEVEL`;
  
  switch (crisisType.toLowerCase()) {
    case 'suicide':
    case 'suicide-direct-detection':
    case 'suicidal-ideation':
      return `
SUICIDE RISK ASSESSMENT (${severityNote}):
- Patient has expressed suicidal ideation
- Immediate safety assessment required
- Contact emergency services if patient has plan/means
- Consider involuntary hold if imminent risk indicated`;

    case 'eating-disorder':
    case 'eating_disorder':
    case 'anorexia':
    case 'bulimia':
    case 'binge-eating':
      return `
EATING DISORDER CRISIS ASSESSMENT (${severityNote}):
- Patient showing concerning eating behaviors
- Risk of medical complications possible
- May require specialized treatment
- High comorbidity with mood disorders`;

    case 'substance-use':
    case 'substance_abuse':
    case 'addiction':
    case 'overdose':
      return `
SUBSTANCE ABUSE CRISIS ASSESSMENT (${severityNote}):
- Patient showing concerning substance use patterns
- Risk of overdose or withdrawal complications
- May require detoxification support
- Assess for dual diagnosis conditions`;

    case 'self-harm':
    case 'cutting':
    case 'self-injury':
      return `
SELF-HARM CRISIS ASSESSMENT (${severityNote}):
- Patient has expressed self-harm intentions/behaviors
- Risk of escalation to suicidal behavior
- Immediate safety planning needed
- May require medical attention for injuries`;

    case 'psychosis':
    case 'hallucinations':
    case 'delusions':
      return `
PSYCHOSIS CRISIS ASSESSMENT (${severityNote}):
- Patient showing signs of psychotic symptoms
- Risk assessment for reality testing required
- May require psychiatric evaluation
- Consider medication compliance issues`;

    default:
      return `
GENERAL CRISIS ASSESSMENT (${severityNote}):
- Patient requires professional attention
- Assess for safety risks
- Provide appropriate intervention based on severity`;
  }
};

// Force initialize the service when module loads
console.log("CRISIS EMAIL: Initializing EmailJS service for ALL severity levels");
initializeEmailService();
