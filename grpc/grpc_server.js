// grpc_server.js
const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
const { DataModel } = require('./models');

// Load the protobuf file
const protoFile = path.resolve(__dirname, 'sensor.proto');
const protoDefinition = protoLoader.loadSync(protoFile, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const protoDescriptor = grpc.loadPackageDefinition(protoDefinition);
const sensorProto = protoDescriptor.sensor;

// MongoDB setup
mongoose.connect('mongodb://localhost:27017/DB');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

function sendData(call, callback) {
    const data = call.request;
    console.log('Received data in gRPC server:', data); // Log received data from cloud server

    // Map data to MongoDB schema and save
    const newData = new DataModel({
        device_id: data.deviceId,
        timestamp: new Date(),
        temperature1: data.temperature1,
        temperature2: data.temperature2,
        humidity1: data.humidity1,
        humidity2: data.humidity2,
        dsu_data: data.dsuData
    });

    newData.save()
        .then(() => {
            console.log('Data saved to MongoDB:', newData);
            callback(null, { status: 'success' });
        })
        .catch(error => {
            console.error('Error saving data to MongoDB:', error.message);
            callback(error, null);
        });
}


function main() {
    const server = new grpc.Server();
    server.addService(sensorProto.SensorService.service, { sendData });
    server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error('Failed to bind gRPC server:', err);
        } else {
            console.log(`gRPC server running at http://0.0.0.0:${port}`);
            server.start();
        }
    });
}

main();
