<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Document Editor</title>

    <!-- Include necessary libraries via CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/docx@7.8.0/build/index.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.2/mammoth.browser.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.5.207/pdf.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/handsontable@11.0.0/dist/handsontable.full.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/docx@7.8.0/build/index.min.js"></script>


    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/handsontable@11.0.0/dist/handsontable.full.min.css" />
    <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
    <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
</head>
<body>
  <h1>Document Editor</h1>

  <input type="file" id="fileInput" accept=".docx, .xls, .xlsx, .pdf" />
  <div id="editor-container"></div>
  <button id="saveButton">Save</button>

  <script>
    document.getElementById('fileInput').addEventListener('change', handleFileUpload);

    let currentFileType = '';  // To store the file type we're editing

    function handleFileUpload(event) {
      const file = event.target.files[0];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      currentFileType = fileExtension;
      const reader = new FileReader();

      if (fileExtension === 'docx') {
        reader.onload = function(e) {
          loadDocxContent(e.target.result);  // Load and edit DOCX
        };
        reader.readAsArrayBuffer(file);
      } else if (fileExtension === 'pdf') {
        reader.onload = function(e) {
          loadPdfContent(e.target.result);  // Load and edit PDF
        };
        reader.readAsArrayBuffer(file);
      } else if (fileExtension === 'xls' || fileExtension === 'xlsx') {
        reader.onload = function(e) {
          loadExcelContent(e.target.result);  // Load and edit Excel
        };
        reader.readAsArrayBuffer(file);
      } else {
        alert('Unsupported file format!');
      }
    }

    // Load and render DOCX content (using Mammoth.js)
    function loadDocxContent(arrayBuffer) {
      mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
        .then(function(result) {
          document.getElementById('editor-container').innerHTML = `
            <div id="docx-editor">
              <div id="editor">${result.value}</div>
            </div>
          `;
          const quill = new Quill('#editor', { theme: 'snow' });
        }).catch(console.error);
    }

    // Save the edited DOCX file using docx.js
    function saveDocx() {
    // Get the content from Quill.js
    const htmlContent = document.querySelector('.ql-editor').innerHTML;

    // Create a new docx document
    const doc = new docx.Document();
    console.log(doc); 

    // Create a temporary container to parse the HTML
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = htmlContent;
    console.log(tempContainer);
    

    let hasValidContent = false;

    // Iterate over each paragraph (<p>) in the HTML and convert it to docx.js structure
    tempContainer.querySelectorAll('p').forEach(p => {
        const textRuns = [];

        p.childNodes.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
            // Handle plain text nodes
            textRuns.push(new docx.TextRun(child.textContent.trim()));
        } else if (child.nodeType === Node.ELEMENT_NODE) {
            // Handle bold (<strong>) and italic (<em>) text formatting
            if (child.tagName === 'STRONG') {
            textRuns.push(new docx.TextRun({
                text: child.textContent.trim(),
                bold: true,
            }));
            } else if (child.tagName === 'EM') {
            textRuns.push(new docx.TextRun({
                text: child.textContent.trim(),
                italics: true,
            }));
            } else if (child.tagName === 'U') {
            textRuns.push(new docx.TextRun({
                text: child.textContent.trim(),
                underline: {},
            }));
            }
            // Add more elements as needed (e.g., links, headings)
        }
        });

        // Add the paragraph to the document only if it has valid text runs
        if (textRuns.length > 0) {
        hasValidContent = true;
        doc.addSection({
            children: [new docx.Paragraph({ children: textRuns })],
        });
        }
    });

    // Make sure we have valid content to save
    if (!hasValidContent) {
        alert("No valid content to save!");
        return;
    }

    // Generate the DOCX file
    docx.Packer.toBlob(doc).then(blob => {
        saveAs(blob, 'edited-document.docx');
    }).catch(error => {
        console.error("Error generating DOCX file:", error);
    });
    }

    // Load and render PDF content (using PDF.js)
    async function loadPdfContent(arrayBuffer) {
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        try {
            const pdfDocument = await loadingTask.promise;
            const page = await pdfDocument.getPage(1);
            const scale = 1.5;
            const viewport = page.getViewport({ scale });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const renderContext = { canvasContext: context, viewport };
            await page.render(renderContext);  // Render the page into the canvas

            // Insert the canvas into the container and overlay Quill.js for editing
            document.getElementById('editor-container').innerHTML = '';
            document.getElementById('editor-container').appendChild(canvas);

            // Create an overlay for Quill.js editor (editable content)
            const editorOverlay = document.createElement('div');
            editorOverlay.style.position = 'absolute';
            editorOverlay.style.top = canvas.offsetTop + 'px';
            editorOverlay.style.left = canvas.offsetLeft + 'px';
            editorOverlay.style.width = canvas.width + 'px';
            editorOverlay.style.height = canvas.height + 'px';
            editorOverlay.style.pointerEvents = 'none';  // Make it non-interactive for the canvas

            const editor = document.createElement('div');
            editor.id = 'quill-editor';
            editor.style.height = '100%';
            editorOverlay.appendChild(editor);
            document.getElementById('editor-container').appendChild(editorOverlay);

            // Initialize Quill.js for overlay text editing
            const quill = new Quill('#quill-editor', {
            theme: 'snow',
            placeholder: 'Edit the PDF text here...',
            modules: {
                toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                ]
            }
            });

        } catch (error) {
            console.error("Error rendering PDF:", error);
            alert("Failed to load PDF content.");
        }
        }


        // Save the edited PDF file using PDF-lib
        function savePdf() {
    const editedText = document.querySelector('#quill-editor .ql-editor').innerHTML;

    // Create a new PDF with PDF-lib
    PDFLib.PDFDocument.create().then(pdfDoc => {
        const page = pdfDoc.addPage([600, 400]);

        // Add the edited text to the PDF
        page.drawText(editedText, {
        x: 50,
        y: 350,
        size: 12,
        color: PDFLib.rgb(0, 0, 0),
        });

        pdfDoc.save().then(blob => saveAs(blob, 'edited-document.pdf'));
    });
    }


    // Load and render Excel content (using Handsontable and SheetJS)
    function loadExcelContent(arrayBuffer) {
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
      const container = document.createElement('div');
      document.getElementById('editor-container').innerHTML = '';
      document.getElementById('editor-container').appendChild(container);
      const hot = new Handsontable(container, {
        data: worksheet,
        rowHeaders: true,
        colHeaders: true,
        contextMenu: true,
        licenseKey: 'non-commercial-and-evaluation'
      });

      // Save the edited Excel sheet
      document.getElementById('saveButton').addEventListener('click', function() {
        const editedData = hot.getData();
        const newWorksheet = XLSX.utils.aoa_to_sheet(editedData);
        const newWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Sheet1');
        const outFile = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([outFile], { type: "application/octet-stream" });
        saveAs(blob, 'edited-excel.xlsx');
      });
    }

    // Save button to trigger saving based on file type
    document.getElementById('saveButton').addEventListener('click', function() {
      if (currentFileType === 'docx') {
        const htmlContent = document.querySelector('#editor').innerHTML;
        saveDocx(htmlContent);
      } else if (currentFileType === 'pdf') {
        savePdf();
      }
    });
  </script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>

</body>
</html>
