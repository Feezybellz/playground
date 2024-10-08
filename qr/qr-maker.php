<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QR Code with Watermark</title>
    <!-- <script src="https://cdn.jsdelivr.net/qrious/4.0.2/qrious.min.js"></script> -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js" integrity="sha512-pUhApVQtLbnpLtJn6DuzDD5o2xtmLJnJ7oBoMsBnzOkVkpqofGLGPaBJ6ayD2zQe3lCgCibhJBi4cj5wAxwVKA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
</head>
<body>

<div id="qrcode"></div>

<script>
    // Function to create QR code with watermark
    function generateQRCodeWithWatermark(element, text, size = 200, logoSrc = false, logoSize = 100) {
        const qrElem = document.createElement('div');

        const qr = new QRious({
            element: qrElem,
            size: size,
            value: text
        });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.height = size;


        if (logoSrc != false) {
          const img = new Image();
          img.src = logoSrc;
          logoSize = logoSize/100 * size;

          img.onload = function() {
            // Draw QR code
            console.log(qr);
            ctx.drawImage(qr.canvas, 0, 0, size, size);

            // Draw watermark logo
            // const logoSize = logoSize; // Adjust the size of the watermark logo
            const logoX = (size - logoSize) / 2;
            const logoY = (size - logoSize) / 2;
            ctx.drawImage(img, logoX, logoY, logoSize, logoSize);

            // Set the QR code with watermark as the background of the original QR code
            qr.canvas.getContext('2d').drawImage(canvas, 0, 0, size, size);
          };
        }else{
          ctx.drawImage(qr.canvas, 0, 0, size, size);
        }

        element.appendChild(canvas);
    }

    // Example usage
    generateQRCodeWithWatermark(document.querySelector("#qrcode"), 'https://locanse.com', 200, 'logo2.png', 30);
</script>

</body>
</html>
