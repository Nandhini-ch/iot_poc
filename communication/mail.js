const nodemailer = require('nodemailer');

// Create a transporter object
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, // Use 587 for TLS
    secure: false, // Set to true if using port 465
    auth: {
        user: 'nandy20nn@gmail.com', // your email address
        pass: 'kcdx offf rcad mxvz' // your password or app password
    }
});

// Email options
const mailOptions = {
    from: 'nandy20nn@gmail.com', // sender address
    to: 'challakolusunandini20@gmail.com', // list of receivers
    subject: 'Test Email from Node.js', // Subject line
    text: 'Hello! This is a test email sent from a Node.js application.', // plain text body
    // html: '<h1>Hello!</h1><p>This is a test email sent from a Node.js application.</p>' // HTML body
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log('Error occurred: ' + error.message);
    }
    console.log('Email sent: ' + info.response);
});
