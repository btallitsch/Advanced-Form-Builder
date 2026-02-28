import React from 'react'
import styles from './ConditionalLogic.module.css'
import { Button } from '../UI/Button.jsx'
import { INPUT_FIELD_TYPES, CHOICE_FIELD_TYPES } from '../../utils/fieldTypes.js'

const OPERATORS = [
  { value: 'equals', label: 'equals' },
  { value: 'not_equals', label: 'does not equal' },
  { value: 'contains', label: 'contains' },
  { value: 'not_contains', label: 'does not contain' },
  { value: 'empty', label: 'is empty' },
  { value: 'not_empty', label: 'is not empty' },
  { value: 'greater_than', label: 'greater than' },
  { value: 'less_than', label: 'less than' },
]

const VALUE_LESS_OPERATORS = ['empty', 'not_empty']

export const ConditionalLogic = ({ field, allFields, onUpdateConditional }) => {
  const logic = field.conditionalLogic || {
    enabled: false,
    action: 'show',
    logicType: 'all',
    conditions: [],
  }

  const eligibleFields = allFields.filter(
    (f) =>
      f.id !== field.id &&
      [...INPUT_FIELD_TYPES, ...CHOICE_FIELD_TYPES].includes(f.type),
  )

  const addCondition = () => {
    const firstField = eligibleFields[0]
    const newCondition = {
      fieldId: firstField?.id || '',
      operator: 'equals',
      value: '',
    }
    onUpdateConditional({ conditions: [...(logic.conditions || []), newCondition] })
  }

  const updateCondition = (index, updates) => {
    const newConditions = logic.conditions.map((c, i) => (i === index ? { ...c, ...updates } : c))
    onUpdateConditional({ conditions: newConditions })
  }

  const removeCondition = (index) => {
    onUpdateConditional({ conditions: logic.conditions.filter((_, i) => i !== index) })
  }

  if (eligibleFields.length === 0) {
    return (
      <p className={styles.empty}>
        Add other input fields to the form first to use conditional logic.
      </p>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.toggle}>
        <label className={styles.switchLabel}>
          <div
            className={[styles.switch, logic.enabled ? styles.on : ''].join(' ')}
            onClick={() => onUpdateConditional({ enabled: !logic.enabled })}
            role="switch"
            aria-checked={logic.enabled}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onUpdateConditional({ enabled: !logic.enabled })}
          >
            <div className={styles.switchThumb} />
          </div>
          <span>Enable conditional logic</span>
        </label>
        <p className={styles.desc}>Show or hide this field based on other field values</p>
      </div>

      {logic.enabled && (
        <div className={styles.logic}>
          {/* Action row */}
          <div className={styles.actionRow}>
            <select
              value={logic.action}
              onChange={(e) => onUpdateConditional({ action: e.target.value })}
              style={{ width: 'auto', display: 'inline-block' }}
            >
              <option value="show">Show</option>
              <option value="hide">Hide</option>
            </select>
            <span className={styles.actionText}>this field when</span>
            <select
              value={logic.logicType}
              onChange={(e) => onUpdateConditional({ logicType: e.target.value })}
              style={{ width: 'auto', display: 'inline-block' }}
            >
              <option value="all">ALL</option>
              <option value="any">ANY</option>
            </select>
            <span className={styles.actionText}>of these conditions are met:</span>
          </div>

          {/* Conditions */}
          <div className={styles.conditions}>
            {(logic.conditions || []).map((condition, index) => (
              <div key={index} className={styles.condition}>
                <select
                  value={condition.fieldId}
                  onChange={(e) => updateCondition(index, { fieldId: e.target.value })}
                >
                  <option value="">Select field...</option>
                  {eligibleFields.map((f) => (
                    <option key={f.id} value={f.id}>{f.label}</option>
                  ))}
                </select>
                <select
                  value={condition.operator}
                  onChange={(e) => updateCondition(index, { operator: e.target.value })}
                >
                  {OPERATORS.map((op) => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>
                {!VALUE_LESS_OPERATORS.includes(condition.operator) && (
                  <input
                    type="text"
                    value={condition.value || ''}
                    placeholder="Value..."
                    onChange={(e) => updateCondition(index, { value: e.target.value })}
                  />
                )}
                <Button variant="icon" size="sm" onClick={() => removeCondition(index)} title="Remove condition">✕</Button>
              </div>
            ))}

            {(logic.conditions || []).length === 0 && (
              <p className={styles.noConditions}>No conditions yet. Add one below.</p>
            )}
          </div>

          <Button variant="secondary" size="sm" onClick={addCondition}>
            + Add Condition
          </Button>
        </div>
      )}
    </div>
  )
}

export default ConditionalLogic
