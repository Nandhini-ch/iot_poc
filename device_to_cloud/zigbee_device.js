const { ZStackAdapter } = require('zigbee-herdsman');
const { createFakeSensorData } = require('./sensorDataSimulator');

const serialPortPath = '/dev/ttyUSB0'; // Update with the correct serial port path
const adapter = new ZStackAdapter({
    serialPort: {
        path: serialPortPath,
        baudRate: 115200,
    },
});

async function start() {
    try {
        await adapter.start();
        console.log('Zigbee Device started');

        const sendSensorData = async () => {
            const data = createFakeSensorData();
            console.log('Sending data:', data);

            adapter.emit('deviceMessage', { ieeeAddr: 'device1' }, data);
            setTimeout(sendSensorData, 5000); // Send data every 5 seconds
        };

        sendSensorData();
    } catch (error) {
        console.error('Error starting Zigbee Device:', error);
    }
}

start();
