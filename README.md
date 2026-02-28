# ⬡ FormCraft — Advanced Form Builder

A production-grade drag-and-drop form builder built with React + Vite. Create complex forms with validation rules, conditional logic, and export to JSON schema or standalone HTML.

![FormCraft Screenshot](https://via.placeholder.com/1200x630/07070f/6366f1?text=FormCraft+Form+Builder)

## ✨ Features

### 🏗️ Builder
- **12+ Field Types**: Text, Email, Number, Phone, URL, Textarea, Password, Date, File Upload, Dropdown, Radio Group, Checkboxes, Toggle
- **Layout Elements**: Headings, Paragraphs, Dividers
- **Drag & Drop**: Drag from palette to canvas, drag to reorder fields
- **Click to Add**: Click any palette item to add instantly
- **Duplicate Fields**: One-click field duplication
- **Inline Form Meta Editing**: Click the title/description to edit in place

### ✅ Validation Rules
- Required field
- Min/Max length (text fields)
- Min/Max value (number fields)
- Regex pattern matching
- Custom error messages
- Built-in email and URL format validation

### 🔀 Conditional Logic
- Show/Hide fields based on other field values
- Operators: equals, does not equal, contains, is empty, is not empty, greater/less than
- ALL / ANY logic (AND/OR conditions)
- Multiple conditions per field

### 👁️ Live Preview
- Full interactive form preview
- Responsive device simulation (Mobile/Tablet/Desktop)
- Real-time conditional logic evaluation
- Client-side validation on submit
- JSON output display on successful submission

### ↗ Export
- **JSON Schema**: Structured schema for API consumption and persistence
- **HTML Embed**: Standalone HTML file with inline CSS + vanilla JS validation, ready to deploy

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🗂️ Project Structure

```
src/
├── main.jsx              # App entry point
├── App.jsx               # Root component + layout
├── App.module.css
│
├── store/
│   └── formReducer.js    # Central state (useReducer)
│
├── utils/
│   ├── fieldTypes.js     # Field type definitions & factory
│   ├── validation.js     # Validation rules & condition evaluator
│   └── schemaExport.js   # JSON & HTML export logic
│
├── hooks/
│   └── useFormBuilder.js # Custom hook wrapping the reducer
│
├── components/
│   ├── Layout/
│   │   ├── TopBar.jsx        # Navigation & actions
│   │   └── TopBar.module.css
│   │
│   ├── Builder/
│   │   ├── FieldPalette.jsx      # Left sidebar — field types
│   │   ├── FieldPalette.module.css
│   │   ├── FormCanvas.jsx        # Center — drag & drop canvas
│   │   ├── FormCanvas.module.css
│   │   ├── FieldCard.jsx         # Individual sortable field row
│   │   └── FieldCard.module.css
│   │
│   ├── Editor/
│   │   ├── FieldEditor.jsx        # Right sidebar — field settings
│   │   ├── FieldEditor.module.css
│   │   ├── ValidationRules.jsx    # Validation rules tab
│   │   ├── ValidationRules.module.css
│   │   ├── ConditionalLogic.jsx   # Logic tab
│   │   └── ConditionalLogic.module.css
│   │
│   ├── Preview/
│   │   ├── FormPreview.jsx        # Full form preview
│   │   ├── FormPreview.module.css
│   │   ├── PreviewField.jsx       # Individual field renderer
│   │   └── PreviewField.module.css
│   │
│   ├── Export/
│   │   ├── ExportPanel.jsx        # JSON/HTML export UI
│   │   └── ExportPanel.module.css
│   │
│   └── UI/
│       ├── Button.jsx              # Reusable button
│       ├── Button.module.css
│       ├── Modal.jsx               # Reusable modal
│       └── Modal.module.css
│
└── styles/
    └── global.css         # CSS variables, resets, base styles
```

## 🧠 Architecture

The app follows a **unidirectional data flow** pattern:

```
User Action
    ↓
useFormBuilder hook
    ↓
formReducer (pure function)
    ↓
New state
    ↓
React re-renders
```

- **State**: Single source of truth in `useReducer`
- **Logic**: Pure reducer with no side effects
- **Utilities**: Stateless helper functions (validation, export)
- **Components**: Presentational — receive props, dispatch via callbacks
- **CSS Modules**: Scoped styles per component

## 🛠️ Tech Stack

- **React 18** — UI framework
- **Vite** — Build tool
- **@dnd-kit** — Accessible drag and drop
- **CSS Modules** — Scoped component styles

## 📄 License

MIT
