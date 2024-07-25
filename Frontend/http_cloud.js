 
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
 
let sensorDataHistory = []; // Array to store sensor data
 
// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS
 
// Endpoint to receive sensor data
app.post('/sensor-data', (req, res) => {
    const data = req.body;
    data.timestamp = new Date(); // Add timestamp to the data
    sensorDataHistory.push(data); // Store data in history
    console.log('Received data:', data);
    res.status(200).send('Data received');
});
 
// Endpoint to get historical sensor data
app.get('/sensor-data/history', (req, res) => {
    res.json(sensorDataHistory);
});
 
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});