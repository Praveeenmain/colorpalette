const express = require('express');
const multer = require('multer');
const path = require('path');
const { spawn } = require('child_process');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS for frontend to access backend
app.use(cors());

// Set up file storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store uploads in 'uploads/' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage: storage });

// Endpoint to upload image and get dominant colors
app.post('/upload', upload.single('image'), (req, res) => {
  const imagePath = path.join(__dirname, 'uploads', req.file.filename);

  // Specify the path to the Python script
  const pythonScriptPath = path.join(__dirname, '../python-ml/color_extractor.py');

  // Spawn a new Python process with the correct interpreter
 const pythonProcess = spawn('python3', [pythonScriptPath, imagePath, '5']);
; // 5 is the number of colors

  // Collect the output from the Python script
  let output = '';
  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  // Handle errors
  pythonProcess.stderr.on('data', (data) => {
    console.error(`Error: ${data.toString()}`);
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).send({ error: 'Error extracting colors' });
    }

    // Parse the output and send it back as a JSON response
    const colors = JSON.parse(output);
    res.json({ colors });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Backend is running on http://localhost:${port}`);
});
