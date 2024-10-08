<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>PDF Editor with Font Selection in Tooltip</title>
    <style>
        /* Styles for the PDF viewer and toolbar */
        #pdfViewer {
            position: relative;
            width: 100%;
            height: auto;
        }
        .page {
            position: relative;
            margin-bottom: 20px;
            border: 1px solid #ccc;
        }
        .text-item {
            position: absolute;
            cursor: text;
            white-space: pre;
        }
        .text-item.selected {
            outline: 1px dashed #000;
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
        .toolbar-btn.active {
            background-color: #ddd;
        }
        #addTextBtn {
            margin-bottom: 10px;
        }
        #addTextBtn.active {
            background-color: #ddd;
        }
    </style>
</head>
<body>

    <h1>PDF Editor with Font Selection in Tooltip</h1>

    <input type="file" id="upload" accept="application/pdf"/>
    <button id="addTextBtn">Add Text</button>
    <button id="saveBtn">Save PDF</button>
    <div id="pdfViewer"></div>

    <!-- Toolbar with font selection -->
    <div id="toolbar">
        <select id="font-family" class="toolbar-btn">
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <!-- Add custom fonts if needed -->
            <!-- <option value="CustomFontRegular">Custom Font</option> -->
        </select>
        <button id="bold-btn" class="toolbar-btn">B</button>
        <button id="italic-btn" class="toolbar-btn">I</button>
        <button id="underline-btn" class="toolbar-btn">U</button>
        <button id="delete-btn" class="toolbar-btn" style="color:red;">Delete</button>
    </div>

    <!-- Include PDF.js and pdf-lib -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js"></script>
    <script src="https://unpkg.com/pdf-lib/dist/pdf-lib.min.js"></script>

    <script>
        const pdfjsLib = window['pdfjsLib'];
        pdfjsLib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js';

        let pdfDoc = null;
        let pdfBytes = null;
        let pdfViewer = document.getElementById('pdfViewer');
        let textItems = [];
        let selectedTextItem = null;
        let addTextMode = false;

        // Variables to hold custom font bytes
        const customFontBytes = {};
        const fontCache = {};

        // Load custom fonts if needed
        async function loadCustomFonts() {
            // Provide the URLs to your font files
            // Uncomment and update the paths if you have custom fonts
            /*
            const fontUrls = {
                'CustomFontRegular': 'path/to/CustomFont-Regular.ttf',
                'CustomFontBold': 'path/to/CustomFont-Bold.ttf',
                // Add more custom fonts if necessary
            };

            for (const [fontName, fontUrl] of Object.entries(fontUrls)) {
                const response = await fetch(fontUrl);
                const fontData = await response.arrayBuffer();
                customFontBytes[fontName] = fontData;
            }
            */
        }

        // Call loadCustomFonts when the page loads
        loadCustomFonts();

        document.getElementById('upload').addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file.type !== 'application/pdf') {
                alert('Please upload a PDF file.');
                return;
            }
            const fileReader = new FileReader();
            fileReader.onload = function () {
                pdfBytes = new Uint8Array(this.result);
                loadAndRenderPDF(pdfBytes);
            };
            fileReader.readAsArrayBuffer(file);
        });

        document.getElementById('addTextBtn').addEventListener('click', (e) => {
            addTextMode = !addTextMode;
            e.target.classList.toggle('active', addTextMode);
        });

        async function loadAndRenderPDF(data) {
            const loadingTask = pdfjsLib.getDocument({ data: data });
            const pdf = await loadingTask.promise;
            pdfDoc = pdf;

            pdfViewer.innerHTML = '';
            textItems = []; // Reset text items

            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const viewport = page.getViewport({ scale: 2 }); // Scale up for better quality

                // Render page to image
                const pageImageData = await renderPageToImage(page, viewport);

                // Create page container
                const pageContainer = document.createElement('div');
                pageContainer.classList.add('page');
                pageContainer.style.width = `${viewport.width}px`;
                pageContainer.style.height = `${viewport.height}px`;
                pageContainer.setAttribute('data-page-num', pageNum);
                pdfViewer.appendChild(pageContainer);

                // Set background image
                pageContainer.style.backgroundImage = `url(${pageImageData})`;
                pageContainer.style.backgroundSize = '100% 100%';

                // Extract text items
                const items = await extractTextItems(page, viewport, pageNum);
                textItems.push(...items);

                // Add text items to page container
                items.forEach(item => {
                    const div = document.createElement('div');
                    div.classList.add('text-item');
                    div.textContent = item.text;
                    div.style.left = `${item.x}px`;
                    div.style.top = `${item.y}px`;
                    div.style.fontSize = `${item.fontSize}px`;
                    div.style.fontFamily = item.fontFamily;
                    div.style.color = 'black';
                    div.style.fontWeight = item.fontWeight;
                    div.style.fontStyle = item.fontStyle;
                    div.style.textDecoration = item.textDecoration;
                    pageContainer.appendChild(div);

                    // Link the div to the item
                    item.div = div;

                    // Add event listeners for editing
                    div.addEventListener('click', (e) => {
                        e.stopPropagation();
                        selectTextItem(div, item);
                    });
                });

                // Add click event for adding new text
                pageContainer.addEventListener('click', (e) => {
                    if (addTextMode) {
                        const rect = e.target.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        createNewTextItem(x, y, pageNum, pageContainer);
                    }
                });
            }

            // Click outside to deselect text item
            document.addEventListener('click', (e) => {
                if (!e.target.classList.contains('text-item') && !e.target.closest('#toolbar')) {
                    deselectTextItem();
                }
            });
        }

        async function renderPageToImage(page, viewport) {
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const context = canvas.getContext('2d');

            await page.render({ canvasContext: context, viewport: viewport }).promise;

            return canvas.toDataURL('image/png');
        }

        async function extractTextItems(page, viewport, pageNum) {
            const textContent = await page.getTextContent();
            const items = textContent.items.map(item => {
                const transform = pdfjsLib.Util.transform(
                    pdfjsLib.Util.transform(viewport.transform, item.transform),
                    [1, 0, 0, -1, 0, 0]
                );
                const x = transform[4];
                const y = transform[5];
                const fontSize = item.height * viewport.scale;
                return {
                    text: item.str,
                    x: x,
                    y: y - fontSize,
                    fontSize: fontSize,
                    fontFamily: item.fontName.includes('Times') ? 'Times New Roman' :
                                item.fontName.includes('Courier') ? 'Courier New' :
                                'Helvetica', // Default to Helvetica
                    fontWeight: 'normal',
                    fontStyle: 'normal',
                    textDecoration: 'none',
                    pageNum: pageNum
                };
            });
            return items;
        }

        function selectTextItem(div, item) {
            deselectTextItem();
            selectedTextItem = { div: div, item: item };
            div.classList.add('selected');
            showToolbar(div);
        }

        function deselectTextItem() {
            if (selectedTextItem) {
                selectedTextItem.div.classList.remove('selected');
                selectedTextItem = null;
                hideToolbar();
            }
        }

        function showToolbar(targetElement) {
            const toolbar = document.getElementById('toolbar');
            const rect = targetElement.getBoundingClientRect();
            toolbar.style.left = `${rect.left}px`;
            toolbar.style.top = `${rect.top - 40}px`;
            toolbar.style.display = 'block';

            // Update toolbar button states
            const boldBtn = document.getElementById('bold-btn');
            const italicBtn = document.getElementById('italic-btn');
            const underlineBtn = document.getElementById('underline-btn');
            const fontFamilySelect = document.getElementById('font-family');

            boldBtn.classList.toggle('active', targetElement.style.fontWeight === 'bold');
            italicBtn.classList.toggle('active', targetElement.style.fontStyle === 'italic');
            underlineBtn.classList.toggle('active', targetElement.style.textDecoration === 'underline');

            // Update font family selection
            fontFamilySelect.value = targetElement.style.fontFamily || 'Helvetica';
        }

        function hideToolbar() {
            const toolbar = document.getElementById('toolbar');
            toolbar.style.display = 'none';
        }

        // Toolbar button event listeners
        document.getElementById('bold-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            if (selectedTextItem) {
                const isBold = selectedTextItem.div.style.fontWeight === 'bold';
                selectedTextItem.div.style.fontWeight = isBold ? 'normal' : 'bold';
                selectedTextItem.item.fontWeight = selectedTextItem.div.style.fontWeight;
                e.target.classList.toggle('active', !isBold);
            }
        });

        document.getElementById('italic-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            if (selectedTextItem) {
                const isItalic = selectedTextItem.div.style.fontStyle === 'italic';
                selectedTextItem.div.style.fontStyle = isItalic ? 'normal' : 'italic';
                selectedTextItem.item.fontStyle = selectedTextItem.div.style.fontStyle;
                e.target.classList.toggle('active', !isItalic);
            }
        });

        document.getElementById('underline-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            if (selectedTextItem) {
                const isUnderline = selectedTextItem.div.style.textDecoration === 'underline';
                selectedTextItem.div.style.textDecoration = isUnderline ? 'none' : 'underline';
                selectedTextItem.item.textDecoration = selectedTextItem.div.style.textDecoration;
                e.target.classList.toggle('active', !isUnderline);
            }
        });

        document.getElementById('delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            if (selectedTextItem) {
                selectedTextItem.div.remove();
                // Remove from textItems array
                const index = textItems.indexOf(selectedTextItem.item);
                if (index > -1) {
                    textItems.splice(index, 1);
                }
                deselectTextItem();
            }
        });

        // Font family selection event listener
        document.getElementById('font-family').addEventListener('change', function (e) {
            e.stopPropagation();
            if (selectedTextItem) {
                const newFontFamily = this.value;
                selectedTextItem.div.style.fontFamily = newFontFamily;
                selectedTextItem.item.fontFamily = newFontFamily;
            }
        });

        // Make text items editable
        pdfViewer.addEventListener('dblclick', (e) => {
            if (e.target.classList.contains('text-item')) {
                const div = e.target;
                const item = textItems.find(t => t.div === div);
                const input = document.createElement('input');
                input.type = 'text';
                input.value = div.textContent;
                input.style.position = 'absolute';
                input.style.left = div.style.left;
                input.style.top = div.style.top;
                input.style.fontSize = div.style.fontSize;
                input.style.fontFamily = div.style.fontFamily;
                input.style.fontWeight = div.style.fontWeight;
                input.style.fontStyle = div.style.fontStyle;
                input.style.textDecoration = div.style.textDecoration;
                input.style.border = '1px solid #000';
                input.style.padding = '0';
                input.style.margin = '0';
                input.style.boxSizing = 'border-box';
                input.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                div.parentNode.appendChild(input);
                div.style.display = 'none';
                input.focus();

                input.addEventListener('blur', () => {
                    div.textContent = input.value;
                    div.style.display = 'block';
                    div.parentNode.removeChild(input);
                    item.text = input.value;
                });
            }
        });

        // Create new text item
        function createNewTextItem(x, y, pageNum, pageContainer) {
            const defaultFontSize = 16;
            const item = {
                text: 'New Text',
                x: x,
                y: y,
                fontSize: defaultFontSize,
                fontFamily: 'Helvetica',
                fontWeight: 'normal',
                fontStyle: 'normal',
                textDecoration: 'none',
                pageNum: pageNum
            };
            textItems.push(item);

            const div = document.createElement('div');
            div.classList.add('text-item');
            div.textContent = item.text;
            div.style.left = `${item.x}px`;
            div.style.top = `${item.y}px`;
            div.style.fontSize = `${item.fontSize}px`;
            div.style.fontFamily = item.fontFamily;
            div.style.color = 'black';
            div.style.fontWeight = item.fontWeight;
            div.style.fontStyle = item.fontStyle;
            div.style.textDecoration = item.textDecoration;
            pageContainer.appendChild(div);

            // Link the div to the item
            item.div = div;

            // Add event listeners for editing
            div.addEventListener('click', (e) => {
                e.stopPropagation();
                selectTextItem(div, item);
            });

            // Simulate double-click to edit the new text
            div.dispatchEvent(new Event('dblclick'));

            // Exit add text mode
            addTextMode = false;
            document.getElementById('addTextBtn').classList.remove('active');
        }

        // Save PDF
        document.getElementById('saveBtn').addEventListener('click', async () => {
            // Load the original PDF document
            const existingPdfDoc = await PDFLib.PDFDocument.load(pdfBytes);

            const numPages = existingPdfDoc.getPageCount();

            // Create a font cache to prevent redundant embedding
            const embeddedFonts = {};

            for (let pageNum = 0; pageNum < numPages; pageNum++) {
                // Get the page
                const page = existingPdfDoc.getPage(pageNum);
                const { width, height } = page.getSize();

                // Get text items for this page
                const items = textItems.filter(item => item.pageNum === pageNum + 1);

                for (const item of items) {
                    // Calculate positions
                    const x = item.x / 2;
                    const y = (height - item.y) / 2 - item.fontSize / 2;

                    // Get the font
                    const font = await selectFont(existingPdfDoc, item.fontFamily, item.fontWeight, item.fontStyle, embeddedFonts);

                    page.drawText(item.text, {
                        x: x,
                        y: y,
                        size: item.fontSize / 2,
                        font: font,
                        color: PDFLib.rgb(0, 0, 0),
                    });

                    // Handle underline
                    if (item.textDecoration === 'underline') {
                        const textWidth = font.widthOfTextAtSize(item.text, item.fontSize / 2);
                        page.drawLine({
                            start: { x: x, y: y - 2 },
                            end: { x: x + textWidth, y: y - 2 },
                            thickness: 1,
                            color: PDFLib.rgb(0, 0, 0),
                        });
                    }
                }
            }

            const pdfBytesNew = await existingPdfDoc.save();
            const blob = new Blob([pdfBytesNew], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            console.log('Generated PDF URL:', url);
            window.open(url);
        });

        async function selectFont(pdfDoc, fontFamily, fontWeight, fontStyle, embeddedFonts) {
            let fontName;

            // Map CSS font family names to PDF standard font names
            let fontFamilyKey = fontFamily;
            if (fontFamily === 'Times New Roman') fontFamilyKey = 'Times Roman';
            if (fontFamily === 'Courier New') fontFamilyKey = 'Courier';

            // Check if font is already embedded
            const fontKey = `${fontFamilyKey}-${fontWeight}-${fontStyle}`;
            if (embeddedFonts[fontKey]) {
                return embeddedFonts[fontKey];
            }

            // Handle standard fonts
            switch (fontFamilyKey) {
                case 'Times Roman':
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
                case 'Courier':
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
                default: // Helvetica
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

            // Embed the font and store it in the cache
            const font = await pdfDoc.embedFont(fontName);
            embeddedFonts[fontKey] = font;
            return font;
        }
    </script>
</body>
</html>
