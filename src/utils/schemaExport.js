/**
 * Schema export utilities — JSON schema & HTML embed code
 */

/**
 * Exports the form as a clean JSON schema
 */
export const exportAsJSON = (formMeta, fields) => {
  const schema = {
    $schema: 'https://formcraft.io/schema/v1',
    version: '1.0',
    meta: {
      title: formMeta.title || 'Untitled Form',
      description: formMeta.description || '',
      createdAt: new Date().toISOString(),
    },
    fields: fields.map((field) => {
      const { id, type, label, placeholder, helpText, required, validation, conditionalLogic, options, content, level, rows } = field
      const cleanField = { id, type, label }
      if (placeholder) cleanField.placeholder = placeholder
      if (helpText) cleanField.helpText = helpText
      if (required) cleanField.required = true
      if (rows) cleanField.rows = rows
      if (content) cleanField.content = content
      if (level) cleanField.level = level
      if (options && options.length) cleanField.options = options
      if (validation && Object.keys(validation).length) cleanField.validation = validation
      if (conditionalLogic?.enabled) cleanField.conditionalLogic = conditionalLogic
      return cleanField
    }),
  }
  return JSON.stringify(schema, null, 2)
}

/**
 * Exports as a standalone HTML form with inline CSS and vanilla JS validation
 */
export const exportAsHTML = (formMeta, fields) => {
  const title = formMeta.title || 'Untitled Form'
  const description = formMeta.description || ''

  const renderField = (field) => {
    if (field.type === 'heading') {
      const tag = `h${field.level || 2}`
      return `    <${tag} class="form-heading">${field.content || ''}</${tag}>`
    }
    if (field.type === 'paragraph') {
      return `    <p class="form-paragraph">${field.content || ''}</p>`
    }
    if (field.type === 'divider') {
      return `    <hr class="form-divider" />`
    }

    const required = field.required ? ' required' : ''
    const fieldId = `field_${field.id}`
    const helpId = field.helpText ? `${fieldId}_help` : ''
    const aria = helpId ? ` aria-describedby="${helpId}"` : ''

    let inputHtml = ''

    switch (field.type) {
      case 'textarea':
        inputHtml = `      <textarea id="${fieldId}" name="${field.id}" placeholder="${field.placeholder || ''}"${required}${aria} rows="${field.rows || 4}"></textarea>`
        break
      case 'select':
        const opts = (field.options || []).map((o) => `        <option value="${o.value}">${o.label}</option>`).join('\n')
        inputHtml = `      <select id="${fieldId}" name="${field.id}"${required}${aria}>\n        <option value="">Select an option</option>\n${opts}\n      </select>`
        break
      case 'radio':
        inputHtml = (field.options || [])
          .map(
            (o, i) =>
              `      <label class="option-label">\n        <input type="radio" name="${field.id}" value="${o.value}"${i === 0 && field.required ? ' required' : ''} />\n        <span>${o.label}</span>\n      </label>`,
          )
          .join('\n')
        break
      case 'checkbox':
        inputHtml = (field.options || [])
          .map(
            (o) =>
              `      <label class="option-label">\n        <input type="checkbox" name="${field.id}" value="${o.value}" />\n        <span>${o.label}</span>\n      </label>`,
          )
          .join('\n')
        break
      case 'file':
        inputHtml = `      <input type="file" id="${fieldId}" name="${field.id}"${field.multiple ? ' multiple' : ''}${field.accept ? ` accept="${field.accept}"` : ''}${required}${aria} />`
        break
      default:
        inputHtml = `      <input type="${field.type === 'phone' ? 'tel' : field.type}" id="${fieldId}" name="${field.id}" placeholder="${field.placeholder || ''}"${required}${aria} />`
    }

    return `    <div class="field-group" id="group_${field.id}">
      <label for="${fieldId}">${field.label}${field.required ? ' <span class="required">*</span>' : ''}</label>
${inputHtml}${field.helpText ? `\n      <span class="help-text" id="${helpId}">${field.helpText}</span>` : ''}
      <span class="error-msg" role="alert"></span>
    </div>`
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; background: #f5f5f5; min-height: 100vh; display: flex; align-items: flex-start; justify-content: center; padding: 40px 20px; }
    .form-container { background: white; border-radius: 12px; padding: 40px; width: 100%; max-width: 640px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .form-title { font-size: 24px; font-weight: 700; margin-bottom: 8px; color: #111; }
    .form-description { color: #666; margin-bottom: 32px; line-height: 1.6; }
    .field-group { margin-bottom: 20px; }
    label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: #333; }
    .required { color: #ef4444; }
    input, textarea, select { width: 100%; padding: 10px 14px; border: 1.5px solid #e0e0e0; border-radius: 8px; font-size: 14px; outline: none; transition: border-color 150ms; }
    input:focus, textarea:focus, select:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
    input[type="file"] { padding: 8px; cursor: pointer; }
    .option-label { display: flex; align-items: center; gap: 8px; cursor: pointer; margin-bottom: 8px; font-size: 14px; font-weight: 400; color: #333; }
    .option-label input { width: auto; margin: 0; }
    .help-text { display: block; font-size: 12px; color: #888; margin-top: 4px; }
    .error-msg { display: block; font-size: 12px; color: #ef4444; margin-top: 4px; min-height: 16px; }
    input.error, textarea.error, select.error { border-color: #ef4444; }
    .form-heading { font-size: 20px; font-weight: 700; margin: 24px 0 8px; color: #111; }
    .form-paragraph { color: #555; line-height: 1.7; margin-bottom: 16px; }
    .form-divider { border: none; border-top: 1.5px solid #eee; margin: 24px 0; }
    .submit-btn { background: #6366f1; color: white; border: none; border-radius: 8px; padding: 12px 28px; font-size: 15px; font-weight: 600; cursor: pointer; margin-top: 8px; transition: background 150ms; }
    .submit-btn:hover { background: #4f46e5; }
    .success-msg { display: none; background: #f0fdf4; border: 1.5px solid #86efac; color: #166534; border-radius: 8px; padding: 16px; margin-top: 16px; font-weight: 500; }
  </style>
</head>
<body>
  <div class="form-container">
    ${title ? `<h1 class="form-title">${title}</h1>` : ''}
    ${description ? `<p class="form-description">${description}</p>` : ''}
    <form id="generatedForm" novalidate>
${fields.map(renderField).join('\n')}
      <button type="submit" class="submit-btn">Submit Form</button>
      <div class="success-msg" id="successMsg">✓ Form submitted successfully!</div>
    </form>
  </div>
  <script>
    document.getElementById('generatedForm').addEventListener('submit', function(e) {
      e.preventDefault();
      let valid = true;
      this.querySelectorAll('[required]').forEach(function(el) {
        const group = el.closest('.field-group');
        const errMsg = group ? group.querySelector('.error-msg') : null;
        if (!el.value.trim()) {
          valid = false;
          el.classList.add('error');
          if (errMsg) errMsg.textContent = 'This field is required';
        } else {
          el.classList.remove('error');
          if (errMsg) errMsg.textContent = '';
        }
      });
      if (valid) {
        const data = Object.fromEntries(new FormData(this));
        console.log('Form data:', data);
        document.getElementById('successMsg').style.display = 'block';
      }
    });
  </script>
</body>
</html>`
}

/**
 * Copies text to clipboard
 */
export const copyToClipboard = async (text) => {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text)
    return true
  }
  return false
}
