const https = require('https');
const fs = require('fs');

https.get('https://finanzas-api.ubunifusoft.digital/api-docs', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    fs.writeFileSync('api-docs-clean.json', data);
    const api = JSON.parse(data);
    const paths = Object.keys(api.paths);
    console.log('Available endpoints:');
    paths.forEach(p => console.log(p));
  });
}).on('error', (err) => {
  console.error(err);
});
