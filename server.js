// server.js
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = 4000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(
    // {
    //     origin:["https://indie-trip-client.vercel.app/"],
    //     methods:["POST","GET","PUT","DELETE"],
    //     credentials:true
    // }
)); // Since you're running the frontend and backend on different ports, you need to handle CORS (Cross-Origin Resource Sharing) in your Express server.

app.get('/hello', (req, res) => {
    console.log('GET / request received');
    res.send("hello world");
});

// Route to handle form submission
app.post('/submit-form', async (req, res) => {
    const { name, email,phone,destination,travelDates, message } = req.body;

    // Nodemailer configuration
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    let mailOptions = {
        from: email,
        to: process.env.ADMIN_EMAIL,
        subject: 'Customer inquiry',
        text: `New inquiry form submitted:

        Name: ${name}
        Email: ${email}
        Phone:${phone}
        Destination: ${destination}
        TravelDate:${travelDates}
        Message: ${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Form submitted successfully.');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email.');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
