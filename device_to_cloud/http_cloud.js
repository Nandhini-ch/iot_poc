// const express = require('express');
// const app = express();
// const PORT = 3000;

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Endpoint to receive sensor data
// app.post('/sensor-data', (req, res) => {
//     const data = req.body;
//     console.log('Received data:', data);
//     res.status(200).send('Data received');
// });

// // Start server
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

// this is for to transfer to the http server
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to receive sensor data
app.post('/sensor-data', async (req, res) => {
    const data = req.body;
    console.log('Received data in cloud server:', data); // Log received data

    try {
        // Send the data to the target server
        const response = await axios.post('http://localhost:4000/store-data', data);
        console.log('Data forwarded to the server:', response.data); // Log response from target server
        res.status(200).send('Data received and forwarded to the server');
    } catch (error) {
        console.error('Error forwarding data to the server:', error.message);
        res.status(500).send('Error forwarding data to the server');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Cloud server running on port ${PORT}`);
});


// code with backup db
// const express = require('express');
// const axios = require('axios');
// const mongoose = require('mongoose');
// const app = express();
// const PORT = 3000;

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Connect to MongoDB for backup
// mongoose.connect('mongodb://localhost/backupDB', { useNewUrlParser: true, useUnifiedTopology: true });
// const backupDb = mongoose.connection;
// backupDb.on('error', console.error.bind(console, 'MongoDB connection error:'));
// backupDb.once('open', () => {
//     console.log('Connected to backup MongoDB');
// });

// // Define a schema for the backup data
// const backupDataSchema = new mongoose.Schema({
//     deviceId: String,
//     temperature1: Number,
//     temperature2: Number,
//     humidity1: Number,
//     humidity2: Number,
//     dsuData: String,
//     timestamp: { type: Date, default: Date.now }
// });

// // Create a model based on the schema
// const BackupData = mongoose.model('BackupData', backupDataSchema);

// // Endpoint to receive sensor data
// app.post('/sensor-data', async (req, res) => {
//     const data = req.body;
//     console.log('Received data in cloud server:', data); // Log received data

//     try {
//         // Send the data to the target server
//         const response = await axios.post('http://localhost:4000/store-data', data);
//         console.log('Data forwarded to the server:', response.data); // Log response from target server
//         res.status(200).send('Data received and forwarded to the server');
//     } catch (error) {
//         console.error('Error forwarding data to the server:', error.message);
        
//         // Save data to backup database
//         try {
//             const backupData = new BackupData(data);
//             await backupData.save();
//             console.log('Data saved to backup MongoDB:', data); // Log data saved to backup MongoDB
//             res.status(200).send('Data received and stored in backup MongoDB');
//         } catch (backupError) {
//             console.error('Error storing data in backup MongoDB:', backupError.message);
//             res.status(500).send('Error forwarding data and storing in backup MongoDB');
//         }
//     }
// });

// // Start server
// app.listen(PORT, () => {
//     console.log(`Cloud server running on port ${PORT}`);
// });
