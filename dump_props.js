const data = require('./formatted.json');
const fs = require('fs');
const out = {
  CreditCardRequest: data.components.schemas.CreditCardRequest.properties,
  CreditCardPaymentRequest: data.components.schemas.CreditCardPaymentRequest.properties
};
fs.writeFileSync('pagos_props.json', JSON.stringify(out, null, 2));
