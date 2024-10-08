<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>PDF Editor with Tooltip Toolbar and Preview</title>
    <style>
        #pdf-canvas {
            border: 1px solid black;
            width: 100%;
            height: auto;
        }
        .text-box {
            position: absolute;
            border: 1px dashed #000;
            background-color: rgba(255,255,255,0.8);
            padding: 5px;
            min-width: 100px;
            cursor: move;
        }
        #toolbar {
            display: none;
            position: absolute;
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            padding: 5px;
            z-index: 1000;
        }
        .toolbar-btn {
            margin-right: 5px;
        }
        #pdfViewer {
            position: relative;
            width: 100%;
            height: auto;
        }
        .page {
            margin-bottom: 20px;
        }
        .editInput {
            position: absolute;
            border: 1px solid #000;
            padding: 0;
            margin: 0;
            box-sizing: border-box;
            background-color: rgba(255, 255, 255, 0.8);
            z-index: 2;
        }
        .toolbar-btn.active {
            background-color: #ddd;
        }
        /* Add Text Button Active State */
        #addTextBtn.active {
            background-color: #ddd;
        }
    </style>
</head>
<body>

    <h1>PDF Editor with Tooltip Toolbar and Preview</h1>

    <input type="file" id="upload" accept="application/pdf"/>
    <button id="addTextBtn">Add Text</button>
    <button id="saveBtn">Preview PDF</button>
    <div id="pdfViewer"></div>

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

        <button id="bold-btn" class="toolbar-btn">B</button>
        <button id="italic-btn" class="toolbar-btn">I</button>
        <button id="underline-btn" class="toolbar-btn">U</button>
        <button id="delete-btn" class="toolbar-btn" style="color:red;">Delete</button>
    </div>

    <!-- Include PDF.js and PDFLib -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.min.js"></script>
    <script src="https://unpkg.com/pdf-lib/dist/pdf-lib.min.js"></script>
    <script>
        const pdfjsLib = window['pdfjsLib'];
        pdfjsLib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js';

        let existingPdfBytes;
        let pdfDoc = null;
        let scale = 1.5;
        let pdfViewer = document.getElementById('pdfViewer');
        let numPages = 0;
        let pageViewports = {};
        let editedTexts = [];
        let activeInput = null;
        let activeTextBox = null;
        let dragOffsetX = 0;
        let dragOffsetY = 0;
        let isDragging = false;
        let isAddingText = false; // Flag for Add Text mode

        document.getElementById('upload').addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file.type !== 'application/pdf') {
                alert('Please upload a PDF file.');
                return;
            }
            const fileReader = new FileReader();
            fileReader.onload = function () {
                existingPdfBytes = new Uint8Array(this.result);
                pdfjsLib.getDocument({ data: existingPdfBytes }).promise.then((pdf) => {
                    pdfDoc = pdf;
                    numPages = pdf.numPages;
                    renderPDF();
                });
            };
            fileReader.readAsArrayBuffer(file);
        });

        // Add event listener to the "Add Text" button
        document.getElementById('addTextBtn').addEventListener('click', function() {
            isAddingText = !isAddingText; // Toggle add text mode
            if (isAddingText) {
                this.classList.add('active');
                document.body.style.cursor = 'crosshair'; // Change cursor
            } else {
                this.classList.remove('active');
                document.body.style.cursor = 'default';
            }
        });

        async function renderPDF() {
            pdfViewer.innerHTML = '';

            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                const page = await pdfDoc.getPage(pageNum);
                const viewport = page.getViewport({ scale: scale });
                pageViewports[pageNum] = viewport;

                const pageContainer = document.createElement('div');
                pageContainer.classList.add('page');
                pageContainer.style.width = `${viewport.width}px`;
                pageContainer.style.height = `${viewport.height}px`;
                pageContainer.style.position = 'relative';
                pageContainer.setAttribute('data-page-num', pageNum);
                pdfViewer.appendChild(pageContainer);

                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                canvas.style.position = 'absolute';
                canvas.style.left = '0';
                canvas.style.top = '0';
                pageContainer.appendChild(canvas);

                const renderContext = {
                    canvasContext: canvas.getContext('2d'),
                    viewport: viewport,
                };
                await page.render(renderContext).promise;

                // Update the click event listener
                pageContainer.addEventListener('click', (event) => {
                    if (isAddingText) {
                        createTextInput(event, pageContainer, pageNum);
                        isAddingText = false; // Reset add text mode after adding text
                        document.getElementById('addTextBtn').classList.remove('active');
                        document.body.style.cursor = 'default';
                    }
                });
            }
        }

        function createTextInput(event, pageContainer, pageNum) {
            event.stopPropagation();
            if (activeInput) {
                const pageNumInput = parseInt(activeInput.closest('.page').getAttribute('data-page-num'), 10);
                finalizeTextInput(activeInput, activeInput.closest('.page'), pageNumInput);
            }

            const input = document.createElement('input');
            input.type = 'text';
            input.classList.add('editInput');
            input.style.left = `${event.offsetX}px`;
            input.style.top = `${event.offsetY}px`;
            input.style.width = '150px';
            pageContainer.appendChild(input);
            input.focus();

            activeInput = input;
            activeTextBox = null; // Deselect any active text box
            showToolbar(event.pageX, event.pageY);

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    finalizeTextInput(input, pageContainer, pageNum);
                }
            });

            input.addEventListener('blur', () => {
                finalizeTextInput(input, pageContainer, pageNum);
            });
        }

        function finalizeTextInput(input, pageContainer, pageNum) {
            // Prevent multiple executions
            if (input.finalized) return;
            input.finalized = true;

            if (!input.value.trim()) {
                // Remove the text data from editedTexts if input is empty
                if (input.hasAttribute('data-id')) {
                    const idToRemove = input.getAttribute('data-id');
                    const indexToRemove = editedTexts.findIndex(t => t.id === idToRemove);
                    if (indexToRemove > -1) {
                        editedTexts.splice(indexToRemove, 1);
                    }
                }
                if (input.parentNode) input.remove();
                activeInput = null;
                hideToolbar();
                return;
            }

            const textDiv = document.createElement('div');
            let id;
            if (input.hasAttribute('data-id')) {
                // Editing existing text box
                id = input.getAttribute('data-id');
            } else {
                // Creating new text box
                id = 'text-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            }
            textDiv.setAttribute('data-id', id);
            textDiv.classList.add('text-box');
            textDiv.textContent = input.value;
            textDiv.style.left = input.style.left;
            textDiv.style.top = input.style.top;
            textDiv.style.position = 'absolute';
            textDiv.style.fontSize = input.style.fontSize || '12px';
            textDiv.style.fontFamily = input.style.fontFamily || 'Arial';
            textDiv.style.fontWeight = input.style.fontWeight || 'normal';
            textDiv.style.fontStyle = input.style.fontStyle || 'normal';
            textDiv.style.textDecoration = input.style.textDecoration || 'none';
            textDiv.style.cursor = 'move';
            pageContainer.appendChild(textDiv);

            const textData = {
                id: id,
                pageNum: pageNum,
                text: input.value,
                x: parseFloat(input.style.left),
                y: parseFloat(input.style.top),
                fontSize: parseFloat(input.style.fontSize || 12),
                fontFamily: input.style.fontFamily || 'Arial',
                fontWeight: input.style.fontWeight || 'normal',
                fontStyle: input.style.fontStyle || 'normal',
                textDecoration: input.style.textDecoration || 'none',
                viewportHeight: pageViewports[pageNum].height
            };

            // Update or add the text data in editedTexts
            const existingIndex = editedTexts.findIndex(t => t.id === id);
            if (existingIndex > -1) {
                // Update existing entry
                editedTexts[existingIndex] = textData;
            } else {
                // Add new entry
                editedTexts.push(textData);
            }

            if (input.parentNode) input.remove();
            activeInput = null;

            textDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                if (activeInput) {
                    const pageNumInput = parseInt(activeInput.closest('.page').getAttribute('data-page-num'), 10);
                    finalizeTextInput(activeInput, activeInput.closest('.page'), pageNumInput);
                }
                showTextInputForEditing(textDiv, pageNum);
            });

            makeElementDraggable(textDiv);

            activeTextBox = textDiv;
            showToolbar(parseInt(textDiv.style.left, 10), parseInt(textDiv.style.top, 10));
        }

        function showTextInputForEditing(textDiv, pageNum) {
            if (activeInput) {
                const pageNumInput = parseInt(activeInput.closest('.page').getAttribute('data-page-num'), 10);
                finalizeTextInput(activeInput, activeInput.closest('.page'), pageNumInput);
            }

            const pageContainer = textDiv.closest('.page');
            const input = document.createElement('input');
            input.type = 'text';
            input.classList.add('editInput');
            input.value = textDiv.textContent;
            input.style.left = textDiv.style.left;
            input.style.top = textDiv.style.top;
            input.style.width = '150px';
            input.style.fontSize = textDiv.style.fontSize;
            input.style.fontFamily = textDiv.style.fontFamily;
            input.style.fontWeight = textDiv.style.fontWeight;
            input.style.fontStyle = textDiv.style.fontStyle;
            input.style.textDecoration = textDiv.style.textDecoration;
            input.setAttribute('data-id', textDiv.getAttribute('data-id'));
            pageContainer.appendChild(input);
            input.focus();

            textDiv.remove();
            activeInput = input;
            activeTextBox = null; // Deselect any active text box
            showToolbar(parseInt(input.style.left, 10), parseInt(input.style.top, 10));

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    finalizeTextInput(input, pageContainer, pageNum);
                }
            });

            input.addEventListener('blur', () => {
                finalizeTextInput(input, pageContainer, pageNum);
            });
        }

        function makeElementDraggable(element) {
            element.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                isDragging = true;
                dragOffsetX = e.offsetX;
                dragOffsetY = e.offsetY;
                activeTextBox = element;
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });

            function onMouseMove(e) {
                if (isDragging) {
                    const pageRect = element.closest('.page').getBoundingClientRect();
                    const newX = e.pageX - pageRect.left - dragOffsetX;
                    const newY = e.pageY - pageRect.top - dragOffsetY;
                    element.style.left = `${newX}px`;
                    element.style.top = `${newY}px`;
                    // Update toolbar position
                    showToolbar(newX, newY);
                }
            }

            function onMouseUp() {
                isDragging = false;
                updateEditedTextPosition(element);
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }
        }

        function updateEditedTextPosition(element) {
            const id = element.getAttribute('data-id');
            const updatedText = editedTexts.find(t => t.id === id);
            if (updatedText) {
                updatedText.x = parseFloat(element.style.left);
                updatedText.y = parseFloat(element.style.top);
            }
        }

        document.getElementById('saveBtn').addEventListener('click', async () => {
            const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);

            for (const editedText of editedTexts) {
                const page = pdfDoc.getPage(editedText.pageNum - 1);
                const { x, y, fontSize, fontFamily, fontWeight, fontStyle, textDecoration, text, viewportHeight } = editedText;

                // Adjust coordinates for scaling
                const adjustedX = x / scale;
                const adjustedY = (viewportHeight / scale) - (y / scale) - fontSize;

                const font = await selectFont(pdfDoc, fontFamily, fontWeight, fontStyle);

                page.drawText(text, {
                    x: adjustedX,
                    y: adjustedY,
                    size: fontSize,
                    font: font,
                    color: PDFLib.rgb(0, 0, 0),
                });

                // Handle underline text decoration
                if (textDecoration === 'underline') {
                    const textWidth = font.widthOfTextAtSize(text, fontSize);
                    page.drawLine({
                        start: { x: adjustedX, y: adjustedY - 2 },
                        end: { x: adjustedX + textWidth, y: adjustedY - 2 },
                        thickness: 1,
                        color: PDFLib.rgb(0, 0, 0),
                    });
                }
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            window.open(url);
        });

        async function selectFont(pdfDoc, fontFamily, fontWeight, fontStyle) {
            let fontName;
            switch (fontFamily) {
                case 'Times New Roman':
                    if (fontWeight === 'bold' && fontStyle === 'italic') {
                        fontName = PDFLib.StandardFonts.TimesBoldItalic;
                    } else if (fontWeight === 'bold') {
                        fontName = PDFLib.StandardFonts.TimesBold;
                    } else if (fontStyle === 'italic') {
                        fontName = PDFLib.StandardFonts.TimesItalic;
                    } else {
                        fontName = PDFLib.StandardFonts.TimesRoman;
                    }
                    break;
                case 'Courier New':
                    if (fontWeight === 'bold' && fontStyle === 'italic') {
                        fontName = PDFLib.StandardFonts.CourierBoldOblique;
                    } else if (fontWeight === 'bold') {
                        fontName = PDFLib.StandardFonts.CourierBold;
                    } else if (fontStyle === 'italic') {
                        fontName = PDFLib.StandardFonts.CourierOblique;
                    } else {
                        fontName = PDFLib.StandardFonts.Courier;
                    }
                    break;
                default:
                    if (fontWeight === 'bold' && fontStyle === 'italic') {
                        fontName = PDFLib.StandardFonts.HelveticaBoldOblique;
                    } else if (fontWeight === 'bold') {
                        fontName = PDFLib.StandardFonts.HelveticaBold;
                    } else if (fontStyle === 'italic') {
                        fontName = PDFLib.StandardFonts.HelveticaOblique;
                    } else {
                        fontName = PDFLib.StandardFonts.Helvetica;
                    }
                    break;
            }
            return await pdfDoc.embedFont(fontName);
        }

        function showToolbar(x, y) {
            const toolbar = document.getElementById('toolbar');
            toolbar.style.left = `${x}px`;
            toolbar.style.top = `${y - 50}px`; // Adjusted for better positioning
            toolbar.style.display = 'block';

            const targetElement = activeTextBox || activeInput;

            if (targetElement) {
                document.getElementById('font-family').value = targetElement.style.fontFamily || 'Arial';
                document.getElementById('font-size').value = targetElement.style.fontSize || '12px';

                const boldBtn = document.getElementById('bold-btn');
                const italicBtn = document.getElementById('italic-btn');
                const underlineBtn = document.getElementById('underline-btn');

                if (targetElement.style.fontWeight === 'bold') {
                    boldBtn.classList.add('active');
                } else {
                    boldBtn.classList.remove('active');
                }

                if (targetElement.style.fontStyle === 'italic') {
                    italicBtn.classList.add('active');
                } else {
                    italicBtn.classList.remove('active');
                }

                if (targetElement.style.textDecoration === 'underline') {
                    underlineBtn.classList.add('active');
                } else {
                    underlineBtn.classList.remove('active');
                }
            }
        }

        document.getElementById('font-family').addEventListener('change', function (e) {
            e.stopPropagation();
            const targetElement = activeTextBox || activeInput;
            if (targetElement) {
                targetElement.style.fontFamily = this.value;
                if (activeTextBox) updateEditedTextFormatting();
                showToolbar(parseInt(targetElement.style.left), parseInt(targetElement.style.top));
            }
        });

        document.getElementById('font-size').addEventListener('change', function (e) {
            e.stopPropagation();
            const targetElement = activeTextBox || activeInput;
            if (targetElement) {
                targetElement.style.fontSize = this.value;
                if (activeTextBox) updateEditedTextFormatting();
                showToolbar(parseInt(targetElement.style.left), parseInt(targetElement.style.top));
            }
        });

        document.getElementById('bold-btn').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const targetElement = activeTextBox || activeInput;
            if (targetElement) {
                targetElement.style.fontWeight = targetElement.style.fontWeight === 'bold' ? 'normal' : 'bold';
                if (activeTextBox) updateEditedTextFormatting();
                showToolbar(parseInt(targetElement.style.left), parseInt(targetElement.style.top));
            }
        });

        document.getElementById('italic-btn').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const targetElement = activeTextBox || activeInput;
            if (targetElement) {
                targetElement.style.fontStyle = targetElement.style.fontStyle === 'italic' ? 'normal' : 'italic';
                if (activeTextBox) updateEditedTextFormatting();
                showToolbar(parseInt(targetElement.style.left), parseInt(targetElement.style.top));
            }
        });

        document.getElementById('underline-btn').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const targetElement = activeTextBox || activeInput;
            if (targetElement) {
                targetElement.style.textDecoration = targetElement.style.textDecoration === 'underline' ? 'none' : 'underline';
                if (activeTextBox) updateEditedTextFormatting();
                showToolbar(parseInt(targetElement.style.left), parseInt(targetElement.style.top));
            }
        });

        document.getElementById('delete-btn').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const targetElement = activeTextBox || activeInput;
            if (targetElement) {
                const id = targetElement.getAttribute('data-id');
                const textIndex = editedTexts.findIndex(t => t.id === id);
                if (textIndex > -1) {
                    editedTexts.splice(textIndex, 1);
                }
                if (targetElement.parentNode) targetElement.remove();
                activeTextBox = null;
                activeInput = null;
                hideToolbar();
            }
        });

        function hideToolbar() {
            const toolbar = document.getElementById('toolbar');
            toolbar.style.display = 'none';
        }

        function updateEditedTextFormatting() {
            if (activeTextBox) {
                const id = activeTextBox.getAttribute('data-id');
                const editedText = editedTexts.find(t => t.id === id);
                if (editedText) {
                    editedText.fontFamily = activeTextBox.style.fontFamily;
                    editedText.fontSize = parseFloat(activeTextBox.style.fontSize || 12);
                    editedText.fontWeight = activeTextBox.style.fontWeight || 'normal';
                    editedText.fontStyle = activeTextBox.style.fontStyle || 'normal';
                    editedText.textDecoration = activeTextBox.style.textDecoration || 'none';
                }
            }
        }

        // Hide toolbar when clicking outside
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.text-box') && !e.target.closest('#toolbar') && !e.target.closest('.editInput')) {
                if (activeInput) {
                    const pageNumInput = parseInt(activeInput.closest('.page').getAttribute('data-page-num'), 10);
                    finalizeTextInput(activeInput, activeInput.closest('.page'), pageNumInput);
                }
                hideToolbar();
                activeTextBox = null;
                activeInput = null;
            }
        });
    </script>
</body>
</html>
