const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const db = require('./database'); // Adjust the path as necessary to point to your database module



const app = express();
const PORT = 3000;

// Define valid locations
const validLocations = {
    "Clemson University": { lat: 34.67833, lng: -82.83917 },
    // Define more locations as needed
};



// Middleware for parsing application/json
app.use(express.json());

// Middleware for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to serve static files
app.use(express.static('views'));

app.use('/qrcodes', express.static('/Users/breland/Documents/GitHub/theoryCraft/qrcodes'));

// Route to serve Service 1 HTML page
app.get('/service1', (req, res) => {
    res.sendFile(__dirname + '/views/service1.html');
});



app.get('/service1/signup.css', (req, res) => {
    res.set('Content-Type', 'text/css');
    res.sendFile(__dirname + '/views/signup.css');
});

// Route to handle signup GET requests
app.get('/service1/signup', (req, res) => {
    // Render the signup form here
    res.sendFile(__dirname + '/views/signup.html');
});

app.use('/uniqueId/qrcodes', express.static('/Users/breland/Documents/GitHub/theoryCraft/qrcodes'));

app.use('/uniqueId', express.static('/Users/breland/Documents/GitHub/theoryCraft/qrcodes'));



app.get('/uniqueId/:uniqueId', (req, res) => {
    const uniqueId = req.params.uniqueId;
    const locationName = getLocationName(uniqueId);
    if (locationName) {
        fs.readFile('views/uniqueId.html', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
            // Replace ${locationName} with the actual location name
            let htmlContent = data.replace(/\$\{locationName\}/g, locationName);

            // Construct the path to the QR code image dynamically
            const qrCodeImagePath = `qrcodes/${uniqueId}.png`;
            const qrCodeImageTag = `<img src="${qrCodeImagePath}" alt="QR Code">`;

            // Append QR code image tag to the HTML content
            htmlContent += qrCodeImageTag;

            res.send(htmlContent);
        });
    } else {
        res.status(404).send('Location not found');
    }
});


app.post('/submit/:uniqueId', (req, res) => {
    const uniqueId = req.params.uniqueId;
    const tonsOfLogs = parseFloat(req.body.tons); // Assuming input name is 'tons'
    const carbonCredits = tonsOfLogs * 0.5 * 3.667 * 0.4; // Calculate carbon credits
    const moneyFromCredits = carbonCredits * 15 * 0.65; // Calculate money from carbon credits

    // Log the incoming data
    console.log(`Received data for ID: ${uniqueId}`);
    console.log(`Tons of Logs: ${tonsOfLogs}`);
    console.log(`Calculated Carbon Credits: ${carbonCredits}`);
    console.log(`Calculated Monetary Value: ${moneyFromCredits}`);

    const sql = `
    INSERT INTO UserData (id, tons, carbonCredits, money)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
    tons = UserData.tons + excluded.tons,
    carbonCredits = UserData.carbonCredits + excluded.carbonCredits,
    money = UserData.money + excluded.money;
    `;
    
    db.run(sql, [uniqueId, tonsOfLogs, carbonCredits, moneyFromCredits], function(err) {
        if (err) {
            console.error('Error storing user data', err);
            return res.status(500).send('Failed to store data');
        }
        console.log(`Data successfully stored/updated for ID: ${uniqueId}`);
        res.redirect(`/results/${uniqueId}`);
    });
    
});

app.get('/results/:uniqueId', (req, res) => {
    const uniqueId = req.params.uniqueId;
    db.get(`SELECT tons, carbonCredits, money FROM UserData WHERE id = ?`, [uniqueId], (err, row) => {
        if (err) {
            console.error('Error retrieving data', err);
            return res.status(500).send('Error retrieving data');
        }
        if (row) {
            // Ensure values are not null before attempting to format them
            const tons = row.tons !== null ? row.tons.toFixed(2) : '0.00';
            const carbonCredits = row.carbonCredits !== null ? row.carbonCredits.toFixed(2) : '0.00';
            const money = row.money !== null ? row.money.toFixed(2) : '0.00';

            console.log(`Displaying results for ID: ${uniqueId}`);
            console.log(`Tons of logs: ${tons}`);
            console.log(`Carbon Credits: ${carbonCredits}`);
            console.log(`Money made from credits: $${money}`);

            const htmlContent = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Results for Current Load</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>
                <h1 class="welcome-message">Results for Current Load</h1>
                <div class="box-container">
                    <div class="box">
                        <h2>Load Breakdown</h2>
                        <p>Total Tons of logs: ${tons}</p>
                        <p>Total Carbon Credits: ${carbonCredits}</p>
                        <p>Total Money made from credits: $${money}</p>
                    </div>
                </div>
                <a href="/uniqueId/${uniqueId}.html">
                    <button style="font-size: 24px; padding: 10px 20px; background-color: white; color: black; border: 2px solid white; cursor: pointer;">
                        Submit Another Load
                    </button>
                </a>
            </body>
            </html>`;
            res.send(htmlContent);
        } else {
            console.log('No data found for this ID');
            res.send('No data found for this ID');
        }
    });
});






  

// Route to handle signup POST request
app.post('/signup', (req, res) => {
    const { name, email, role } = req.body;
    const uniqueId = uuidv4(); // Generate a unique ID for the user
    console.log(`Signup received with name: ${name}, email: ${email}, role: ${role}, unique ID: ${uniqueId}`);
    if (role === 'landowner') {
        exec(`node generateQR.js ${uniqueId}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return;
            }
            console.log(stdout);
            // Redirect to the unique ID page after generating QR code
            res.redirect('/uniqueId/' + uniqueId); // Using string concatenation
        });
    } else {
        // Handle other roles or scenarios
        res.send('Signup successful');
    }
});


// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


// Function to get location name from unique ID
function getLocationName(uniqueId) {
    // This function extracts location name from the validLocations object based on the unique ID
    // Implement your logic here to fetch the location name associated with the unique ID
    // For now, I'll just return the first location name as a placeholder
    const locationNames = Object.keys(validLocations);
    return locationNames.length > 0 ? locationNames[0] : "Unknown Location";
}