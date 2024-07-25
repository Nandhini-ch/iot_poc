// const SerialPort = require('serialport');
// const Readline = require('@serialport/parser-readline');
// const faker = require('faker');

// // Function to generate simulated sensor data
// function generateSensorData() {
//   return {
//     temperature: faker.datatype.float({ min: -10, max: 50 }),
//     humidity: faker.datatype.float({ min: 0, max: 100 }),
//     status: faker.random.boolean(),
//   };
// }

// // Function to send data via NB-IoT
// function sendData(port) {
//   const data = generateSensorData();
//   const payload = JSON.stringify(data);

//   // Prepare AT command to send data (example command, adjust as needed)
//   const atCommand = `AT+SEND=${payload.length},${payload}`;

//   port.write(atCommand, (err) => {
//     if (err) {
//       return console.log('Error on write: ', err.message);
//     }
//     console.log('Message sent: ', data);
//   });
// }

// // Set up the serial port connection to NB-IoT module
// const port = new SerialPort('/dev/ttyUSB0', {
//   baudRate: 9600,
// });

// const parser = port.pipe(new Readline({ delimiter: '\n' }));

// // Send data every 5 seconds
// setInterval(() => sendData(port), 5000);

// // Error handling
// port.on('error', (err) => {
//   console.log('Error: ', err.message);
// });

// // Handle incoming data (if needed)
// parser.on('data', (data) => {
//   console.log('Received: ', data);
// });


// In a real-world NB-IoT scenario:

// Device Side: Your device would use an NB-IoT module to send data over the NB-IoT network to a gateway or server.
// Cloud Side: Your cloud server would receive this data from the network infrastructure, potentially via an IoT platform or data gateway.

// Note: Replace <server_ip> and <server_port> with the actual IP address and port of your cloud server

const axios = require('axios');
const { faker } = require('@faker-js/faker');
const { SerialPort } = require('serialport'); // Ensure correct import
const { ReadlineParser } = require('@serialport/parser-readline');

// Configuration
const NB_IOT_URL = 'http://localhost:3000/nbiot-data'; // Replace with your cloud endpoint
const SIMULATION_INTERVAL = 10000; // 10 seconds

// List available serial ports
(async () => {
    try {
        const ports = await SerialPort.list(); // List ports
        ports.forEach(port => {
            console.log(`${port.path} - ${port.manufacturer}`);
        });
    } catch (err) {
        console.error('Error listing serial ports:', err);
    }
})();

// Serial Port Setup
const portPath = 'COM3'; // Replace with your actual serial port path
const port = new SerialPort({
    path: portPath,
    baudRate: 9600
});
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

// Function to generate simulated sensor data
const generateSensorData = () => {
    return {
        temperature: faker.datatype.number({ min: -10, max: 40 }),
        humidity: faker.datatype.number({ min: 0, max: 100 }),
        timestamp: new Date().toISOString()
    };
};

// Send data to the cloud
const sendData = async (data) => {
    try {
        await axios.post(NB_IOT_URL, data);
        console.log('Data sent to cloud:', data);
    } catch (error) {
        console.error('Error sending data:', error);
    }
};

// Simulate sending data every 10 seconds
setInterval(() => {
    const data = generateSensorData();
    sendData(data);
}, SIMULATION_INTERVAL);

// Optionally: log data received from the serial port
parser.on('data', (line) => {
    console.log('Received from device:', line);
});

// Handle errors
port.on('error', (err) => {
    console.error('Serial port error:', err.message);
});


// When to Expect Ports to Appear
// Immediately After Connection: Ports should appear as soon as the device is connected and recognized by Windows.
// After Driver Installation: If drivers are not installed or not updated, the ports may not show up. Installing or updating drivers should resolve this issue.
// After System Reboot: If ports don’t show up immediately, try rebooting your computer to refresh the hardware detection.
