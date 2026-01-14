/**
 * Form Validation Utilities
 * Comprehensive client-side validation
 */

// Email validation
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Password validation
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber,
    errors: {
      minLength: password.length < minLength ? `Password must be at least ${minLength} characters` : null,
      hasUpperCase: !hasUpperCase ? 'Password must contain at least one uppercase letter' : null,
      hasLowerCase: !hasLowerCase ? 'Password must contain at least one lowercase letter' : null,
      hasNumber: !hasNumber ? 'Password must contain at least one number' : null,
      hasSpecialChar: !hasSpecialChar ? 'Password should contain at least one special character' : null,
    },
  };
};

// Phone validation (Brazilian format)
export const validatePhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 11 || cleaned.length === 10;
};

// CPF validation (Brazilian ID)
export const validateCPF = (cpf) => {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return false;

  // Check for known invalid CPFs
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  // Validate check digits
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(10))) return false;

  return true;
};

// URL validation
export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Required field validation
export const validateRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

// Number range validation
export const validateRange = (value, min, max) => {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
};

// Create validation schema
export const createValidator = (schema) => {
  return (data) => {
    const errors = {};

    for (const [field, rules] of Object.entries(schema)) {
      const value = data[field];

      for (const rule of rules) {
        if (rule.required && !validateRequired(value)) {
          errors[field] = rule.message || `${field} is required`;
          break;
        }

        if (value && rule.type === 'email' && !validateEmail(value)) {
          errors[field] = rule.message || 'Invalid email address';
          break;
        }

        if (value && rule.type === 'password') {
          const passwordValidation = validatePassword(value);
          if (!passwordValidation.isValid) {
            errors[field] = Object.values(passwordValidation.errors).find(e => e) || 'Invalid password';
            break;
          }
        }

        if (value && rule.minLength && value.length < rule.minLength) {
          errors[field] = rule.message || `Must be at least ${rule.minLength} characters`;
          break;
        }

        if (value && rule.maxLength && value.length > rule.maxLength) {
          errors[field] = rule.message || `Must be no more than ${rule.maxLength} characters`;
          break;
        }

        if (value && rule.pattern && !rule.pattern.test(value)) {
          errors[field] = rule.message || 'Invalid format';
          break;
        }
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };
};
