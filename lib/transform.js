const moment = require('moment')

/**
 *
 * Updates should be in the form of:
 *
 * {
 *   "cells": [
 *     {
 *       "column": "column name",
 *       "value": "value"
 *     }, {
 *     {
 *       "column": "column name",
 *       "value": "value"
 *     }, ...
 *   ]
 * }
 *
 */

exports.transformBankToUpdates = function(transactions) {
  /**
   *
   * Implement your custom logic of transforming transactions into
   * Coda rows.
   *
   * Transactions come in the format of:
   * {
   *   account: 'paypal',
   *   name: 'Payment from XXX',
   *   date: 2019-xx-xx,
   *   amount: 123
   *   category: [ 'Food and Drink', 'Restaurants' ],
   *   transaction_id: '8oVROayy18se85dAZYnni1mE0xz7k4IyqJwON',
   *   pending: false
   * }
   *
   */

  const updates = transactions
    .filter(({pending}) => !pending)
    .filter(({transaction_id}) => transaction_id)
    .map((transaction) => (
      {
        "cells": [
          {
            column: "c-zat6_xj5Eh",
            value: transaction.name
          }, {
            column: "c-fTNn07aQqU",
            value: transaction.date
          }, {
            column: "c-kgE4uCkBJY",
            value: transaction.amount
          }, {
            column: "c-9CoHgGkmhE",
            value: transaction.category[0]
          }, {
            column: "c-FCxOOtprRW",
            value: transaction.category[1]
          }, {
            column: "c-VeqTQImSAz",
            value: transaction.category[2]
          }, {
            column: "c-CZPkqDC8jp",
            value: transaction.transaction_id
          }
        ]
      }
    ));
  return updates
}

exports.transformVenmoToUpdates = function(transactions) {
  /**
   *
   * Implement your custom logic of transforming transactions into
   * Coda rows.
   *
   * Transactions come in the format of:
   * {
   *   counterparty: 'Annie Chen',
   *   description: 'Potatoes',
   *   amount: "1.5"
   * }
   *
   */

  const updates = transactions
    .map((transaction) => (
      {
        "cells": [
          {
            column: "c-pPYPq-FSOs",
            value: transaction.description
          }, {
            column: "c-nkykPcBVbU",
            value: transaction.counterparty
          }, {
            column: "c-kBRRjHbtDw",
            value: transaction.amount
          }, {
            column: "c-MOdq9kfVB4",
            value: moment().format("YYYY-MM-DD")
          }
        ]
      }
    ));
  return updates
}
