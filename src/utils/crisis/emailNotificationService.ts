
/**
 * Enhanced Email Notification Service for Crisis Detection
 * ALL SEVERITY LEVELS NOW GET EMAIL NOTIFICATIONS
 */

import emailjs from '@emailjs/browser';

// EmailJS Configuration - CORRECT IDs from your setup
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
    
    // Create comprehensive email body
    const emailBody = `🚨 ENHANCED CRISIS DETECTION ALERT - Roger AI Clinical Documentation 🚨

=== IMMEDIATE CLINICAL ASSESSMENT ===
Timestamp: ${crisisData.timestamp}
Session ID: ${crisisData.sessionId}
Crisis Type: ${crisisData.crisisType}
Severity Level: ${crisisData.severity.toUpperCase()}
Risk Assessment: CRITICAL RISK - Immediate intervention required

=== PATIENT PRESENTATION ===
User Message: "${crisisData.userMessage}"

Roger's Response: "${crisisData.rogerResponse}"

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

===================================================
IMMEDIATE ACTION REQUIRED - LICENSED CLINICAL REVIEW
===================================================

This automated alert requires immediate clinical assessment.

---
Roger AI Enhanced Crisis Detection & Clinical Documentation System
Cuyahoga Valley Mindful Health and Wellness
Generated: ${new Date().toISOString()}`;

    // Prepare template parameters for EmailJS - matching your template
    const templateParams = {
      to_email: 'ericmriesterer@gmail.com',
      from_name: 'Roger AI Crisis Detection',
      subject: `🚨 CRISIS ALERT - ${crisisData.severity.toUpperCase()} - ${crisisData.crisisType}`,
      message: emailBody,
      name: 'Roger AI Crisis Detection System',
      email: 'crisis@cvmhw.com'
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

// Initialize the service immediately
console.log("CRISIS EMAIL: Initializing EmailJS service for ALL severity levels");
initializeEmailService();
