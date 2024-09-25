<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Vanilla JS Document Editor with WYSIWYG</title>
    
    <!-- Include necessary libraries via CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/docx@7.8.0/build/index.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.2/mammoth.browser.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.5.207/pdf.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.5.0/jszip.min.js"></script>
    <script src="https://unpkg.com/pizzip@3.1.2/dist/pizzip.js"></script>
    <script src="https://unpkg.com/docxtemplater@3.25.4/build/docxtemplater.js"></script>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/handsontable@11.0.0/dist/handsontable.full.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/handsontable@11.0.0/dist/handsontable.full.min.js"></script>

    <!-- Include Quill.js for the WYSIWYG editor -->
    <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
    <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>

    <!-- Optional: Include a CSS reset or your own styles -->
    <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Vanilla JavaScript Document Editor with WYSIWYG</h1>

  <!-- File Upload Section -->
  <section id="upload-section">
    <h2>Upload a Document</h2>
    <input type="file" id="fileInput" accept=".docx, .xls, .xlsx, .pdf" />
  </section>

  <!-- Editor Section -->
  <section id="editor-section" style="display: none;">
    <h2>Editor</h2>
    <div id="editor-container">
      <!-- Quill.js editor for rich text editing -->
      <div id="editor"></div>
    </div>
    <div id="controls">
      <button id="saveButton">Save Changes</button>
      <button id="downloadButton">Download Edited Document</button>
    </div>
  </section>

  <!-- Create New Document Section -->
  <section id="create-section">
    <h2>Create New Document</h2>
    <select id="newDocType">
      <option value="">Select Document Type</option>
      <option value="docx">DOCX</option>
      <option value="xlsx">Excel</option>
      <option value="pdf">PDF</option>
    </select>
    <button id="createButton">Create</button>

    <div id="create-editor" style="display: none; margin-top: 20px;">
      <!-- Quill.js editor for creating a new document -->
      <div id="newDocEditor"></div>
      <div>
        <button id="createSaveButton">Save Document</button>
      </div>
    </div>
  </section>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const fileInput = document.getElementById('fileInput');
      const editorSection = document.getElementById('editor-section');
      const editorContainer = document.getElementById('editor-container');
      const saveButton = document.getElementById('saveButton');
      const downloadButton = document.getElementById('downloadButton');
      const createDocType = document.getElementById('newDocType');
      const createButton = document.getElementById('createButton');
      const createEditor = document.getElementById('create-editor');
      const createSaveButton = document.getElementById('createSaveButton');

      // Quill.js initialization
      const quill = new Quill('#editor', {
        theme: 'snow',
        placeholder: 'Edit document content...',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
          ]
        }
      });

      const newDocQuill = new Quill('#newDocEditor', {
        theme: 'snow',
        placeholder: 'Create new document...',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }]
          ]
        }
      });

      let currentFileType = '';
      
      // Handle File Upload
      fileInput.addEventListener('change', handleFileUpload);

      function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const fileExtension = file.name.split('.').pop().toLowerCase();
        currentFileType = fileExtension;

        const reader = new FileReader();

        if (fileExtension === 'docx') {
          reader.onload = function(e) {
            loadDocxContent(e.target.result);
          };
          reader.readAsArrayBuffer(file);
        } else if (fileExtension === 'pdf') {
          reader.onload = function(e) {
            loadPdfContent(e.target.result);
          };
          reader.readAsArrayBuffer(file);
        } else if (fileExtension === 'xls' || fileExtension === 'xlsx') {
          reader.onload = function(e) {
            loadExcelContent(e.target.result);
          };
          reader.readAsArrayBuffer(file);
        } else {
          alert('Unsupported file format!');
        }
      }

      // Load and render DOCX content
      function loadDocxContent(arrayBuffer) {
        mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
          .then(function(result) {
            const html = result.value;
            editorSection.style.display = 'block';
            quill.root.innerHTML = html;  // Load the HTML content into Quill.js editor
          })
          .catch(function(err) {
            console.error("Error extracting DOCX content with Mammoth.js:", err);
            alert("Error loading DOCX file.");
          });
      }

      // Load and render PDF content using PDF.js (on canvas)
      async function loadPdfContent(arrayBuffer) {
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        try {
          const pdfDocument = await loadingTask.promise;
          const page = await pdfDocument.getPage(1);
          const scale = 1.5;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement('canvas');
          editorContainer.innerHTML = '';  // Clear previous content
          editorContainer.appendChild(canvas);
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = { canvasContext: context, viewport };
          page.render(renderContext);  // Render the page to canvas

          editorSection.style.display = 'block';  // Display the editor section
        } catch (error) {
          console.error("Error rendering PDF:", error);
          alert("Failed to load PDF content.");
        }
      }

      // Load and render Excel content using Handsontable
      function loadExcelContent(arrayBuffer) {
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

        // Initialize Handsontable with the sheet data
        const container = document.createElement('div');
        editorContainer.innerHTML = '';  // Clear previous content
        editorContainer.appendChild(container);

        const hot = new Handsontable(container, {
          data: worksheet,
          rowHeaders: true,
          colHeaders: true,
          contextMenu: true,  // Enable right-click context menu for editing
          licenseKey: 'non-commercial-and-evaluation'
        });

        editorSection.style.display = 'block';  // Show the editor section

        saveButton.addEventListener('click', function() {
          const editedData = hot.getData();
          const newWorksheet = XLSX.utils.aoa_to_sheet(editedData);
          const newWorkbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Sheet1');

          const outFile = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
          const blob = new Blob([outFile], { type: "application/octet-stream" });
          saveAs(blob, "edited-excel-file.xlsx");
        });
      }

      // Handle Save Changes
      saveButton.addEventListener('click', function() {
        const html = quill.root.innerHTML;  // Get the WYSIWYG edited content as HTML

        if (currentFileType === 'docx') {
          saveDocx(html);  // Save the HTML content back into a DOCX file
        } else if (currentFileType === 'pdf') {
          savePdf(html);   // Save the content into a PDF
        }
      });

      // Save as DOCX
      function saveDocx(htmlContent) {
        // Create a new document
        const doc = new docx.Document();
        
        // Create a temporary container to parse the HTML
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = htmlContent;
        
        // Process each child node and map it to a docx.js structure
        tempContainer.childNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'P') {
                // Handle paragraph
                const textRuns = [];

                node.childNodes.forEach(child => {
                    if (child.nodeType === Node.ELEMENT_NODE) {
                        if (child.tagName === 'STRONG') {
                            // Handle bold text
                            textRuns.push(new docx.TextRun({
                                text: child.innerText,
                                bold: true,
                            }));
                        } else if (child.tagName === 'EM') {
                            // Handle italic text
                            textRuns.push(new docx.TextRun({
                                text: child.innerText,
                                italics: true,
                            }));
                        }
                    } else if (child.nodeType === Node.TEXT_NODE) {
                        // Handle plain text
                        textRuns.push(new docx.TextRun(child.textContent));
                    }
                });

                doc.addSection({
                    properties: {},
                    children: [new docx.Paragraph({
                        children: textRuns
                    })]
                });
            }
        });

        // Export the document
        docx.Packer.toBlob(doc).then(blob => {
            saveAs(blob, 'edited-document.docx');
        });
    }


      // Save as PDF (simple PDF with text)
      function savePdf(textContent) {
        const pdfDoc = PDFLib.PDFDocument.create();
        const page = pdfDoc.addPage([600, 400]);
        page.drawText(textContent, { x: 50, y: 350, size: 12 });

        pdfDoc.save().then(blob => {
          saveAs(blob, 'edited-document.pdf');
        });
      }
    });
  </script>
</body>
</html>
