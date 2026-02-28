export const FIELD_TYPES = {
  // Input fields
  text: {
    type: 'text',
    label: 'Text Input',
    icon: '✏️',
    category: 'inputs',
    defaultProps: {
      label: 'Text Field',
      placeholder: 'Enter text...',
      helpText: '',
      required: false,
    },
  },
  email: {
    type: 'email',
    label: 'Email',
    icon: '✉️',
    category: 'inputs',
    defaultProps: {
      label: 'Email Address',
      placeholder: 'you@example.com',
      helpText: '',
      required: false,
    },
  },
  number: {
    type: 'number',
    label: 'Number',
    icon: '#',
    category: 'inputs',
    defaultProps: {
      label: 'Number Field',
      placeholder: '0',
      helpText: '',
      required: false,
    },
  },
  phone: {
    type: 'phone',
    label: 'Phone',
    icon: '📞',
    category: 'inputs',
    defaultProps: {
      label: 'Phone Number',
      placeholder: '+1 (555) 000-0000',
      helpText: '',
      required: false,
    },
  },
  url: {
    type: 'url',
    label: 'URL',
    icon: '🔗',
    category: 'inputs',
    defaultProps: {
      label: 'Website URL',
      placeholder: 'https://',
      helpText: '',
      required: false,
    },
  },
  textarea: {
    type: 'textarea',
    label: 'Textarea',
    icon: '📝',
    category: 'inputs',
    defaultProps: {
      label: 'Long Text',
      placeholder: 'Enter your message...',
      helpText: '',
      required: false,
      rows: 4,
    },
  },
  password: {
    type: 'password',
    label: 'Password',
    icon: '🔒',
    category: 'inputs',
    defaultProps: {
      label: 'Password',
      placeholder: 'Enter password...',
      helpText: '',
      required: false,
    },
  },
  date: {
    type: 'date',
    label: 'Date',
    icon: '📅',
    category: 'inputs',
    defaultProps: {
      label: 'Date',
      helpText: '',
      required: false,
    },
  },
  file: {
    type: 'file',
    label: 'File Upload',
    icon: '📎',
    category: 'inputs',
    defaultProps: {
      label: 'File Upload',
      helpText: 'Drag & drop or click to upload',
      required: false,
      accept: '',
      multiple: false,
    },
  },
  // Choice fields
  select: {
    type: 'select',
    label: 'Dropdown',
    icon: '▾',
    category: 'choice',
    defaultProps: {
      label: 'Select Option',
      helpText: '',
      required: false,
      options: [
        { label: 'Option 1', value: 'option_1' },
        { label: 'Option 2', value: 'option_2' },
        { label: 'Option 3', value: 'option_3' },
      ],
    },
  },
  radio: {
    type: 'radio',
    label: 'Radio Group',
    icon: '⊙',
    category: 'choice',
    defaultProps: {
      label: 'Choose One',
      helpText: '',
      required: false,
      options: [
        { label: 'Option 1', value: 'option_1' },
        { label: 'Option 2', value: 'option_2' },
      ],
    },
  },
  checkbox: {
    type: 'checkbox',
    label: 'Checkboxes',
    icon: '☑',
    category: 'choice',
    defaultProps: {
      label: 'Select All That Apply',
      helpText: '',
      required: false,
      options: [
        { label: 'Option 1', value: 'option_1' },
        { label: 'Option 2', value: 'option_2' },
      ],
    },
  },
  toggle: {
    type: 'toggle',
    label: 'Toggle',
    icon: '⬡',
    category: 'choice',
    defaultProps: {
      label: 'Enable Feature',
      helpText: '',
      required: false,
      defaultValue: false,
    },
  },
  // Layout fields
  heading: {
    type: 'heading',
    label: 'Heading',
    icon: 'H',
    category: 'layout',
    defaultProps: {
      content: 'Section Heading',
      level: 2,
    },
  },
  paragraph: {
    type: 'paragraph',
    label: 'Paragraph',
    icon: 'P',
    category: 'layout',
    defaultProps: {
      content: 'Add some descriptive text here to help users understand this section.',
    },
  },
  divider: {
    type: 'divider',
    label: 'Divider',
    icon: '—',
    category: 'layout',
    defaultProps: {},
  },
}

export const FIELD_CATEGORIES = {
  inputs: { label: 'Input Fields', order: 1 },
  choice: { label: 'Choice Fields', order: 2 },
  layout: { label: 'Layout', order: 3 },
}

export const INPUT_FIELD_TYPES = ['text', 'email', 'number', 'phone', 'url', 'textarea', 'password', 'date', 'file']
export const CHOICE_FIELD_TYPES = ['select', 'radio', 'checkbox', 'toggle']
export const LAYOUT_FIELD_TYPES = ['heading', 'paragraph', 'divider']
export const HAS_OPTIONS = ['select', 'radio', 'checkbox']
export const HAS_VALIDATION = [...INPUT_FIELD_TYPES, ...CHOICE_FIELD_TYPES]

export const createField = (type) => {
  const fieldDef = FIELD_TYPES[type]
  if (!fieldDef) return null
  return {
    id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    ...JSON.parse(JSON.stringify(fieldDef.defaultProps)),
    validation: {},
    conditionalLogic: {
      enabled: false,
      action: 'show',
      logicType: 'all',
      conditions: [],
    },
  }
}
