const client = require('./codaClient');

const CODA_BANK_TABLE_ID = process.env.CODA_BANK_TABLE_ID;
const CODA_VENMO_TABLE_ID = process.env.CODA_VENMO_TABLE_ID;

exports.updateBankTable = async function(updates) {
  return client.addTableRows(CODA_BANK_TABLE_ID, updates, [ "c-CZPkqDC8jp" ]);
}

exports.updateVenmoTable = async function(updates) {
  return client.addTableRows(CODA_VENMO_TABLE_ID, updates, []);
}
