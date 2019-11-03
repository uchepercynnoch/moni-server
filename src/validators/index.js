const {  validationResult } = require('express-validator')
const Transaction = require('./transaction.validator')

module.exports = {
    Transaction,
    validationResult,
}
