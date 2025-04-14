
/**
 * Multi-factor authentication utilities
 */

// Generate a random 6-digit code
export const generateMFACode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Validate that the entered code matches the generated code
export const validateMFACode = (enteredCode: string, storedCode: string): boolean => {
  return enteredCode === storedCode;
};

// Simulate sending a code via SMS (in a real app, this would use a service like Twilio)
export const sendMFACodeViaSMS = async (phoneNumber: string, code: string): Promise<boolean> => {
  console.log(`[MFA] Sending code ${code} to ${phoneNumber}`);
  
  // In a real implementation, we'd call an SMS service here
  // For demo purposes, we'll simulate success after a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};

// Simulate sending a code via Email (in a real app, this would use a service like SendGrid)
export const sendMFACodeViaEmail = async (email: string, code: string): Promise<boolean> => {
  console.log(`[MFA] Sending code ${code} to ${email}`);
  
  // In a real implementation, we'd call an email service here
  // For demo purposes, we'll simulate success after a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};

// Store MFA code in local storage (in a real app, this would be server-side)
export const storeMFACode = (userId: string, code: string): void => {
  localStorage.setItem(`mfa_code_${userId}`, code);
  
  // Set expiration time (5 minutes from now)
  const expiresAt = Date.now() + 5 * 60 * 1000;
  localStorage.setItem(`mfa_code_${userId}_expires`, expiresAt.toString());
};

// Retrieve stored MFA code
export const retrieveMFACode = (userId: string): string | null => {
  const code = localStorage.getItem(`mfa_code_${userId}`);
  const expiresAt = localStorage.getItem(`mfa_code_${userId}_expires`);
  
  if (!code || !expiresAt) {
    return null;
  }
  
  // Check if the code has expired
  if (Date.now() > parseInt(expiresAt, 10)) {
    clearMFACode(userId);
    return null;
  }
  
  return code;
};

// Clear MFA code after use or expiration
export const clearMFACode = (userId: string): void => {
  localStorage.removeItem(`mfa_code_${userId}`);
  localStorage.removeItem(`mfa_code_${userId}_expires`);
};

// Types for MFA preferences
export type MFAMethod = 'sms' | 'email' | 'app';

export interface MFAPreferences {
  enabled: boolean;
  method: MFAMethod;
  phoneNumber?: string;
}

// Store MFA preferences in local storage
export const storeMFAPreferences = (userId: string, preferences: MFAPreferences): void => {
  localStorage.setItem(`mfa_prefs_${userId}`, JSON.stringify(preferences));
};

// Retrieve MFA preferences
export const retrieveMFAPreferences = (userId: string): MFAPreferences | null => {
  const prefsString = localStorage.getItem(`mfa_prefs_${userId}`);
  if (!prefsString) {
    return null;
  }
  
  try {
    return JSON.parse(prefsString) as MFAPreferences;
  } catch (error) {
    console.error("Failed to parse MFA preferences:", error);
    return null;
  }
};
