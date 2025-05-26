/**
 * Crisis Audit Logger with Email Notifications
 * 
 * Logs all crisis detections and sends email notifications to the psychologist
 */

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
}

/**
 * Log a crisis detection event
 */
export const logCrisisEvent = async (entry: CrisisAuditEntry): Promise<void> => {
  try {
    console.log('CRISIS AUDIT: Starting crisis event logging', entry);
    
    // Store in local storage for immediate backup
    const existingLogs = getStoredCrisisLogs();
    existingLogs.push(entry);
    localStorage.setItem('crisis_audit_logs', JSON.stringify(existingLogs));
    console.log('CRISIS AUDIT: Stored locally successfully');
    
    // Send email notification to psychologist
    await sendCrisisEmailNotification(entry);
    
    console.log('CRISIS AUDIT: Event logged and email sent successfully', {
      timestamp: entry.timestamp,
      crisisType: entry.crisisType,
      severity: entry.severity
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
 * Send crisis email notification to psychologist using EmailJS
 */
const sendCrisisEmailNotification = async (entry: CrisisAuditEntry): Promise<void> => {
  console.log('CRISIS EMAIL: Starting email notification process');
  
  // Enhanced email body with crisis-specific information
  const emailBody = `
CRISIS DETECTION ALERT - Roger AI

Timestamp: ${entry.timestamp}
Session ID: ${entry.sessionId}
Crisis Type: ${entry.crisisType}
Severity: ${entry.severity}
Detection Method: ${entry.detectionMethod}

User Message:
"${entry.userInput}"

Roger's Response:
"${entry.rogerResponse}"

${getCrisisSpecificInformation(entry.crisisType, entry.severity)}

Technical Details:
- User Agent: ${entry.userAgent || 'Unknown'}
- IP Address: ${entry.ipAddress || 'Unknown'}

Please review this crisis detection immediately.

---
This is an automated alert from Roger AI Crisis Detection System
Cuyahoga Valley Mindful Health and Wellness
  `;

  // Get crisis-specific subject line
  const subjectLine = getCrisisSubjectLine(entry.crisisType, entry.severity);

  // Updated with your CONFIRMED EmailJS configuration from dashboard
  const emailJSData = {
    service_id: 'service_fqqp3ta', // CONFIRMED: Matches your Gmail service in dashboard
    template_id: 'template_u3w9maq', // CONFIRMED: Your actual template ID
    user_id: 'eFkOj3YAK3s86h8hL', // Your public key
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
      roger_response: entry.rogerResponse
    }
  };

  console.log('CRISIS EMAIL: Prepared EmailJS data with CONFIRMED credentials:', emailJSData);

  // Using your configured EmailJS service
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
    console.log('CRISIS EMAIL: EmailJS response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CRISIS EMAIL: EmailJS error response:', errorText);
      throw new Error(`EmailJS send failed: ${response.status} - ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('CRISIS EMAIL: EmailJS success response:', result);
    console.log(`✅ Crisis email sent successfully to cvmindfulhealthandwellness@outlook.com for ${entry.crisisType}`);
    
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
 * Get crisis-specific subject line
 */
const getCrisisSubjectLine = (crisisType: string, severity: string): string => {
  const emoji = getEmergencyEmoji(crisisType);
  const priority = severity === 'critical' ? 'URGENT' : 'ALERT';
  
  switch (crisisType.toLowerCase()) {
    case 'suicide':
    case 'suicide-direct-detection':
      return `${emoji} ${priority}: SUICIDE RISK - Immediate Intervention Required`;
    case 'self-harm':
    case 'cutting':
      return `${emoji} ${priority}: SELF-HARM RISK - ${severity} severity`;
    case 'eating-disorder':
    case 'eating_disorder':
      return `${emoji} ${priority}: EATING DISORDER CRISIS - ${severity} severity`;
    case 'substance-use':
    case 'substance_abuse':
      return `${emoji} ${priority}: SUBSTANCE ABUSE CRISIS - ${severity} severity`;
    default:
      return `${emoji} ${priority}: CRISIS DETECTION - ${crisisType} - ${severity} severity`;
  }
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
