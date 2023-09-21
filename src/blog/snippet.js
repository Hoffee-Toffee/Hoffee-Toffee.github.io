// codeInput
// by WebCoder49
// Based on a CSS-Tricks Post
// Needs Prism.js

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

var codeInput = {
  update: function (text, code_input) {
    code_input.setAttribute('value', text)
    let result_element = code_input.getElementsByClassName(
      'code-input_highlighting-content'
    )[0]
    // Update code
    result_element.innerHTML = text
      .replace(new RegExp('&', 'g'), '&amp;')
      .replace(new RegExp('<', 'g'), '&lt;') /* Global RegExp */
    // Syntax Highlight
    Prism.highlightElement(result_element)
  },

  sync_scroll: function (element, code_input) {
    /* Scroll result to scroll coords of event - sync with textarea */
    let result_element = code_input.getElementsByClassName(
      'code-input_highlighting'
    )[0]
    // Get and set x and y
    result_element.scrollTop = element.scrollTop
    result_element.scrollLeft = element.scrollLeft
  },

  check_tab: function (element, event) {
    let code = element.value
    if (event.key == 'Tab') {
      /* Tab key pressed */
      event.preventDefault() // stop normal
      let before_tab = code.slice(0, element.selectionStart) // text before tab
      let after_tab = code.slice(element.selectionEnd, element.value.length) // text after tab
      let cursor_pos = element.selectionEnd + 2 // after tab placed, where cursor moves to - 2 for 2 spaces
      element.value = before_tab + '  ' + after_tab // add tab char - 2 spaces
      // move cursor
      element.selectionStart = cursor_pos
      element.selectionEnd = cursor_pos
    }
  },
}

class CodeInput extends HTMLElement {
  // Create code input element
  constructor() {
    super() // Element
  }
  connectedCallback() {
    // Added to document
    /* Defaults */
    let lang = this.getAttribute('lang') || 'JS'
    let placeholder =
      this.getAttribute('placeholder') || 'Enter ' + this.lang + ' Source Code'
    let value = this.getAttribute('value') || this.innerHTML || ''

    this.innerHTML = '' // Clear Content

    /* Create Textarea */
    let textarea = document.createElement('textarea')
    textarea.placeholder = placeholder
    textarea.value = value
    textarea.className = 'code-input_editing'
    textarea.setAttribute('spellcheck', 'false')

    if (this.getAttribute('name')) {
      textarea.setAttribute('name', this.getAttribute('name')) // for use in forms
      this.removeAttribute('name')
    }

    /* Create pre code */
    let code = document.createElement('code')
    code.className = 'code-input_highlighting-content language-' + lang // Language for Prism.js
    code.innerText = value

    let pre = document.createElement('pre')
    pre.className = 'code-input_highlighting'
    pre.setAttribute('aria-hidden', 'true') // Hide for screen readers
    pre.append(code)
    this.append(pre)
  }
}

try {
  customElements.define('code-input', CodeInput)
  Array.from(
    document.getElementsByClassName('code-input_highlighting-content')
  ).forEach((result_element) => {
    result_element.innerHTML = result_element.innerText
      .replace(new RegExp('<br>', 'g'), '\n')
      .replace(new RegExp('&', 'g'), '&amp;')
      .replace(new RegExp('<', 'g'), '&lt;')
    Prism.highlightElement(result_element)
  })
} catch (err) {
  console.error(err)
}
