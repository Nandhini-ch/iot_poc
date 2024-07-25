const ftp = require('basic-ftp');
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

// FTP connection configuration
const FTP_HOST = 'your-ftp-host'; // Replace with your FTP host
const FTP_USERNAME = 'your-username'; // Replace with your FTP username
const FTP_PASSWORD = 'your-password'; // Replace with your FTP password

async function retrieveData() {
    const client = new ftp.Client();
    client.ftp.verbose = true; // Optional: for debugging

    try {
        await client.access({
            host: FTP_HOST,
            user: FTP_USERNAME,
            password: FTP_PASSWORD,
            secure: false // Set to true if using FTPS
        });
        console.log('Connected to FTP server');

        // Retrieve the file (replace with your actual file path)
        const filePath = 'path/to/your/file.json';
        const data = await client.downloadToBuffer(filePath);

        // Assuming the data is in JSON format
        const jsonData = JSON.parse(data.toString());

        // Store data in MongoDB
        const sensorData = new SensorData(jsonData);
        await sensorData.save();
        console.log('Data saved to MongoDB:', jsonData);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        client.close();
    }
}

// Call the function to retrieve data
retrieveData();
