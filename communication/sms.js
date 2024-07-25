const twilio = require('twilio');

// Twilio credentials
const accountSid = 'your_account_sid'; // Your Account SID
const authToken = 'your_auth_token'; // Your Auth Token

// Create a Twilio client
const twilioClient = twilio(accountSid, authToken);

// Function to send SMS
const sendSMS = (to, body) => {
    twilioClient.messages
        .create({
            body: body,
            from: 'your_twilio_phone_number', // Your Twilio phone number
            to: to // The recipient's phone number
        })
        .then((message) => console.log('SMS sent successfully:', message.sid))
        .catch((error) => console.error('Error sending SMS:', error));
};

// Example usage
// sendSMS('+1234567890', 'Alert! The temperature has exceeded the threshold.');


// const twilio = require('twilio');

// const accountSid = 'your_account_sid'; // Your Account SID
// const authToken = 'your_auth_token'; // Your Auth Token
// const twilioClient = twilio(accountSid, authToken);

// const sendSMS = (to, message) => {
//     twilioClient.messages.create({
//         body: message,
//         from: 'your_twilio_phone_number', // Your Twilio number
//         to: to // Recipient's phone number in E.164 format
//     })
//     .then(message => console.log('SMS sent:', message.sid))
//     .catch(error => console.error('Error sending SMS:', error));
// };

// // Example usage
// sendSMS('+91720051XXXX', 'Alert! The temperature has exceeded the threshold.');

