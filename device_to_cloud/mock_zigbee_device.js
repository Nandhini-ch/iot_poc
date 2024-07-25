const EventEmitter = require('events');
const { createFakeSensorData } = require('./sensorDataSimulator'); // Ensure you have this file for generating fake data

class MockZigbeeDevice extends EventEmitter {
    constructor() {
        super();
    }

    start() {
        console.log('Mock Zigbee Device started');
        this.sendSensorData();
    }

    sendSensorData() {
        const data = createFakeSensorData();
        console.log('Sending data:', data);
        this.emit('deviceMessage', { ieeeAddr: 'device1' }, data);
        setTimeout(() => this.sendSensorData(), 5000); // Send data every 5 seconds
    }
}

const mockDevice = new MockZigbeeDevice();
mockDevice.start();

module.exports = mockDevice;
