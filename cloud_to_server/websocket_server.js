// const express = require('express');
// const mongoose = require('mongoose');
// const axios = require('axios');

// const app = express();
// const PORT = 4000;

// // MongoDB connection URL
// const MONGODB_URL = 'mongodb://localhost:27017/DB'; // Replace with your MongoDB URL

// // WebSocket server URL to fetch data from
// const WEBSOCKET_SERVER_URL = 'http://localhost:3000/sensor-data'; // Replace with your WebSocket server URL

// // Connect to MongoDB
// mongoose.connect(MONGODB_URL)
//     .then(() => console.log('Connected to MongoDB'))
//     .catch((error) => console.error('MongoDB connection error:', error));

// // Define a schema for sensor data
// const sensorDataSchema = new mongoose.Schema({
//     deviceId: String,
//     temperature1: Number,
//     temperature2: Number,
//     humidity1: Number,
//     humidity2: Number,
//     dsuData: String,
//     timestamp: { type: Date, default: Date.now }
// });

// // Create a model for sensor data
// const SensorData = mongoose.model('SensorData', sensorDataSchema);

// // Function to fetch data from the WebSocket server and store it in MongoDB
// async function fetchDataFromWebSocketServer() {
//     try {
//         const response = await axios.get(WEBSOCKET_SERVER_URL);
//         const data = response.data;

//         if (Array.isArray(data)) {
//             // If the data is an array, save each item individually
//             for (const item of data) {
//                 const sensorData = new SensorData(item);
//                 await sensorData.save();
//                 console.log('Data saved to MongoDB:', item);
//             }
//         } else {
//             // If the data is a single object, save it directly
//             const sensorData = new SensorData(data);
//             await sensorData.save();
//             console.log('Data saved to MongoDB:', data);
//         }
//     } catch (error) {
//         console.error('Error fetching data from WebSocket server:', error);
//     }
// }

// // Fetch data from the WebSocket server every 10 seconds
// setInterval(fetchDataFromWebSocketServer, 10000);

// // Express API to fetch stored data from MongoDB
// app.get('/sensor-data', async (req, res) => {
//     try {
//         const data = await SensorData.find();
//         res.json(data);
//     } catch (error) {
//         res.status(500).json({ error: 'Error fetching data' });
//     }
// });

// // Start the Express server
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });


const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
const PORT = 4000;

// MongoDB connection URL
const MONGODB_URL = 'mongodb://localhost:27017/DB'; // Replace with your MongoDB URL

// WebSocket server URL to fetch data from
const WEBSOCKET_SERVER_URL = 'http://localhost:3000/sensor-data'; // Replace with your WebSocket server URL

// Connect to MongoDB
mongoose.connect(MONGODB_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

// Define a schema for sensor data
const sensorDataSchema = new mongoose.Schema({
    deviceId: String,
    temperature1: Number,
    temperature2: Number,
    humidity1: Number,
    humidity2: Number,
    dsuData: String,
    timestamp: { type: Date, default: Date.now }
});

// Create a model for sensor data
const SensorData = mongoose.model('SensorData', sensorDataSchema);

// Function to fetch data from the WebSocket server and store it in MongoDB
async function fetchDataFromWebSocketServer() {
    try {
        const response = await axios.get(WEBSOCKET_SERVER_URL);
        const data = response.data;

        if (Array.isArray(data)) {
            // If the data is an array, save each item individually
            for (const item of data) {
                const sensorData = new SensorData({
                    deviceId: item.deviceId,
                    temperature1: item.temperature1,
                    temperature2: item.temperature2,
                    humidity1: item.humidity1,
                    humidity2: item.humidity2,
                    dsuData: item.dsuData,
                    timestamp: new Date() // Optionally adjust timestamp if needed
                });
                await sensorData.save();
                console.log('Data saved to MongoDB:', item);
            }
        } else {
            // If the data is a single object, save it directly
            const sensorData = new SensorData({
                deviceId: data.deviceId,
                temperature1: data.temperature1,
                temperature2: data.temperature2,
                humidity1: data.humidity1,
                humidity2: data.humidity2,
                dsuData: data.dsuData,
                timestamp: new Date() // Optionally adjust timestamp if needed
            });
            await sensorData.save();
            console.log('Data saved to MongoDB:', data);
        }
    } catch (error) {
        console.error('Error fetching data from WebSocket server:', error);
    }
}

// Fetch data from the WebSocket server every 10 seconds
setInterval(fetchDataFromWebSocketServer, 10000);

// Express API to fetch stored data from MongoDB
app.get('/sensor-data', async (req, res) => {
    try {
        const data = await SensorData.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data' });
    }
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
