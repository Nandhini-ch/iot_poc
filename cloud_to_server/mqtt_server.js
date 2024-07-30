const mqtt = require('mqtt');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 4000;

// MQTT broker URL (use environment variable or fallback to localhost)
const MQTT_BROKER = process.env.MQTT_BROKER || 'mqtt://localhost';

// MQTT client
const client = mqtt.connect(MQTT_BROKER);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/DB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// MongoDB Schema and Model
const sensorDataSchema = new mongoose.Schema({
    deviceId: String,
    temperature1: Number,
    temperature2: Number,
    humidity1: Number,
    humidity2: Number,
    dsuData: String,
    timestamp: { type: Date, default: Date.now }
});

const SensorData = mongoose.model('SensorData', sensorDataSchema);

// Handle MQTT connection
client.on('connect', () => {
    client.subscribe('sensor-data', (err) => {
        if (err) {
            console.error('Failed to subscribe to MQTT topic:', err);
        } else {
            console.log('Subscribed to MQTT topic: sensor-data');
        }
    });
});

// Handle incoming MQTT messages
client.on('message', (topic, message) => {
    try {
        const data = JSON.parse(message.toString());
        console.log('Received data:', data);

        // Save the data to MongoDB
        const sensorData = new SensorData(data);
        sensorData.save()
            .then(() => console.log('Data saved to MongoDB'))
            .catch(error => console.error('Error saving data to MongoDB:', error));
    } catch (error) {
        console.error('Failed to parse MQTT message:', error);
    }
});

// Handle MQTT client errors
client.on('error', (error) => {
    console.error('MQTT Client Error:', error);
});

// Express route to fetch stored sensor data
app.get('/sensor-data', async (req, res) => {
    try {
        const sensorData = await SensorData.find();
        res.json(sensorData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sensor data from the database.' });
    }
});

// Start Express server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle clean shutdown
process.on('SIGINT', () => {
    client.end(() => {
        console.log('MQTT client disconnected');
        mongoose.connection.close(() => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
});

