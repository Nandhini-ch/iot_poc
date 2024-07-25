const { Client } = require('ssh2');
const mongoose = require('mongoose');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/DB', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define a schema and model
const sensorDataSchema = new mongoose.Schema({
    deviceId: String,
    temperature1: Number,
    temperature2: Number,
    humidity1: Number,
    humidity2: Number,
    dsuData: String
});
const SensorData = mongoose.model('SensorData', sensorDataSchema);

// SFTP connection configuration
const conn = new Client();
const SFTP_HOST = 'your-sftp-host';
const SFTP_PORT = 22; // Default SFTP port
const SFTP_USERNAME = 'your-username';
const SFTP_PASSWORD = 'your-password';

conn.on('ready', () => {
    console.log('Client :: ready');
    conn.sftp((err, sftp) => {
        if (err) throw err;

        // Read file from SFTP
        sftp.readFile('path/to/your/file.json', (err, data) => {
            if (err) throw err;

            // Assuming the data is in JSON format
            const jsonData = JSON.parse(data.toString());

            // Store data in MongoDB
            const sensorData = new SensorData(jsonData);
            sensorData.save()
                .then(() => {
                    console.log('Data saved to MongoDB:', jsonData);
                })
                .catch(err => {
                    console.error('Error saving data:', err);
                })
                .finally(() => {
                    conn.end(); // Close the connection
                });
        });
    });
}).connect({
    host: SFTP_HOST,
    port: SFTP_PORT,
    username: SFTP_USERNAME,
    password: SFTP_PASSWORD
});
