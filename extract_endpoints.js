const fs = require('fs');
const data = require('./api-docs-clean.json');
fs.writeFileSync('endpoints.txt', Object.keys(data.paths).join('\n'));
