
  let isDrawing = false;
  let drawingHistory = [];
  let redoHistory = [];
  let signatureColor = '#000000';
  let backgroundColor = '#ffffff';

  document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');

    // Event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);


    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);

    const signatureDisplay = document.querySelector(".signature_display");

    document.getElementById('undoBtn').addEventListener('click', undo);
    document.getElementById('redoBtn').addEventListener('click', redo);
    document.getElementById('clearBtn').addEventListener('click', clearCanvas);
    // document.getElementById('convertBtn').addEventListener('click', convertToImage);
    document.getElementById('backgroundColor').addEventListener('input', changeBackgroundColor);
    document.getElementById('signatureColor').addEventListener('input', changeSignatureColor);

    function startDrawing(e) {
      isDrawing = true;
      // context.beginPath();
      // context.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
      drawingHistory.push([]);
    }

    function draw(e) {
      if (!isDrawing) return;


      // const x = (e.clientX ?? e.touches[0].clientX) - canvas.offsetLeft;
      // const y = (e.clientY ?? e.touches[0].clientY) - canvas.offsetTop;

      const rect = canvas.getBoundingClientRect();

      // const x = (e.clientX ?? e.touches[0].clientX) - rect.left;
      // const y = (e.clientY ?? e.touches[0].clientY) - rect.top;

      const x = (e.clientX ?? e.touches[0].clientX) - canvas.offsetLeft;
      const y = (e.clientY ?? e.touches[0].clientY) - canvas.offsetTop;

      context.lineWidth = 2;
      context.lineCap = 'round';

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
      // image.src = canvas.toDataURL();
      // signatureDisplay.innerHTML = '';
      // signatureDisplay.appendChild(image);
      return  canvas.toDataURL();
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


    const convertToImageBtn = document.querySelector("#convertToImageBtn");
    convertToImageBtn.addEventListener("click", function(){
      const image = convertToImage();
      Swal.fire({
        html:`
        <img src='${image}' style='width: 100%;'>
        <button class="button-18" onclick="forceDownload('${image}');"> Download </button>
        `,
        showConfirmButton: false,
      });
    })



    const defaultColors = Array.from(document.querySelectorAll(".default-color"));

    defaultColors.map(_elem=>{

      _elem.addEventListener("click", function(){
        defaultColors.map(_el=>_el.classList.remove("active"));
        _elem.classList.add("active");
        const color = _elem.dataset.color;
        signatureColor = color;
        redrawCanvas();
      })
    })


  });

function forceDownload(link){
  const a = document.createElement("a");
  a.href = link;
  a.download = "e-Signature";
  a.click();


}
