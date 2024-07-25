const mongoose = require('mongoose');
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const PORT = 4000;

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/DB');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define a schema for your sensor data
const sensorDataSchema = new mongoose.Schema({
    deviceId: { type: String, required: true },
    temperature1: { type: Number, required: true },
    temperature2: { type: Number, required: true },
    humidity1: { type: Number, required: true },
    humidity2: { type: Number, required: true },
    dsuData: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

// Create a model based on the schema
const SensorData = mongoose.model('SensorData', sensorDataSchema);

// Nodemailer transporter setup
// Create a transporter object
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, // Use 587 for TLS
    secure: false, // Set to true if using port 465
    auth: {
        user: 'nandy20nn@gmail.com', // your email address
        pass: 'kcdx offf rcad mxvz' // your password or app password
    }
});

// Function to send email
const sendEmail = (temperature) => {
    const mailOptions = {
        from: 'nandy20nn@gmail.com', // sender address
        to: 'challakolusunandini20@gmail.com', // receiver address
        subject: 'Temperature Alert',
        text: `Alert! The temperature has exceeded the threshold. Current temperature: ${temperature}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.error('Error sending email:', error);
        }
        // console.log('Email sent:', info.response);
        console.log('Email sent: ' + info.response);
    });
};

// Endpoint to receive sensor data from cloud server and store in MongoDB
app.post('/store-data', async (req, res) => {
    try {
        const data = req.body;
        console.log('Received data:', data); // Log received data

        // Validate data
        if (!data.deviceId || typeof data.temperature1 !== 'number' || typeof data.temperature2 !== 'number' ||
            typeof data.humidity1 !== 'number' || typeof data.humidity2 !== 'number' || typeof data.dsuData !== 'string') {
            console.error('Invalid data format:', data);
            return res.status(400).send('Invalid data format');
        }

        // Check if temperature values exceed 10 and send an email if true
        if (data.temperature1 > 10 || data.temperature2 > 10) {
            sendEmail(data.temperature1 > 10 ? data.temperature1 : data.temperature2);
        }

        // Save received data to MongoDB using Mongoose model
        const sensorData = new SensorData(data);
        await sensorData.save();

        console.log('Data saved to MongoDB:', data); // Log data saved to MongoDB
        res.status(200).send('Data stored in MongoDB');
    } catch (error) {
        console.error('Error storing data in MongoDB:', error); // Log MongoDB storage errors
        res.status(500).send('Internal Server Error');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
