const fs = require('fs');
const data = require('./api-docs-clean.json');

const schemas = {
  CreditCardRequest: data.components.schemas.CreditCardRequest,
  CreditCardPaymentRequest: data.components.schemas.CreditCardPaymentRequest
};

fs.writeFileSync('pagos_dtos.json', JSON.stringify(schemas, null, 2));
