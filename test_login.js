const https = require('https');

const data = JSON.stringify({
  email: 'testuser@ejemplo.com',
  password: 'password123'
});

const options = {
  hostname: 'finanzas-api.ubunifusoft.digital',
  port: 443,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, res => {
  let responseData = '';
  res.on('data', d => { responseData += d; });
  res.on('end', () => {
    console.log('Response:', responseData);
    const parsed = JSON.parse(responseData);
    if(parsed.data && parsed.data.token) {
      const token = parsed.data.token;
      const payload = Buffer.from(token.split('.')[1], 'base64').toString();
      console.log('JWT Payload:', payload);
    }
  });
});

req.on('error', error => { console.error(error); });
req.write(data);
req.end();
