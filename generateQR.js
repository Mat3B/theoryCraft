const qr = require('qrcode');
const fs = require('fs');
const path = require('path');

// Get the unique ID from command-line arguments
const uniqueId = process.argv[2]; // Assuming unique ID is passed as the first command-line argument

// Manually enter the ngrok URL
const ngrokUrl = 'http://localhost:3000';

// Construct the full URL using the ngrok URL and unique ID
const fullUrl = `${ngrokUrl}/${uniqueId}`;

// Directory where the QR codes will be stored
const baseDir = '/Users/breland/Desktop/theoryCraft/uniqueId/qrcodes';

// Create the directory if it doesn't exist
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

// Generate QR code using the full URL
qr.toFile(path.join(baseDir, `${uniqueId}.png`), fullUrl, { type: 'png' }, (err) => {
  if (err) {
    console.error('Error generating QR code:', err);
    return;
  }
  console.log(`QR code generated for ${uniqueId}: ${fullUrl}`);
});
