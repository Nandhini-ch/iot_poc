const mqtt = require('mqtt');
const mongoose = require('mongoose');

// MQTT broker URL
const MQTT_BROKER = 'mqtt://localhost'; // Replace with your MQTT broker URL

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

// Handle MQTT messages
client.on('connect', () => {
    client.subscribe('sensor-data');
    console.log('Subscribed to MQTT topic: sensor-data');
});

client.on('message', (topic, message) => {
    const data = JSON.parse(message.toString());
    console.log('Received data:', data);

    // Save the data to MongoDB
    const sensorData = new SensorData(data);
    sensorData.save()
        .then(() => console.log('Data saved to MongoDB'))
        .catch(error => console.error('Error saving data to MongoDB:', error));
});

// Handle errors
client.on('error', (error) => {
    console.error('MQTT Client Error:', error);
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
