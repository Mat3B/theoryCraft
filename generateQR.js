const qr = require('qrcode');
const fs = require('fs');

// Base URL for ngrok forwarding - replace this with your current ngrok URL
const ngrokBaseUrl = 'https://bd0e-198-21-200-63.ngrok-free.app';

const qrCodeMapping = {
  'uniqueId1': 'service1',
  'uniqueId2': 'service2',
  'uniqueId3': 'service3', // Add this line for service3
  // Add other mappings as needed
};


// Create the qrcodes directory if it doesn't exist
if (!fs.existsSync('./qrcodes')) {
  fs.mkdirSync('./qrcodes');
}

// Generate QR codes for each unique ID, including the ngrok URL
for (const uniqueId in qrCodeMapping) {
  const serviceId = qrCodeMapping[uniqueId];
  // Construct the full URL for each service using the ngrok base URL
  const fullUrl = `${ngrokBaseUrl}/${serviceId}`;

  qr.toFile(`./qrcodes/${uniqueId}.png`, fullUrl, { type: 'png' }, (err) => {
    if (err) throw err;
    console.log(`QR code generated for ${uniqueId}: ${fullUrl}`);
  });
}
