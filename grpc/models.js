const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    device_id: String,
    timestamp: Date,
    temperature1: Number,
    temperature2: Number,
    humidity1: Number,
    humidity2: Number,
    dsu_data: String
});

const DataModel = mongoose.model('Data', dataSchema);

module.exports = { DataModel };




