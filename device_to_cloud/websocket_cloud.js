const WebSocket = require('ws');
const express = require('express');

const app = express();
const PORT = 3000;

// Create WebSocket server
const wss = new WebSocket.Server({ noServer: true });

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    // Handle incoming messages
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log('Received data:', data);
    });

    // Handle WebSocket errors
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// Express API to fetch stored data (if needed, currently not storing)
app.get('/sensor-data', (req, res) => {
    res.json({ message: 'Data logging is enabled, but data storage is not implemented.' });
});

// Handle HTTP upgrades to WebSocket
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});



// this is transfer to server
// const WebSocket = require('ws');
// const express = require('express');

// const app = express();
// const PORT = 3000;

// let sensorDataArray = []; // Store sensor data

// // Create WebSocket server
// const wss = new WebSocket.Server({ noServer: true });

// // Handle WebSocket connections
// wss.on('connection', (ws) => {
//     console.log('New WebSocket connection');

//     // Handle incoming messages
//     ws.on('message', (message) => {
//         const data = JSON.parse(message);
//         console.log('Received data:', data);
//         sensorDataArray.push(data); // Store data in array

//         // Broadcast data to all clients (if needed)
//         wss.clients.forEach((client) => {
//             if (client !== ws && client.readyState === WebSocket.OPEN) {
//                 client.send(JSON.stringify(data));
//             }
//         });
//     });

//     // Handle WebSocket errors
//     ws.on('error', (error) => {
//         console.error('WebSocket error:', error);
//     });
// });

// // Express API to fetch stored data
// app.get('/sensor-data', (req, res) => {
//     res.json(sensorDataArray); // Return stored sensor data
// });

// // Handle HTTP upgrades to WebSocket
// const server = app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

// server.on('upgrade', (request, socket, head) => {
//     wss.handleUpgrade(request, socket, head, (ws) => {
//         wss.emit('connection', ws, request);
//     });
// });
