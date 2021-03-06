const { check } = require('express-validator')

const NewTransactionValidator = [
    check('userId', 'Please supply the customers ID')
        .isString()
        .not()
        .isEmpty(),
    check('iam', 'Please supply the merchat IAM')
        .isString()
        .not()
        .isEmpty(),
    check('gemsToDeduct').isNumeric(),
    check('transactionId').isString()
]

const BreakdownValidator = [
    check('userId', 'Please supply the customers ID')
        .isString()
        .not()
        .isEmpty(),
    check('iam', 'Please supply the merchat IAM')
        .isString()
        .not()
        .isEmpty(),
    check('gemsToDeduct').isNumeric(),
    check('transactionTotal').isString()
]

module.exports = {
    NewTransactionValidator,
    BreakdownValidator
}
