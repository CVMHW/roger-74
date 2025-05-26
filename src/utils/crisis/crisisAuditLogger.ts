
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
}

/**
 * Log a crisis detection event
 */
export const logCrisisEvent = async (entry: CrisisAuditEntry): Promise<void> => {
  try {
    // Store in local storage for immediate backup
    const existingLogs = getStoredCrisisLogs();
    existingLogs.push(entry);
    localStorage.setItem('crisis_audit_logs', JSON.stringify(existingLogs));
    
    // Send email notification to psychologist
    await sendCrisisEmailNotification(entry);
    
    console.log('CRISIS AUDIT: Event logged and email sent', {
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
    } catch (storageError) {
      console.error('CRISIS AUDIT CRITICAL: Failed to store locally', storageError);
    }
  }
};

/**
 * Send crisis email notification to psychologist
 */
const sendCrisisEmailNotification = async (entry: CrisisAuditEntry): Promise<void> => {
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

Technical Details:
- User Agent: ${entry.userAgent || 'Unknown'}
- IP Address: ${entry.ipAddress || 'Unknown'}

Please review this crisis detection immediately.

---
This is an automated alert from Roger AI Crisis Detection System
Cuyahoga Valley Mindful Health and Wellness
  `;

  // Using EmailJS service (requires setup)
  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'service_crisis_alerts', // Would need to be configured
        template_id: 'template_crisis_alert',
        user_id: 'your_emailjs_user_id', // Would need to be configured
        template_params: {
          to_email: 'cvmindfulhealthandwellness@outlook.com',
          from_name: 'Roger AI Crisis System',
          subject: `CRISIS ALERT: ${entry.crisisType} - ${entry.severity} severity`,
          message: emailBody,
          timestamp: entry.timestamp,
          crisis_type: entry.crisisType,
          severity: entry.severity
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Email send failed: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to send crisis email:', error);
    // Fallback: try using mailto (opens user's email client)
    const subject = encodeURIComponent(`CRISIS ALERT: ${entry.crisisType} - ${entry.severity} severity`);
    const body = encodeURIComponent(emailBody);
    const mailtoUrl = `mailto:cvmindfulhealthandwellness@outlook.com?subject=${subject}&body=${body}`;
    
    // This will only work if user has email client configured
    try {
      window.open(mailtoUrl, '_blank');
    } catch (mailtoError) {
      console.error('Mailto fallback also failed:', mailtoError);
      throw error;
    }
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
