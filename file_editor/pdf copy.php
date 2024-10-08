<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Advanced PDF Editor</title>
  <style>
    #pdf-canvas {
      border: 1px solid black;
      width: 100%;
      height: auto;
    }
    .input-box {
      position: absolute;
      border: 1px solid #333;
      padding: 5px;
      cursor: move;
      background-color: white;
      resize: both;
      overflow: auto;
      min-width: 100px;
      min-height: 30px;
      box-sizing: border-box; /* Include padding and border in element's total width and height */
    }
    .control-panel {
      margin-bottom: 10px;
    }
    .delete-btn {
      position: absolute;
      top: -10px;
      right: -10px;
      background: red;
      color: white;
      border: none;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 20px;
      font-size: 16px;
      padding: 0;
    }
    #pdf-container {
      position: relative;
    }
  </style>
</head>
<body>
  <h1>Advanced PDF Editor</h1>

  <!-- Upload PDF File -->
  <input type="file" id="pdf-upload" accept="application/pdf">
  <br><br>

  <!-- Control Panel -->
  <div class="control-panel">
    <!-- Font Selection -->
    <label for="font-select">Font:</label>
    <select id="font-select">
      <option value="TimesRoman">Times New Roman</option>
      <option value="Courier">Courier</option>
      <option value="Helvetica">Helvetica</option>
    </select>

    <!-- Font Size -->
    <label for="font-size">Font Size:</label>
    <input type="number" id="font-size" value="24" min="10" max="72">

    <!-- Text Alignment -->
    <label for="text-align">Text Alignment:</label>
    <select id="text-align">
      <option value="left">Left</option>
      <option value="center">Center</option>
      <option value="right">Right</option>
    </select>

    <!-- Button to Add Text Input -->
    <button id="add-text-btn">Add Text</button>
  </div>

  <!-- Container for PDF Rendering -->
  <div id="pdf-container">
    <canvas id="pdf-canvas"></canvas>
  </div>

  <br>
  <!-- Save and Preview Button -->
  <button id="save-pdf">Save PDF</button>

  <iframe id="pdf-preview" width="100%" height="500px"></iframe>

  <a id="download-link" style="display:none;" download="edited_pdf.pdf">Download PDF</a>

  <!-- Include Libraries -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.min.js"></script>

  <!-- JavaScript Code -->
  <script>
    let pdfDoc, canvas, ctx;
    let scale = 1.5;
    let inputBoxes = [];

    // Event listener to load PDF
    document.getElementById('pdf-upload').addEventListener('change', async (event) => {
      const file = event.target.files[0];
      if (file) {
        const fileReader = new FileReader();
        fileReader.onload = async function () {
          const typedArray = new Uint8Array(this.result);
          const loadingTask = pdfjsLib.getDocument({ data: typedArray });
          const pdf = await loadingTask.promise;
          pdfDoc = await PDFLib.PDFDocument.load(this.result);

          // Render the first page
          const page = await pdf.getPage(1);
          renderPage(page);
        };
        fileReader.readAsArrayBuffer(file);
      }
    });

    // Render the page on the canvas
    function renderPage(page) {
      canvas = document.getElementById('pdf-canvas');
      ctx = canvas.getContext('2d');

      const viewport = page.getViewport({ scale: scale });
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };

      page.render(renderContext);
    }

    // Add event listener for "Add Text" button
    document.getElementById('add-text-btn').addEventListener('click', () => {
      addInputBox();
    });

    // Function to add new text input box
    function addInputBox() {
      const inputBox = document.createElement('div');
      inputBox.contentEditable = true;
      inputBox.className = 'input-box';
      inputBox.style.left = '50px';
      inputBox.style.top = '50px';
      inputBox.style.fontSize = `${document.getElementById('font-size').value}px`;
      inputBox.style.fontFamily = getFontFamily(document.getElementById('font-select').value);
      inputBox.style.textAlign = document.getElementById('text-align').value;
      inputBox.style.minWidth = '100px';  // Sets a minimum width
      inputBox.style.minHeight = '30px';  // Sets a minimum height

      inputBox.style.boxSizing = 'border-box'; // Include padding and border in element's total width and height
      inputBox.style.padding = '5px'; // Padding inside the input box

      // Positioning context for delete button
      inputBox.style.position = 'absolute';

      // Add delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.innerHTML = '×';
      deleteBtn.className = 'delete-btn';
      deleteBtn.onclick = (e) => {
        e.stopPropagation(); // Prevent triggering drag when clicking delete
        inputBox.remove();
        inputBoxes = inputBoxes.filter(box => box !== inputBox);
      };

      inputBox.appendChild(deleteBtn);

      document.getElementById('pdf-container').appendChild(inputBox);
      inputBoxes.push(inputBox);

      makeDraggable(inputBox);
    }

    // Function to make input box draggable
    function makeDraggable(element) {
      let isDragging = false;
      let offsetX, offsetY;

      element.addEventListener('mousedown', (e) => {
        if (e.target === element || e.target.contentEditable === 'true') {
          isDragging = true;
          offsetX = e.clientX - element.offsetLeft;
          offsetY = e.clientY - element.offsetTop;
        }
      });

      document.addEventListener('mousemove', (e) => {
        if (isDragging) {
          element.style.left = `${e.clientX - offsetX}px`;
          element.style.top = `${e.clientY - offsetY}px`;
        }
      });

      document.addEventListener('mouseup', () => {
        isDragging = false;
      });
    }

    // Save the input texts to the PDF
    document.getElementById('save-pdf').addEventListener('click', async () => {
      const page = pdfDoc.getPages()[0];

      // Get the canvas dimensions
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Iterate over all input boxes to add their text to the PDF
      for (const inputBox of inputBoxes) {
        const textToAdd = inputBox.innerText.trim();

        // Skip if no text
        if (!textToAdd) continue;

        // Get the position and styles of the input box
        const canvasPositionX = inputBox.offsetLeft;
        const canvasPositionY = inputBox.offsetTop;
        const boxWidth = inputBox.offsetWidth;
        const boxHeight = inputBox.offsetHeight;

        const fontSize = parseInt(inputBox.style.fontSize);
        const fontFamily = inputBox.style.fontFamily;
        const textAlign = inputBox.style.textAlign || 'left';

        // Convert canvas coordinates to PDF coordinates
        const pdfWidth = page.getWidth();
        const pdfHeight = page.getHeight();
        const normalizedX = (canvasPositionX / canvasWidth) * pdfWidth;
        const normalizedY = pdfHeight - ((canvasPositionY + boxHeight) / canvasHeight) * pdfHeight;

        // Embed the selected font
        let selectedFont;
        switch (fontFamily) {
          case 'Courier, monospace':
            selectedFont = await pdfDoc.embedFont(PDFLib.StandardFonts.Courier);
            break;
          case 'Helvetica, Arial, sans-serif':
            selectedFont = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
            break;
          default:
            selectedFont = await pdfDoc.embedFont(PDFLib.StandardFonts.TimesRoman);
        }

        // Add text to the PDF at the converted coordinates
        page.drawText(textToAdd, {
          x: normalizedX,
          y: normalizedY,
          size: fontSize,
          font: selectedFont,
          color: PDFLib.rgb(0, 0, 0),
          maxWidth: (boxWidth / canvasWidth) * pdfWidth,
          lineHeight: fontSize + 2,
          align: textAlign
        });
      }

      const pdfBytes = await pdfDoc.save();

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      document.getElementById('pdf-preview').src = url;
      const downloadLink = document.getElementById('download-link');
      downloadLink.href = url;
      downloadLink.style.display = 'block';
    });

    // Helper function to get CSS font-family from font name
    function getFontFamily(fontName) {
      switch (fontName) {
        case 'Courier':
          return 'Courier, monospace';
        case 'Helvetica':
          return 'Helvetica, Arial, sans-serif';
        default:
          return 'Times New Roman, Times, serif';
      }
    }
  </script>
</body>
</html>
