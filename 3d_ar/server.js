require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const UPLOADS_DIR = process.env.UPLOADS_DIR || "uploads";
const QR_CODES_DIR = process.env.QR_CODES_DIR || "qr_codes";
const SERVER_URL = process.env.SERVER_URL || `http://192.168.1.106:${PORT}`;

app.use(cors()); // Allow all origins
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/qr_codes", express.static(path.join(__dirname, "qr_codes")));

// Ensure upload directories exist
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);
if (!fs.existsSync(QR_CODES_DIR)) fs.mkdirSync(QR_CODES_DIR);

// Multer configuration for video uploads
const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});
const upload = multer({ storage });

// 📌 API: Upload Video & Generate QR Code
app.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const videoFilename = req.file.filename;
    const videoUrl = `${SERVER_URL}/uploads/${videoFilename}`;

    // Generate QR Code linking to the AR view page
    const qrFilename = `qr_${Date.now()}.png`;
    const qrFilePath = path.join(QR_CODES_DIR, qrFilename);
    const qrUrl = `${SERVER_URL}/qr_codes/${qrFilename}`;
    const viewUrl = `${SERVER_URL}/view-ar?video=${encodeURIComponent(
      videoUrl
    )}`;

    await QRCode.toFile(qrFilePath, viewUrl);

    res.json({ success: true, videoUrl, qrUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: "Upload failed", error });
  }
});

// 📌 API: Serve the AR View Page
app.get("/view-ar", (req, res) => {
  res.sendFile(path.join(__dirname, "public/view-ar.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
