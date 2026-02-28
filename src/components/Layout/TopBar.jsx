import React, { useState } from 'react'
import styles from './TopBar.module.css'
import { Button } from '../UI/Button.jsx'

const TABS = [
  { id: 'builder', label: 'Builder', icon: '⚡' },
  { id: 'preview', label: 'Preview', icon: '👁' },
  { id: 'export', label: 'Export', icon: '↗' },
]

export const TopBar = ({ activeTab, setActiveTab, fieldCount, isDirty, clearForm }) => {
  const [confirmClear, setConfirmClear] = useState(false)

  const handleClear = () => {
    if (confirmClear) {
      clearForm()
      setConfirmClear(false)
    } else {
      setConfirmClear(true)
      setTimeout(() => setConfirmClear(false), 3000)
    }
  }

  return (
    <header className={styles.topbar}>
      <div className={styles.brand}>
        <div className={styles.logo}>
          <span className={styles.logoMark}>⬡</span>
          <span className={styles.logoText}>FormCraft</span>
        </div>
        {isDirty && <span className={styles.dirtyDot} title="Unsaved changes" />}
        <span className={styles.fieldCount}>{fieldCount} {fieldCount === 1 ? 'field' : 'fields'}</span>
      </div>

      <nav className={styles.tabs} aria-label="View tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={[styles.tab, activeTab === tab.id ? styles.active : ''].join(' ')}
            onClick={() => setActiveTab(tab.id)}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      <div className={styles.actions}>
        <Button
          variant="danger"
          size="sm"
          onClick={handleClear}
          title={confirmClear ? 'Click again to confirm' : 'Clear all fields'}
        >
          {confirmClear ? '⚠ Confirm Clear' : '✕ Clear'}
        </Button>
      </div>
    </header>
  )
}

export default TopBar
