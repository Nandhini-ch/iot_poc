const { SerialPort } = require('zigbee-herdsman/src/adapter/z-stack/serialPort');
const { ZStackAdapter } = require('zigbee-herdsman');
const express = require('express');
const app = express();
const PORT = 3000;

const coordinator = new ZStackAdapter();
const serialPort = new SerialPort('/dev/ttyUSB0', { baudRate: 115200 }); // Adjust the serial port and baud rate as needed

async function start() {
    try {
        await coordinator.start(serialPort);
        console.log('Zigbee Coordinator started');

        // Listening for device messages
        coordinator.on('deviceMessage', (device, message) => {
            console.log('Message from device:', device.ieeeAddr, message);

            // You can further process the message here, like saving it to a database
        });

    } catch (error) {
        console.error('Error starting Zigbee Coordinator:', error);
    }
}

start();

// Start an Express server (optional, for potential future use)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



// Certainly! Here's a summary of the dynamic content you need to adjust in your code for testing:

// ### Device Code (`device.js`)

// 1. **Serial Port Path**:
//    - Update the serial port path to match where your Zigbee coordinator is connected.
//      ```javascript
//      const serialPortPath = '/dev/ttyUSB0'; // Example: '/dev/ttyUSB0', 'COM3', '/dev/cu.usbserial-xxxx'
//      ```

// 2. **Device IEEE Address**:
//    - If needed, change `'device1'` to the actual IEEE address of your Zigbee device.
//      ```javascript
//      adapter.emit('deviceMessage', { ieeeAddr: 'device1' }, data);
//      ```

// ### Cloud Code (`cloud.js`)

// 1. **Serial Port Path**:
//    - Adjust the serial port and baud rate as needed for your environment.
//      ```javascript
//      const serialPort = new SerialPort('/dev/ttyUSB0', { baudRate: 115200 }); // Example: '/dev/ttyUSB0', 'COM3', '/dev/cu.usbserial-xxxx'
//      ```

// 2. **Baud Rate**:
//    - Ensure the baud rate matches your Zigbee adapter configuration.
//      ```javascript
//      baudRate: 115200 // Example: 9600, 115200, etc.
//      ```

// ### Additional Considerations

// - Ensure the `sensorDataSimulator` module exists and exports the `createFakeSensorData` function to generate mock data.
// - Confirm that your Zigbee coordinator and device are connected properly to the specified serial port.
// - Modify any further processing logic within the `deviceMessage` event handler as needed for your testing or application requirements.