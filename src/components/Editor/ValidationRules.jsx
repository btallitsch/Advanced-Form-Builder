import React from 'react'
import { getApplicableRules } from '../../utils/validation.js'
import styles from './ValidationRules.module.css'

export const ValidationRules = ({ field, onUpdateValidation }) => {
  const rules = getApplicableRules(field.type)

  if (rules.length === 0) {
    return <p className={styles.empty}>No validation rules for this field type.</p>
  }

  return (
    <div className={styles.rules}>
      {rules.map((rule) => {
        if (rule.key === 'required') return null // Handled in main field editor
        if (rule.key === 'customError') return null // Shown separately below
        const value = field.validation?.[rule.key] ?? ''
        return (
          <div key={rule.key} className={styles.rule}>
            <label htmlFor={`val_${rule.key}`}>{rule.label}</label>
            <p className={styles.desc}>{rule.description}</p>
            {rule.input === 'number' && (
              <input
                id={`val_${rule.key}`}
                type="number"
                value={value}
                placeholder={rule.placeholder}
                onChange={(e) =>
                  onUpdateValidation({ [rule.key]: e.target.value === '' ? undefined : Number(e.target.value) })
                }
              />
            )}
            {rule.input === 'text' && (
              <input
                id={`val_${rule.key}`}
                type="text"
                value={value}
                placeholder={rule.placeholder}
                onChange={(e) =>
                  onUpdateValidation({ [rule.key]: e.target.value || undefined })
                }
              />
            )}
          </div>
        )
      })}

      {/* Custom error message */}
      <div className={styles.rule}>
        <label htmlFor="val_customError">Custom Error Message</label>
        <p className={styles.desc}>Override default validation error text</p>
        <input
          id="val_customError"
          type="text"
          value={field.validation?.customError ?? ''}
          placeholder="e.g. Please enter a valid value"
          onChange={(e) => onUpdateValidation({ customError: e.target.value || undefined })}
        />
      </div>
    </div>
  )
}

export default ValidationRules
