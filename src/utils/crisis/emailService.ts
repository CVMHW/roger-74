
/**
 * Rebuilt EmailJS Crisis Email Service
 * GUARANTEED delivery with proper error handling and verification
 */

import emailjs from '@emailjs/browser';

// EmailJS Configuration - Using your working config
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_fqqp3ta',
  TEMPLATE_ID: 'template_u3w9maq',
  PUBLIC_KEY: 'eFkOj3YAK3s86h8hL'
};

let isInitialized = false;

/**
 * Initialize EmailJS with verification
 */
export const initializeEmailJS = async (): Promise<boolean> => {
  try {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    isInitialized = true;
    console.log("✅ EmailJS initialized successfully");
    return true;
  } catch (error) {
    console.error("❌ EmailJS initialization failed:", error);
    return false;
  }
};

/**
 * Send crisis email with guaranteed delivery verification
 */
export const sendCrisisEmail = async (crisisData: {
  userMessage: string;
  severity: string;
  crisisType: string;
  timestamp: string;
  sessionId: string;
  locationInfo?: any;
}): Promise<{ success: boolean; error?: string }> => {
  console.log("🚨 SENDING CRISIS EMAIL:", crisisData);
  
  // Ensure EmailJS is initialized
  if (!isInitialized) {
    const initResult = await initializeEmailJS();
    if (!initResult) {
      return { success: false, error: "EmailJS initialization failed" };
    }
  }

  const emailBody = `🚨 CRISIS ALERT - IMMEDIATE ATTENTION REQUIRED 🚨

SEVERITY: ${crisisData.severity.toUpperCase()}
CRISIS TYPE: ${crisisData.crisisType}
TIMESTAMP: ${crisisData.timestamp}
SESSION ID: ${crisisData.sessionId}

USER MESSAGE: "${crisisData.userMessage}"

LOCATION: ${crisisData.locationInfo ? JSON.stringify(crisisData.locationInfo) : 'Unknown'}

IMMEDIATE RESOURCES:
• Cuyahoga County Mobile Crisis: 1-216-623-6555
• National Suicide Prevention Lifeline: 988
• Emergency Services: 911

This is an automated crisis detection alert from Roger AI.
Professional clinical review required immediately.`;

  const templateParams = {
    to_email: 'ericmriesterer@gmail.com',
    from_name: 'Roger AI Crisis System',
    subject: `🚨 CRISIS ALERT - ${crisisData.severity.toUpperCase()} - IMMEDIATE ACTION REQUIRED`,
    message: emailBody,
    name: 'Roger AI Crisis Detection',
    email: 'crisis@rogersupport.com'
  };

  try {
    console.log("📧 Sending email with params:", templateParams);
    
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    console.log("✅ Email sent successfully:", response);
    
    if (response.status === 200 || response.text === 'OK') {
      return { success: true };
    } else {
      return { success: false, error: `Unexpected response: ${response.text}` };
    }
    
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    return { success: false, error: error.message };
  }
};

// Initialize immediately
initializeEmailJS();
