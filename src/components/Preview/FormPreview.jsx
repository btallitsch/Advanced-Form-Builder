import React, { useState, useCallback } from 'react'
import { PreviewField } from './PreviewField.jsx'
import { validateField, evaluateConditions } from '../../utils/validation.js'
import { Button } from '../UI/Button.jsx'
import styles from './FormPreview.module.css'

export const FormPreview = ({ formMeta, fields }) => {
  const [values, setValues] = useState({})
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [deviceMode, setDeviceMode] = useState('desktop')

  const handleChange = useCallback((fieldId, value) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }))
    setErrors((prev) => ({ ...prev, [fieldId]: null }))
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    let hasErrors = false

    fields.forEach((field) => {
      const visible = evaluateConditions(field, values)
      if (!visible) return
      if (['heading', 'paragraph', 'divider'].includes(field.type)) return

      const error = validateField(field, values[field.id])
      if (error) {
        newErrors[field.id] = error
        hasErrors = true
      }
    })

    setErrors(newErrors)
    if (!hasErrors) {
      setSubmitted(true)
    }
  }

  const handleReset = () => {
    setValues({})
    setErrors({})
    setSubmitted(false)
  }

  const DEVICES = [
    { id: 'mobile', label: '📱', width: 375, title: 'Mobile' },
    { id: 'tablet', label: '📟', width: 640, title: 'Tablet' },
    { id: 'desktop', label: '🖥', width: '100%', title: 'Desktop' },
  ]

  const currentDevice = DEVICES.find((d) => d.id === deviceMode)

  return (
    <section className={styles.previewSection}>
      <div className={styles.toolbar}>
        <div className={styles.deviceSwitcher}>
          {DEVICES.map((d) => (
            <button
              key={d.id}
              className={[styles.deviceBtn, deviceMode === d.id ? styles.active : ''].join(' ')}
              onClick={() => setDeviceMode(d.id)}
              title={d.title}
            >
              {d.label}
            </button>
          ))}
        </div>
        <span className={styles.toolbarLabel}>Live Preview</span>
        <Button variant="ghost" size="sm" onClick={handleReset}>Reset</Button>
      </div>

      <div className={styles.viewport}>
        <div
          className={styles.formWrapper}
          style={{
            width: typeof currentDevice.width === 'number' ? `${currentDevice.width}px` : currentDevice.width,
            maxWidth: '100%',
          }}
        >
          {submitted ? (
            <div className={styles.successState}>
              <div className={styles.successIcon}>✓</div>
              <h2 className={styles.successTitle}>Form Submitted!</h2>
              <p className={styles.successDesc}>Here's the data that would be submitted:</p>
              <pre className={styles.jsonOutput}>
                {JSON.stringify(
                  Object.fromEntries(
                    fields
                      .filter((f) => !['heading', 'paragraph', 'divider'].includes(f.type))
                      .map((f) => [f.label || f.id, values[f.id] ?? null]),
                  ),
                  null,
                  2,
                )}
              </pre>
              <Button variant="primary" onClick={handleReset}>Submit Another Response</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              {formMeta.title && <h1 className={styles.formTitle}>{formMeta.title}</h1>}
              {formMeta.description && <p className={styles.formDesc}>{formMeta.description}</p>}

              {fields.length === 0 ? (
                <div className={styles.emptyForm}>
                  <p>No fields yet. Add fields in the Builder tab.</p>
                </div>
              ) : (
                <div className={styles.fieldsContainer}>
                  {fields.map((field) => {
                    const visible = evaluateConditions(field, values)
                    return (
                      <PreviewField
                        key={field.id}
                        field={field}
                        value={values[field.id]}
                        onChange={handleChange}
                        error={errors[field.id]}
                        visible={visible}
                      />
                    )
                  })}
                </div>
              )}

              {fields.length > 0 && (
                <button type="submit" className={styles.submitBtn}>
                  Submit Form
                </button>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

export default FormPreview
