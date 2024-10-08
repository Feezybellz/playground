<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>PDF Editor with Tooltip Toolbar and Preview</title>
    <style>
        #pdfViewer {
            width: 100%;
            height: 800px;
            border: 1px solid black;
        }
        .text-box {
            position: absolute;
            border: 1px dashed #000;
            background-color: rgba(255, 255, 255, 0.8);
            padding: 5px;
            cursor: move;
            min-width: 50px;
        }
        .signature-box {
            position: absolute;
            border: 1px dashed #000;
            padding: 5px;
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
        #addTextBtn.active, #addSignatureBtn.active {
            background-color: #ddd;
        }
    </style>
</head>
<body>
    <h1>PDF Editor with Tooltip Toolbar and Preview</h1>

    <input type="file" id="upload" accept="application/pdf"/>
    <button id="addTextBtn">Add Text</button>
    <button id="addSignatureBtn">Add Signature</button>
    <button id="saveBtn">Preview PDF</button>
    <iframe id="pdfViewer"></iframe>

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

    <script src="https://unpkg.com/pdf-lib/dist/pdf-lib.min.js"></script>
    <script>
        let existingPdfBytes;
        let pdfDoc = null;
        let editedTexts = [];
        let signatures = [];
        let activeInput = null;
        let isAddingText = false;
        let isAddingSignature = false;

        // Function to Load and Render PDF
        async function loadPDF() {
            try {
                pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
                const pdfBytes = await pdfDoc.save(); // Save the document to get the current state

                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);

                const pdfViewer = document.getElementById('pdfViewer');
                pdfViewer.src = url;

                // Revoke URL after a short delay to release memory
                setTimeout(() => URL.revokeObjectURL(url), 1000);
            } catch (error) {
                console.error('Error loading PDF:', error);
                alert('An error occurred while loading the PDF.');
            }
        }

        // Handle PDF Upload
        document.getElementById('upload').addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (file && file.type === 'application/pdf') {
                const reader = new FileReader();
                reader.onload = async function() {
                    existingPdfBytes = new Uint8Array(this.result);
                    await loadPDF(); // Load and display the uploaded PDF
                };
                reader.readAsArrayBuffer(file);
            } else {
                alert('Please upload a valid PDF file.');
            }
        });

        // Add Text Button Toggle
        document.getElementById('addTextBtn').addEventListener('click', (e) => {
            isAddingText = !isAddingText;
            isAddingSignature = false;
            e.target.classList.toggle('active', isAddingText);
            document.getElementById('addSignatureBtn').classList.remove('active');
        });

        // Add Signature Button Toggle
        document.getElementById('addSignatureBtn').addEventListener('click', (e) => {
            isAddingSignature = !isAddingSignature;
            isAddingText = false;
            e.target.classList.toggle('active', isAddingSignature);
            document.getElementById('addTextBtn').classList.remove('active');
        });

        // Detect PDF Viewer Clicks for Adding Text or Signature
        document.getElementById('pdfViewer').addEventListener('click', (e) => {
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (isAddingText) {
                createTextInput(x, y);
                isAddingText = false;
                document.getElementById('addTextBtn').classList.remove('active');
            }

            if (isAddingSignature) {
                createSignatureInput(x, y);
                isAddingSignature = false;
                document.getElementById('addSignatureBtn').classList.remove('active');
            }
        });

        // Create a Text Input at Given Position
        function createTextInput(x, y) {
            const input = document.createElement('input');
            input.type = 'text';
            input.classList.add('text-box');
            input.style.left = `${x}px`;
            input.style.top = `${y}px`;
            input.style.position = 'absolute';
            input.style.fontSize = '12px';
            input.style.fontFamily = 'Arial';
            document.body.appendChild(input);
            input.focus();

            activeInput = input;

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    finalizeTextInput(input);
                }
            });
        }

        // Finalize Text Input and Store in editedTexts
        function finalizeTextInput(input) {
            if (!input.value.trim()) {
                input.remove();
                return;
            }

            const textData = {
                id: 'text-' + Date.now(),
                text: input.value,
                x: parseFloat(input.style.left),
                y: parseFloat(input.style.top),
                fontSize: parseFloat(input.style.fontSize || 12),
                fontFamily: input.style.fontFamily || 'Arial',
                fontWeight: 'normal',
                fontStyle: 'normal',
                textDecoration: 'none',
                pageNum: 1 // You can adjust this to track specific page numbers if necessary
            };

            editedTexts.push(textData);
            input.remove();
        }

        // Create a Signature Input at Given Position
        function createSignatureInput(x, y) {
            const input = document.createElement('div');
            input.classList.add('signature-box');
            input.style.left = `${x}px`;
            input.style.top = `${y}px`;
            input.style.width = '100px';
            input.style.height = '50px';
            input.style.position = 'absolute';
            input.style.border = '1px dashed #000';
            input.style.backgroundColor = '#fff';
            input.textContent = 'Signature Here';
            document.body.appendChild(input);

            signatures.push({
                id: 'sig-' + Date.now(),
                x: x,
                y: y,
                width: 100,
                height: 50,
                pageNum: 1 // You can adjust this to track specific page numbers if necessary
            });
        }

        // Preview the PDF with edited text and signature
        document.getElementById('saveBtn').addEventListener('click', async () => {
            if (!pdfDoc) {
                alert('Please upload a PDF first.');
                return;
            }

            try {
                // Iterate through all edited texts and signatures to embed them into the PDF
                for (const editedText of editedTexts) {
                    const page = pdfDoc.getPage(editedText.pageNum - 1);
                    const { x, y, fontSize, fontFamily, text } = editedText;

                    // Adjust coordinates for PDFLib (origin at bottom-left)
                    const adjustedX = x;
                    const adjustedY = page.getHeight() - y - fontSize;

                    const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);

                    // Draw the text
                    page.drawText(text, {
                        x: adjustedX,
                        y: adjustedY,
                        size: fontSize,
                        font: font,
                        color: PDFLib.rgb(0, 0, 0),
                    });
                }

                // Iterate through all signatures to embed them into the PDF
                for (const sig of signatures) {
                    const page = pdfDoc.getPage(sig.pageNum - 1);

                    // Draw a rectangle where the signature would be placed (you can replace this with actual signature image embedding)
                    page.drawRectangle({
                        x: sig.x,
                        y: page.getHeight() - sig.y - sig.height,
                        width: sig.width,
                        height: sig.height,
                        borderColor: PDFLib.rgb(0, 0, 0),
                        borderWidth: 1,
                    });
                }

                const pdfBytes = await pdfDoc.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);

                // Open the PDF preview in the iframe
                document.getElementById('pdfViewer').src = url;

                // Revoke URL after a short delay to release memory
                setTimeout(() => URL.revokeObjectURL(url), 1000);
            } catch (error) {
                console.error('Error generating preview PDF:', error);
                alert('An error occurred while generating the preview PDF.');
            }
        });
    </script>
</body>
</html>
