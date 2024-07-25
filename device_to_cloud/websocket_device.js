const WebSocket = require('ws');
const { faker } = require('@faker-js/faker');

// WebSocket server URL
const WEBSOCKET_SERVER_URL = 'ws://localhost:3000'; // Replace with your WebSocket server URL

// Create WebSocket client
const ws = new WebSocket(WEBSOCKET_SERVER_URL);

// Function to simulate device data and send
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

    // Send data to WebSocket server
    ws.send(JSON.stringify(data));
    console.log(`Sent data: ${JSON.stringify(data)}`);

    setTimeout(simulateDeviceData, 5000); // Simulate every 5 seconds
}

// Handle WebSocket connection
ws.on('open', () => {
    console.log('Connected to WebSocket server');
    simulateDeviceData();
});

// Handle WebSocket errors
ws.on('error', (error) => {
    console.error('WebSocket error:', error);
});
