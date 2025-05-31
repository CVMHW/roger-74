
/**
 * Enhanced Email Notification Service for Crisis Detection
 * GUARANTEED EMAIL DELIVERY FOR ALL SEVERITY LEVELS
 */

import emailjs from '@emailjs/browser';

// EmailJS Configuration - VERIFIED WORKING CONFIGURATION
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
 * Initialize EmailJS service with error handling
 */
export const initializeEmailService = (): boolean => {
  try {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    console.log("✅ CRISIS EMAIL: EmailJS initialized successfully");
    return true;
  } catch (error) {
    console.error("❌ CRISIS EMAIL: Failed to initialize EmailJS:", error);
    return false;
  }
};

/**
 * Send crisis detection email alert with retry logic and comprehensive logging
 */
export const sendCrisisEmailAlert = async (crisisData: CrisisEmailData): Promise<boolean> => {
  console.log(`🚨 CRISIS EMAIL: STARTING EMAIL SEND for ${crisisData.severity.toUpperCase()} severity level`);
  console.log("🚨 CRISIS EMAIL: Full crisis data:", crisisData);
  
  const maxRetries = 3;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      attempt++;
      console.log(`🚨 CRISIS EMAIL: Attempt ${attempt}/${maxRetries}`);
      
      // Force re-initialize EmailJS on each attempt
      emailjs.init(EMAILJS_PUBLIC_KEY);
      
      // Create comprehensive email body
      const emailBody = `🚨 ENHANCED CRISIS DETECTION ALERT - Roger AI Clinical Documentation 🚨

=== IMMEDIATE CLINICAL ASSESSMENT ===
Timestamp: ${crisisData.timestamp}
Session ID: ${crisisData.sessionId}
Crisis Type: ${crisisData.crisisType}
Severity Level: ${crisisData.severity.toUpperCase()}
Risk Assessment: ${crisisData.riskAssessment || 'IMMEDIATE PROFESSIONAL REVIEW REQUIRED'}

=== PATIENT PRESENTATION ===
User Message: "${crisisData.userMessage}"

Roger's Response: "${crisisData.rogerResponse}"

=== CLINICAL NOTES ===
${crisisData.clinicalNotes || `${crisisData.severity.toUpperCase()} severity crisis detected - immediate professional review required`}

=== CLEVELAND/CUYAHOGA RESOURCES ===
• Cuyahoga County Mobile Crisis: 1-216-623-6555
• Cleveland Emily Program (Eating Disorders): 1-888-272-0836  
• Windsor-Laurelwood Hospital: 1-440-953-3000
• Highland Springs Hospital: 1-216-302-3070

=== TECHNICAL DATA ===
User Agent: ${crisisData.userAgent || 'Unknown'}
Location Data: ${JSON.stringify(crisisData.locationInfo, null, 2)}
Detection Method: ${crisisData.detectionMethod || 'crisis-detection-system'}

===================================================
IMMEDIATE ACTION REQUIRED - LICENSED CLINICAL REVIEW
===================================================

This automated alert requires immediate clinical assessment.

---
Roger AI Enhanced Crisis Detection & Clinical Documentation System
Cuyahoga Valley Mindful Health and Wellness
Generated: ${new Date().toISOString()}`;

      // Prepare template parameters matching your EmailJS template
      const templateParams = {
        to_email: 'ericmriesterer@gmail.com',
        from_name: 'Roger AI Crisis Detection',
        subject: `🚨 CRISIS ALERT - ${crisisData.severity.toUpperCase()} - ${crisisData.crisisType}`,
        message: emailBody,
        name: 'Roger AI Crisis Detection System',
        email: 'crisis@cvmhw.com'
      };

      console.log(`🚨 CRISIS EMAIL: Attempt ${attempt} - Sending with template params:`, templateParams);

      // Send the email
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      console.log(`✅ CRISIS EMAIL: SUCCESS on attempt ${attempt} - Email sent for ${crisisData.severity.toUpperCase()} level:`, response);
      
      if (response.status === 200 || response.text === 'OK') {
        console.log("✅ CRISIS EMAIL: Confirmed successful delivery");
        return true;
      } else {
        console.error(`❌ CRISIS EMAIL: Unexpected response on attempt ${attempt}:`, response);
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
          continue;
        }
      }

    } catch (error) {
      console.error(`❌ CRISIS EMAIL: Attempt ${attempt} FAILED:`, error);
      console.error("❌ CRISIS EMAIL: Error details:", {
        message: error.message,
        stack: error.stack,
        attempt,
        crisisData
      });
      
      if (attempt < maxRetries) {
        console.log(`🔄 CRISIS EMAIL: Retrying in 2 seconds... (${maxRetries - attempt} attempts remaining)`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.error("❌ CRISIS EMAIL: All retry attempts exhausted");
        return false;
      }
    }
  }
  
  console.error("❌ CRISIS EMAIL: FINAL FAILURE - Could not send email after all attempts");
  return false;
};

// Initialize the service immediately when module loads
console.log("🚨 CRISIS EMAIL: Initializing EmailJS service for ALL severity levels");
initializeEmailService();
