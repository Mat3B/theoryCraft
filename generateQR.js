const qr = require('qrcode');
const fs = require('fs');
const path = require('path');
const db = require('./database');  // Adjust the path as necessary to point to your database.js


function generateFiles(uniqueId) {
    // Manually enter the ngrok URL
    const ngrokUrl = 'https://30f1-164-153-54-188.ngrok-free.app';

    // Construct the full URL using the ngrok URL and unique ID
    const fullUrl = `${ngrokUrl}/uniqueId/${uniqueId}.html`; // Added .html to make the QR code link to the HTML file

    // Directory where the QR codes will be stored
    const baseDir = '/Users/breland/Documents/GitHub/theoryCraft/qrcodes';

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

        db.run(`INSERT INTO UniqueIDs (id) VALUES (?)`, [uniqueId], (err) => {
            if (err) {
                console.error('Error inserting data into the database', err);
            } else {
                console.log(`Stored unique ID in database: ${uniqueId}`); // Explicitly log the stored unique ID
            }
        });
        // Generate HTML file
        const locationName = "Clemson University";

        const htmlContent = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to ${uniqueId}</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <h1 class="welcome-message">Mill Operation: ${locationName}</h1>
            <form action="/submit/${uniqueId}" method="post">
                <label class="log-input-label" for="tonsInput">Tons of logs for this truckload:</label>
                <input type="number" id="tonsInput" name="tons" min="0" step="0.01" placeholder="Enter tons">
                <button type="submit">Submit</button>
            </form>
            <div class="box-container">
                <div class="box">
                    <h2>Load Breakdown</h2>
                    <p>Money made using carbon credits: $<span id="carbonMoney">0</span></p>
                </div>
            </div>
        </body>
        </html>`;
    
        
        
        
        
        fs.writeFile(path.join(baseDir, `${uniqueId}.html`), htmlContent, (err) => {
            if (err) {
                console.error('Error generating HTML file:', err);
                return;
            }
            console.log(`HTML file generated for ${uniqueId}`);
        });
    });
}

// Get the unique ID from command-line arguments
const uniqueId = process.argv[2]; // Assuming unique ID is passed as the first command-line argument
generateFiles(uniqueId);
