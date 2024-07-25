const soap = require('soap');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Define the service
const service = {
  TemperatureService: {
    TemperaturePort: {
      GetTemperature: function (args) {
        const temperatures = {
          "San Francisco": 68,
          "New York": 75,
          "Los Angeles": 72,
        };
        return {
          Temperature: temperatures[args.City] || 0,
        };
      },
    },
  },
};

// Read WSDL file
const wsdlPath = path.join(__dirname, 'service.wsdl');
const wsdl = fs.readFileSync(wsdlPath, 'utf8');

// Create SOAP server
app.listen(8000, function () {
  soap.listen(app, '/wsdl', service, wsdl, function () {
    console.log('SOAP server listening on port 8000');
  });
});
