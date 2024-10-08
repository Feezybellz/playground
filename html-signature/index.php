<?php
$default_colors = [
"#000000",
"#003eb0",
"#172a55",
"#6eaa4d",
"#c01900",
];


 ?>

<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title></title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <style media="screen">
    :root {
      --primary-color: #3498db;
    }
    /* CSS */
    .button-18 {
    align-items: center;
    background-color: #0A66C2;
    border: 0;
    border-radius: 100px;
    box-sizing: border-box;
    color: #ffffff;
    cursor: pointer;
    display: inline-flex;
    font-family: -apple-system, system-ui, system-ui, "Segoe UI", Roboto, "Helvetica Neue", "Fira Sans", Ubuntu, Oxygen, "Oxygen Sans", Cantarell, "Droid Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Lucida Grande", Helvetica, Arial, sans-serif;
    font-size: 16px;
    font-weight: 600;
    justify-content: center;
    line-height: 20px;
    max-width: 480px;
    min-height: 40px;
    min-width: 0px;
    overflow: hidden;
    padding: 0px;
    padding-left: 20px;
    padding-right: 20px;
    text-align: center;
    touch-action: manipulation;
    transition: background-color 0.167s cubic-bezier(0.4, 0, 0.2, 1) 0s, box-shadow 0.167s cubic-bezier(0.4, 0, 0.2, 1) 0s, color 0.167s cubic-bezier(0.4, 0, 0.2, 1) 0s;
    user-select: none;
    -webkit-user-select: none;
    vertical-align: middle;
    }
    .button-18.secondary,.button-18.secondary:hover,
    .button-18.secondary:focus  {
      color: #0A66C2;
      background-color: #ffffff;
      border: 1px solid #0A66C2;
    }


    .button-18:hover,
    .button-18:focus {
    background-color: #ffffff;
    color: #0A66C2;
    border: 1px solid #0A66C2;
    }



    /* .button-18:active {
    background: #09223b;
    color: rgb(255, 255, 255, .7);
    } */

    .button-18:disabled {
    cursor: not-allowed;
    background: rgba(0, 0, 0, .08);
    color: rgba(0, 0, 0, .3);
    }

    input[type="color"], .default-color {
    	-webkit-appearance: none;
    	border: none;
      border-radius: 50%;
    	width: 30px;
    	height: 30px;
      display: inline-block ;
      overflow: hidden;
      margin: 0 2px;
      cursor: pointer;
    }
    .display-important{
      display: var(--display) !important;
    }
    input[type="color"]::-webkit-color-swatch-wrapper {
    	padding: 0;
    }
    input[type="color"]::-webkit-color-swatch {
    	border: none;
    }
    #signatureColor{
      border: 1px solid #000;
    }

    .default-color.active{
        border: 3px solid var(--primary-color);
    }
    .draw-field {
      /* margin: ; */
      padding: 20px 50px ;
    }
    </style>
  </head>
  <body>
    <main class="modal-parent">
      <!-- <section class="back-section">
        <a class="back-link" href="/online-signature/">Go back</a>
      </section> -->

      <article style="margin-top: 50px;">
        <div class="wrap">
          <h1 style="color: #000;">Draw your signature</h1>
          <!-- <div class="draw-field"> -->
            <canvas class="writing-line" id="ccanvas_signature" width="767" style="touch-action: nnone;" height="276"></canvas>
          <!-- </div> -->
          <div class="signature_display">

          </div>
          <div class="draw-controls">
            <!-- <div class="range-control" style="display:none">
              <span class="control-label">Smoothing</span>
              <div class="slider slider-horizontal" id="" style="margin-bottom: 0px;">
                <div class="slider-track">
                  <div class="slider-track-low" style="left: 0px; width: 0%;"></div>
                  <div class="slider-selection tick-slider-selection" style="left: 0%; width: 50%;"></div>
                  <div class="slider-track-high" style="right: 0px; width: 50%;"></div></div>
                  <div class="tooltip tooltip-main top hide" role="presentation" style="left: 50%;">
                    <div class="tooltip-arrow"></div>
                    <div class="tooltip-inner">3</div></div>
                    <div class="tooltip tooltip-min top hide" role="presentation"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div><div class="tooltip tooltip-max top hide" role="presentation"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div><div class="slider-tick-label-container" style="margin-left: 0px;"><div class="slider-tick-label label-in-selection" style="width: 0px;">Less <br> smooth</div><div class="slider-tick-label label-in-selection label-is-selection" style="width: 0px;">Default</div><div class="slider-tick-label" style="width: 0px;">More <br> smooth</div></div><div class="slider-tick-container"><div class="slider-tick round in-selection" style="left: 0%;"></div><div class="slider-tick round in-selection" style="left: 50%;"></div><div class="slider-tick round" style="left: 100%;"></div></div><div class="slider-handle min-slider-handle round" role="slider" aria-valuemin="2" aria-valuemax="4" aria-valuenow="3" tabindex="0" style="left: 50%;"></div><div class="slider-handle max-slider-handle round hide" role="slider" aria-valuemin="2" aria-valuemax="4" aria-valuenow="2" style="left: 0%;" tabindex="0"></div></div><input type="text" class="range-slider" data-slider-min="2" data-slider-max="4" data-slider-step="1" data-slider-value="3" data-slider-tooltip="hide" data-slider-ticks="[2, 3, 4]" data-slider-ticks-labels="[&quot;Less <br/> smooth&quot;, &quot;Default&quot;, &quot;More <br/> smooth&quot;]" style="display: none;" data-value="3" value="3">
            </div> -->
            <div class="" style="display: block; width: 100%; margin-bottom: 15px;">
              <img id="undoBtn" src="undo.svg" alt="" style="width: 35px;">
              <img id="redoBtn" src="redo.svg" alt="" style="width: 35px;">
            </div>
            <div class="color-controls">


              <span class="control-label">Color</span>
              <?php foreach ($default_colors as $key => $value){?>

                <div class="default-color <?= ($key == 0) ? "active" : "" ?>" data-color="<?=$value?>" style="background-color: <?=$value?>"></div>
              <?php }; ?>



              <input id="backgroundColor" type="color" name="color" value="#000000" style="display: none;">
              <input id="signatureColor" type="color" name="color" value="#000000" class="display-important" style="--display: inline-block;">


              <!-- <div class="sp-replacer sp-light color-item">
                <div class="sp-preview">
                  <div class="sp-preview-inner" style="background-color: rgb(81, 183, 197);"></div>
                </div>
                <div class="sp-dd">▼</div>
              </div> -->
            </div>
            <div class="button-controls">

              <button class="button-18 btn-default" id="convertToImageBtn">Convert to Image</button>
              <button class="button-18 secondary btn-default transparent" id="clearBtn">Clear</button>
            </div>
          </div>

        </div>
      </article>


    </main>

    <script type="text/javascript" src="script.js" charset="utf-8"></script>

  </body>
</html>


<!-- <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Online Signature</title>
  <style>
    #canvas {
      border: 1px solid #000;
    }
  </style>
</head>
<body>
  <canvas id="canvas" width="400" height="200"></canvas>
  <div>
    <button id="undoBtn">Undo</button>
    <button id="redoBtn">Redo</button>
    <button id="clearBtn">Clear</button>
    <button id="convertBtn">Convert to Image</button>
    <label for="backgroundColor">Background Color:</label>
    <input type="color" id="backgroundColor" value="#ffffff">
    <label for="signatureColor">Signature Color:</label>
    <input type="color" id="signatureColor" value="#000000">
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', function () {
      const canvas = document.getElementById('canvas');
      const context = canvas.getContext('2d');
      let isDrawing = false;
      let drawingHistory = [];
      let redoHistory = [];
      let signatureColor = '#000000';
      let backgroundColor = '#ffffff';

      // Event listeners
      canvas.addEventListener('mousedown', startDrawing);
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', stopDrawing);
      canvas.addEventListener('mouseout', stopDrawing);

      document.getElementById('undoBtn').addEventListener('click', undo);
      document.getElementById('redoBtn').addEventListener('click', redo);
      document.getElementById('clearBtn').addEventListener('click', clearCanvas);
      document.getElementById('convertBtn').addEventListener('click', convertToImage);
      document.getElementById('backgroundColor').addEventListener('input', changeBackgroundColor);
      document.getElementById('signatureColor').addEventListener('input', changeSignatureColor);

      function startDrawing(e) {
        isDrawing = true;
        context.beginPath();
        context.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        drawingHistory.push([]);
      }

      function draw(e) {
        if (!isDrawing) return;

        const x = e.clientX - canvas.offsetLeft;
        const y = e.clientY - canvas.offsetTop;

        context.lineTo(x, y);
        context.strokeStyle = signatureColor;
        context.stroke();

        drawingHistory[drawingHistory.length - 1].push({ x, y });

        redoHistory = [];
      }

      function stopDrawing() {
        isDrawing = false;
        context.beginPath();
      }

      function undo() {
        if (drawingHistory.length > 1) {
          redoHistory.push({ paths: drawingHistory.pop(), backgroundColor: backgroundColor });
          redrawCanvas();
        } else {
          clearCanvas();
        }
      }

      function redo() {
        if (redoHistory.length > 0) {
          const { paths, backgroundColor: prevBgColor } = redoHistory.pop();
          drawingHistory.push(paths);
          backgroundColor = prevBgColor;
          console.log(backgroundColor);
          redrawCanvas();
        }
      }

      function clearCanvas() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        // drawingHistory = [];
        // redoHistory = [];
        backgroundColor = '#ffffff';
      }

      function convertToImage() {
        const image = new Image();
        image.src = canvas.toDataURL();
        document.body.appendChild(image);
      }

      function changeBackgroundColor() {
        backgroundColor = document.getElementById('backgroundColor').value;
        redrawCanvas();
      }

      function changeSignatureColor() {
        signatureColor = document.getElementById('signatureColor').value;
        redrawCanvas();
      }

      function redrawCanvas() {
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, canvas.width, canvas.height);

        drawingHistory.forEach(path => {
          context.beginPath();
          context.moveTo(path[0].x, path[0].y);

          for (let i = 1; i < path.length; i++) {
            context.lineTo(path[i].x, path[i].y);
          }

          context.strokeStyle = signatureColor;
          context.stroke();
        });
      }
    });
  </script>
</body>
</html> -->
