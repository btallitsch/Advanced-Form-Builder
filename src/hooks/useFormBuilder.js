import { useReducer, useCallback, useMemo } from 'react'
import { formReducer, initialState, ACTIONS } from '../store/formReducer.js'

/**
 * Central hook that provides all form builder state and actions
 */
export const useFormBuilder = () => {
  const [state, dispatch] = useReducer(formReducer, initialState)

  const { formMeta, fields, selectedFieldId, activeTab, isDirty } = state

  const selectedField = useMemo(
    () => fields.find((f) => f.id === selectedFieldId) ?? null,
    [fields, selectedFieldId],
  )

  // Navigation
  const setActiveTab = useCallback((tab) => dispatch({ type: ACTIONS.SET_TAB, payload: tab }), [])

  // Form meta
  const setFormMeta = useCallback((updates) => dispatch({ type: ACTIONS.SET_FORM_META, payload: updates }), [])

  // Field management
  const addField = useCallback((fieldType) => dispatch({ type: ACTIONS.ADD_FIELD, payload: fieldType }), [])

  const addFieldAt = useCallback(
    (fieldType, index) => dispatch({ type: ACTIONS.ADD_FIELD_AT, payload: { fieldType, index } }),
    [],
  )

  const removeField = useCallback((fieldId) => dispatch({ type: ACTIONS.REMOVE_FIELD, payload: fieldId }), [])

  const duplicateField = useCallback(
    (fieldId) => dispatch({ type: ACTIONS.DUPLICATE_FIELD, payload: fieldId }),
    [],
  )

  const reorderFields = useCallback(
    (activeId, overId) => dispatch({ type: ACTIONS.REORDER_FIELDS, payload: { activeId, overId } }),
    [],
  )

  const selectField = useCallback(
    (fieldId) => dispatch({ type: ACTIONS.SELECT_FIELD, payload: fieldId }),
    [],
  )

  const updateField = useCallback(
    (fieldId, updates) => dispatch({ type: ACTIONS.UPDATE_FIELD, payload: { fieldId, updates } }),
    [],
  )

  const updateValidation = useCallback(
    (fieldId, validation) => dispatch({ type: ACTIONS.UPDATE_VALIDATION, payload: { fieldId, validation } }),
    [],
  )

  const updateConditional = useCallback(
    (fieldId, conditionalLogic) =>
      dispatch({ type: ACTIONS.UPDATE_CONDITIONAL, payload: { fieldId, conditionalLogic } }),
    [],
  )

  // Options management
  const addOption = useCallback((fieldId) => dispatch({ type: ACTIONS.ADD_OPTION, payload: { fieldId } }), [])

  const updateOption = useCallback(
    (fieldId, index, updates) =>
      dispatch({ type: ACTIONS.UPDATE_OPTION, payload: { fieldId, index, updates } }),
    [],
  )

  const removeOption = useCallback(
    (fieldId, index) => dispatch({ type: ACTIONS.REMOVE_OPTION, payload: { fieldId, index } }),
    [],
  )

  // Utility
  const clearForm = useCallback(() => dispatch({ type: ACTIONS.CLEAR_FORM }), [])

  const loadSchema = useCallback(
    (schema) => dispatch({ type: ACTIONS.LOAD_SCHEMA, payload: { schema } }),
    [],
  )

  return {
    // State
    formMeta,
    fields,
    selectedFieldId,
    selectedField,
    activeTab,
    isDirty,
    // Actions
    setActiveTab,
    setFormMeta,
    addField,
    addFieldAt,
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
    loadSchema,
  }
}
