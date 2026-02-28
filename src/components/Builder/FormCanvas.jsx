import React from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { FieldCard } from './FieldCard.jsx'
import { FIELD_TYPES } from '../../utils/fieldTypes.js'
import styles from './FormCanvas.module.css'
import { useState } from 'react'

const CanvasDropZone = ({ children, isEmpty }) => {
  const { isOver, setNodeRef } = useDroppable({ id: 'canvas' })
  return (
    <div
      ref={setNodeRef}
      className={[styles.dropZone, isOver ? styles.over : '', isEmpty ? styles.empty : ''].join(' ')}
    >
      {isEmpty && !isOver ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>⊕</div>
          <p className={styles.emptyTitle}>Drop fields here</p>
          <p className={styles.emptySubtitle}>
            Drag fields from the palette<br />or click them to add
          </p>
        </div>
      ) : (
        children
      )}
      {isOver && isEmpty && (
        <div className={styles.dropIndicator}>Release to add field</div>
      )}
    </div>
  )
}

export const FormCanvas = ({
  formMeta,
  fields,
  selectedFieldId,
  onSelectField,
  onRemoveField,
  onDuplicateField,
  onReorderFields,
  onAddField,
  onSetFormMeta,
}) => {
  const [activeId, setActiveId] = useState(null)
  const [editingTitle, setEditingTitle] = useState(false)
  const [editingDesc, setEditingDesc] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  const handleDragStart = ({ active }) => setActiveId(active.id)

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null)
    if (!over) return

    const isFromPalette = active.data.current?.source === 'palette'
    if (isFromPalette) {
      // Add field from palette
      const fieldType = active.data.current.fieldType
      onAddField(fieldType)
      return
    }

    // Reorder canvas fields
    if (active.id !== over.id) {
      onReorderFields(active.id, over.id)
    }
  }

  const activeField = activeId ? fields.find((f) => f.id === activeId) : null
  const activePalette = activeId?.startsWith('palette-') ? activeId.replace('palette-', '') : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <section className={styles.canvas}>
        {/* Form Meta Header */}
        <div className={styles.formHeader}>
          {editingTitle ? (
            <input
              type="text"
              value={formMeta.title}
              onChange={(e) => onSetFormMeta({ title: e.target.value })}
              onBlur={() => setEditingTitle(false)}
              autoFocus
              className={styles.titleInput}
              placeholder="Form title..."
            />
          ) : (
            <h1 className={styles.formTitle} onClick={() => setEditingTitle(true)} title="Click to edit title">
              {formMeta.title || 'Untitled Form'}
              <span className={styles.editHint}>✎</span>
            </h1>
          )}
          {editingDesc ? (
            <textarea
              value={formMeta.description}
              onChange={(e) => onSetFormMeta({ description: e.target.value })}
              onBlur={() => setEditingDesc(false)}
              autoFocus
              className={styles.descInput}
              placeholder="Form description (optional)..."
              rows={2}
            />
          ) : (
            <p
              className={styles.formDesc}
              onClick={() => setEditingDesc(true)}
              title="Click to edit description"
            >
              {formMeta.description || 'Add a description...'}
              <span className={styles.editHint}>✎</span>
            </p>
          )}
        </div>

        {/* Fields List */}
        <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          <CanvasDropZone isEmpty={fields.length === 0}>
            <div className={styles.fieldsList}>
              {fields.map((field) => (
                <FieldCard
                  key={field.id}
                  field={field}
                  isSelected={selectedFieldId === field.id}
                  onSelect={onSelectField}
                  onRemove={onRemoveField}
                  onDuplicate={onDuplicateField}
                />
              ))}
            </div>
          </CanvasDropZone>
        </SortableContext>
      </section>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeField && (
          <div className={styles.overlay}>
            <span>{FIELD_TYPES[activeField.type]?.icon}</span>
            <span>{activeField.label}</span>
          </div>
        )}
        {activePalette && (
          <div className={styles.overlay}>
            <span>{FIELD_TYPES[activePalette]?.icon}</span>
            <span>{FIELD_TYPES[activePalette]?.label}</span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

export default FormCanvas
