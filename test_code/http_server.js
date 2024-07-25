const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// In-memory storage for demo purposes
const temperatureData = [];
const humidityData = [];

// Endpoint to receive data
app.post('/data', (req, res) => {
    const data = req.body;
    console.log('Data received:', data);

    // Store temperature data
    if (data.deviceId === 'temperature-device-1234') {
        temperatureData.push({
            deviceId: data.deviceId,
            value: data.value,
            timestamp: data.timestamp,
            id: data.id // Include the unique identifier
        });
    }

    // Store humidity data
    if (data.deviceId === 'humidity-device-1234') {
        humidityData.push({
            deviceId: data.deviceId,
            value: data.value,
            timestamp: data.timestamp,
            id: data.id // Include the unique identifier
        });
    }

    // Send acknowledgment with the unique identifier
    res.status(200).json({ message: 'Data received successfully', acknowledgedId: data.id });
});

// Endpoint to list temperature data
app.get('/temperature', (req, res) => {
    res.status(200).json(temperatureData);
});

// Endpoint to list humidity data
app.get('/humidity', (req, res) => {
    res.status(200).json(humidityData);
});

// Endpoint to list both temperature and humidity data
app.get('/', (req, res) => {
    const data = {
        temperature: temperatureData,
        humidity: humidityData,
    };
    res.status(200).json(data);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
