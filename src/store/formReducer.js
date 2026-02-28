import { arrayMove } from '@dnd-kit/sortable'
import { createField } from '../utils/fieldTypes.js'

export const initialState = {
  formMeta: {
    title: 'My Awesome Form',
    description: 'Fill out the form below to get started.',
  },
  fields: [],
  selectedFieldId: null,
  activeTab: 'builder',
  isDirty: false,
}

export const ACTIONS = {
  SET_TAB: 'SET_TAB',
  SET_FORM_META: 'SET_FORM_META',
  ADD_FIELD: 'ADD_FIELD',
  ADD_FIELD_AT: 'ADD_FIELD_AT',
  REMOVE_FIELD: 'REMOVE_FIELD',
  DUPLICATE_FIELD: 'DUPLICATE_FIELD',
  REORDER_FIELDS: 'REORDER_FIELDS',
  SELECT_FIELD: 'SELECT_FIELD',
  UPDATE_FIELD: 'UPDATE_FIELD',
  UPDATE_VALIDATION: 'UPDATE_VALIDATION',
  UPDATE_CONDITIONAL: 'UPDATE_CONDITIONAL',
  ADD_OPTION: 'ADD_OPTION',
  UPDATE_OPTION: 'UPDATE_OPTION',
  REMOVE_OPTION: 'REMOVE_OPTION',
  CLEAR_FORM: 'CLEAR_FORM',
  LOAD_SCHEMA: 'LOAD_SCHEMA',
}

export const formReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_TAB:
      return { ...state, activeTab: action.payload }

    case ACTIONS.SET_FORM_META:
      return { ...state, formMeta: { ...state.formMeta, ...action.payload }, isDirty: true }

    case ACTIONS.ADD_FIELD: {
      const newField = createField(action.payload)
      if (!newField) return state
      return { ...state, fields: [...state.fields, newField], selectedFieldId: newField.id, isDirty: true }
    }

    case ACTIONS.ADD_FIELD_AT: {
      const { fieldType, index } = action.payload
      const newField = createField(fieldType)
      if (!newField) return state
      const newFields = [...state.fields]
      newFields.splice(index, 0, newField)
      return { ...state, fields: newFields, selectedFieldId: newField.id, isDirty: true }
    }

    case ACTIONS.REMOVE_FIELD: {
      const newFields = state.fields.filter((f) => f.id !== action.payload)
      const wasSelected = state.selectedFieldId === action.payload
      const removedIdx = state.fields.findIndex((f) => f.id === action.payload)
      const newSelectedId = wasSelected
        ? newFields[Math.max(0, removedIdx - 1)]?.id ?? null
        : state.selectedFieldId
      return { ...state, fields: newFields, selectedFieldId: newSelectedId, isDirty: true }
    }

    case ACTIONS.DUPLICATE_FIELD: {
      const idx = state.fields.findIndex((f) => f.id === action.payload)
      if (idx === -1) return state
      const original = state.fields[idx]
      const duplicate = {
        ...JSON.parse(JSON.stringify(original)),
        id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        label: `${original.label} (Copy)`,
      }
      const newFields = [...state.fields]
      newFields.splice(idx + 1, 0, duplicate)
      return { ...state, fields: newFields, selectedFieldId: duplicate.id, isDirty: true }
    }

    case ACTIONS.REORDER_FIELDS: {
      const { activeId, overId } = action.payload
      const oldIndex = state.fields.findIndex((f) => f.id === activeId)
      const newIndex = state.fields.findIndex((f) => f.id === overId)
      if (oldIndex === -1 || newIndex === -1) return state
      return { ...state, fields: arrayMove(state.fields, oldIndex, newIndex), isDirty: true }
    }

    case ACTIONS.SELECT_FIELD:
      return { ...state, selectedFieldId: action.payload }

    case ACTIONS.UPDATE_FIELD: {
      const { fieldId, updates } = action.payload
      return {
        ...state,
        fields: state.fields.map((f) => (f.id === fieldId ? { ...f, ...updates } : f)),
        isDirty: true,
      }
    }

    case ACTIONS.UPDATE_VALIDATION: {
      const { fieldId, validation } = action.payload
      return {
        ...state,
        fields: state.fields.map((f) =>
          f.id === fieldId ? { ...f, validation: { ...f.validation, ...validation } } : f,
        ),
        isDirty: true,
      }
    }

    case ACTIONS.UPDATE_CONDITIONAL: {
      const { fieldId, conditionalLogic } = action.payload
      return {
        ...state,
        fields: state.fields.map((f) =>
          f.id === fieldId
            ? { ...f, conditionalLogic: { ...f.conditionalLogic, ...conditionalLogic } }
            : f,
        ),
        isDirty: true,
      }
    }

    case ACTIONS.ADD_OPTION: {
      const { fieldId } = action.payload
      return {
        ...state,
        fields: state.fields.map((f) => {
          if (f.id !== fieldId) return f
          const newOption = { label: `Option ${(f.options?.length || 0) + 1}`, value: `option_${Date.now()}` }
          return { ...f, options: [...(f.options || []), newOption] }
        }),
        isDirty: true,
      }
    }

    case ACTIONS.UPDATE_OPTION: {
      const { fieldId, index, updates } = action.payload
      return {
        ...state,
        fields: state.fields.map((f) => {
          if (f.id !== fieldId) return f
          return { ...f, options: f.options.map((opt, i) => (i === index ? { ...opt, ...updates } : opt)) }
        }),
        isDirty: true,
      }
    }

    case ACTIONS.REMOVE_OPTION: {
      const { fieldId, index } = action.payload
      return {
        ...state,
        fields: state.fields.map((f) => {
          if (f.id !== fieldId) return f
          return { ...f, options: f.options.filter((_, i) => i !== index) }
        }),
        isDirty: true,
      }
    }

    case ACTIONS.CLEAR_FORM:
      return { ...initialState, activeTab: state.activeTab }

    case ACTIONS.LOAD_SCHEMA: {
      const { schema } = action.payload
      return { ...state, formMeta: schema.meta || state.formMeta, fields: schema.fields || [], selectedFieldId: null, isDirty: false }
    }

    default:
      return state
  }
}
