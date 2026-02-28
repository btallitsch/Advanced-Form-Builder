import React, { useState, useCallback } from 'react'
import { exportAsJSON, exportAsHTML, copyToClipboard } from '../../utils/schemaExport.js'
import { Button } from '../UI/Button.jsx'
import styles from './ExportPanel.module.css'

const TABS = [
  { id: 'json', label: 'JSON Schema', icon: '{}' },
  { id: 'html', label: 'HTML Embed', icon: '</>' },
]

export const ExportPanel = ({ formMeta, fields }) => {
  const [activeTab, setActiveTab] = useState('json')
  const [copied, setCopied] = useState(false)

  const jsonOutput = exportAsJSON(formMeta, fields)
  const htmlOutput = exportAsHTML(formMeta, fields)

  const activeContent = activeTab === 'json' ? jsonOutput : htmlOutput

  const handleCopy = useCallback(async () => {
    const success = await copyToClipboard(activeContent)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [activeContent])

  const handleDownload = useCallback(() => {
    const ext = activeTab === 'json' ? 'json' : 'html'
    const mimeType = activeTab === 'json' ? 'application/json' : 'text/html'
    const blob = new Blob([activeContent], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${formMeta.title?.replace(/\s+/g, '_') || 'form'}.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }, [activeContent, activeTab, formMeta.title])

  return (
    <section className={styles.exportPanel}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Export Form</h2>
          <p className={styles.subtitle}>
            {fields.length} fields · {activeTab === 'json' ? 'JSON Schema for APIs and storage' : 'Standalone HTML page, ready to deploy'}
          </p>
        </div>
        <div className={styles.headerActions}>
          <Button variant="secondary" size="md" onClick={handleCopy}>
            {copied ? '✓ Copied!' : '⎘ Copy'}
          </Button>
          <Button variant="primary" size="md" onClick={handleDownload}>
            ↓ Download
          </Button>
        </div>
      </div>

      <div className={styles.tabBar}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={[styles.tab, activeTab === tab.id ? styles.active : ''].join(' ')}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.outputWrapper}>
        {fields.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyIcon}>↗</p>
            <p className={styles.emptyTitle}>Nothing to export yet</p>
            <p className={styles.emptyDesc}>Add some fields in the Builder tab first</p>
          </div>
        ) : (
          <pre className={styles.codeOutput}>
            <code>{activeContent}</code>
          </pre>
        )}
      </div>

      {activeTab === 'json' && fields.length > 0 && (
        <div className={styles.schemaInfo}>
          <h3 className={styles.infoTitle}>Schema Reference</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <p className={styles.infoLabel}>Fields</p>
              <p className={styles.infoValue}>{fields.filter(f => !['heading','paragraph','divider'].includes(f.type)).length}</p>
            </div>
            <div className={styles.infoCard}>
              <p className={styles.infoLabel}>Required</p>
              <p className={styles.infoValue}>{fields.filter(f => f.required).length}</p>
            </div>
            <div className={styles.infoCard}>
              <p className={styles.infoLabel}>With Validation</p>
              <p className={styles.infoValue}>{fields.filter(f => f.validation && Object.keys(f.validation).some(k => f.validation[k])).length}</p>
            </div>
            <div className={styles.infoCard}>
              <p className={styles.infoLabel}>Conditional</p>
              <p className={styles.infoValue}>{fields.filter(f => f.conditionalLogic?.enabled).length}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default ExportPanel
