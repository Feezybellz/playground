<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PDF Editor</title>
  <style>
    /* CSS Styles */
    #pdfViewer {
      position: relative;
    }

    #pdfViewer canvas {
      position: relative;
      z-index: 0;
    }

    #pdfViewer .text-element {
      position: absolute;
      z-index: 1;
      cursor: move;
      user-select: none;
    }

    #pdfViewer .text-element.editing {
      cursor: text;
      user-select: auto;
    }

    #pdfViewer .text-element:focus {
      outline: none;
    }

    #textOptions {
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <!-- UI Components -->
  <input type="file" id="upload" accept="application/pdf" />
  <button id="addTextBtn">Add Text</button>
  <div id="textOptions">
    <label for="fontColor">Color:</label>
    <input type="color" id="fontColor" />
    <label for="fontSize">Size:</label>
    <input type="number" id="fontSize" value="16" />
    <label for="fontFamily">Font:</label>
    <select id="fontFamily">
      <option value="Helvetica">Helvetica</option>
      <option value="Times Roman">Times Roman</option>
      <!-- Add more fonts as needed -->
    </select>
  </div>
  <div id="pdfViewer"></div>
  <button id="saveBtn">Save PDF</button>

  <!-- Include Libraries -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.min.js"></script>
  <script src="https://unpkg.com/pdf-lib/dist/pdf-lib.min.js"></script>
  <!-- Include the JavaScript code -->
  <script>

    // Access pdfjsLib correctly
const pdfjsLib = window['pdfjsLib'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js';

// Global variable to store PDF data
let existingPdfBytes;

// PDF upload and rendering
document.getElementById('upload').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file.type !== 'application/pdf') {
    alert('Please upload a PDF file.');
    return;
  }
  const fileReader = new FileReader();
  fileReader.onload = function() {
    existingPdfBytes = new Uint8Array(this.result); // Store PDF data
    pdfjsLib.getDocument(existingPdfBytes).promise.then((pdf) => {
      renderPDF(pdf);
    });
  };
  fileReader.readAsArrayBuffer(file);
});

function renderPDF(pdf) {
  const pdfViewer = document.getElementById('pdfViewer');
  pdfViewer.innerHTML = ''; // Clear previous renders
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    pdf.getPage(pageNum).then((page) => {
      const canvas = document.createElement('canvas');
      canvas.id = `page-${pageNum}`;
      pdfViewer.appendChild(canvas);
      const viewport = page.getViewport({ scale: 1.5 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const renderContext = {
        canvasContext: canvas.getContext('2d'),
        viewport: viewport
      };
      page.render(renderContext);
    });
  }
}

// Add Text Functionality
document.getElementById('addTextBtn').addEventListener('click', () => {
  const textDiv = document.createElement('div');
  textDiv.classList.add('text-element');
  textDiv.innerText = 'Enter text here';
  textDiv.style.top = '50px';
  textDiv.style.left = '50px';
  textDiv.style.fontSize = '16px';
  textDiv.style.fontFamily = 'Helvetica';
  textDiv.style.color = '#000000';
  textDiv.style.border = '1px solid #ccc';
  textDiv.style.padding = '4px';
  textDiv.style.backgroundColor = 'transparent';

  makeDraggable(textDiv);
  setupTextEditing(textDiv);
  document.getElementById('pdfViewer').appendChild(textDiv);
});

// Draggable Functionality
function makeDraggable(elmnt) {
  let isDragging = false;
  let startX, startY, origX, origY;

  elmnt.addEventListener('mousedown', dragMouseDown);

  function dragMouseDown(e) {
    if (elmnt.classList.contains('editing')) {
      // Do not initiate drag if in editing mode
      return;
    }
    e.preventDefault();
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    origX = parseInt(elmnt.style.left, 10);
    origY = parseInt(elmnt.style.top, 10);
    document.addEventListener('mousemove', elementDrag);
    document.addEventListener('mouseup', closeDragElement);
  }

  function elementDrag(e) {
    if (!isDragging) return;
    e.preventDefault();
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    elmnt.style.left = origX + dx + 'px';
    elmnt.style.top = origY + dy + 'px';
  }

  function closeDragElement() {
    if (isDragging) {
      isDragging = false;
      document.removeEventListener('mousemove', elementDrag);
      document.removeEventListener('mouseup', closeDragElement);
    }
  }
}

// Text Editing Functionality
function setupTextEditing(textDiv) {
  textDiv.addEventListener('dblclick', () => {
    textDiv.contentEditable = 'true';
    textDiv.classList.add('editing');
    textDiv.focus();
    placeCursorAtEnd(textDiv);
  });

  textDiv.addEventListener('blur', () => {
    textDiv.contentEditable = 'false';
    textDiv.classList.remove('editing');
  });
}

// Utility function to place cursor at the end of the text
function placeCursorAtEnd(el) {
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(el);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
}

// Text Customization Options
const fontColorInput = document.getElementById('fontColor');
const fontSizeInput = document.getElementById('fontSize');
const fontFamilySelect = document.getElementById('fontFamily');
let selectedTextDiv = null;

// Update selected text div when clicked
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('text-element')) {
    selectedTextDiv = e.target;
    // Set current values
    fontColorInput.value = rgbToHex(getComputedStyle(selectedTextDiv).color);
    fontSizeInput.value = parseInt(getComputedStyle(selectedTextDiv).fontSize);
    fontFamilySelect.value = getComputedStyle(selectedTextDiv).fontFamily.replace(/['"]/g, '');
  } else {
    selectedTextDiv = null;
  }
});

// Update text properties
fontColorInput.addEventListener('input', () => {
  if (selectedTextDiv) {
    selectedTextDiv.style.color = fontColorInput.value;
  }
});

fontSizeInput.addEventListener('input', () => {
  if (selectedTextDiv) {
    selectedTextDiv.style.fontSize = fontSizeInput.value + 'px';
  }
});

fontFamilySelect.addEventListener('change', () => {
  if (selectedTextDiv) {
    selectedTextDiv.style.fontFamily = fontFamilySelect.value;
  }
});

function rgbToHex(rgb) {
  if (!rgb) return '#000000';
  const result = rgb.match(/\d+/g).map((x) => {
    const hex = parseInt(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  });
  return `#${result.join('')}`;
}

// Save and Download the Edited PDF
document.getElementById('saveBtn').addEventListener('click', async () => {
  if (!existingPdfBytes) {
    alert('No PDF loaded to save.');
    return;
  }

  const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
  const pages = pdfDoc.getPages();

  const textDivs = document.querySelectorAll('#pdfViewer > .text-element');
  for (const textDiv of textDivs) {
    // Determine which page the textDiv is on
    const rect = textDiv.getBoundingClientRect();
    const canvases = document.querySelectorAll('#pdfViewer > canvas');

    let pageNumber = null;
    let canvasRect = null;
    let canvas = null;

    for (let i = 0; i < canvases.length; i++) {
      const c = canvases[i];
      const cRect = c.getBoundingClientRect();
      if (rect.top >= cRect.top && rect.top < cRect.bottom) {
        pageNumber = i;
        canvasRect = cRect;
        canvas = c;
        break;
      }
    }

    if (pageNumber === null) {
      console.warn('Text div not found on any page.');
      continue;
    }

    const page = pages[pageNumber];

    // Calculate scaling factors
    const scaleX = page.getWidth() / canvasRect.width;
    const scaleY = page.getHeight() / canvasRect.height;

    // Calculate position relative to the page
    const x = (rect.left - canvasRect.left) * scaleX;
    const y = page.getHeight() - ((rect.top - canvasRect.top) * scaleY) - (textDiv.offsetHeight * scaleY);

    // Embed the font specified in the textDiv
    const fontName = getComputedStyle(textDiv).fontFamily.replace(/['"]/g, '');
    let font;
    if (fontName.includes('Helvetica')) {
      font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
    } else if (fontName.includes('Times')) {
      font = await pdfDoc.embedFont(PDFLib.StandardFonts.TimesRoman);
    } else {
      font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica); // Default font
    }

    // Get the font size and adjust for scaling
    const fontSizePx = parseFloat(getComputedStyle(textDiv).fontSize);
    const fontSize = fontSizePx * scaleY;

    page.drawText(textDiv.innerText, {
      x: x,
      y: y,
      size: fontSize,
      font: font,
      color: hexToRgb(getComputedStyle(textDiv).color),
    });
  }

  const pdfBytes = await pdfDoc.save();
  download(pdfBytes, 'edited.pdf', 'application/pdf');
});

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return PDFLib.rgb(
    ((bigint >> 16) & 255) / 255,
    ((bigint >> 8) & 255) / 255,
    (bigint & 255) / 255
  );
}

function download(data, filename, type) {
  const blob = new Blob([data], { type: type });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

  </script>
</body>
</html>
