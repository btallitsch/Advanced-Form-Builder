import React from 'react'
import styles from './PreviewField.module.css'

export const PreviewField = ({ field, value, onChange, error, visible }) => {
  if (!visible) return null

  const handleChange = (newValue) => onChange(field.id, newValue)

  if (field.type === 'heading') {
    const Tag = `h${field.level || 2}`
    return <Tag className={styles.heading}>{field.content}</Tag>
  }

  if (field.type === 'paragraph') {
    return <p className={styles.paragraph}>{field.content}</p>
  }

  if (field.type === 'divider') {
    return <hr className={styles.divider} />
  }

  return (
    <div className={[styles.fieldGroup, error ? styles.hasError : ''].join(' ')}>
      <label htmlFor={`preview_${field.id}`} className={styles.label}>
        {field.label}
        {field.required && <span className={styles.required}>*</span>}
      </label>

      {field.type === 'textarea' && (
        <textarea
          id={`preview_${field.id}`}
          value={value || ''}
          placeholder={field.placeholder}
          rows={field.rows || 4}
          onChange={(e) => handleChange(e.target.value)}
          className={error ? styles.inputError : ''}
        />
      )}

      {field.type === 'select' && (
        <select
          id={`preview_${field.id}`}
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          className={error ? styles.inputError : ''}
        >
          <option value="">Select an option...</option>
          {(field.options || []).map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )}

      {field.type === 'radio' && (
        <div className={styles.optionList}>
          {(field.options || []).map((opt) => (
            <label key={opt.value} className={styles.optionLabel}>
              <input
                type="radio"
                name={`preview_${field.id}`}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => handleChange(opt.value)}
              />
              <span className={styles.optionText}>{opt.label}</span>
            </label>
          ))}
        </div>
      )}

      {field.type === 'checkbox' && (
        <div className={styles.optionList}>
          {(field.options || []).map((opt) => {
            const checked = Array.isArray(value) && value.includes(opt.value)
            return (
              <label key={opt.value} className={styles.optionLabel}>
                <input
                  type="checkbox"
                  value={opt.value}
                  checked={checked}
                  onChange={(e) => {
                    const current = Array.isArray(value) ? value : []
                    if (e.target.checked) {
                      handleChange([...current, opt.value])
                    } else {
                      handleChange(current.filter((v) => v !== opt.value))
                    }
                  }}
                />
                <span className={styles.optionText}>{opt.label}</span>
              </label>
            )
          })}
        </div>
      )}

      {field.type === 'toggle' && (
        <label className={styles.toggleLabel}>
          <div
            className={[styles.toggle, value ? styles.toggleOn : ''].join(' ')}
            onClick={() => handleChange(!value)}
            role="switch"
            aria-checked={!!value}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleChange(!value)}
          >
            <div className={styles.toggleThumb} />
          </div>
          <span>{value ? 'Enabled' : 'Disabled'}</span>
        </label>
      )}

      {field.type === 'file' && (
        <div className={styles.fileUpload}>
          <input
            id={`preview_${field.id}`}
            type="file"
            accept={field.accept}
            multiple={field.multiple}
            onChange={(e) => handleChange(e.target.files[0]?.name || '')}
          />
          <label htmlFor={`preview_${field.id}`} className={styles.fileLabel}>
            <span className={styles.fileIcon}>📎</span>
            <span>{value || (field.helpText || 'Click to upload or drag & drop')}</span>
          </label>
        </div>
      )}

      {!['textarea', 'select', 'radio', 'checkbox', 'toggle', 'file'].includes(field.type) && (
        <input
          id={`preview_${field.id}`}
          type={field.type === 'phone' ? 'tel' : field.type}
          value={value || ''}
          placeholder={field.placeholder}
          onChange={(e) => handleChange(e.target.value)}
          className={error ? styles.inputError : ''}
        />
      )}

      {field.helpText && !error && (
        <span className={styles.helpText}>{field.helpText}</span>
      )}
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  )
}

export default PreviewField
