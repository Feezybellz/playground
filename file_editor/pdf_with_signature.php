<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Advanced PDF Editor with Text and Signature Tools</title>
    <style>
        /* Basic Styles */
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }

        h1 {
            text-align: center;
        }

        /* Control Buttons */
        #controls {
            text-align: center;
            margin-bottom: 10px;
        }

        .control-button {
            margin: 0 5px;
            padding: 8px 12px;
            font-size: 14px;
            cursor: pointer;
            border: none;
            border-radius: 4px;
            background-color: #007BFF;
            color: #fff;
            transition: background-color 0.3s;
        }

        .control-button:hover {
            background-color: #0056b3;
        }

        .control-button.active {
            background-color: #0056b3;
        }

        /* PDF Viewer Styles */
        #pdfViewer {
            position: relative;
            width: 100%;
            height: auto;
            margin-top: 20px;
        }

        .page {
            margin-bottom: 20px;
            position: relative;
            border: 1px solid #ccc;
            box-shadow: 2px 2px 12px rgba(0,0,0,0.1);
            background-color: #fff;
        }

        canvas {
            display: block;
        }

        /* Text Box Styles */
        .text-box {
            position: absolute;
            border: 1px dashed #000;
            background-color: rgba(255, 255, 255, 0.8);
            padding: 5px;
            min-width: 100px;
            cursor: move;
            z-index: 10;
            resize: both;
            overflow: auto;
            box-sizing: border-box;
        }

        .text-box textarea {
            width: 100%;
            height: 100%;
            border: none;
            background: transparent;
            resize: none;
            font-family: inherit;
            font-size: inherit;
            font-weight: inherit;
            font-style: inherit;
            text-decoration: inherit;
        }

        /* Signature Box Styles */
        .signature-box {
            position: absolute;
            border: 1px dashed #000;
            padding: 5px;
            cursor: move;
            z-index: 10;
            background-color: transparent;
            resize: both;
            overflow: hidden;
            box-sizing: border-box;
        }

        .signature-box img,
        .signature-box canvas,
        .signature-box .text-signature {
            max-width: 200px;
            max-height: 100px;
            display: block;
            width: 100%;
            height: 100%;
        }

        .text-signature {
            border: none;
            background: transparent;
            font-size: 16px;
            font-weight: bold;
            cursor: text;
        }

        /* Toolbar Styles */
        #toolbar {
            display: none;
            position: absolute;
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            padding: 5px;
            z-index: 1000;
            border-radius: 4px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }

        .toolbar-btn {
            margin-right: 5px;
            padding: 4px 8px;
            border: none;
            background-color: #fff;
            cursor: pointer;
            border-radius: 3px;
            font-size: 14px;
            transition: background-color 0.3s;
        }

        .toolbar-btn:hover,
        .toolbar-btn.active {
            background-color: #ddd;
        }

        /* Signature Modal Styles */
        .modal {
            display: none; /* Hidden by default */
            position: fixed; /* Stay in place */
            z-index: 2000; /* Sit on top */
            left: 0;
            top: 0;
            width: 100%; /* Full width */
            height: 100%; /* Full height */
            overflow: auto; /* Enable scroll if needed */
            background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
        }

        .modal-content {
            background-color: #fefefe;
            margin: 5% auto; /* 5% from the top and centered */
            padding: 20px;
            border: 1px solid #888;
            width: 50%; /* Could be more or less, depending on screen size */
            border-radius: 8px;
            position: relative;
        }

        .close-button {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }

        .close-button:hover,
        .close-button:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
        }

        .modal-button {
            display: block;
            width: 100%;
            margin: 10px 0;
            padding: 10px;
            font-size: 16px;
            cursor: pointer;
            border: none;
            border-radius: 4px;
            background-color: #28a745;
            color: #fff;
            transition: background-color 0.3s;
        }

        .modal-button:hover {
            background-color: #218838;
        }

        .signature-option {
            margin-top: 20px;
        }

        #drawCanvas {
            border: 1px solid #000;
            cursor: crosshair;
        }

        /* Draggable and Resizable Handles (Optional Enhancement) */
        /* You can add specific styles for resize handles if you implement custom resizing */

        /* Responsive Design */
        @media (max-width: 768px) {
            .modal-content {
                width: 80%;
            }
        }

    </style>
</head>
<body>

    <h1>Advanced PDF Editor</h1>

    <!-- Control Buttons -->
    <div id="controls">
        <label for="upload" class="control-button">Upload PDF</label>
        <input type="file" id="upload" accept="application/pdf" style="display: none;"/>
        
        <button id="addTextBtn" class="control-button">Add Text</button>
        <button id="addSignatureBtn" class="control-button">Add Signature</button>
        <button id="saveBtn" class="control-button">Preview PDF</button>
        
        <input type="file" id="signatureUpload" accept="image/png" style="display: none;"/>
    </div>

    <!-- PDF Viewer -->
    <div id="pdfViewer"></div>

    <!-- Toolbar for Text Formatting -->
    <div id="toolbar">
        <select id="font-family" class="toolbar-btn">
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
        </select>

        <select id="font-size" class="toolbar-btn">
            <option value="12px">12px</option>
            <option value="16px">16px</option>
            <option value="20px">20px</option>
            <option value="24px">24px</option>
        </select>

        <button id="bold-btn" class="toolbar-btn"><strong>B</strong></button>
        <button id="italic-btn" class="toolbar-btn"><em>I</em></button>
        <button id="underline-btn" class="toolbar-btn"><u>U</u></button>
        <button id="delete-btn" class="toolbar-btn delete-btn">Delete</button>
    </div>

    <!-- Signature Modal -->
    <div id="signatureModal" class="modal">
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <h2>Add Signature</h2>
            <button id="drawSignatureBtn" class="modal-button">Draw Signature</button>
            <button id="typeSignatureBtn" class="modal-button">Type Signature</button>
            <button id="uploadSignatureBtn" class="modal-button">Upload Signature</button>

            <!-- Draw Signature Canvas -->
            <div id="drawSignatureContainer" class="signature-option" style="display: none;">
                <canvas id="drawCanvas" width="300" height="150" style="border:1px solid #000;"></canvas>
                <button id="saveDrawnSignatureBtn" class="modal-button">Save Signature</button>
            </div>

            <!-- Type Signature Input -->
            <div id="typeSignatureContainer" class="signature-option" style="display: none;">
                <input type="text" id="typedSignature" placeholder="Type your signature here" />
                <button id="saveTypedSignatureBtn" class="modal-button">Save Signature</button>
            </div>

            <!-- Upload Signature Option -->
            <div id="uploadSignatureContainer" class="signature-option" style="display: none;">
                <label for="uploadSignatureFile" class="modal-button">Choose PNG File</label>
                <input type="file" id="uploadSignatureFile" accept="image/png" style="display: none;"/>
                <button id="saveUploadedSignatureBtn" class="modal-button">Save Signature</button>
            </div>
        </div>
    </div>

    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js"></script>
    <script src="https://unpkg.com/pdf-lib/dist/pdf-lib.min.js"></script>
    <!-- Include jsPDF Library -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>


<script>
    // Initialize PDF.js
    const pdfjsLib = window['pdfjsLib'];
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js';

    // Variables
    let existingPdfBytes;
    let pdfDoc = null;
    const scale = 1.5; // Adjust the scale as needed
    const pdfViewer = document.getElementById('pdfViewer');
    let numPages = 0;
    const pageViewports = {};

    // Event Listener for PDF Upload
    const uploadInput = document.getElementById('upload');
    uploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            const fileReader = new FileReader();
            fileReader.onload = function () {
                existingPdfBytes = new Uint8Array(this.result);
                loadPDF();
            };
            fileReader.readAsArrayBuffer(file);
        } else {
            alert('Please upload a valid PDF file.');
        }
    });

    // Function to Load and Render PDF
    async function loadPDF() {
        pdfViewer.innerHTML = ''; // Clear previous content

        try {
            pdfDoc = await pdfjsLib.getDocument({ data: existingPdfBytes }).promise;
            numPages = pdfDoc.numPages;

            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                const page = await pdfDoc.getPage(pageNum);
                const viewport = page.getViewport({ scale: scale });
                pageViewports[pageNum] = viewport;

                // Create page container
                const pageContainer = document.createElement('div');
                pageContainer.classList.add('page');
                pageContainer.style.width = `${viewport.width}px`;
                pageContainer.style.height = `${viewport.height}px`;
                pageContainer.setAttribute('data-page-num', pageNum);
                pdfViewer.appendChild(pageContainer);

                // Create canvas for PDF page
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                pageContainer.appendChild(canvas);

                // Render PDF page into canvas
                const renderContext = {
                    canvasContext: canvas.getContext('2d'),
                    viewport: viewport,
                };
                await page.render(renderContext).promise;

                // Click event for adding text or signature
                pageContainer.addEventListener('click', (event) => {
                    const rect = pageContainer.getBoundingClientRect();
                    const x = event.clientX - rect.left;
                    const y = event.clientY - rect.top;

                    if (isAddingText) {
                        createTextInput(x, y, pageNum, pageContainer);
                        isAddingText = false;
                        addTextBtn.classList.remove('active');
                        document.body.style.cursor = 'default';
                    } else if (isAddingSignature && signatureImage) {
                        // Signature placement will be handled in Batch 5
                        createSignature(x, y, pageNum, pageContainer);
                    }
                });
            }
        } catch (error) {
            console.error('Error loading PDF:', error);
            alert('An error occurred while loading the PDF.');
        }
    }
</script>
<!-- JavaScript for Handling Text Addition and Editing -->
<script>
    // Variables for Text Addition
    let isAddingText = false; // Flag to indicate if text-adding mode is active
    let activeInput = null; // Currently active text input
    let activeTextBox = null; // Currently selected text box

    // Get Control Buttons
    const addTextBtn = document.getElementById('addTextBtn');
    const toolbar = document.getElementById('toolbar');
    const fontFamilySelect = document.getElementById('font-family');
    const fontSizeSelect = document.getElementById('font-size');
    const boldBtn = document.getElementById('bold-btn');
    const italicBtn = document.getElementById('italic-btn');
    const underlineBtn = document.getElementById('underline-btn');
    const deleteBtn = document.getElementById('delete-btn');

    // Toggle Text Adding Mode
    addTextBtn.addEventListener('click', () => {
        isAddingText = !isAddingText;
        if (isAddingText) {
            addTextBtn.classList.add('active');
            addSignatureBtn.classList.remove('active');
            isAddingSignature = false;
            document.body.style.cursor = 'crosshair';
        } else {
            addTextBtn.classList.remove('active');
            document.body.style.cursor = 'default';
        }
    });

    // Function to Create a Text Input
    function createTextInput(x, y, pageNum, pageContainer) {
        // Finalize any active input
        if (activeInput) {
            finalizeTextInput();
        }

        // Create input element
        const input = document.createElement('textarea');
        input.classList.add('editInput');
        input.style.left = `${x}px`;
        input.style.top = `${y}px`;
        input.style.width = '200px';
        input.style.height = '50px';
        input.placeholder = 'Enter text...';
        pageContainer.appendChild(input);
        input.focus();

        activeInput = input;

        // Event listeners for input
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                finalizeTextInput();
            }
        });

        input.addEventListener('blur', () => {
            finalizeTextInput();
        });
    }

    // Function to Finalize Text Input and Create Text Box
    function finalizeTextInput() {
        if (!activeInput) return;

        const input = activeInput;
        const pageContainer = input.parentElement;
        const pageNum = parseInt(pageContainer.getAttribute('data-page-num'));

        const textContent = input.value.trim();
        if (!textContent) {
            // Remove empty input
            input.remove();
            activeInput = null;
            hideToolbar();
            return;
        }

        // Create text box
        const textBox = document.createElement('div');
        textBox.classList.add('text-box');
        textBox.style.left = input.style.left;
        textBox.style.top = input.style.top;
        textBox.style.width = input.style.width;
        textBox.style.height = input.style.height;
        textBox.innerHTML = `<textarea>${textContent}</textarea>`;
        pageContainer.appendChild(textBox);

        // Store text data
        const textData = {
            id: 'text-' + Date.now(),
            pageNum: pageNum,
            textContent: textContent,
            x: parseFloat(input.style.left),
            y: parseFloat(input.style.top),
            width: parseFloat(input.style.width),
            height: parseFloat(input.style.height),
            fontSize: 16,
            fontFamily: 'Arial',
            fontWeight: 'normal',
            fontStyle: 'normal',
            textDecoration: 'none',
            viewportHeight: pageViewports[pageNum].height
        };
        editedTexts.push(textData);

        // Remove input and reset
        input.remove();
        activeInput = null;

        // Make text box draggable and resizable
        makeElementDraggable(textBox);
        makeElementResizable(textBox);

        // Click event to select text box
        textBox.addEventListener('click', (e) => {
            e.stopPropagation();
            if (activeInput) {
                finalizeTextInput();
            }
            selectTextBox(textBox, textData);
        });

        // Show toolbar
        showToolbar(textData.x, textData.y);
    }

    // Function to Make Element Draggable
    function makeElementDraggable(element) {
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;

        element.addEventListener('mousedown', (e) => {
            if (e.target.tagName.toLowerCase() === 'textarea') return; // Do not drag when editing text
            e.preventDefault();
            isDragging = true;
            dragOffsetX = e.offsetX;
            dragOffsetY = e.offsetY;
            document.body.style.cursor = 'move';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const pageContainer = element.parentElement;
            const rect = pageContainer.getBoundingClientRect();
            const newX = e.clientX - rect.left - dragOffsetX;
            const newY = e.clientY - rect.top - dragOffsetY;
            element.style.left = `${newX}px`;
            element.style.top = `${newY}px`;

            // Update text data
            const textId = element.getAttribute('data-id') || '';
            const text = editedTexts.find(t => t.id === textId);
            if (text) {
                text.x = newX;
                text.y = newY;
            }

            // Move toolbar if active
            if (activeTextBox === element) {
                showToolbar(newX, newY);
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                document.body.style.cursor = 'default';
            }
        });
    }

    // Function to Make Element Resizable
    function makeElementResizable(element) {
        // The CSS `resize: both;` already allows resizing.
        // Additional JavaScript can be added if custom behavior is desired.
        // For simplicity, we'll rely on CSS resizing here.
        
        // Optional: Listen to resize events to update text data
        // This requires more complex handling and is not supported directly.
    }

    // Function to Select Text Box
    function selectTextBox(textBox, textData) {
        activeTextBox = textBox;
        activeSignatureBox = null;
        showToolbar(textData.x, textData.y);

        // Populate toolbar with current styles
        fontFamilySelect.value = textData.fontFamily;
        fontSizeSelect.value = `${textData.fontSize}px`;
        boldBtn.classList.toggle('active', textData.fontWeight === 'bold');
        italicBtn.classList.toggle('active', textData.fontStyle === 'italic');
        underlineBtn.classList.toggle('active', textData.textDecoration === 'underline');

        // Highlight the selected text box (optional)
        textBox.style.border = '2px dashed #007BFF';
    }

    // Function to Show Toolbar
    function showToolbar(x, y) {
        toolbar.style.left = `${x}px`;
        toolbar.style.top = `${y - 50}px`; // Position above the element
        toolbar.style.display = 'block';
    }

    // Function to Hide Toolbar
    function hideToolbar() {
        toolbar.style.display = 'none';
        activeTextBox = null;
    }

    // Event Listener for Delete Button
    deleteBtn.addEventListener('click', () => {
        if (activeTextBox) {
            const textId = activeTextBox.getAttribute('data-id') || '';
            const index = editedTexts.findIndex(t => t.id === textId);
            if (index !== -1) {
                editedTexts.splice(index, 1);
            }
            activeTextBox.remove();
            activeTextBox = null;
            hideToolbar();
        }

        if (activeSignatureBox) {
            // Handle deletion of signature boxes (to be implemented in signature batches)
            activeSignatureBox.remove();
            activeSignatureBox = null;
            hideToolbar();
        }
    });

    // Event Listeners for Toolbar Buttons

    // Font Family Change
    fontFamilySelect.addEventListener('change', (e) => {
        if (activeTextBox) {
            const selectedFont = e.target.value;
            activeTextBox.style.fontFamily = selectedFont;

            // Update text data
            const textId = activeTextBox.getAttribute('data-id') || '';
            const text = editedTexts.find(t => t.id === textId);
            if (text) {
                text.fontFamily = selectedFont;
            }
        }
    });

    // Font Size Change
    fontSizeSelect.addEventListener('change', (e) => {
        if (activeTextBox) {
            const selectedSize = parseInt(e.target.value);
            activeTextBox.style.fontSize = `${selectedSize}px`;

            // Update text data
            const textId = activeTextBox.getAttribute('data-id') || '';
            const text = editedTexts.find(t => t.id === textId);
            if (text) {
                text.fontSize = selectedSize;
            }
        }
    });

    // Bold Toggle
    boldBtn.addEventListener('click', () => {
        if (activeTextBox) {
            const isBold = activeTextBox.style.fontWeight === 'bold';
            activeTextBox.style.fontWeight = isBold ? 'normal' : 'bold';
            boldBtn.classList.toggle('active', !isBold);

            // Update text data
            const textId = activeTextBox.getAttribute('data-id') || '';
            const text = editedTexts.find(t => t.id === textId);
            if (text) {
                text.fontWeight = isBold ? 'normal' : 'bold';
            }
        }
    });

    // Italic Toggle
    italicBtn.addEventListener('click', () => {
        if (activeTextBox) {
            const isItalic = activeTextBox.style.fontStyle === 'italic';
            activeTextBox.style.fontStyle = isItalic ? 'normal' : 'italic';
            italicBtn.classList.toggle('active', !isItalic);

            // Update text data
            const textId = activeTextBox.getAttribute('data-id') || '';
            const text = editedTexts.find(t => t.id === textId);
            if (text) {
                text.fontStyle = isItalic ? 'normal' : 'italic';
            }
        }
    });

    // Underline Toggle
    underlineBtn.addEventListener('click', () => {
        if (activeTextBox) {
            const isUnderlined = activeTextBox.style.textDecoration === 'underline';
            activeTextBox.style.textDecoration = isUnderlined ? 'none' : 'underline';
            underlineBtn.classList.toggle('active', !isUnderlined);

            // Update text data
            const textId = activeTextBox.getAttribute('data-id') || '';
            const text = editedTexts.find(t => t.id === textId);
            if (text) {
                text.textDecoration = isUnderlined ? 'none' : 'underline';
            }
        }
    });

    // Deselect Elements When Clicking Outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.text-box') && !e.target.closest('.signature-box') && !e.target.closest('#toolbar') && !e.target.closest('.editInput')) {
            if (activeInput) {
                finalizeTextInput();
            }
            hideToolbar();
        }
    });
</script>
<!-- JavaScript for Handling Signatures -->
<script>
    // Variables for Signature Handling
    let isAddingSignature = false; // Flag to indicate if signature-adding mode is active
    let signatureImage = null; // Stores the uploaded signature image data
    let drawnSignatureDataURL = null; // Stores the drawn signature as Data URL
    let typedSignatureDataURL = null; // Stores the typed signature as Data URL

    // Get Modal Elements
    const signatureModal = document.getElementById('signatureModal');
    const closeModalBtn = document.querySelector('.close-button');
    const drawSignatureBtn = document.getElementById('drawSignatureBtn');
    const typeSignatureBtn = document.getElementById('typeSignatureBtn');
    const uploadSignatureBtn = document.getElementById('uploadSignatureBtn');

    // Signature Option Containers
    const drawSignatureContainer = document.getElementById('drawSignatureContainer');
    const typeSignatureContainer = document.getElementById('typeSignatureContainer');
    const uploadSignatureContainer = document.getElementById('uploadSignatureContainer');

    // Signature Saving Buttons
    const saveDrawnSignatureBtn = document.getElementById('saveDrawnSignatureBtn');
    const saveTypedSignatureBtn = document.getElementById('saveTypedSignatureBtn');
    const saveUploadedSignatureBtn = document.getElementById('saveUploadedSignatureBtn');

    // Signature Canvas for Drawing
    const drawCanvas = document.getElementById('drawCanvas');
    const ctx = drawCanvas.getContext('2d');
    let isDrawing = false;

    // Typed Signature Input
    const typedSignatureInput = document.getElementById('typedSignature');

    // Uploaded Signature File Input
    const uploadSignatureFile = document.getElementById('uploadSignatureFile');

    // Event Listener to Open Modal
    addSignatureBtn.addEventListener('click', () => {
        isAddingSignature = true;
        signatureModal.style.display = 'block';
        resetSignatureOptions();
    });

    // Event Listener to Close Modal
    closeModalBtn.addEventListener('click', () => {
        signatureModal.style.display = 'none';
        resetSignatureOptions();
    });

    // Function to Reset Signature Options
    function resetSignatureOptions() {
        drawSignatureContainer.style.display = 'none';
        typeSignatureContainer.style.display = 'none';
        uploadSignatureContainer.style.display = 'none';
    }

    // Event Listeners for Signature Options
    drawSignatureBtn.addEventListener('click', () => {
        resetSignatureOptions();
        drawSignatureContainer.style.display = 'block';
    });

    typeSignatureBtn.addEventListener('click', () => {
        resetSignatureOptions();
        typeSignatureContainer.style.display = 'block';
    });

    uploadSignatureBtn.addEventListener('click', () => {
        resetSignatureOptions();
        uploadSignatureContainer.style.display = 'block';
    });

    // Drawing on Canvas
    drawCanvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const rect = drawCanvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    });

    drawCanvas.addEventListener('mousemove', (e) => {
        if (isDrawing) {
            const rect = drawCanvas.getBoundingClientRect();
            ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    });

    drawCanvas.addEventListener('mouseup', () => {
        isDrawing = false;
    });

    drawCanvas.addEventListener('mouseleave', () => {
        isDrawing = false;
    });

    // Save Drawn Signature
    saveDrawnSignatureBtn.addEventListener('click', () => {
        drawnSignatureDataURL = drawCanvas.toDataURL('image/png');
        signatureImage = drawnSignatureDataURL;
        signatureModal.style.display = 'none';
        resetSignatureOptions();
        alert('Drawn signature saved! Click on the PDF to place it.');
    });

    // Save Typed Signature
    saveTypedSignatureBtn.addEventListener('click', () => {
        const typedText = typedSignatureInput.value.trim();
        if (!typedText) {
            alert('Please enter your signature.');
            return;
        }

        // Create a temporary canvas to render the typed signature
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.font = '48px Arial';
        const textMetrics = tempCtx.measureText(typedText);
        tempCanvas.width = textMetrics.width + 20;
        tempCanvas.height = 60; // Adjust height as needed

        // Redraw text on the resized canvas
        tempCtx.font = '48px Arial';
        tempCtx.fillStyle = '#000';
        tempCtx.fillText(typedText, 10, 50);

        typedSignatureDataURL = tempCanvas.toDataURL('image/png');
        signatureImage = typedSignatureDataURL;

        signatureModal.style.display = 'none';
        resetSignatureOptions();
        alert('Typed signature saved! Click on the PDF to place it.');
    });

    // Upload Signature File
    uploadSignatureFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'image/png') {
            const reader = new FileReader();
            reader.onload = function(event) {
                signatureImage = event.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please upload a valid PNG image for the signature.');
            uploadSignatureFile.value = ''; // Reset the input
        }
    });

    // Save Uploaded Signature
    saveUploadedSignatureBtn.addEventListener('click', () => {
        if (!signatureImage) {
            alert('Please upload a PNG image for the signature.');
            return;
        }
        signatureModal.style.display = 'none';
        resetSignatureOptions();
        alert('Uploaded signature saved! Click on the PDF to place it.');
    });

    // Click Event for Placing Signature on PDF
    // This assumes that "Add Signature" mode is active
    // You may need to adjust based on your application's logic
    function createSignature(x, y, pageNum, pageContainer) {
        if (!signatureImage) {
            alert('No signature available. Please create or upload a signature first.');
            return;
        }

        // Create signature box
        const sigDiv = document.createElement('div');
        sigDiv.classList.add('signature-box');
        sigDiv.style.left = `${x}px`;
        sigDiv.style.top = `${y}px`;
        sigDiv.style.width = '150px'; // Default width
        sigDiv.style.height = '60px'; // Default height
        sigDiv.setAttribute('data-page-num', pageNum);
        sigDiv.setAttribute('data-id', 'sig-' + Date.now());
        pageContainer.appendChild(sigDiv);

        // Create image element
        const img = document.createElement('img');
        img.src = signatureImage;
        img.style.width = '100%';
        img.style.height = '100%';
        sigDiv.appendChild(img);

        // Store signature data
        const sigData = {
            id: sigDiv.getAttribute('data-id'),
            pageNum: pageNum,
            imageData: signatureImage,
            x: parseFloat(sigDiv.style.left),
            y: parseFloat(sigDiv.style.top),
            width: parseFloat(sigDiv.style.width),
            height: parseFloat(sigDiv.style.height),
            viewportHeight: pageViewports[pageNum].height
        };
        signatures.push(sigData);

        // Make signature draggable and resizable
        makeElementDraggable(sigDiv);
        makeElementResizable(sigDiv);

        // Click event to select signature box
        sigDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            selectSignatureBox(sigDiv, sigData);
        });

        // Reset signature image after placing
        signatureImage = null;
    }

    // Function to Select Signature Box
    let activeSignatureBox = null;
    function selectSignatureBox(sigDiv, sigData) {
        activeSignatureBox = sigDiv;
        activeTextBox = null;
        showToolbar(sigData.x, sigData.y);

        // Hide text formatting options
        fontFamilySelect.style.display = 'none';
        fontSizeSelect.style.display = 'none';
        boldBtn.style.display = 'none';
        italicBtn.style.display = 'none';
        underlineBtn.style.display = 'none';

        // Optionally, highlight the selected signature box
        sigDiv.style.border = '2px dashed #28a745';
    }

    // Modify showToolbar to handle both text and signature
    function showToolbar(x, y) {
        toolbar.style.left = `${x}px`;
        toolbar.style.top = `${y - 50}px`; // Position above the element
        toolbar.style.display = 'block';
    }

    // Function to Make Element Draggable (Extended for Signatures)
    function makeElementDraggable(element) {
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;

        element.addEventListener('mousedown', (e) => {
            if (e.target.tagName.toLowerCase() === 'textarea' || e.target.classList.contains('text-signature')) return; // Do not drag when editing
            e.preventDefault();
            isDragging = true;
            dragOffsetX = e.offsetX;
            dragOffsetY = e.offsetY;
            document.body.style.cursor = 'move';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const pageContainer = element.parentElement;
            const rect = pageContainer.getBoundingClientRect();
            const newX = e.clientX - rect.left - dragOffsetX;
            const newY = e.clientY - rect.top - dragOffsetY;
            element.style.left = `${newX}px`;
            element.style.top = `${newY}px`;

            // Update data
            const elementId = element.getAttribute('data-id');
            if (element.classList.contains('text-box')) {
                const text = editedTexts.find(t => t.id === elementId);
                if (text) {
                    text.x = newX;
                    text.y = newY;
                }
            } else if (element.classList.contains('signature-box')) {
                const sig = signatures.find(s => s.id === elementId);
                if (sig) {
                    sig.x = newX;
                    sig.y = newY;
                }
            }

            // Move toolbar if active
            if (activeTextBox === element || activeSignatureBox === element) {
                showToolbar(newX, newY);
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                document.body.style.cursor = 'default';
            }
        });
    }

    // Function to Make Element Resizable (Extended for Signatures)
    function makeElementResizable(element) {
        // The CSS `resize: both;` already allows resizing.
        // Additional JavaScript can be added if custom behavior is desired.
        // For simplicity, we'll rely on CSS resizing here.

        // Optional: Listen to resize events to update data
        // This requires more complex handling and is not supported directly.
    }

    // Deselect Elements When Clicking Outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.text-box') && !e.target.closest('.signature-box') && !e.target.closest('#toolbar') && !e.target.closest('.editInput')) {
            if (activeInput) {
                finalizeTextInput();
            }
            hideToolbar();
            activeTextBox = null;
            activeSignatureBox = null;
        }
    });
</script>
<!-- JavaScript for Handling Signatures -->
<script>
    // // Variables for Signature Handling
    // let isAddingSignature = false; // Flag to indicate if signature-adding mode is active
    // let signatureImage = null; // Stores the uploaded signature image data
    // let drawnSignatureDataURL = null; // Stores the drawn signature as Data URL
    // let typedSignatureDataURL = null; // Stores the typed signature as Data URL

    // // Get Modal Elements
    // const signatureModal = document.getElementById('signatureModal');
    // const closeModalBtn = document.querySelector('.close-button');
    // const drawSignatureBtn = document.getElementById('drawSignatureBtn');
    // const typeSignatureBtn = document.getElementById('typeSignatureBtn');
    // const uploadSignatureBtn = document.getElementById('uploadSignatureBtn');

    // // Signature Option Containers
    // const drawSignatureContainer = document.getElementById('drawSignatureContainer');
    // const typeSignatureContainer = document.getElementById('typeSignatureContainer');
    // const uploadSignatureContainer = document.getElementById('uploadSignatureContainer');

    // // Signature Saving Buttons
    // const saveDrawnSignatureBtn = document.getElementById('saveDrawnSignatureBtn');
    // const saveTypedSignatureBtn = document.getElementById('saveTypedSignatureBtn');
    // const saveUploadedSignatureBtn = document.getElementById('saveUploadedSignatureBtn');

    // // Signature Canvas for Drawing
    // const drawCanvas = document.getElementById('drawCanvas');
    // const ctx = drawCanvas.getContext('2d');
    // let isDrawing = false;

    // // Typed Signature Input
    // const typedSignatureInput = document.getElementById('typedSignature');

    // // Uploaded Signature File Input
    // const uploadSignatureFile = document.getElementById('uploadSignatureFile');

    // Event Listener to Open Modal
    addSignatureBtn.addEventListener('click', () => {
        isAddingSignature = true;
        signatureModal.style.display = 'block';
        resetSignatureOptions();
    });

    // Event Listener to Close Modal
    closeModalBtn.addEventListener('click', () => {
        signatureModal.style.display = 'none';
        resetSignatureOptions();
    });

    // Function to Reset Signature Options
    function resetSignatureOptions() {
        drawSignatureContainer.style.display = 'none';
        typeSignatureContainer.style.display = 'none';
        uploadSignatureContainer.style.display = 'none';
    }

    // Event Listeners for Signature Options
    drawSignatureBtn.addEventListener('click', () => {
        resetSignatureOptions();
        drawSignatureContainer.style.display = 'block';
        clearDrawCanvas();
    });

    typeSignatureBtn.addEventListener('click', () => {
        resetSignatureOptions();
        typeSignatureContainer.style.display = 'block';
    });

    uploadSignatureBtn.addEventListener('click', () => {
        resetSignatureOptions();
        uploadSignatureContainer.style.display = 'block';
    });

    // Function to Clear the Draw Canvas
    function clearDrawCanvas() {
        ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    }

    // Drawing on Canvas
    drawCanvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const rect = drawCanvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    });

    drawCanvas.addEventListener('mousemove', (e) => {
        if (isDrawing) {
            const rect = drawCanvas.getBoundingClientRect();
            ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    });

    drawCanvas.addEventListener('mouseup', () => {
        isDrawing = false;
    });

    drawCanvas.addEventListener('mouseleave', () => {
        isDrawing = false;
    });

    // Save Drawn Signature
    saveDrawnSignatureBtn.addEventListener('click', () => {
        drawnSignatureDataURL = drawCanvas.toDataURL('image/png');
        if (isCanvasBlank(drawCanvas)) {
            alert('Please draw your signature before saving.');
            return;
        }
        signatureImage = drawnSignatureDataURL;
        signatureModal.style.display = 'none';
        resetSignatureOptions();
        alert('Drawn signature saved! Click on the PDF to place it.');
    });

    // Function to Check if Canvas is Blank
    function isCanvasBlank(canvas) {
        const blank = document.createElement('canvas');
        blank.width = canvas.width;
        blank.height = canvas.height;
        return canvas.toDataURL() === blank.toDataURL();
    }

    // Save Typed Signature
    saveTypedSignatureBtn.addEventListener('click', () => {
        const typedText = typedSignatureInput.value.trim();
        if (!typedText) {
            alert('Please enter your signature.');
            return;
        }

        // Create a temporary canvas to render the typed signature
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.font = '48px Arial';
        const textMetrics = tempCtx.measureText(typedText);
        tempCanvas.width = textMetrics.width + 20;
        tempCanvas.height = 60; // Adjust height as needed

        // Redraw text on the resized canvas
        tempCtx.font = '48px Arial';
        tempCtx.fillStyle = '#000';
        tempCtx.fillText(typedText, 10, 50);

        typedSignatureDataURL = tempCanvas.toDataURL('image/png');
        signatureImage = typedSignatureDataURL;

        signatureModal.style.display = 'none';
        resetSignatureOptions();
        alert('Typed signature saved! Click on the PDF to place it.');
    });

    // Upload Signature File
    uploadSignatureFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'image/png') {
            const reader = new FileReader();
            reader.onload = function(event) {
                signatureImage = event.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please upload a valid PNG image for the signature.');
            uploadSignatureFile.value = ''; // Reset the input
        }
    });

    // Save Uploaded Signature
    saveUploadedSignatureBtn.addEventListener('click', () => {
        if (!signatureImage) {
            alert('Please upload a PNG image for the signature.');
            return;
        }
        signatureModal.style.display = 'none';
        resetSignatureOptions();
        alert('Uploaded signature saved! Click on the PDF to place it.');
    });

    // Function to Place Signature on PDF
    function createSignature(x, y, pageNum, pageContainer) {
        if (!signatureImage) {
            alert('No signature available. Please create or upload a signature first.');
            return;
        }

        // Create signature box
        const sigDiv = document.createElement('div');
        sigDiv.classList.add('signature-box');
        sigDiv.style.left = `${x}px`;
        sigDiv.style.top = `${y}px`;
        sigDiv.style.width = '150px'; // Default width
        sigDiv.style.height = '60px'; // Default height
        sigDiv.setAttribute('data-page-num', pageNum);
        sigDiv.setAttribute('data-id', 'sig-' + Date.now());
        pageContainer.appendChild(sigDiv);

        // Create image element
        const img = document.createElement('img');
        img.src = signatureImage;
        img.style.width = '100%';
        img.style.height = '100%';
        sigDiv.appendChild(img);

        // Store signature data
        const sigData = {
            id: sigDiv.getAttribute('data-id'),
            pageNum: pageNum,
            imageData: signatureImage,
            x: parseFloat(sigDiv.style.left),
            y: parseFloat(sigDiv.style.top),
            width: parseFloat(sigDiv.style.width),
            height: parseFloat(sigDiv.style.height),
            viewportHeight: pageViewports[pageNum].height
        };
        signatures.push(sigData);

        // Make signature draggable and resizable
        makeElementDraggable(sigDiv);
        makeElementResizable(sigDiv);

        // Click event to select signature box
        sigDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            selectSignatureBox(sigDiv, sigData);
        });

        // Reset signature image after placing
        signatureImage = null;
    }

    // Function to Select Signature Box
    // let activeSignatureBox = null;
    function selectSignatureBox(sigDiv, sigData) {
        activeSignatureBox = sigDiv;
        activeTextBox = null;
        showToolbar(sigData.x, sigData.y);

        // Hide text formatting options
        fontFamilySelect.style.display = 'none';
        fontSizeSelect.style.display = 'none';
        boldBtn.style.display = 'none';
        italicBtn.style.display = 'none';
        underlineBtn.style.display = 'none';

        // Optionally, highlight the selected signature box
        sigDiv.style.border = '2px dashed #28a745';
    }

    // Modify showToolbar to handle both text and signature
    function showToolbar(x, y) {
        toolbar.style.left = `${x}px`;
        toolbar.style.top = `${y - 50}px`; // Position above the element
        toolbar.style.display = 'block';
    }

    // Function to Make Element Draggable (Extended for Signatures)
    function makeElementDraggable(element) {
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;

        element.addEventListener('mousedown', (e) => {
            if (e.target.tagName.toLowerCase() === 'textarea' || e.target.classList.contains('text-signature')) return; // Do not drag when editing
            e.preventDefault();
            isDragging = true;
            dragOffsetX = e.offsetX;
            dragOffsetY = e.offsetY;
            document.body.style.cursor = 'move';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const pageContainer = element.parentElement;
            const rect = pageContainer.getBoundingClientRect();
            const newX = e.clientX - rect.left - dragOffsetX;
            const newY = e.clientY - rect.top - dragOffsetY;
            element.style.left = `${newX}px`;
            element.style.top = `${newY}px`;

            // Update data
            const elementId = element.getAttribute('data-id');
            if (element.classList.contains('text-box')) {
                const text = editedTexts.find(t => t.id === elementId);
                if (text) {
                    text.x = newX;
                    text.y = newY;
                }
            } else if (element.classList.contains('signature-box')) {
                const sig = signatures.find(s => s.id === elementId);
                if (sig) {
                    sig.x = newX;
                    sig.y = newY;
                }
            }

            // Move toolbar if active
            if (activeTextBox === element || activeSignatureBox === element) {
                showToolbar(newX, newY);
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                document.body.style.cursor = 'default';
            }
        });
    }

    // Function to Make Element Resizable (Extended for Signatures)
    function makeElementResizable(element) {
        // The CSS `resize: both;` already allows resizing.
        // Additional JavaScript can be added if custom behavior is desired.
        // For simplicity, we'll rely on CSS resizing here.

        // Optional: Listen to resize events to update data
        // This requires more complex handling and is not supported directly.
    }

    // Deselect Elements When Clicking Outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.text-box') && !e.target.closest('.signature-box') && !e.target.closest('#toolbar') && !e.target.closest('.editInput')) {
            if (activeInput) {
                finalizeTextInput();
            }
            hideToolbar();
            activeTextBox = null;
            activeSignatureBox = null;
        }
    });
</script>
<!-- JavaScript for Handling Typed Signatures -->
<script>
    // Array to Store Typed Signatures
    const typedSignatures = [];

    // Function to Save Typed Signature
    saveTypedSignatureBtn.addEventListener('click', () => {
        const typedText = typedSignatureInput.value.trim();
        if (!typedText) {
            alert('Please enter your signature.');
            return;
        }

        // Create a temporary canvas to render the typed signature
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.font = '48px Arial'; // Adjust font and size as needed
        const textMetrics = tempCtx.measureText(typedText);
        tempCanvas.width = textMetrics.width + 20; // Add some padding
        tempCanvas.height = 60; // Adjust height as needed

        // Redraw text on the resized canvas
        tempCtx.font = '48px Arial';
        tempCtx.fillStyle = '#000';
        tempCtx.fillText(typedText, 10, 50); // Position text with padding

        // Convert the canvas to a Data URL
        const typedSignatureDataURL = tempCanvas.toDataURL('image/png');

        // Store the typed signature data
        signatureImage = typedSignatureDataURL;

        // Clear the input field
        typedSignatureInput.value = '';

        // Close the modal and reset options
        signatureModal.style.display = 'none';
        resetSignatureOptions();

        alert('Typed signature saved! Click on the PDF to place it.');
    });

    // Function to Place Typed Signature on PDF
    function createTypedSignature(x, y, pageNum, pageContainer) {
        if (!signatureImage) {
            alert('No signature available. Please create or upload a signature first.');
            return;
        }

        // Create signature box
        const sigDiv = document.createElement('div');
        sigDiv.classList.add('signature-box');
        sigDiv.style.left = `${x}px`;
        sigDiv.style.top = `${y}px`;
        sigDiv.style.width = '150px'; // Default width, can be resized
        sigDiv.style.height = '60px'; // Default height, can be resized
        sigDiv.setAttribute('data-page-num', pageNum);
        sigDiv.setAttribute('data-id', 'sig-' + Date.now());
        pageContainer.appendChild(sigDiv);

        // Create image element for the typed signature
        const img = document.createElement('img');
        img.src = signatureImage;
        img.style.width = '100%';
        img.style.height = '100%';
        sigDiv.appendChild(img);

        // Store signature data
        const sigData = {
            id: sigDiv.getAttribute('data-id'),
            pageNum: pageNum,
            imageData: signatureImage,
            x: parseFloat(sigDiv.style.left),
            y: parseFloat(sigDiv.style.top),
            width: parseFloat(sigDiv.style.width),
            height: parseFloat(sigDiv.style.height),
            viewportHeight: pageViewports[pageNum].height
        };
        typedSignatures.push(sigData);

        // Make signature draggable and resizable
        makeElementDraggable(sigDiv);
        makeElementResizable(sigDiv);

        // Click event to select signature box
        sigDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            selectTypedSignatureBox(sigDiv, sigData);
        });

        // Reset signature image after placing
        signatureImage = null;
    }

    // Function to Select Typed Signature Box
    function selectTypedSignatureBox(sigDiv, sigData) {
        activeSignatureBox = sigDiv;
        activeTextBox = null;
        showToolbar(sigData.x, sigData.y);

        // Hide text formatting options
        fontFamilySelect.style.display = 'none';
        fontSizeSelect.style.display = 'none';
        boldBtn.style.display = 'none';
        italicBtn.style.display = 'none';
        underlineBtn.style.display = 'none';

        // Optionally, highlight the selected signature box
        sigDiv.style.border = '2px dashed #28a745';
    }

    // Override the existing createSignature function to handle both drawn and typed signatures
    function createSignature(x, y, pageNum, pageContainer) {
        if (!signatureImage) {
            alert('No signature available. Please create or upload a signature first.');
            return;
        }

        // Determine if the signature is typed or drawn based on the Data URL
        // For simplicity, assume that if the signature was created via typing, its Data URL includes "data:image/png;base64,..."
        // Alternatively, you can set a flag when saving typed vs. drawn signatures
        const isTyped = typedSignatureInput.value.trim() !== '';

        if (isTyped) {
            createTypedSignature(x, y, pageNum, pageContainer);
        } else {
            // Existing drawn signature handling
            // Create signature box
            const sigDiv = document.createElement('div');
            sigDiv.classList.add('signature-box');
            sigDiv.style.left = `${x}px`;
            sigDiv.style.top = `${y}px`;
            sigDiv.style.width = '150px'; // Default width
            sigDiv.style.height = '60px'; // Default height
            sigDiv.setAttribute('data-page-num', pageNum);
            sigDiv.setAttribute('data-id', 'sig-' + Date.now());
            pageContainer.appendChild(sigDiv);

            // Create image element
            const img = document.createElement('img');
            img.src = signatureImage;
            img.style.width = '100%';
            img.style.height = '100%';
            sigDiv.appendChild(img);

            // Store signature data
            const sigData = {
                id: sigDiv.getAttribute('data-id'),
                pageNum: pageNum,
                imageData: signatureImage,
                x: parseFloat(sigDiv.style.left),
                y: parseFloat(sigDiv.style.top),
                width: parseFloat(sigDiv.style.width),
                height: parseFloat(sigDiv.style.height),
                viewportHeight: pageViewports[pageNum].height
            };
            signatures.push(sigData);

            // Make signature draggable and resizable
            makeElementDraggable(sigDiv);
            makeElementResizable(sigDiv);

            // Click event to select signature box
            sigDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                selectSignatureBox(sigDiv, sigData);
            });

            // Reset signature image after placing
            signatureImage = null;
        }
    }

    // Modify the click event in loadPDF to handle signature placement
    async function loadPDF() {
        pdfViewer.innerHTML = ''; // Clear previous content

        try {
            pdfDoc = await pdfjsLib.getDocument({ data: existingPdfBytes }).promise;
            numPages = pdfDoc.numPages;

            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                const page = await pdfDoc.getPage(pageNum);
                const viewport = page.getViewport({ scale: scale });
                pageViewports[pageNum] = viewport;

                // Create page container
                const pageContainer = document.createElement('div');
                pageContainer.classList.add('page');
                pageContainer.style.width = `${viewport.width}px`;
                pageContainer.style.height = `${viewport.height}px`;
                pageContainer.setAttribute('data-page-num', pageNum);
                pdfViewer.appendChild(pageContainer);

                // Create canvas for PDF page
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                pageContainer.appendChild(canvas);

                // Render PDF page into canvas
                const renderContext = {
                    canvasContext: canvas.getContext('2d'),
                    viewport: viewport,
                };
                await page.render(renderContext).promise;

                // Click event for adding text or signature
                pageContainer.addEventListener('click', (event) => {
                    const rect = pageContainer.getBoundingClientRect();
                    const x = event.clientX - rect.left;
                    const y = event.clientY - rect.top;

                    if (isAddingText) {
                        createTextInput(x, y, pageNum, pageContainer);
                        isAddingText = false;
                        addTextBtn.classList.remove('active');
                        document.body.style.cursor = 'default';
                    } else if (isAddingSignature) {
                        createSignature(x, y, pageNum, pageContainer);
                        isAddingSignature = false;
                        addSignatureBtn.classList.remove('active');
                        document.body.style.cursor = 'default';
                    }
                });
            }
        } catch (error) {
            console.error('Error loading PDF:', error);
            alert('An error occurred while loading the PDF.');
        }
    }

    // Update the Add Signature button to toggle adding signature mode
    addSignatureBtn.addEventListener('click', () => {
        isAddingSignature = !isAddingSignature;
        if (isAddingSignature) {
            addSignatureBtn.classList.add('active');
            addTextBtn.classList.remove('active');
            isAddingText = false;
            document.body.style.cursor = 'crosshair';
        } else {
            addSignatureBtn.classList.remove('active');
            document.body.style.cursor = 'default';
        }
    });

    // Array to store signatures
    const signatures = [];

    // Array to store typed signatures
    // const typedSignatures = [];


    // Array to store text annotations
    const editedTexts = [];

    // Update the showToolbar function to handle both text and signature
    function showToolbar(x, y) {
        toolbar.style.left = `${x}px`;
        toolbar.style.top = `${y - 50}px`; // Position above the element
        toolbar.style.display = 'block';
    }

    // Hide Toolbar Function (if not already defined)
    function hideToolbar() {
        toolbar.style.display = 'none';
        // Reset toolbar buttons visibility if needed
        fontFamilySelect.style.display = 'inline-block';
        fontSizeSelect.style.display = 'inline-block';
        boldBtn.style.display = 'inline-block';
        italicBtn.style.display = 'inline-block';
        underlineBtn.style.display = 'inline-block';
    }
</script>
<!-- JavaScript for Handling Uploaded Signatures with Error Handling -->
<script>
    // Array to Store Uploaded Signatures
    const uploadedSignatures = [];

    // Function to Save Uploaded Signature
    saveUploadedSignatureBtn.addEventListener('click', () => {
        if (!signatureImage) {
            alert('Please upload a valid PNG image for the signature.');
            return;
        }

        // Ensure the uploaded image is in PNG format
        const img = new Image();
        img.onload = function() {
            // Optionally, you can add further validations on image dimensions here
            // For example, limit the maximum size of the signature image
            signatureModal.style.display = 'none';
            resetSignatureOptions();
            alert('Uploaded signature saved! Click on the PDF to place it.');
        };
        img.onerror = function() {
            alert('The uploaded file is not a valid image. Please upload a PNG image.');
            signatureImage = null;
        };
        img.src = signatureImage;
    });

    // Event Listener for Upload Signature File Input
    uploadSignatureFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'image/png') {
                alert('Invalid file type. Please upload a PNG image for the signature.');
                uploadSignatureFile.value = ''; // Reset the input
                signatureImage = null;
                return;
            }

            const reader = new FileReader();
            reader.onload = function(event) {
                signatureImage = event.target.result;
            };
            reader.onerror = function() {
                alert('An error occurred while reading the file. Please try again.');
                signatureImage = null;
            };
            reader.readAsDataURL(file);
        }
    });

    // Function to Place Uploaded Signature on PDF
    function createUploadedSignature(x, y, pageNum, pageContainer) {
        if (!signatureImage) {
            alert('No signature available. Please upload a signature first.');
            return;
        }

        // Create signature box
        const sigDiv = document.createElement('div');
        sigDiv.classList.add('signature-box');
        sigDiv.style.left = `${x}px`;
        sigDiv.style.top = `${y}px`;
        sigDiv.style.width = '150px'; // Default width, can be resized
        sigDiv.style.height = '60px'; // Default height, can be resized
        sigDiv.setAttribute('data-page-num', pageNum);
        sigDiv.setAttribute('data-id', 'sig-' + Date.now());
        pageContainer.appendChild(sigDiv);

        // Create image element for the uploaded signature
        const img = document.createElement('img');
        img.src = signatureImage;
        img.style.width = '100%';
        img.style.height = '100%';
        sigDiv.appendChild(img);

        // Store signature data
        const sigData = {
            id: sigDiv.getAttribute('data-id'),
            pageNum: pageNum,
            imageData: signatureImage,
            x: parseFloat(sigDiv.style.left),
            y: parseFloat(sigDiv.style.top),
            width: parseFloat(sigDiv.style.width),
            height: parseFloat(sigDiv.style.height),
            viewportHeight: pageViewports[pageNum].height
        };
        uploadedSignatures.push(sigData);

        // Make signature draggable and resizable
        makeElementDraggable(sigDiv);
        makeElementResizable(sigDiv);

        // Click event to select signature box
        sigDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            selectUploadedSignatureBox(sigDiv, sigData);
        });

        // Reset signature image after placing
        signatureImage = null;
    }

    // Function to Select Uploaded Signature Box
    function selectUploadedSignatureBox(sigDiv, sigData) {
        activeSignatureBox = sigDiv;
        activeTextBox = null;
        showToolbar(sigData.x, sigData.y);

        // Hide text formatting options
        fontFamilySelect.style.display = 'none';
        fontSizeSelect.style.display = 'none';
        boldBtn.style.display = 'none';
        italicBtn.style.display = 'none';
        underlineBtn.style.display = 'none';

        // Optionally, highlight the selected signature box
        sigDiv.style.border = '2px dashed #28a745';
    }

    // Update the createSignature function to handle uploaded signatures
    function createSignature(x, y, pageNum, pageContainer) {
        if (!signatureImage) {
            alert('No signature available. Please create or upload a signature first.');
            return;
        }

        // Determine the type of signature based on where it was saved
        // Assuming 'signatureImage' holds the Data URL of the latest saved signature
        // You can implement additional logic or flags if needed

        // Check if the signature was uploaded by verifying the Data URL structure
        // Typically, uploaded images are from FileReader and should be valid
        // Here, we proceed to place it as an uploaded signature

        createUploadedSignature(x, y, pageNum, pageContainer);
    }

    // Modify the loadPDF function to handle signature placement correctly
    async function loadPDF() {
        pdfViewer.innerHTML = ''; // Clear previous content

        try {
            pdfDoc = await pdfjsLib.getDocument({ data: existingPdfBytes }).promise;
            numPages = pdfDoc.numPages;

            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                const page = await pdfDoc.getPage(pageNum);
                const viewport = page.getViewport({ scale: scale });
                pageViewports[pageNum] = viewport;

                // Create page container
                const pageContainer = document.createElement('div');
                pageContainer.classList.add('page');
                pageContainer.style.width = `${viewport.width}px`;
                pageContainer.style.height = `${viewport.height}px`;
                pageContainer.setAttribute('data-page-num', pageNum);
                pdfViewer.appendChild(pageContainer);

                // Create canvas for PDF page
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                pageContainer.appendChild(canvas);

                // Render PDF page into canvas
                const renderContext = {
                    canvasContext: canvas.getContext('2d'),
                    viewport: viewport,
                };
                await page.render(renderContext).promise;

                // Click event for adding text or signature
                pageContainer.addEventListener('click', (event) => {
                    const rect = pageContainer.getBoundingClientRect();
                    const x = event.clientX - rect.left;
                    const y = event.clientY - rect.top;

                    if (isAddingText) {
                        createTextInput(x, y, pageNum, pageContainer);
                        isAddingText = false;
                        addTextBtn.classList.remove('active');
                        document.body.style.cursor = 'default';
                    } else if (isAddingSignature) {
                        // Determine the type of signature being placed
                        // Assuming that 'signatureImage' holds the latest signature (drawn, typed, or uploaded)
                        // For more accurate type detection, consider setting flags during signature creation
                        createSignature(x, y, pageNum, pageContainer);
                        isAddingSignature = false;
                        addSignatureBtn.classList.remove('active');
                        document.body.style.cursor = 'default';
                    }
                });
            }
        } catch (error) {
            console.error('Error loading PDF:', error);
            alert('An error occurred while loading the PDF.');
        }
    }

    // Update the Add Signature button to toggle adding signature mode
    addSignatureBtn.addEventListener('click', () => {
        isAddingSignature = !isAddingSignature;
        if (isAddingSignature) {
            addSignatureBtn.classList.add('active');
            addTextBtn.classList.remove('active');
            isAddingText = false;
            document.body.style.cursor = 'crosshair';
        } else {
            addSignatureBtn.classList.remove('active');
            document.body.style.cursor = 'default';
        }
    });

    // // Array to store signatures
    // const signatures = [];

    // // Arrays to store typed and uploaded signatures
    // const typedSignatures = [];
    // const uploadedSignatures = [];

    // // Array to store text annotations
    // const editedTexts = [];

    // Update the showToolbar function to handle both text and signature
    function showToolbar(x, y) {
        toolbar.style.left = `${x}px`;
        toolbar.style.top = `${y - 50}px`; // Position above the element
        toolbar.style.display = 'block';
    }

    // Hide Toolbar Function (if not already defined)
    function hideToolbar() {
        toolbar.style.display = 'none';
        // Reset toolbar buttons visibility if needed
        fontFamilySelect.style.display = 'inline-block';
        fontSizeSelect.style.display = 'inline-block';
        boldBtn.style.display = 'inline-block';
        italicBtn.style.display = 'inline-block';
        underlineBtn.style.display = 'inline-block';
    }
</script>

<!-- JavaScript for Handling Preview PDF Functionality -->
<!-- JavaScript for Handling Preview PDF Functionality with Blob Method -->
<script>
    // Ensure jsPDF is loaded
    window.onload = function() {
        if (!window.jspdf) {
            console.error('jsPDF library is not loaded.');
            alert('Failed to load jsPDF library. Please check your internet connection.');
        }
    };

    // Event Listener for Preview PDF Button
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.addEventListener('click', () => {
        if (!pdfDoc) {
            alert('Please upload a PDF first.');
            return;
        }
        generatePreviewPDF();
    });

    // Function to Generate Preview PDF using Blob Method
    async function generatePreviewPDF() {
        const { jsPDF } = window.jspdf;
        const previewPDF = new jsPDF({
            unit: 'pt',
            format: 'a4',
        });

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);
            const viewport = pageViewports[pageNum];
            const scale = 2; // Increased scale for better quality
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width * scale;
            canvas.height = viewport.height * scale;

            const renderContext = {
                canvasContext: context,
                viewport: page.getViewport({ scale: scale }),
            };

            await page.render(renderContext).promise;

            // Convert the canvas to a Blob
            const canvasBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

            // Create a temporary URL for the blob
            const blobURL = URL.createObjectURL(canvasBlob);

            // Add the image to jsPDF
            if (pageNum > 1) {
                previewPDF.addPage();
            }

            // Calculate width and height to fit A4
            const imgProps = previewPDF.getImageProperties(blobURL);
            const pdfWidth = previewPDF.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            previewPDF.addImage(blobURL, 'PNG', 0, 0, pdfWidth, pdfHeight);

            // Overlay Annotations
            const pageContainer = document.querySelector(`.page[data-page-num='${pageNum}']`);
            if (pageContainer) {
                // Add Text Annotations
                const textBoxes = pageContainer.querySelectorAll('.text-box');
                textBoxes.forEach(textBox => {
                    const textarea = textBox.querySelector('textarea');
                    if (textarea) {
                        const text = textarea.value || textarea.innerText || '';
                        const fontSize = parseInt(textBox.style.fontSize) || 16;
                        const fontFamily = textBox.style.fontFamily || 'Arial';
                        const fontWeight = textBox.style.fontWeight || 'normal';
                        const fontStyle = textBox.style.fontStyle || 'normal';
                        const textDecoration = textBox.style.textDecoration || 'none';

                        // Calculate position relative to the PDF
                        const x = parseFloat(textBox.style.left) * (pdfWidth / viewport.width);
                        const y = parseFloat(textBox.style.top) * (previewPDF.internal.pageSize.getHeight() / viewport.height) + fontSize;

                        // Set font styles
                        previewPDF.setFont(fontFamily, fontStyle === 'italic' ? 'italic' : 'normal', fontWeight === 'bold' ? 'bold' : 'normal');
                        previewPDF.setFontSize(fontSize);

                        // Handle underline
                        if (textDecoration === 'underline') {
                            previewPDF.text(text, x, y);
                            const textWidth = previewPDF.getTextDimensions(text).w;
                            previewPDF.setLineWidth(1);
                            previewPDF.line(x, y + 2, x + textWidth, y + 2); // Simple underline
                        } else {
                            previewPDF.text(text, x, y);
                        }
                    }
                });

                // Add Signature Annotations
                const signatureBoxes = pageContainer.querySelectorAll('.signature-box');
                signatureBoxes.forEach(sigBox => {
                    const img = sigBox.querySelector('img');
                    if (img && img.src) {
                        const imgWidth = parseFloat(sigBox.style.width) * (pdfWidth / viewport.width);
                        const imgHeight = parseFloat(sigBox.style.height) * (previewPDF.internal.pageSize.getHeight() / viewport.height);
                        const x = parseFloat(sigBox.style.left) * (pdfWidth / viewport.width);
                        const y = parseFloat(sigBox.style.top) * (previewPDF.internal.pageSize.getHeight() / viewport.height);

                        previewPDF.addImage(img.src, 'PNG', x, y, imgWidth, imgHeight);
                    }
                });
            }

            // Revoke the blob URL to free memory
            URL.revokeObjectURL(blobURL);
        }

        // Generate the PDF as a Blob
        const pdfBlob = previewPDF.output('blob');

        // Create a Blob URL
        const pdfURL = URL.createObjectURL(pdfBlob);

        // Open the PDF in a new tab
        window.open(pdfURL);

        // Optional: Revoke the object URL after a delay to free memory
        setTimeout(() => {
            URL.revokeObjectURL(pdfURL);
        }, 1000);
    }
</script>



</body>
</html>
