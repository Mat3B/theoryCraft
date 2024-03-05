const express = require('express');
const app = express();

const PORT_1 = 3000;
const PORT_2 = 3001;
const PORT_3 = 3002;

// Service 1
app.get('/service1', (req, res) => {
  res.sendFile(__dirname + '/views/service1.html');
});

// Service 2
app.get('/service2', (req, res) => {
  res.sendFile(__dirname + '/views/service2.html');
});

// Service 3
app.get('/service3', (req, res) => {
  res.sendFile(__dirname + '/views/service3.html');
});

app.listen(PORT_1, '0.0.0.0', () => {
  console.log(`Service 1 is running on http://localhost:${PORT_1}`);
});

app.listen(PORT_2, '0.0.0.0', () => {
  console.log(`Service 2 is running on http://localhost:${PORT_2}`);
});

app.listen(PORT_3, '0.0.0.0', () => {
  console.log(`Service 3 is running on http://localhost:${PORT_3}`);
});
