// Input Sanitization - Remove potentially dangerous characters
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers like onclick=
    .replace(/['"]/g, ''); // Remove quotes
}

// Email Validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Password Strength Validation
export interface PasswordValidation {
  valid: boolean;
  message: string;
  strength: 'weak' | 'medium' | 'strong';
}

export function validatePassword(password: string): PasswordValidation {
  // Check minimum length
  if (password.length < 8) {
    return {
      valid: false,
      message: 'Password must be at least 8 characters long',
      strength: 'weak'
    };
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one uppercase letter',
      strength: 'weak'
    };
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one lowercase letter',
      strength: 'weak'
    };
  }

  // Check for number
  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one number',
      strength: 'weak'
    };
  }

  // Check for special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one special character (!@#$%^&*)',
      strength: 'medium'
    };
  }

  // Determine strength
  let strength: 'weak' | 'medium' | 'strong' = 'medium';
  
  if (password.length >= 12 && 
      /[A-Z]/.test(password) && 
      /[a-z]/.test(password) && 
      /[0-9]/.test(password) && 
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    strength = 'strong';
  }

  return {
    valid: true,
    message: 'Password is strong',
    strength
  };
}

// Phone Number Validation
export function validatePhone(phone: string): boolean {
  // Malaysian phone format: +60 or 60 followed by 9-11 digits
  const phoneRegex = /^(\+?60|0)[0-9]{9,11}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
}

// Matric Number Validation (USM format)
export function validateMatricNumber(matricNumber: string): boolean {
  // Format: P followed by 6 digits
  const matricRegex = /^P\d{6}$/;
  return matricRegex.test(matricNumber);
}

// General text sanitization for display
export function sanitizeForDisplay(text: string): string {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}