const mqtt = require('mqtt');
const { faker } = require('@faker-js/faker');

// MQTT broker connection options
const brokerUrl = 'mqtt://localhost';
const options = {
    clientId: 'mqtt_gateway',
    clean: true // Clean session to ensure no old data is retained
};

// Connect to MQTT broker
const client = mqtt.connect(brokerUrl, options);

// Event handler for successful connection
client.on('connect', () => {
    console.log('Connected to MQTT broker');

    // Function to send temperature data
    const sendTemperatureData = () => {
        const temperatureData = {
            deviceId: 'temperature-device-1234',
            value: faker.number.int({ min: 0, max: 100 }),
            timestamp: new Date().toISOString(),
            id: faker.datatype.uuid() // Use faker.datatype.uuid() for generating UUID
        };
        client.publish('temperature', JSON.stringify(temperatureData));
        console.log('Temperature data sent:', temperatureData);
    };

    // Function to send humidity data
    const sendHumidityData = () => {
        const humidityData = {
            deviceId: 'humidity-device-1234',
            value: faker.number.int({ min: 0, max: 100 }),
            timestamp: new Date().toISOString(),
            id: faker.datatype.uuid() // Use faker.datatype.uuid() for generating UUID
        };
        client.publish('humidity', JSON.stringify(humidityData));
        console.log('Humidity data sent:', humidityData);
    };

    // Send temperature data every 5 seconds
    setInterval(sendTemperatureData, 5000);

    // Send humidity data every 7 seconds (adjust as needed)
    setInterval(sendHumidityData, 7000);
});

// Handle errors
client.on('error', (error) => {
    console.error('Error occurred:', error);
});

// Handle disconnect
client.on('close', () => {
    console.log('Disconnected from MQTT broker');
});

// Handle incoming messages
client.on('message', (topic, message) => {
    console.log(`Received message on topic '${topic}': ${message.toString()}`);
});

// Subscribe to relevant topics
client.subscribe('temperature', { qos: 1 });
client.subscribe('humidity', { qos: 1 });

// Handle process exit gracefully
process.on('SIGINT', () => {
    client.end();
    console.log('Closed MQTT connection');
    process.exit();
});
