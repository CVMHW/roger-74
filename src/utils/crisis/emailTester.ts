
/**
 * Email Testing Utility
 * Simple way to test if EmailJS is working
 */

import { sendCrisisEmail } from './emailService';

export const testCrisisEmail = async (): Promise<void> => {
  console.log("🧪 Testing crisis email system...");
  
  const testData = {
    userMessage: "This is a test of the crisis email system",
    severity: "TEST",
    crisisType: "system-test",
    timestamp: new Date().toISOString(),
    sessionId: `test_${Date.now()}`
  };
  
  const result = await sendCrisisEmail(testData);
  
  if (result.success) {
    console.log("✅ Email test PASSED - System is working");
  } else {
    console.error("❌ Email test FAILED:", result.error);
  }
};

// Add a global function for testing
(window as any).testCrisisEmail = testCrisisEmail;
