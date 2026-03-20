const fs = require('fs');
const data = require('./api-docs-clean.json');

const creditCardPaths = {
  '/api/credit-cards': data.paths['/api/credit-cards'],
  '/api/credit-cards/{id}/pagos': data.paths['/api/credit-cards/{id}/pagos']
};

fs.writeFileSync('pagos_schema.json', JSON.stringify(creditCardPaths, null, 2));
