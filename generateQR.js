const qr = require('qrcode');
const fs = require('fs');

// Get the unique ID from command-line arguments
const uniqueId = process.argv[2]; // Assuming unique ID is passed as the first command-line argument
//
//
// UPDATE
// UPDATE
// Manually enter the ngrok URL
const ngrokUrl = 'https://bb4a-164-153-54-188.ngrok-free.app';

// Construct the full URL using the ngrok URL and unique ID
const fullUrl = `${ngrokUrl}/${uniqueId}`;

// Generate QR code using the full URL
qr.toFile(`./qrcodes/${uniqueId}.png`, fullUrl, { type: 'png' }, (err) => {
  if (err) {
    console.error('Error generating QR code:', err);
    return;
  }
  console.log(`QR code generated for ${uniqueId}: ${fullUrl}`);
});
