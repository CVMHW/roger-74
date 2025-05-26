
/**
 * Phone Number Collection for Crisis Situations
 * 
 * Handles gentle collection of phone numbers during crisis situations
 * with immediate notification to psychologist
 */

import { 
  logCrisisEvent, 
  getCurrentSessionId,
  CrisisAuditEntry 
} from './crisisAuditLogger';
import { LocationInfo } from './crisisResponseCoordinator';
import { getLocationDescription } from './locationDetection';

// Track phone number requests in session storage
interface PhoneNumberRequestData {
  sessionId: string;
  requestCount: number;
  lastRequestTime: string;
  crisisType: string;
  hasProvidedNumber: boolean;
  phoneNumber?: string;
  rogerPersistenceLevel: number; // 0-2, escalates with refusals
}

/**
 * Check if user message contains a phone number
 */
export const extractPhoneNumber = (userInput: string): string | null => {
  // Various phone number patterns
  const phonePatterns = [
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/, // 555-123-4567 or 555.123.4567 or 5551234567
    /\b\(\d{3}\)\s*\d{3}[-.]?\d{4}\b/, // (555) 123-4567
    /\b\d{3}\s+\d{3}\s+\d{4}\b/, // 555 123 4567
    /\b1[-.]?\d{3}[-.]?\d{3}[-.]?\d{4}\b/, // 1-555-123-4567
  ];
  
  for (const pattern of phonePatterns) {
    const match = userInput.match(pattern);
    if (match) {
      // Clean up the phone number
      return match[0].replace(/[^\d]/g, '').replace(/^1/, ''); // Remove non-digits and leading 1
    }
  }
  
  return null;
};

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/[^\d]/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phoneNumber; // Return original if can't format
};

/**
 * Generate Roger's phone number request based on crisis context and persistence level
 */
export const generatePhoneNumberRequest = (
  crisisType: string,
  refusalCount: number,
  locationInfo: LocationInfo | null
): string => {
  const requestData = getPhoneNumberRequestData();
  const persistenceLevel = requestData?.rogerPersistenceLevel || 0;
  
  if (persistenceLevel === 0) {
    // Level 1: Gentle, practical approach
    return `I'm genuinely concerned about you right now, and I want to make sure you have the support you need. Would you be comfortable sharing a phone number where someone could reach you? I know it might feel like a big step, but having that connection available could be really important. It's completely up to you, and I understand if you're not ready for that.`;
  } else if (persistenceLevel === 1) {
    // Level 2: Roger's detail-oriented nature shows, more direct
    return `I've been thinking about what you've shared, and I'm still quite concerned. I tend to be pretty straightforward about things like this - I believe having a way for a professional to reach you directly could make a real difference right now. Could you share a phone number? I know you've said you're not ready for some resources, but this is just about having that option available if things feel more overwhelming later.`;
  } else {
    // Level 3: Roger's structured persistence, but still respectful
    return `I want to be direct with you because I care about what happens to you. I've asked before about sharing a phone number, and I understand your hesitation. At the same time, as someone who tends to think through the practical details, I can see that having that direct connection available could be crucial. Would you consider sharing a number, not because you have to use any services right now, but because it gives you and the people who care about you more options if you need them?`;
  }
};

/**
 * Handle phone number collection during crisis situations
 */
export const handlePhoneNumberCollection = async (
  userInput: string,
  crisisType: string,
  locationInfo: LocationInfo | null
): Promise<string | null> => {
  // Check if user provided a phone number
  const phoneNumber = extractPhoneNumber(userInput);
  
  if (phoneNumber) {
    console.log("CRISIS PHONE NUMBER: Received phone number during crisis");
    
    // Store the phone number
    storePhoneNumber(phoneNumber, crisisType);
    
    // Immediately send enhanced crisis alert with phone number
    await sendCrisisPhoneNumberAlert(phoneNumber, crisisType, userInput, locationInfo);
    
    // Roger's response acknowledging receipt
    return `Thank you for trusting me with your phone number. I want you to know that this information is being shared with a licensed professional who can provide the right kind of support. Having this connection available feels like an important step. How are you feeling right now about having taken this step?`;
  }
  
  // Check if we should request a phone number
  const requestData = getPhoneNumberRequestData();
  const shouldRequest = shouldRequestPhoneNumber(crisisType, requestData);
  
  if (shouldRequest) {
    // Track the request
    trackPhoneNumberRequest(crisisType);
    
    // Generate appropriate request based on persistence level
    return generatePhoneNumberRequest(crisisType, requestData?.requestCount || 0, locationInfo);
  }
  
  return null;
};

/**
 * Determine if we should request a phone number
 */
const shouldRequestPhoneNumber = (
  crisisType: string,
  requestData: PhoneNumberRequestData | null
): boolean => {
  // Don't request if already provided
  if (requestData?.hasProvidedNumber) return false;
  
  // Don't request more than 3 times
  if (requestData && requestData.requestCount >= 3) return false;
  
  // Request for high-risk crisis types
  const highRiskTypes = ['suicide', 'self-harm', 'crisis'];
  if (highRiskTypes.includes(crisisType)) {
    // First request after initial refusal, then space them out
    if (!requestData) return true; // First time
    if (requestData.requestCount === 1) return true; // Second request
    if (requestData.requestCount === 2) return true; // Final request
  }
  
  return false;
};

/**
 * Track phone number request
 */
const trackPhoneNumberRequest = (crisisType: string): void => {
  const sessionId = getCurrentSessionId();
  const existingData = sessionStorage.getItem('phone_number_request_data');
  
  let requestData: PhoneNumberRequestData;
  
  if (existingData) {
    requestData = JSON.parse(existingData);
    requestData.requestCount += 1;
    requestData.lastRequestTime = new Date().toISOString();
    requestData.rogerPersistenceLevel = Math.min(requestData.requestCount - 1, 2);
  } else {
    requestData = {
      sessionId,
      requestCount: 1,
      lastRequestTime: new Date().toISOString(),
      crisisType,
      hasProvidedNumber: false,
      rogerPersistenceLevel: 0
    };
  }
  
  sessionStorage.setItem('phone_number_request_data', JSON.stringify(requestData));
};

/**
 * Store phone number when provided
 */
const storePhoneNumber = (phoneNumber: string, crisisType: string): void => {
  const sessionId = getCurrentSessionId();
  const existingData = sessionStorage.getItem('phone_number_request_data');
  
  let requestData: PhoneNumberRequestData;
  
  if (existingData) {
    requestData = JSON.parse(existingData);
  } else {
    requestData = {
      sessionId,
      requestCount: 0,
      lastRequestTime: new Date().toISOString(),
      crisisType,
      hasProvidedNumber: false,
      rogerPersistenceLevel: 0
    };
  }
  
  requestData.hasProvidedNumber = true;
  requestData.phoneNumber = phoneNumber;
  
  sessionStorage.setItem('phone_number_request_data', JSON.stringify(requestData));
};

/**
 * Get phone number request data
 */
const getPhoneNumberRequestData = (): PhoneNumberRequestData | null => {
  const existingData = sessionStorage.getItem('phone_number_request_data');
  return existingData ? JSON.parse(existingData) : null;
};

/**
 * Send immediate crisis alert with phone number to psychologist
 */
const sendCrisisPhoneNumberAlert = async (
  phoneNumber: string,
  crisisType: string,
  userInput: string,
  locationInfo: LocationInfo | null
): Promise<void> => {
  const sessionId = getCurrentSessionId();
  const formattedNumber = formatPhoneNumber(phoneNumber);
  const locationDescription = getLocationDescription(locationInfo);
  
  // Create high-priority audit entry
  const auditEntry: CrisisAuditEntry = {
    timestamp: new Date().toISOString(),
    sessionId: sessionId,
    userInput: userInput,
    crisisType: `${crisisType}-with-phone-number`,
    severity: 'critical',
    rogerResponse: `Phone number collected: ${formattedNumber}`,
    detectionMethod: 'phone-number-collection-system',
    userAgent: navigator.userAgent,
    ipAddress: 'client-side',
    locationInfo: locationInfo || undefined,
    clinicalNotes: `URGENT: Patient provided phone number ${formattedNumber} during crisis. Previous resource refusal documented. Immediate contact recommended.`,
    riskAssessment: 'HIGH RISK - Phone number provided after resource refusal, immediate clinical contact required'
  };
  
  // Log with highest priority
  await logCrisisEvent(auditEntry);
  
  // Send additional high-priority email specifically for phone number
  await sendPhoneNumberEmail(formattedNumber, crisisType, locationDescription, sessionId);
};

/**
 * Send dedicated email for phone number collection
 */
const sendPhoneNumberEmail = async (
  phoneNumber: string,
  crisisType: string,
  location: string,
  sessionId: string
): Promise<void> => {
  const emailBody = `
🚨🚨🚨 IMMEDIATE CRISIS INTERVENTION REQUIRED 🚨🚨🚨

PHONE NUMBER PROVIDED DURING CRISIS - IMMEDIATE ACTION NEEDED

===== CRITICAL CONTACT INFORMATION =====
Patient Phone Number: ${phoneNumber}
Crisis Type: ${crisisType.toUpperCase()}
Location: ${location}
Session ID: ${sessionId}
Time: ${new Date().toLocaleString()}

===== CLINICAL CONTEXT =====
• Patient initially REFUSED crisis resources
• Roger maintained supportive contact per protocol
• Patient subsequently PROVIDED phone number
• This indicates possible readiness for intervention
• IMMEDIATE phone contact recommended

===== RECOMMENDED IMMEDIATE ACTIONS =====
1. Call ${phoneNumber} within 15 minutes if possible
2. Assess current safety and risk level
3. Provide appropriate crisis intervention
4. Document contact attempt and outcome
5. Consider emergency services if unreachable

===== ROGER'S CRISIS MANAGEMENT =====
Roger successfully:
• Maintained therapeutic rapport after resource refusal
• Used gentle persistence without pressure
• Secured phone number through supportive approach
• Provided immediate documentation to clinical team

This represents successful crisis management - patient moved from refusal to providing contact information.

URGENT CLINICAL FOLLOW-UP REQUIRED IMMEDIATELY

---
Roger AI Crisis Phone Number Collection System
Cuyahoga Valley Mindful Health and Wellness
CRITICAL PRIORITY ALERT - ${new Date().toISOString()}
  `;
  
  const emailJSData = {
    service_id: 'service_fqqp3ta',
    template_id: 'template_u3w9maq',
    user_id: 'eFkOj3YAK3s86h8hL',
    template_params: {
      to_email: 'cvmindfulhealthandwellness@outlook.com',
      from_name: 'Roger AI URGENT Crisis Phone Collection',
      subject: `🚨 URGENT: Crisis Phone Number Provided - ${phoneNumber} - IMMEDIATE CONTACT REQUIRED`,
      message: emailBody,
      timestamp: new Date().toISOString(),
      crisis_type: crisisType,
      severity: 'CRITICAL',
      session_id: sessionId,
      phone_number: phoneNumber,
      location: location
    }
  };

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailJSData)
    });

    if (!response.ok) {
      throw new Error(`EmailJS send failed: ${response.status}`);
    }

    console.log('✅ URGENT: Crisis phone number email sent successfully');
    
  } catch (error) {
    console.error('URGENT: Failed to send crisis phone number email:', error);
    
    // Fallback mailto for critical situations
    const subject = encodeURIComponent(`🚨 URGENT: Crisis Phone Number - ${phoneNumber}`);
    const body = encodeURIComponent(emailBody);
    const mailtoUrl = `mailto:cvmindfulhealthandwellness@outlook.com?subject=${subject}&body=${body}`;
    
    try {
      window.open(mailtoUrl, '_blank');
    } catch (mailtoError) {
      console.error('All notification methods failed for phone number alert:', mailtoError);
    }
  }
};

/**
 * Check if we have phone number request data for current session
 */
export const hasPhoneNumberRequestData = (): boolean => {
  const data = getPhoneNumberRequestData();
  return data !== null;
};

/**
 * Get phone number if provided in current session
 */
export const getProvidedPhoneNumber = (): string | null => {
  const data = getPhoneNumberRequestData();
  return data?.phoneNumber || null;
};
