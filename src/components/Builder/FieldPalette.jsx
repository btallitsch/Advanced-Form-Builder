import React, { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { FIELD_TYPES, FIELD_CATEGORIES } from '../../utils/fieldTypes.js'
import styles from './FieldPalette.module.css'

const PaletteItem = ({ fieldType, fieldDef, onAdd }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${fieldType}`,
    data: { source: 'palette', fieldType },
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={[styles.item, isDragging ? styles.dragging : ''].join(' ')}
      onClick={() => onAdd(fieldType)}
      title={`Add ${fieldDef.label}`}
    >
      <span className={styles.icon}>{fieldDef.icon}</span>
      <span className={styles.label}>{fieldDef.label}</span>
    </div>
  )
}

export const FieldPalette = ({ onAddField }) => {
  const [search, setSearch] = useState('')

  const grouped = Object.entries(FIELD_CATEGORIES)
    .sort(([, a], [, b]) => a.order - b.order)
    .map(([catKey, catDef]) => {
      const items = Object.entries(FIELD_TYPES).filter(([, def]) => {
        if (def.category !== catKey) return false
        if (search && !def.label.toLowerCase().includes(search.toLowerCase())) return false
        return true
      })
      return { catKey, catDef, items }
    })
    .filter(({ items }) => items.length > 0)

  return (
    <aside className={styles.palette}>
      <div className={styles.header}>
        <h2 className={styles.title}>Fields</h2>
        <p className={styles.subtitle}>Drag or click to add</p>
      </div>
      <div className={styles.search}>
        <span className={styles.searchIcon}>⌕</span>
        <input
          type="text"
          placeholder="Search fields..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      <div className={styles.groups}>
        {grouped.map(({ catKey, catDef, items }) => (
          <div key={catKey} className={styles.group}>
            <p className={styles.groupLabel}>{catDef.label}</p>
            <div className={styles.grid}>
              {items.map(([type, def]) => (
                <PaletteItem key={type} fieldType={type} fieldDef={def} onAdd={onAddField} />
              ))}
            </div>
          </div>
        ))}
        {grouped.length === 0 && (
          <p className={styles.empty}>No fields match "{search}"</p>
        )}
      </div>
    </aside>
  )
}

export default FieldPalette
