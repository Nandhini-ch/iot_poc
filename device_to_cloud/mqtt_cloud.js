const mqtt = require('mqtt');
const express = require('express');

const app = express();
const PORT = 3000;

// MQTT broker URL
const MQTT_BROKER = 'mqtt://localhost'; // Replace with your MQTT broker URL

// MQTT client
const client = mqtt.connect(MQTT_BROKER);

// Handle MQTT messages
client.on('connect', () => {
    client.subscribe('sensor-data');
    console.log('Subscribed to MQTT topic: sensor-data');
});

client.on('message', (topic, message) => {
    const data = JSON.parse(message);
    console.log('Received data:', data);
});

// Express API to fetch stored data (if needed, currently not storing)
app.get('/sensor-data', (req, res) => {
    res.json({ message: 'Data logging is enabled, but data storage is not implemented.' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
