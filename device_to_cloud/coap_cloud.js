const coap = require('coap');

// Create CoAP server
const server = coap.createServer();

// Handle incoming CoAP requests
server.on('request', (req, res) => {
    if (req.method === 'POST') {
        const data = JSON.parse(req.payload.toString());
        console.log('Received data:', data);
        res.end('Data received');
    } else {
        res.end('Invalid request');
    }
});

// Start the CoAP server
server.listen(() => {
    console.log('CoAP server is running');
});
