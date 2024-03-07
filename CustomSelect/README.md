# CustomSelect

CustomSelect is a JavaScript library for creating custom-styled dropdowns with enhanced functionality. It allows you to easily replace the default HTML `<select>` element with a customizable dropdown.

## Features

- Custom-styled dropdowns with configurable styles.
- Search functionality for quickly finding options.
- Easy integration with existing HTML `<select>` elements.
- Event triggering for customization and extensibility.

## Installation

Include the CustomSelect script in your HTML file:

```html
<script src="path/to/custom-select.js"></script>

##Usage

// Import or include the library
<script src="path/to/custom-select.js"></script>


// Initialize on all select elements
CustomSelect.init();

// Or initialize on specific elements
const specificElement = document.getElementById('my-select');
CustomSelect.init(specificElement);


// Or initialize on specific elements by string "id | class | tagname | attribute"
Below example is using a class ".class1"
CustomSelect.init(".class1");


#API
CustomSelect.init()
Initializes CustomSelect on the specified HTML elements.

elements: (Optional) Accepts either an HTMLElement, NodeList, or a CSS selector string. If not provided, it will initialize on all .custom-select elements.

CustomSelect.triggerChange(element)
Triggers the change event on the specified HTML element.

element: The HTML element on which the change event will be triggered.
