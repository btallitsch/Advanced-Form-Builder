import React, { useState } from 'react'
import { FIELD_TYPES, HAS_OPTIONS, HAS_VALIDATION, LAYOUT_FIELD_TYPES } from '../../utils/fieldTypes.js'
import { ValidationRules } from './ValidationRules.jsx'
import { ConditionalLogic } from './ConditionalLogic.jsx'
import { Button } from '../UI/Button.jsx'
import styles from './FieldEditor.module.css'

const TABS = ['Settings', 'Validation', 'Logic']

const OptionsEditor = ({ field, onAddOption, onUpdateOption, onRemoveOption }) => (
  <div className={styles.section}>
    <label>Options</label>
    <div className={styles.options}>
      {(field.options || []).map((opt, idx) => (
        <div key={idx} className={styles.optionRow}>
          <input
            type="text"
            value={opt.label}
            placeholder="Label"
            onChange={(e) => onUpdateOption(field.id, idx, { label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
          />
          <input
            type="text"
            value={opt.value}
            placeholder="Value"
            onChange={(e) => onUpdateOption(field.id, idx, { value: e.target.value })}
            className={styles.valueInput}
          />
          <Button variant="icon" size="sm" onClick={() => onRemoveOption(field.id, idx)} title="Remove option">✕</Button>
        </div>
      ))}
      <Button variant="secondary" size="sm" onClick={() => onAddOption(field.id)}>+ Add Option</Button>
    </div>
  </div>
)

export const FieldEditor = ({
  field,
  allFields,
  onUpdateField,
  onUpdateValidation,
  onUpdateConditional,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
}) => {
  const [activeTab, setActiveTab] = useState('Settings')
  const fieldDef = FIELD_TYPES[field.type]
  const isLayout = LAYOUT_FIELD_TYPES.includes(field.type)

  const tabs = isLayout ? ['Settings'] : TABS

  return (
    <aside className={styles.editor}>
      <div className={styles.header}>
        <div className={styles.fieldType}>
          <span className={styles.typeIcon}>{fieldDef?.icon}</span>
          <div>
            <p className={styles.typeName}>{fieldDef?.label || field.type}</p>
            <p className={styles.fieldId}>id: {field.id}</p>
          </div>
        </div>
        <div className={styles.editorTabs}>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={[styles.tab, activeTab === tab ? styles.active : ''].join(' ')}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.body}>
        {activeTab === 'Settings' && (
          <div className={styles.settingsPanel}>
            {/* Layout field: heading */}
            {field.type === 'heading' && (
              <>
                <div className={styles.section}>
                  <label htmlFor="field_content">Heading Text</label>
                  <input
                    id="field_content"
                    type="text"
                    value={field.content || ''}
                    placeholder="Enter heading text..."
                    onChange={(e) => onUpdateField(field.id, { content: e.target.value })}
                  />
                </div>
                <div className={styles.section}>
                  <label htmlFor="field_level">Heading Level</label>
                  <select
                    id="field_level"
                    value={field.level || 2}
                    onChange={(e) => onUpdateField(field.id, { level: Number(e.target.value) })}
                  >
                    <option value={1}>H1 — Large</option>
                    <option value={2}>H2 — Medium</option>
                    <option value={3}>H3 — Small</option>
                  </select>
                </div>
              </>
            )}

            {/* Layout field: paragraph */}
            {field.type === 'paragraph' && (
              <div className={styles.section}>
                <label htmlFor="field_content">Paragraph Text</label>
                <textarea
                  id="field_content"
                  value={field.content || ''}
                  placeholder="Enter paragraph text..."
                  rows={4}
                  onChange={(e) => onUpdateField(field.id, { content: e.target.value })}
                />
              </div>
            )}

            {/* Regular input fields */}
            {!isLayout && (
              <>
                <div className={styles.section}>
                  <label htmlFor="field_label">Label</label>
                  <input
                    id="field_label"
                    type="text"
                    value={field.label || ''}
                    placeholder="Field label..."
                    onChange={(e) => onUpdateField(field.id, { label: e.target.value })}
                  />
                </div>

                {!['file', 'date', 'toggle', ...HAS_OPTIONS].includes(field.type) && (
                  <div className={styles.section}>
                    <label htmlFor="field_placeholder">Placeholder</label>
                    <input
                      id="field_placeholder"
                      type="text"
                      value={field.placeholder || ''}
                      placeholder="Placeholder text..."
                      onChange={(e) => onUpdateField(field.id, { placeholder: e.target.value })}
                    />
                  </div>
                )}

                <div className={styles.section}>
                  <label htmlFor="field_help">Help Text</label>
                  <input
                    id="field_help"
                    type="text"
                    value={field.helpText || ''}
                    placeholder="Add help text below the field..."
                    onChange={(e) => onUpdateField(field.id, { helpText: e.target.value })}
                  />
                </div>

                <div className={styles.section}>
                  <label className={styles.checkLabel}>
                    <input
                      type="checkbox"
                      checked={field.required || false}
                      onChange={(e) => onUpdateField(field.id, { required: e.target.checked })}
                      style={{ width: 'auto', marginRight: 6 }}
                    />
                    Required field
                  </label>
                </div>

                {field.type === 'textarea' && (
                  <div className={styles.section}>
                    <label htmlFor="field_rows">Rows</label>
                    <input
                      id="field_rows"
                      type="number"
                      min={2}
                      max={20}
                      value={field.rows || 4}
                      onChange={(e) => onUpdateField(field.id, { rows: Number(e.target.value) })}
                    />
                  </div>
                )}

                {field.type === 'file' && (
                  <>
                    <div className={styles.section}>
                      <label htmlFor="field_accept">Accept File Types</label>
                      <input
                        id="field_accept"
                        type="text"
                        value={field.accept || ''}
                        placeholder="e.g. .pdf, .docx, image/*"
                        onChange={(e) => onUpdateField(field.id, { accept: e.target.value })}
                      />
                    </div>
                    <div className={styles.section}>
                      <label className={styles.checkLabel}>
                        <input
                          type="checkbox"
                          checked={field.multiple || false}
                          onChange={(e) => onUpdateField(field.id, { multiple: e.target.checked })}
                          style={{ width: 'auto', marginRight: 6 }}
                        />
                        Allow multiple files
                      </label>
                    </div>
                  </>
                )}

                {/* Options editor for select, radio, checkbox */}
                {HAS_OPTIONS.includes(field.type) && (
                  <OptionsEditor
                    field={field}
                    onAddOption={onAddOption}
                    onUpdateOption={onUpdateOption}
                    onRemoveOption={onRemoveOption}
                  />
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'Validation' && (
          <div className={styles.settingsPanel}>
            <ValidationRules
              field={field}
              onUpdateValidation={(v) => onUpdateValidation(field.id, v)}
            />
          </div>
        )}

        {activeTab === 'Logic' && (
          <div className={styles.settingsPanel}>
            <ConditionalLogic
              field={field}
              allFields={allFields}
              onUpdateConditional={(cl) => onUpdateConditional(field.id, cl)}
            />
          </div>
        )}
      </div>
    </aside>
  )
}

const EmptyEditor = () => (
  <aside className={styles.editor}>
    <div className={styles.emptyEditor}>
      <span className={styles.emptyIcon}>←</span>
      <p className={styles.emptyTitle}>Select a field</p>
      <p className={styles.emptyDesc}>Click any field on the canvas to edit its properties</p>
    </div>
  </aside>
)

export const FieldEditorPanel = (props) => {
  if (!props.field) return <EmptyEditor />
  return <FieldEditor {...props} />
}

export default FieldEditorPanel
