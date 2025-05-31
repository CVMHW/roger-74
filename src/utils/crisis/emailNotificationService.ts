
/**
 * Enhanced Email Notification Service for Crisis Detection
 * Integrated with EmailJS for real-time crisis alerts
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
 * Initialize EmailJS service
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
 * Send comprehensive crisis detection email alert
 */
export const sendCrisisEmailAlert = async (crisisData: CrisisEmailData): Promise<boolean> => {
  try {
    console.log("CRISIS EMAIL: Preparing to send comprehensive email alert");
    
    // Initialize EmailJS if not already done
    if (!initializeEmailService()) {
      throw new Error("EmailJS initialization failed");
    }
    
    // Format location information
    const locationText = crisisData.locationInfo 
      ? `${crisisData.locationInfo.city || 'Unknown'}, ${crisisData.locationInfo.region || 'Unknown'}`
      : 'Location not available';

    // Get crisis-specific clinical information
    const crisisSpecificInfo = getCrisisSpecificInformation(crisisData.crisisType, crisisData.severity);

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
      
      // Comprehensive formatted message
      message: createComprehensiveEmailBody(crisisData, locationText, crisisSpecificInfo)
    };

    console.log("CRISIS EMAIL: Sending email with template params:", templateParams);

    // Send email using EmailJS
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
    return false;
  }
};

/**
 * Create comprehensive clinical email body
 */
const createComprehensiveEmailBody = (crisisData: CrisisEmailData, locationText: string, crisisSpecificInfo: string): string => {
  return `CRISIS DETECTION ALERT - Roger AI

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

Technical Details:
- User Agent: ${crisisData.userAgent || 'Unknown browser'}
- IP Address: client-side
- Location Data: ${JSON.stringify(crisisData.locationInfo, null, 2)}

Please review this crisis detection immediately.

---
This is an automated alert from Roger AI Crisis Detection System
Cuyahoga Valley Mindful Health and Wellness`;
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

// Initialize the service when module loads
initializeEmailService();
