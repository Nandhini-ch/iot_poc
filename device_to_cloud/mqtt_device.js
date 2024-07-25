const mqtt = require('mqtt');
const { faker } = require('@faker-js/faker');

// MQTT broker URL
const MQTT_BROKER = 'mqtt://localhost'; // Replace with your MQTT broker URL

// Create MQTT client
const client = mqtt.connect(MQTT_BROKER);

// Function to simulate device data and publish
function simulateDeviceData() {
    const deviceId = faker.string.uuid();
    const temperature1 = faker.number.int({ min: 20, max: 30 });
    const temperature2 = faker.number.int({ min: 15, max: 25 });
    const humidity1 = faker.number.int({ min: 40, max: 60 });
    const humidity2 = faker.number.int({ min: 30, max: 50 });
    const dsuData = faker.helpers.arrayElement(['on', 'off']); // DSU data as "on" or "off"

    const data = {
        deviceId,
        temperature1,
        temperature2,
        humidity1,
        humidity2,
        dsuData
    };

    // Publish data to MQTT topic
    client.publish('sensor-data', JSON.stringify(data));
    console.log(`Published data: ${JSON.stringify(data)}`);

    setTimeout(simulateDeviceData, 10000); // Simulate every 5 seconds
}

// Connect to MQTT broker
client.on('connect', () => {
    console.log('Connected to MQTT broker');
    simulateDeviceData();
});

// Handle errors
client.on('error', (error) => {
    console.error('Error:', error);
});

