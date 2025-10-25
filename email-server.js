// Simple email server using nodemailer
// Run this with: node email-server.js

const nodemailer = require('nodemailer');

// Gmail SMTP configuration
// You'll need to enable "App Passwords" in your Gmail account
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'joy.meera@gmail.com',  // Your Gmail address
    pass: 'YOUR_APP_PASSWORD'      // Replace with your 16-character App Password
  }
});

// Email sending function
async function sendEmail(to, subject, content) {
  try {
    const mailOptions = {
      from: 'joy.meera@gmail.com',
      to: to,
      subject: subject,
      text: content,
      html: content.replace(/\n/g, '<br>') // Convert line breaks to HTML
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return { success: false, error: error.message };
  }
}

// Simple HTTP server to receive email requests
const http = require('http');
const url = require('url');

const server = http.createServer(async (req, res) => {
  // Enable CORS for web requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/send-email') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { to, subject, content } = JSON.parse(body);
        
        console.log(`📧 Sending email to: ${to}`);
        console.log(`📧 Subject: ${subject}`);
        
        const result = await sendEmail(to, subject, content);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (error) {
        console.error('❌ Server error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: error.message }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`📧 Email server running on http://localhost:${PORT}`);
  console.log(`📧 Send POST requests to http://localhost:${PORT}/send-email`);
  console.log('');
  console.log('🔧 Setup Instructions:');
  console.log('1. Enable 2-Factor Authentication in your Gmail account');
  console.log('2. Generate an App Password: https://myaccount.google.com/apppasswords');
  console.log('3. Replace "YOUR_APP_PASSWORD" in this file with your App Password');
  console.log('4. Run: node email-server.js');
  console.log('5. Your app can now send emails via: http://localhost:3001/send-email');
});
