const soap = require('soap');

const url = 'http://localhost:8000/wsdl?wsdl';

const args = { City: 'San Francisco' };

soap.createClient(url, function (err, client) {
  if (err) throw err;
  client.GetTemperature(args, function (err, result) {
    if (err) throw err;
    console.log('Temperature in San Francisco:', result.Temperature);
  });
});
