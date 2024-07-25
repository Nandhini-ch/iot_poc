const axios = require('axios');
const { faker } = require('@faker-js/faker');

const serverUrl = 'http://localhost:3000/data';

const sendTemperatureData = () => {
    const temperatureData = {
        deviceId: 'temperature-device-1234',
        value: faker.number.int({ min: -10, max: 40 }),
        timestamp: new Date().toISOString(),
        id: faker.string.uuid() // Updated as per deprecation warning
    };

    axios.post(serverUrl, temperatureData, { timeout: 5000 }) // Adding a timeout of 5 seconds
        .then(response => {
            console.log('Temperature data sent to server:', response.data);
            console.log('Acknowledgment received:', response.data.acknowledgedId);
        })
        .catch(error => {
            console.error('Error sending temperature data to server:', error);
        });
};

const sendHumidityData = () => {
    const humidityData = {
        deviceId: 'humidity-device-1234',
        value: faker.number.int({ min: 0, max: 100 }),
        timestamp: new Date().toISOString(),
        id: faker.string.uuid() // Updated as per deprecation warning
    };

    axios.post(serverUrl, humidityData, { timeout: 5000 }) // Adding a timeout of 5 seconds
        .then(response => {
            console.log('Humidity data sent to server:', response.data);
            console.log('Acknowledgment received:', response.data.acknowledgedId);
        })
        .catch(error => {
            console.error('Error sending humidity data to server:', error);
        });
};

// Send temperature data, then send humidity data after a delay
setInterval(() => {
    sendTemperatureData();
    setTimeout(sendHumidityData, 1000); // Send humidity data 1 second after temperature data
}, 5000); // Send data every 5 seconds
