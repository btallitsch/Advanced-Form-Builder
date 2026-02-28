/**
 * Validation rule definitions and validators
 */

export const VALIDATION_RULES = {
  required: {
    key: 'required',
    label: 'Required',
    description: 'Field must be filled in',
    input: 'none',
    applicableTo: ['all'],
  },
  minLength: {
    key: 'minLength',
    label: 'Min Length',
    description: 'Minimum character count',
    input: 'number',
    placeholder: '3',
    applicableTo: ['text', 'textarea', 'password'],
  },
  maxLength: {
    key: 'maxLength',
    label: 'Max Length',
    description: 'Maximum character count',
    input: 'number',
    placeholder: '100',
    applicableTo: ['text', 'textarea', 'password', 'url', 'phone'],
  },
  min: {
    key: 'min',
    label: 'Min Value',
    description: 'Minimum numeric value',
    input: 'number',
    placeholder: '0',
    applicableTo: ['number'],
  },
  max: {
    key: 'max',
    label: 'Max Value',
    description: 'Maximum numeric value',
    input: 'number',
    placeholder: '100',
    applicableTo: ['number'],
  },
  pattern: {
    key: 'pattern',
    label: 'Pattern (Regex)',
    description: 'Must match regex pattern',
    input: 'text',
    placeholder: '^[a-zA-Z]+$',
    applicableTo: ['text', 'email', 'phone', 'url'],
  },
  customError: {
    key: 'customError',
    label: 'Custom Error Message',
    description: 'Override default error message',
    input: 'text',
    placeholder: 'Please enter a valid value',
    applicableTo: ['all'],
  },
}

export const getApplicableRules = (fieldType) => {
  return Object.values(VALIDATION_RULES).filter((rule) => {
    return rule.applicableTo.includes('all') || rule.applicableTo.includes(fieldType)
  })
}

/**
 * Validates a field value against its validation rules
 * @returns {string|null} error message or null if valid
 */
export const validateField = (field, value) => {
  const { validation = {}, required } = field

  // Required check
  if (required && (value === undefined || value === null || value === '')) {
    return validation.customError || `${field.label} is required`
  }

  if (!value && value !== 0) return null

  const strValue = String(value)

  // Min length
  if (validation.minLength && strValue.length < Number(validation.minLength)) {
    return validation.customError || `Must be at least ${validation.minLength} characters`
  }

  // Max length
  if (validation.maxLength && strValue.length > Number(validation.maxLength)) {
    return validation.customError || `Must be no more than ${validation.maxLength} characters`
  }

  // Min value
  if (validation.min !== undefined && Number(value) < Number(validation.min)) {
    return validation.customError || `Must be at least ${validation.min}`
  }

  // Max value
  if (validation.max !== undefined && Number(value) > Number(validation.max)) {
    return validation.customError || `Must be no more than ${validation.max}`
  }

  // Pattern
  if (validation.pattern) {
    try {
      const regex = new RegExp(validation.pattern)
      if (!regex.test(strValue)) {
        return validation.customError || `Invalid format`
      }
    } catch {
      // Invalid regex — skip
    }
  }

  // Built-in email validation
  if (field.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(strValue)) {
      return validation.customError || 'Please enter a valid email address'
    }
  }

  // Built-in URL validation
  if (field.type === 'url' && value) {
    try {
      new URL(strValue)
    } catch {
      return validation.customError || 'Please enter a valid URL'
    }
  }

  return null
}

/**
 * Evaluates conditional logic for a field
 * @param {object} field
 * @param {object} formValues - current values of all fields { fieldId: value }
 * @returns {boolean} - whether the field should be visible
 */
export const evaluateConditions = (field, formValues) => {
  const { conditionalLogic } = field
  if (!conditionalLogic?.enabled || !conditionalLogic.conditions.length) {
    return true // Always visible
  }

  const { action, logicType, conditions } = conditionalLogic

  const results = conditions.map((condition) => {
    const { fieldId, operator, value } = condition
    const fieldValue = formValues[fieldId]

    switch (operator) {
      case 'equals':
        return String(fieldValue ?? '') === String(value ?? '')
      case 'not_equals':
        return String(fieldValue ?? '') !== String(value ?? '')
      case 'contains':
        return String(fieldValue ?? '').toLowerCase().includes(String(value ?? '').toLowerCase())
      case 'not_contains':
        return !String(fieldValue ?? '').toLowerCase().includes(String(value ?? '').toLowerCase())
      case 'empty':
        return !fieldValue || fieldValue === ''
      case 'not_empty':
        return !!fieldValue && fieldValue !== ''
      case 'greater_than':
        return Number(fieldValue) > Number(value)
      case 'less_than':
        return Number(fieldValue) < Number(value)
      default:
        return true
    }
  })

  const conditionMet = logicType === 'all' ? results.every(Boolean) : results.some(Boolean)

  return action === 'show' ? conditionMet : !conditionMet
}
