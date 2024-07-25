const mockDevice = require('./mock_zigbee_device'); // Import the mock device to receive messages

class MockZigbeeCloud {
    constructor() {
        this.start();
    }

    start() {
        console.log('Mock Zigbee Cloud started');

        mockDevice.on('deviceMessage', (device, message) => {
            console.log('Received data from device:', device.ieeeAddr, message);
        });
    }
}

new MockZigbeeCloud();
