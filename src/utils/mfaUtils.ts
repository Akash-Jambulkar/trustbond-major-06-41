
// MFA utilities for authentication

// Generate a random 6-digit MFA code
export const generateMFACode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store MFA code in sessionStorage
export const storeMFACode = (userId: string, code: string): void => {
  sessionStorage.setItem(`mfa_code_${userId}`, code);
  // Set expiry to 5 minutes from now
  const expires = Date.now() + 5 * 60 * 1000;
  sessionStorage.setItem(`mfa_code_${userId}_expires`, expires.toString());
};

// Retrieve MFA code from sessionStorage
export const retrieveMFACode = (userId: string): string | null => {
  const expires = sessionStorage.getItem(`mfa_code_${userId}_expires`);
  
  // Check if code has expired
  if (expires && parseInt(expires) < Date.now()) {
    clearMFACode(userId);
    return null;
  }
  
  return sessionStorage.getItem(`mfa_code_${userId}`);
};

// Clear MFA code from sessionStorage
export const clearMFACode = (userId: string): void => {
  sessionStorage.removeItem(`mfa_code_${userId}`);
  sessionStorage.removeItem(`mfa_code_${userId}_expires`);
};

interface MFAPreferences {
  enabled: boolean;
  method: 'sms' | 'email';
  phoneNumber?: string;
}

// Store MFA preferences in localStorage
export const storeMFAPreferences = (userId: string, preferences: MFAPreferences): void => {
  localStorage.setItem(`mfa_prefs_${userId}`, JSON.stringify(preferences));
};

// Retrieve MFA preferences from localStorage
export const retrieveMFAPreferences = (userId: string): MFAPreferences | null => {
  const prefs = localStorage.getItem(`mfa_prefs_${userId}`);
  return prefs ? JSON.parse(prefs) : null;
};

// Mock function to send MFA code via email
export const sendMFACodeViaEmail = async (email: string, code: string): Promise<boolean> => {
  console.log(`Sending MFA code ${code} to ${email}`);
  // In a real app, this would call an API to send the email
  // For demo purposes, we'll just simulate a successful send
  await new Promise(resolve => setTimeout(resolve, 1000));
  return true;
};

// Mock function to send MFA code via SMS
export const sendMFACodeViaSMS = async (phoneNumber: string, code: string): Promise<boolean> => {
  console.log(`Sending MFA code ${code} to ${phoneNumber}`);
  // In a real app, this would call an API to send the SMS
  // For demo purposes, we'll just simulate a successful send
  await new Promise(resolve => setTimeout(resolve, 1000));
  return true;
};
