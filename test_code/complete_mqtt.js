// Yes, you can use MQTT to send data from the cloud to the application server. This can be achieved by having the application server subscribe to the relevant MQTT topics just like the cloud server does. Here’s how you can set it up:

// ### Components Involved
// 1. **Devices**: Publish data to the MQTT broker.
// 2. **Cloud Server**: Receives data from devices via MQTT and republishes it to another topic if needed.
// 3. **Application Server**: Subscribes to the MQTT broker to receive data.

// ### Step-by-Step Workflow

// #### 1. Device to Cloud (Using MQTT)
// - Devices publish sensor data to the MQTT broker.
// - Example: A device publishes temperature data to the `sensors/temperature` topic.

// #### 2. Cloud Server: Subscribe to MQTT Topics
// - The cloud server subscribes to relevant MQTT topics to receive data.
// - Optionally, the cloud server can process the data and republish it to another topic.

// #### 3. Application Server: Subscribe to MQTT Topics
// - The application server subscribes to the relevant MQTT topics to receive data directly from the broker.

// ### Example Implementation

// Device Code (MQTT Client)


const mqtt = require('mqtt');
const client = mqtt.connect(mqttBrokerUrl);

client.on('connect', () => {
  setInterval(() => {
    const temperature = getTemperatureData(); // Function to get temperature data
    client.publish('sensors/temperature', JSON.stringify({ temperature }));
  }, 1000); // Publish every second
});


// Cloud Server Code (MQTT Client)

const mqtt = require('mqtt');
// const client = mqtt.connect('mqtt://broker-address');

client.on('connect', () => {
  client.subscribe('sensors/temperature');
});

client.on('message', (topic, message) => {
  if (topic === 'sensors/temperature') {
    const data = JSON.parse(message.toString());
    console.log(`Received temperature data on cloud server: ${data.temperature}`);

    // Optionally, process data and republish to another topic
    const processedData = processTemperatureData(data); // Process data if needed
    client.publish('processed/sensors/temperature', JSON.stringify(processedData));
  }
});

function processTemperatureData(data) {
  // Add processing logic if needed
  return data;
}

// Application Server Code (MQTT Client)

const mqtt = require('mqtt');
const mongoose = require('mongoose');

// Connect to the MQTT broker
// const client = mqtt.connect('mqtt://broker-address');

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

// Subscribe to the MQTT topic
client.on('connect', () => {
  client.subscribe('processed/sensors/temperature', (err) => {
    if (!err) {
      console.log('Subscribed to processed/sensors/temperature');
    }
  });
});

// Handle incoming MQTT messages
client.on('message', (topic, message) => {
  if (topic === 'processed/sensors/temperature') {
    const data = JSON.parse(message.toString());
    console.log(`Received temperature data on application server: ${data.temperature}`);

    // Save the data to the database
    const tempData = new Temperature({ temperature: data.temperature });
    tempData.save()
      .then(() => console.log('Data saved successfully'))
      .catch(error => console.error('Error saving data:', error));
  }
});


// ### Summary
// 1. **Devices** publish data to the MQTT broker.
// 2. **Cloud server** subscribes to the MQTT topic, optionally processes the data, and can republish it to another topic.
// 3. **Application server** subscribes to the MQTT topic (either directly to the original topic or to the processed topic) and processes or stores the data accordingly.

// Using MQTT for end-to-end data transfer ensures low-latency, lightweight communication between devices, the cloud, and the application server.
