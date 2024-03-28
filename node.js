const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');


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

app.use('/uniqueId/qrcodes', express.static('/Users/breland/Desktop/theoryCraft/uniqueId/qrcodes'));



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