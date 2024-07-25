const soap = require('soap');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// In-memory data store
const temperatures = {};

// Define the SOAP service
const service = {
  TemperatureService: {
    TemperaturePort: {
      // Create Temperature
      CreateTemperature: function (args) {
        temperatures[args.City] = args.Temperature;
        return { Status: 'Success' };
      },

      // Update Temperature
      UpdateTemperature: function (args) {
        if (temperatures[args.City] !== undefined) {
          temperatures[args.City] = args.Temperature;
          return { Status: 'Updated' };
        } else {
          return { Status: 'City not found' };
        }
      },

      // Get Temperature by City
      GetTemperatureById: function (args) {
        return {
          Temperature: temperatures[args.City] || 0,
        };
      },

      // Delete Temperature
      DeleteTemperature: function (args) {
        if (temperatures[args.City] !== undefined) {
          delete temperatures[args.City];
          return { Status: 'Deleted' };
        } else {
          return { Status: 'City not found' };
        }
      },
    },
  },
};

// Read the WSDL file
const wsdlPath = path.join(__dirname, 'service.wsdl');
const wsdl = fs.readFileSync(wsdlPath, 'utf8');

// Create and start the SOAP server
app.listen(8000, function () {
  soap.listen(app, '/wsdl', service, wsdl, function () {
    console.log('SOAP server listening on port 8000');
  });
});
