
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
 * Send crisis detection email alert for ALL severity levels
 */
export const sendCrisisEmailAlert = async (crisisData: CrisisEmailData): Promise<boolean> => {
  try {
    console.log(`CRISIS EMAIL: SENDING EMAIL for ${crisisData.severity.toUpperCase()} severity level`);
    console.log("CRISIS EMAIL: Full crisis data:", crisisData);
    
    // Force initialize EmailJS every time
    emailjs.init(EMAILJS_PUBLIC_KEY);
    
    // Format location information
    const locationText = crisisData.locationInfo 
      ? `${crisisData.locationInfo.city || 'Cleveland'}, ${crisisData.locationInfo.region || 'Ohio'}`
      : 'Cleveland, Ohio (default)';

    // Get severity-specific actions
    const severityActions = getSeveritySpecificActions(crisisData.severity);
    const crisisSpecificInfo = getCrisisSpecificInformation(crisisData.crisisType, crisisData.severity);

    // Create comprehensive email body
    const emailBody = `🚨 ROGER AI CRISIS DETECTION ALERT 🚨
SEVERITY: ${crisisData.severity.toUpperCase()}

=== IMMEDIATE ATTENTION REQUIRED ===
Timestamp: ${crisisData.timestamp}
Session ID: ${crisisData.sessionId}
Crisis Type: ${crisisData.crisisType}
Patient Location: ${locationText}
Detection Method: ${crisisData.detectionMethod}

=== PATIENT COMMUNICATION ===
User Message: "${crisisData.userMessage}"

Roger's Response: "${crisisData.rogerResponse}"

${crisisSpecificInfo}

${severityActions}

=== CLEVELAND/CUYAHOGA RESOURCES ===
• Cuyahoga County Mobile Crisis: 1-216-623-6555
• Cleveland Emily Program (Eating Disorders): 1-888-272-0836  
• Windsor-Laurelwood Hospital: 1-440-953-3000
• Highland Springs Hospital: 1-216-302-3070

=== CLINICAL ASSESSMENT ===
Clinical Notes: ${crisisData.clinicalNotes}
Risk Assessment: ${crisisData.riskAssessment}

=== TECHNICAL DATA ===
User Agent: ${crisisData.userAgent}
Location Data: ${JSON.stringify(crisisData.locationInfo, null, 2)}

This is an automated alert from Roger AI Crisis Detection System.
ALL SEVERITY LEVELS trigger immediate email notification.
Cuyahoga Valley Mindful Health and Wellness`;

    // Prepare template parameters for EmailJS
    const templateParams = {
      to_email: 'ericmriesterer@gmail.com',
      from_name: 'Roger AI Crisis Detection',
      subject: `🚨 CRISIS ALERT - ${crisisData.severity.toUpperCase()} - ${crisisData.crisisType}`,
      message: emailBody,
      timestamp: crisisData.timestamp,
      session_id: crisisData.sessionId,
      crisis_type: crisisData.crisisType,
      severity: crisisData.severity.toUpperCase(),
      user_message: crisisData.userMessage,
      roger_response: crisisData.rogerResponse,
      location: locationText,
      clinical_notes: crisisData.clinicalNotes,
      risk_assessment: crisisData.riskAssessment
    };

    console.log("CRISIS EMAIL: Sending with template params:", templateParams);

    // Send the email
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log(`CRISIS EMAIL: SUCCESS - Email sent for ${crisisData.severity.toUpperCase()} level:`, response);
    
    if (response.status === 200 || response.text === 'OK') {
      console.log("CRISIS EMAIL: Confirmed successful delivery");
      return true;
    } else {
      console.error("CRISIS EMAIL: Unexpected response:", response);
      return false;
    }

  } catch (error) {
    console.error("CRISIS EMAIL: FAILED to send email:", error);
    console.error("CRISIS EMAIL: Error details:", {
      message: error.message,
      stack: error.stack,
      crisisData
    });
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
🚨 CRITICAL ACTIONS REQUIRED IMMEDIATELY:
- CONTACT PATIENT IMMEDIATELY if contact information available
- Consider emergency services notification (911) for imminent risk
- Involuntary hold assessment may be necessary
- HIGHEST PRIORITY - Review within 15 minutes
- May require immediate intervention by licensed clinician`;

    case 'high':
      return `
⚠️ HIGH PRIORITY ACTIONS REQUIRED:
- Contact patient within 1 hour if possible
- Safety assessment required today
- Consider crisis intervention team involvement
- HIGH PRIORITY - Review within 1 hour
- Schedule immediate appointment if possible`;

    case 'medium':
      return `
📋 MODERATE ACTIONS REQUIRED:
- Follow up with patient within 24 hours
- Safety planning needed
- Consider outpatient crisis services
- MODERATE PRIORITY - Review within 4 hours`;

    case 'low':
      return `
📝 FOLLOW-UP ACTIONS REQUIRED:
- Check in with patient within 48 hours
- Monitor for escalation
- Provide appropriate resources
- STANDARD PRIORITY - Review within 24 hours`;

    default:
      return `
📋 GENERAL ACTIONS REQUIRED:
- Review and assess as appropriate
- Standard follow-up protocols
- Monitor for changes`;
  }
};

/**
 * Get crisis-specific clinical information
 */
const getCrisisSpecificInformation = (crisisType: string, severity: string): string => {
  const severityNote = `SEVERITY: ${severity.toUpperCase()} LEVEL`;
  
  switch (crisisType.toLowerCase()) {
    case 'suicide':
    case 'suicide-direct-detection':
    case 'suicidal-ideation':
      return `
🔴 SUICIDE RISK ASSESSMENT (${severityNote}):
- Patient has expressed suicidal ideation
- IMMEDIATE safety assessment required
- Contact emergency services if patient has plan/means
- Consider involuntary hold if imminent risk indicated
- Ohio law requires mandated reporting for imminent risk`;

    case 'eating-disorder':
    case 'eating_disorder':
      return `
🟡 EATING DISORDER CRISIS ASSESSMENT (${severityNote}):
- Patient showing concerning eating behaviors
- Risk of medical complications possible
- Cleveland Emily Program referral recommended
- High comorbidity with mood disorders`;

    case 'substance-use':
    case 'substance_abuse':
      return `
🟠 SUBSTANCE ABUSE CRISIS ASSESSMENT (${severityNote}):
- Patient showing concerning substance use patterns
- Risk of overdose or withdrawal complications
- May require detoxification support
- Assess for dual diagnosis conditions`;

    case 'self-harm':
    case 'cutting':
      return `
🔴 SELF-HARM CRISIS ASSESSMENT (${severityNote}):
- Patient has expressed self-harm intentions/behaviors
- Risk of escalation to suicidal behavior
- IMMEDIATE safety planning needed
- May require medical attention for injuries`;

    default:
      return `
🟡 GENERAL CRISIS ASSESSMENT (${severityNote}):
- Patient requires professional attention
- Assess for safety risks
- Provide appropriate intervention based on severity`;
  }
};

// Initialize the service immediately
console.log("CRISIS EMAIL: Initializing EmailJS service for ALL severity levels");
initializeEmailService();
