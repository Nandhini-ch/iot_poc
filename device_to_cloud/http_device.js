const axios = require('axios');
const { faker } = require('@faker-js/faker');

// Server URL
const SERVER_URL = 'http://localhost:3000/sensor-data';

// Function to simulate device data and send via HTTP
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

    // Send data via HTTP POST request
    axios.post(SERVER_URL, data)
        .then(response => {
            console.log(`Data sent: ${JSON.stringify(data)}`);
        })
        .catch(error => {
            console.error('Error sending data:', error);
        });

    setTimeout(simulateDeviceData, 5000); // Simulate every 5 seconds
}

simulateDeviceData();
