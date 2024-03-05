const qr = require('qrcode');
const fs = require('fs');

const qrCodeMapping = {
  'uniqueId1': 'service1',
  // Add other mappings as needed
};

// Create the qrcodes directory if it doesn't exist
if (!fs.existsSync('./qrcodes')) {
  fs.mkdirSync('./qrcodes');
}

// Generate QR codes for each unique ID
for (const uniqueId in qrCodeMapping) {
  const serviceId = qrCodeMapping[uniqueId];
  const data = { uniqueId, serviceId };

  qr.toFile(`./qrcodes/${uniqueId}.png`, JSON.stringify(data), { type: 'png' }, (err) => {
    if (err) throw err;
    console.log(`QR code generated for ${uniqueId}`);
  });
}
