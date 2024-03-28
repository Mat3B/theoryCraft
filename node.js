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

// Route to handle signup POST requests
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

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
