<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Vanilla JS Document Editor</title>
    <!-- Include necessary libraries via CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/docx@7.8.0/build/index.min.js"></script>
    <!-- Include Mammoth.js in your HTML -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.2/mammoth.browser.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.5.207/pdf.min.js"></script>


  <!-- Optional: Include a CSS reset or your own styles -->
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Vanilla JavaScript Document Editor</h1>
  
  <!-- File Upload Section -->
  <section id="upload-section">
    <h2>Upload a Document</h2>
    <input type="file" id="fileInput" accept=".docx, .xls, .xlsx, .pdf" />
  </section>
  
  <!-- Editor Section -->
  <section id="editor-section" style="display: none;">
    <h2>Editor</h2>
    <div id="editor-container"></div>
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
      <textarea id="newDocContent" rows="10" cols="80" placeholder="Enter content here..."></textarea>
      <div>
        <button id="createSaveButton">Save Document</button>
      </div>
    </div>
  </section>
  
  <!-- Include the JavaScript file -->
  <script>
    // app.js

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const fileInput = document.getElementById('fileInput');
  const editorSection = document.getElementById('editor-section');
  const editorContainer = document.getElementById('editor-container');
  const saveButton = document.getElementById('saveButton');
  const downloadButton = document.getElementById('downloadButton');
  
  const createDocType = document.getElementById('newDocType');
  const createButton = document.getElementById('createButton');
  const createEditor = document.getElementById('create-editor');
  const newDocContent = document.getElementById('newDocContent');
  const createSaveButton = document.getElementById('createSaveButton');
  
  // State
  let currentFile = null;
  let currentFileType = '';
  let originalContent = null; // To store original content for editing
  let editedContent = null;   // To store edited content
  
  // Handle File Upload
  fileInput.addEventListener('change', handleFileUpload);
  
  // Handle Save Changes
  saveButton.addEventListener('click', saveChanges);
  
  // Handle Download
  downloadButton.addEventListener('click', downloadEditedFile);
  
  // Handle Create New Document
  createButton.addEventListener('click', handleCreateDocument);
  createSaveButton.addEventListener('click', saveNewDocument);
  
  // Function to handle file upload
  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const fileExtension = file.name.split('.').pop().toLowerCase();
    currentFileType = fileExtension;
    currentFile = file;

const reader = new FileReader();

// Process file based on its extension
if (fileExtension === 'docx') {
  reader.onload = function(e) {
    loadDocxContent(e.target.result);
  };
  reader.readAsArrayBuffer(file);
} else if (fileExtension === 'xls' || fileExtension === 'xlsx') {
  reader.onload = function(e) {
    loadExcelContent(e.target.result);
  };
  reader.readAsArrayBuffer(file);
} else if (fileExtension === 'pdf') {
  reader.onload = function(e) {
    loadPdfContent(e.target.result);
  };
  reader.readAsArrayBuffer(file);
} else {
  alert('Unsupported file format!');
}
}

function loadDocxContent(arrayBuffer) {
  mammoth.extractRawText({ arrayBuffer: arrayBuffer })
    .then(function(result) {
      const text = result.value; // Extracted text from DOCX
      editorSection.style.display = 'block';
      editorContainer.innerHTML = "<textarea id='docxEditor' rows='10' cols='80'>" + text + "</textarea>";
      originalContent = text;
    })
    .catch(function(err) {
      console.error("Error extracting DOCX content with Mammoth:", err);
      alert("Error loading DOCX file.");
    });
}


// Extract text from DOCX document (simplified version)
async function extractDocxText(doc) {
  let text = '';
  doc.paragraphs.forEach(paragraph => {
    text += paragraph.getText() + '\n';
  });
  return text;
}

// Load and render Excel content
function loadExcelContent(arrayBuffer) {
const workbook = XLSX.read(arrayBuffer, { type: 'array' });
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// Render Excel content in a textarea (simplified, for demo purposes)
editorSection.style.display = 'block';
editorContainer.innerHTML = "<textarea id='excelEditor' rows='10' cols='80'>" + JSON.stringify(data, null, 2) + "</textarea>";
originalContent = data;
}

// Load and render PDF content
async function loadPdfContent(arrayBuffer) {
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  
  try {
    const pdfDocument = await loadingTask.promise;
    const page = await pdfDocument.getPage(1); // Get the first page

    const textContent = await page.getTextContent(); // Get text content from the page
    let extractedText = "";

    // Extract the text from the textContent object
    textContent.items.forEach(function (item) {
      extractedText += item.str + " "; // Concatenate text items
    });

    // Render extracted text in a textarea
    editorSection.style.display = 'block';
    editorContainer.innerHTML = "<textarea id='pdfEditor' rows='10' cols='80'>" + extractedText + "</textarea>";
    originalContent = extractedText;

  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    alert("Failed to load PDF content.");
  }
}


// Handle Save Changes (Edit Existing File)
function saveChanges() {
if (currentFileType === 'docx') {
  const editedDocxContent = document.getElementById('docxEditor').value;
  editedContent = editedDocxContent;
  console.log("Edited DOCX content:", editedContent);
} else if (currentFileType === 'xls' || currentFileType === 'xlsx') {
  const editedExcelContent = JSON.parse(document.getElementById('excelEditor').value);
  editedContent = editedExcelContent;
  console.log("Edited Excel content:", editedContent);
} else if (currentFileType === 'pdf') {
  const editedPdfContent = document.getElementById('pdfEditor').value;
  editedContent = editedPdfContent;
  console.log("Edited PDF content:", editedContent);
}
}

// Handle Download Edited Document
function downloadEditedFile() {
if (!editedContent) {
  alert('No changes to download.');
  return;
}

if (currentFileType === 'docx') {
  const doc = new docx.Document({
    sections: [{
      children: [
        new docx.Paragraph({
          text: editedContent,
        }),
      ],
    }],
  });
  
  docx.Packer.toBlob(doc).then(blob => {
    saveAs(blob, 'edited-document.docx');
  });
} else if (currentFileType === 'xls' || currentFileType === 'xlsx') {
  const newWorkbook = XLSX.utils.book_new();
  const newWorksheet = XLSX.utils.aoa_to_sheet(editedContent);
  XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Sheet1');
  const outFile = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([outFile], { type: "application/octet-stream" });
  saveAs(blob, "edited-document.xlsx");
} else if (currentFileType === 'pdf') {
  const blob = new Blob([editedContent], { type: 'application/pdf' });
  saveAs(blob, 'edited-document.pdf');
}
}

// Handle Create New Document
function handleCreateDocument() {
const docType = createDocType.value;
if (!docType) {
  alert("Please select a document type to create.");
  return;
}

createEditor.style.display = 'block';
createDocType.disabled = true; // Disable after choosing to prevent changes
}

// Save New Document
function saveNewDocument() {
const newContent = newDocContent.value;
const docType = createDocType.value;

if (docType === 'docx') {
  const doc = new docx.Document({
    sections: [{
      children: [
        new docx.Paragraph({
          text: newContent,
        }),
      ],
    }],
  });
  docx.Packer.toBlob(doc).then(blob => {
    saveAs(blob, 'new-document.docx');
  });
} else if (docType === 'xlsx') {
  const newWorkbook = XLSX.utils.book_new();
  const newWorksheet = XLSX.utils.aoa_to_sheet([[newContent]]);
  XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Sheet1');
  const outFile = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([outFile], { type: "application/octet-stream" });
  saveAs(blob, "new-document.xlsx");
} else if (docType === 'pdf') {
  const pdfDoc = PDFLib.PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  page.drawText(newContent, {
    x: 50,
    y: 350,
    size: 30,
  });
  pdfDoc.save().then(blob => {
    const newBlob = new Blob([blob], { type: "application/pdf" });
    saveAs(newBlob, "new-document.pdf");
  });
}
}
});


  </script>
</body>
</html>
