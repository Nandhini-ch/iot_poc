const mqtt = require('mqtt');
const amqp = require('amqplib');

// MQTT broker URL
const MQTT_BROKER = 'mqtt://localhost'; // Replace with your MQTT broker URL

// RabbitMQ settings
const RABBITMQ_URL = 'amqp://localhost'; // Replace with your RabbitMQ URL
const QUEUE = 'sensor-data';

// Create MQTT client
const client = mqtt.connect(MQTT_BROKER);

// RabbitMQ connection and channel
let channel = null;
let connection = null;

// Function to connect to RabbitMQ and send messages
async function connectToRabbitMQ() {
    try {
        connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertQueue(QUEUE, { durable: true }); // Make sure this matches your existing queue
        console.log('Connected to RabbitMQ and queue is asserted');
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
        process.exit(1); // Exit process on connection failure
    }
}

async function sendToQueue(data) {
    try {
        if (!channel) {
            throw new Error('RabbitMQ channel not initialized');
        }
        channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(data)));
        console.log(`Data sent to RabbitMQ: ${JSON.stringify(data)}`);
    } catch (error) {
        console.error('Error sending data to RabbitMQ:', error);
    }
}

// Handle MQTT messages
client.on('connect', () => {
    client.subscribe('sensor-data');
    console.log('Subscribed to MQTT topic: sensor-data');
    connectToRabbitMQ();
});

client.on('message', async (topic, message) => {
    const data = JSON.parse(message.toString());
    console.log('Received data:', data);
    await sendToQueue(data);
});

// Handle errors
client.on('error', (error) => {
    console.error('MQTT Error:', error);
});

// Clean up on process termination
process.on('SIGINT', async () => {
    console.log('Process terminated. Closing connections...');
    if (channel) {
        await channel.close();
    }
    if (connection) {
        await connection.close();
    }
    client.end();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Process terminated. Closing connections...');
    if (channel) {
        await channel.close();
    }
    if (connection) {
        await connection.close();
    }
    client.end();
    process.exit(0);
});
