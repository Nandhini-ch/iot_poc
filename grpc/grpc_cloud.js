const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const app = express();
const PORT = 3000;

// Load the protobuf file
const protoFile = './sensor.proto'; // Replace with your actual path
const protoDefinition = protoLoader.loadSync(protoFile, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const protoDescriptor = grpc.loadPackageDefinition(protoDefinition);
const sensorProto = protoDescriptor.sensor;

// gRPC client setup
const grpcClient = new sensorProto.SensorService('localhost:50052', grpc.credentials.createInsecure());

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to receive sensor data from devices
app.post('/sensor-data', async (req, res) => {
    const data = req.body;
    console.log('Received data in cloud server:', data);

    // Call gRPC server
    grpcClient.sendData(data, (err, grpcResponse) => {
        if (err) {
            console.error('Error forwarding data to the gRPC server:', err);
            res.status(500).send('Error forwarding data to the gRPC server');
        } else {
            console.log('Data forwarded to gRPC server:', grpcResponse);
            res.status(200).send('Data received and forwarded to the gRPC server');
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Cloud server running on port ${PORT}`);
});
