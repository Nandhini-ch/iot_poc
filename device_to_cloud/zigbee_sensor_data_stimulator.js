const faker = require('faker');

function createFakeSensorData() {
    return {
        temperature1: faker.random.number({ min: -10, max: 50 }),
        temperature2: faker.random.number({ min: -10, max: 50 }),
        humidity1: faker.random.number({ min: 0, max: 100 }),
        humidity2: faker.random.number({ min: 0, max: 100 }),
        dsuData: faker.random.arrayElement(['on', 'off']),
    };
}

module.exports = { createFakeSensorData };


// Device Simulation (device.js): This script simulates sensor data using Faker.js and emits this data every 5 seconds as if it's coming from a Zigbee device.

// Cloud Server (cloud.js): This script sets up a Zigbee coordinator that listens for messages from Zigbee devices. When it receives a message, it logs the data to the console.

// Sensor Data Simulator (sensorDataSimulator.js): This utility script generates fake sensor data using Faker.js.

// Zigbee Dongle/Adapter: Connect your Zigbee dongle/adapter to your computer. Identify the serial port it uses (e.g., /dev/ttyUSB0 on Linux/Mac or COM3 on Windows).
// Ensure your Zigbee adapter is connected and you have the correct serial port path (e.g., /dev/ttyUSB0 for Linux/Mac or COM3 for Windows).