const dotenv = require('dotenv')
dotenv.config()

const bodyParser = require('body-parser')
const express = require('express')
const moment = require('moment')

const { fetchTransactions } = require('../lib/fetch')
const { transformBankToUpdates, transformVenmoToUpdates } = require('../lib/transform')
const { updateBankTable, updateVenmoTable } = require('../lib/update')

const app = express()
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json())

var lastUpdatedPlaid = 0;

// Webhook called by Plaid to report a new transaction
app.all('/plaid', (request, response, next) => {
  console.log("Plaid webhook triggered");

  const currentTime = moment().unix();
  if(currentTime - lastUpdatedPlaid < 60) {
    console.log("Plaid webhook was called very recently, so skipping Coda update");
    response.sendStatus(400);
    return;
  } else {
    lastUpdatedPlaid = currentTime;
    response.sendStatus(200);
  }

  fetchTransactions()
    .then((transactions) => transformBankToUpdates(transactions))
    .then((updates) => updateBankTable(updates))
    .catch(next);
});

// Webhook called by Zapier to report a new email from Venmo
app.post('/venmo', (request, response, next) => {
  console.log("Venmo webhook triggered");
  response.sendStatus(200);

  const body = request.body.body;
  const subject = request.body.subject;

  let regExp;
  let negate;
  if(subject.includes("completed your")) {
    regExp = /You\s*charged\s*([^\n]*)\s*(.*)\s*Transfer Date and Amount:\s*[^$]*\$((?:\d|\.)*)/g
    negate = true;
  } else if(subject.includes("paid you")) {
    regExp = /([^\n]*)\s*paid\s*You\s*(.*)\s*Transfer Date and Amount:\s*[^$]*\$((?:\d|\.)*)/g
    negate = true;
  } else if(subject.includes("You paid")) {
    regExp = /You\s*paid\s*([^\n]*)\s*(.*)\s*Transfer Date and Amount:\s*[^$]*\$((?:\d|\.)*)/g
    negate = false;
  } else if(subject.includes("You completed")) {
    regExp = /([^\n]*)\s*(.*)\s*charged\s*You\s*Transfer Date and Amount:\s*[^$]*\$((?:\d|\.)*)/g
    negate = false;
  } else {
    console.log("Ignoring unmatched email with subject: " + subject);
    return;
  }

  const match = regExp.exec(body)
  counterparty = match[1];
  description = match[2];
  amount = (negate ? "-" : "") + match[3];
  console.log("Processed email with subject: " + subject + ". " + counterparty + " | " + description + " | " + amount);

  const transactions = [{counterparty, description, amount}];
  const updates = transformVenmoToUpdates(transactions);
  updateVenmoTable(updates);
});

const PORT = process.env.PORT || 8080
var server = app.listen(PORT, function() {
  console.log(`Server started port ${PORT}`);
});