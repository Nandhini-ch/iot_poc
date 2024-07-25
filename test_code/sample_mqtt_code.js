// cloud server

const mqtt = require('mqtt');
const axios = require('axios');

// Connect to the MQTT broker
const client = mqtt.connect('mqtt://broker-address');

// Subscribe to the MQTT topic when connected
client.on('connect', () => {
  client.subscribe('sensors/temperature', (err) => {
    if (!err) {
      console.log('Subscribed to sensors/temperature');
    }
  });
});

// Handle incoming MQTT messages
client.on('message', (topic, message) => {
  if (topic === 'sensors/temperature') {
    const data = JSON.parse(message.toString());
    console.log(`Received temperature data: ${data.temperature}`);

    // Forward data to the application server using HTTP POST
    axios.post('http://application-server-address/api/temperature', data)
      .then(response => {
        console.log('Data sent to application server:', response.data);
      })
      .catch(error => {
        console.error('Error sending data to application server:', error);
      });
  }
});


// APPLICATION SERVER CODE
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/sensor-data', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a Mongoose schema for temperature data
const temperatureSchema = new mongoose.Schema({
  temperature: Number,
  timestamp: { type: Date, default: Date.now },
});

const Temperature = mongoose.model('Temperature', temperatureSchema);

// Define the API endpoint to receive temperature data
app.post('/api/temperature', (req, res) => {
  const { temperature } = req.body;

  // Save the data to the database
  const tempData = new Temperature({ temperature });
  tempData.save()
    .then(() => res.status(201).send('Data saved successfully'))
    .catch(error => res.status(500).send('Error saving data:', error));
});

// Start the Express server
app.listen(3000, () => {
  console.log('Application server listening on port 3000');
});
