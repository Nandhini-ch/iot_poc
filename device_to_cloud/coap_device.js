const coap = require('coap');
const { faker } = require('@faker-js/faker');

// CoAP server URL
const COAP_SERVER_URL = 'coap://localhost/sensor-data'; // Replace with your CoAP server URL

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

    const req = coap.request({
        hostname: 'localhost', // Replace with your CoAP server hostname
        pathname: '/sensor-data',
        method: 'POST',
        confirmable: true
    });

    req.write(JSON.stringify(data));
    req.end();
    console.log(`Sent data: ${JSON.stringify(data)}`);

    req.on('response', (res) => {
        console.log('Response:', res.payload.toString());
    });

    setTimeout(simulateDeviceData, 5000); // Simulate every 5 seconds
}

// Start sending data
simulateDeviceData();
