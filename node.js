const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// Define valid locations
const validLocations = {
    "Clemson University": { lat: 34.67833, lng: -82.83917 },
    // Define more locations as needed
};

// Middleware for parsing application/json
app.use(express.json());
app.get('/', (req, res) => {
  res.redirect('/service1');
});


// Service 1
app.get('/service1', (req, res) => {
    res.sendFile(__dirname + '/views/service1.html');
});

// Service for dynamic pages based on unique IDs
app.get('/:uniqueId', (req, res) => {
  const uniqueId = req.params.uniqueId;
  const locationName = getLocationName(uniqueId);
  if (locationName) {
      res.send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Welcome to Mill ${locationName}</title>
          </head>
          <body>
              <h1>Welcome to Mill ${locationName}</h1>
              <!-- Other content goes here -->
          </body>
          </html>
      `);
  } else {
      res.status(404).send('Location not found');
  }
});


// Signup route to handle POST requests
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
        });
    } else {
        res.send('Signup successful');
    }
});

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
