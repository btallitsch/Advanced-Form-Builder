import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FIELD_TYPES } from '../../utils/fieldTypes.js'
import styles from './FieldCard.module.css'
import { Button } from '../UI/Button.jsx'

export const FieldCard = ({ field, isSelected, onSelect, onRemove, onDuplicate }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  }

  const fieldDef = FIELD_TYPES[field.type]
  const isLayout = ['heading', 'paragraph', 'divider'].includes(field.type)

  const getPreviewText = () => {
    if (field.type === 'heading') return field.content || 'Heading'
    if (field.type === 'paragraph') return field.content?.substring(0, 60) + (field.content?.length > 60 ? '...' : '') || 'Paragraph'
    if (field.type === 'divider') return '— Divider'
    return field.label || fieldDef?.label || field.type
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[styles.card, isSelected ? styles.selected : '', isDragging ? styles.dragging : ''].join(' ')}
      onClick={() => onSelect(field.id)}
    >
      <button className={styles.dragHandle} {...listeners} {...attributes} title="Drag to reorder" onClick={(e) => e.stopPropagation()}>
        <span>⠿</span>
      </button>

      <div className={styles.info}>
        <span className={styles.typeIcon}>{fieldDef?.icon || '?'}</span>
        <div className={styles.text}>
          <span className={styles.label}>{getPreviewText()}</span>
          <span className={styles.type}>{fieldDef?.label || field.type}</span>
        </div>
        <div className={styles.badges}>
          {field.required && <span className={styles.badge} style={{color:'var(--danger)'}}>req</span>}
          {field.conditionalLogic?.enabled && <span className={styles.badge} style={{color:'var(--warning)'}}>if</span>}
          {!isLayout && Object.keys(field.validation || {}).filter(k => field.validation[k]).length > 0 && (
            <span className={styles.badge} style={{color:'var(--success)'}}>✓</span>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <Button variant="icon" size="sm" onClick={(e) => { e.stopPropagation(); onDuplicate(field.id) }} title="Duplicate">⧉</Button>
        <Button variant="icon" size="sm" onClick={(e) => { e.stopPropagation(); onRemove(field.id) }} title="Remove" style={{color:'var(--danger)'}}>✕</Button>
      </div>
    </div>
  )
}

export default FieldCard
