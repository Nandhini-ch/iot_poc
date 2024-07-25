const mongoose = require('mongoose');
const express = require('express');
const app = express();
const PORT = 4000;

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/DB');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define a schema for your sensor data
const sensorDataSchema = new mongoose.Schema({
    deviceId: { type: String, required: true },
    temperature1: { type: Number, required: true },
    temperature2: { type: Number, required: true },
    humidity1: { type: Number, required: true },
    humidity2: { type: Number, required: true },
    dsuData: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

// Create a model based on the schema
const SensorData = mongoose.model('SensorData', sensorDataSchema);

// Endpoint to receive sensor data from cloud server and store in MongoDB
app.post('/store-data', async (req, res) => {
    try {
        const data = req.body;
        console.log('Received data:', data); // Log received data

        // Validate data
        if (!data.deviceId || typeof data.temperature1 !== 'number' || typeof data.temperature2 !== 'number' ||
            typeof data.humidity1 !== 'number' || typeof data.humidity2 !== 'number' || typeof data.dsuData !== 'string') {
            console.error('Invalid data format:', data);
            return res.status(400).send('Invalid data format');
        }

        // Save received data to MongoDB using Mongoose model
        const sensorData = new SensorData(data);
        await sensorData.save();

        console.log('Data saved to MongoDB:', data); // Log data saved to MongoDB
        res.status(200).send('Data stored in MongoDB');
    } catch (error) {
        console.error('Error storing data in MongoDB:', error); // Log MongoDB storage errors
        res.status(500).send('Internal Server Error');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

