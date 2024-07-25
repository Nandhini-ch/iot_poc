function createFakeSensorData() {
    return {
        deviceId: 'device1',
        temperature1: Math.floor(Math.random() * 100),
        temperature2: Math.floor(Math.random() * 100),
        humidity1: Math.floor(Math.random() * 100),
        humidity2: Math.floor(Math.random() * 100),
        dsuData: Math.random() > 0.5 ? 'on' : 'off',
    };
}

module.exports = { createFakeSensorData };
