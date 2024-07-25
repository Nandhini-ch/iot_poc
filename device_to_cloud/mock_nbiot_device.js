const axios = require('axios');

// Function to simulate creating fake sensor data
function createFakeSensorData() {
    return {
        deviceId: 'device1',
        temperature1: Math.floor(Math.random() * 100),
        temperature2: Math.floor(Math.random() * 100),
        humidity1: Math.floor(Math.random() * 100),
        humidity2: Math.floor(Math.random() * 100),
        dsuData: Math.random() > 0.5 ? 'on' : 'off',
    };
}

// Function to simulate sending data from the device to the cloud server
async function simulateDevice() {
    console.log('Device simulation started');

    while (true) {
        const data = createFakeSensorData();
        console.log('Sending data:', data);

        try {
            await axios.post('http://localhost:4000/data', data); // Update this URL if needed
            console.log('Data sent successfully');
        } catch (error) {
            console.error('Error sending data:', error.message);
        }

        await new Promise(resolve => setTimeout(resolve, 5000)); // Send data every 5 seconds
    }
}

// Start the device simulation
simulateDevice();
