const https = require('https');

const paths = [
  '/api/v3/api-docs',
  '/api/swagger-ui/openapi.json',
  '/v3/api-docs',
  '/api-docs',
  '/swagger.json',
  '/api/swagger.json'
];

const host = 'finanzas-api.ubunifusoft.digital';

async function checkPath(path) {
  return new Promise((resolve) => {
    const options = {
      hostname: host,
      port: 443,
      path: path,
      method: 'GET'
    };

    const req = https.request(options, (res) => {
      resolve({ path, status: res.statusCode });
    });

    req.on('error', (e) => {
      resolve({ path, status: 0, error: e.message });
    });

    req.end();
  });
}

async function main() {
  console.log('Probing Swagger endpoints...');
  for (const path of paths) {
    const result = await checkPath(path);
    console.log(`Path: ${result.path} - Status: ${result.status}`);
  }
}

main();
