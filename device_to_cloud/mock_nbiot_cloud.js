const express = require('express');
const app = express();
const PORT = 4000;

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to receive sensor data from the device
app.post('/data', (req, res) => {
    const data = req.body;
    console.log('Received data from device:', data.deviceId, data);
    res.status(200).send('Data received');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Cloud server running on port ${PORT}`);
});
