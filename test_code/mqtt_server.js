const express = require('express');
const bodyParser = require('body-parser');
const mqtt = require('mqtt');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// MQTT Broker setup (replace with your MQTT broker URL)
const mqttBrokerUrl = 'mqtt://localhost';
const client = mqtt.connect(mqttBrokerUrl);

// In-memory storage for demo purposes
const temperatureData = [];
const humidityData = [];

// MQTT Subscription topics
const temperatureTopic = 'temperature';
const humidityTopic = 'humidity';

// MQTT Client connected
client.on('connect', () => {
    console.log('MQTT client connected to broker');
    // Subscribe to topics
    client.subscribe(temperatureTopic);
    client.subscribe(humidityTopic);
});

// Handle MQTT messages
client.on('message', (topic, message) => {
    const data = JSON.parse(message.toString());
    console.log(`Received MQTT message on topic ${topic}:`, data);

    // Store data based on topic
    if (topic === temperatureTopic) {
        temperatureData.push({
            deviceId: data.deviceId,
            value: data.value,
            timestamp: data.timestamp,
            id: data.id
        });
    } else if (topic === humidityTopic) {
        humidityData.push({
            deviceId: data.deviceId,
            value: data.value,
            timestamp: data.timestamp,
            id: data.id
        });
    }
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
app.get('/data', (req, res) => {
    const data = {
        temperature: temperatureData,
        humidity: humidityData,
    };
    res.status(200).json(data);
});

// Start the HTTP server
app.listen(port, () => {
    console.log(`HTTP server is running on http://localhost:${port}`);
});
