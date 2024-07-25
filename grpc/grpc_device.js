const axios = require('axios');
const { faker } = require('@faker-js/faker');

const generateSensorData = () => {
    // Simulate sensor data using Faker.js
    const sensorData = {
        deviceId: faker.string.uuid(),
        temperature1: faker.number.int({ min: 20, max: 30 }),
        temperature2: faker.number.int({ min: 15, max: 25 }),
        humidity1: faker.number.int({ min: 40, max: 60 }),
        humidity2: faker.number.int({ min: 30, max: 50 }),
        dsuData: faker.helpers.arrayElement(['on', 'off']) // DSU data as "on" or "off"
    
    };
    return sensorData;
};

const sendSensorData = async () => {
    const data = generateSensorData();
    console.log('Generated sensor data:', data);

    try {
        // Send data to the cloud server
        const response = await axios.post('http://localhost:3000/sensor-data', data);
        console.log('Response from cloud server:', response.data);
    } catch (error) {
        console.error('Error sending sensor data:', error.message);
    }
};

// Send sensor data every 5 seconds (for example)
setInterval(sendSensorData, 5000);
