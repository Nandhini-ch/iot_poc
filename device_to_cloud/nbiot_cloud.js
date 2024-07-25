const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/DB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sensorSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  status: Boolean,
  timestamp: { type: Date, default: Date.now }
});

const SensorData = mongoose.model('SensorData', sensorSchema);

// Endpoint to receive data from NB-IoT
app.post('/nbiot-data', async (req, res) => {
  try {
    const { device, time, data } = req.body;
    console.log(`Received data from device ${device} at ${time}:`, data);

    // Save data to MongoDB
    const sensorData = new SensorData({
      temperature: data.temperature,
      humidity: data.humidity,
      status: data.status,
      timestamp: new Date(time),
    });

    await sensorData.save();
    res.sendStatus(200);
  } catch (error) {
    console.error('Error saving data:', error);
    res.sendStatus(500);
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
