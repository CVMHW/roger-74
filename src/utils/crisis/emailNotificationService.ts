
/**
 * Enhanced Email Notification Service for Crisis Detection
 * Integrated with EmailJS for real-time crisis alerts
 */

import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'service_7hq8x2j';
const EMAILJS_TEMPLATE_ID = 'template_crisis_alert';
const EMAILJS_PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY'; // This needs to be set

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
 * Send crisis detection email alert
 */
export const sendCrisisEmailAlert = async (crisisData: CrisisEmailData): Promise<boolean> => {
  try {
    console.log("CRISIS EMAIL: Preparing to send email alert");
    
    // Format location information
    const locationText = crisisData.locationInfo 
      ? `${crisisData.locationInfo.city || 'Unknown'}, ${crisisData.locationInfo.region || 'Unknown'}`
      : 'Location not available';

    // Prepare email template parameters
    const templateParams = {
      timestamp: crisisData.timestamp,
      session_id: crisisData.sessionId,
      crisis_type: crisisData.crisisType,
      severity: crisisData.severity.toUpperCase(),
      user_message: crisisData.userMessage,
      roger_response: crisisData.rogerResponse,
      location: locationText,
      clinical_notes: crisisData.clinicalNotes || 'No additional clinical notes',
      risk_assessment: crisisData.riskAssessment || 'Standard risk assessment protocol applied',
      detection_method: crisisData.detectionMethod || 'crisis-detection-system',
      user_agent: crisisData.userAgent || 'Unknown browser',
      
      // Additional formatted content for better email readability
      alert_subject: `CRISIS DETECTION ALERT - Roger AI - ${crisisData.severity.toUpperCase()} SEVERITY`,
      formatted_message: `
CRISIS DETECTION ALERT - Roger AI

Timestamp: ${crisisData.timestamp}
Session ID: ${crisisData.sessionId}
Crisis Type: ${crisisData.crisisType}
Severity: ${crisisData.severity.toUpperCase()}
Detection Method: ${crisisData.detectionMethod || 'crisis-detection-system'}
Patient Location: ${locationText}

User Message:
"${crisisData.userMessage}"

Roger's Response:
"${crisisData.rogerResponse}"

SUICIDE RISK ASSESSMENT:
${crisisData.riskAssessment || '- This patient has expressed concerning content requiring immediate assessment'}

IMMEDIATE ACTIONS RECOMMENDED:
- Review this crisis detection immediately
- Assess for plan, intent, and means if contact information available
- Consider emergency services notification if imminent risk indicated
- Safety planning required for ongoing support

CLEVELAND/CUYAHOGA COUNTY SPECIFIC RESOURCES:
- Cuyahoga County Mobile Crisis: 1-216-623-6555
- Cleveland Emily Program (Eating Disorders): 1-888-272-0836
- Windsor-Laurelwood Hospital: 1-440-953-3000
- Cleveland Project DAWN: 1-216-387-6290
- Highland Springs Hospital: 1-216-302-3070

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
    
    // Fallback: Log to console for debugging
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
