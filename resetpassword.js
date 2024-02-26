//Backend (Node.js with Express) 

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 5000;

// Example database (Replace this with your actual database setup)
let users = {
    "user@example.com": {
        password: "password123"
    }
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Nodemailer configuration (replace with your email configuration)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your_email@gmail.com',
        pass: 'your_password'
    }
});

// Route to handle password reset request
app.post('/forgot-password', (req, res) => {
    const { email } = req.body;

    if (!users[email]) {
        return res.status(404).json({ error: "User not found" });
    }

    const token = crypto.randomBytes(20).toString('hex');
    users[email].resetToken = token;

    const mailOptions = {
        from: 'your_email@gmail.com',
        to: email,
        subject: 'Password Reset',
        html: `
            <p>You are receiving this email because you (or someone else) has requested the reset of the password for your account.</p>
            <p>Please click on the following link, or paste this into your browser to complete the process:</p>
            <a href="http://localhost:3000/reset-password/${token}">Reset Password</a>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: 'Failed to send email' });
        }
        console.log('Email sent: ' + info.response);
        res.status(200).json({ message: 'Email sent successfully' });
    });
});

// Route to handle password reset
app.post('/reset-password/:token', (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const email = Object.keys(users).find(userEmail => users[userEmail].resetToken === token);

    if (!email) {
        return res.status(404).json({ error: 'Invalid or expired token' });
    }

    users[email].password = password;
    delete users[email].resetToken;

    res.status(200).json({ message: 'Password reset successfully' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

Certainly! Below is a basic implementation of the password reset flow using React for the frontend, Node.js for the backend, and Bootstrap for UI framing. This example assumes you have a basic understanding of setting up a React app and a Node.js server.

Backend (Node.js with Express)

javascript
Copy code
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 5000;

// Example database (Replace this with your actual database setup)
let users = {
    "user@example.com": {
        password: "password123"
    }
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Nodemailer configuration (replace with your email configuration)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your_email@gmail.com',
        pass: 'your_password'
    }
});

// Route to handle password reset request
app.post('/forgot-password', (req, res) => {
    const { email } = req.body;

    if (!users[email]) {
        return res.status(404).json({ error: "User not found" });
    }

    const token = crypto.randomBytes(20).toString('hex');
    users[email].resetToken = token;

    const mailOptions = {
        from: 'your_email@gmail.com',
        to: email,
        subject: 'Password Reset',
        html: `
            <p>You are receiving this email because you (or someone else) has requested the reset of the password for your account.</p>
            <p>Please click on the following link, or paste this into your browser to complete the process:</p>
            <a href="http://localhost:3000/reset-password/${token}">Reset Password</a>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: 'Failed to send email' });
        }
        console.log('Email sent: ' + info.response);
        res.status(200).json({ message: 'Email sent successfully' });
    });
});

// Route to handle password reset
app.post('/reset-password/:token', (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const email = Object.keys(users).find(userEmail => users[userEmail].resetToken === token);

    if (!email) {
        return res.status(404).json({ error: 'Invalid or expired token' });
    }

    users[email].password = password;
    delete users[email].resetToken;

    res.status(200).json({ message: 'Password reset successfully' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


//Frontend (React with Bootstrap UI)

import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleForgotPassword = async () => {
        try {
            await axios.post('http://localhost:5000/forgot-password', { email });
            setMessage('Password reset email sent successfully');
        } catch (error) {
            setMessage(error.response.data.error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Forgot Password</h2>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button className="btn btn-primary" onClick={handleForgotPassword}>Submit</button>
            {message && <p className="mt-3">{message}</p>}
        </div>
    );
};

export default ForgotPassword;

