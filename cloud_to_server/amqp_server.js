const amqp = require('amqplib');
const mongoose = require('mongoose');

// RabbitMQ settings
const RABBITMQ_URL = 'amqp://localhost'; // Replace with your RabbitMQ URL
const QUEUE = 'sensor-data';

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/DB', { useNewUrlParser: true, useUnifiedTopology: true });

// MongoDB Schema and Model
const sensorDataSchema = new mongoose.Schema({
    deviceId: String,
    temperature1: Number,
    temperature2: Number,
    humidity1: Number,
    humidity2: Number,
    dsuData: String,
    timestamp: { type: Date, default: Date.now }
});

const SensorData = mongoose.model('SensorData', sensorDataSchema);

// Function to consume messages from RabbitMQ
async function consumeFromQueue() {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(QUEUE, { durable: true }); // Ensure this matches your queue's existing properties

        console.log(`Waiting for messages in queue: ${QUEUE}`);

        channel.consume(QUEUE, (msg) => {
            if (msg !== null) {
                const data = JSON.parse(msg.content.toString());
                console.log('Received data:', data);

                // Save the data to MongoDB
                const sensorData = new SensorData(data);
                sensorData.save()
                    .then(() => console.log('Data saved to MongoDB'))
                    .catch(error => console.error('Error saving data to MongoDB:', error));

                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error('Error consuming data from RabbitMQ:', error);
    }
}

consumeFromQueue();

// Handle clean shutdown
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed');
        process.exit(0);
    });
});

// for this use the mqtt_to_amqp_cloud file 
// http://localhost:15672/#/queues/%2F/sensor-data
// C:\Program Files\RabbitMQ Server\rabbitmq_server-3.13.4\sbin>rabbitmq-service start
// The RabbitMQ service is starting.
// The RabbitMQ service was started successfully.
