import React from 'react'
import { useFormBuilder } from './hooks/useFormBuilder.js'
import { TopBar } from './components/Layout/TopBar.jsx'
import { FieldPalette } from './components/Builder/FieldPalette.jsx'
import { FormCanvas } from './components/Builder/FormCanvas.jsx'
import { FieldEditorPanel } from './components/Editor/FieldEditor.jsx'
import { FormPreview } from './components/Preview/FormPreview.jsx'
import { ExportPanel } from './components/Export/ExportPanel.jsx'
import styles from './App.module.css'

function App() {
  const {
    formMeta,
    fields,
    selectedFieldId,
    selectedField,
    activeTab,
    isDirty,
    setActiveTab,
    setFormMeta,
    addField,
    removeField,
    duplicateField,
    reorderFields,
    selectField,
    updateField,
    updateValidation,
    updateConditional,
    addOption,
    updateOption,
    removeOption,
    clearForm,
  } = useFormBuilder()

  return (
    <div className={styles.app}>
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        fieldCount={fields.length}
        isDirty={isDirty}
        clearForm={clearForm}
      />

      <main className={styles.main}>
        {activeTab === 'builder' && (
          <div className={styles.builderLayout}>
            <FieldPalette onAddField={addField} />
            <FormCanvas
              formMeta={formMeta}
              fields={fields}
              selectedFieldId={selectedFieldId}
              onSelectField={selectField}
              onRemoveField={removeField}
              onDuplicateField={duplicateField}
              onReorderFields={reorderFields}
              onAddField={addField}
              onSetFormMeta={setFormMeta}
            />
            <FieldEditorPanel
              field={selectedField}
              allFields={fields}
              onUpdateField={updateField}
              onUpdateValidation={updateValidation}
              onUpdateConditional={updateConditional}
              onAddOption={addOption}
              onUpdateOption={updateOption}
              onRemoveOption={removeOption}
            />
          </div>
        )}

        {activeTab === 'preview' && (
          <FormPreview formMeta={formMeta} fields={fields} />
        )}

        {activeTab === 'export' && (
          <ExportPanel formMeta={formMeta} fields={fields} />
        )}
      </main>
    </div>
  )
}

export default App
