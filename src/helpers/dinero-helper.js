const mongoose = require('mongoose')
const Dinero = require('dinero.js')
const _ = require('lodash')

const DineroSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    precision: { type: Number, required: true },
    currency: { type: String, required: true },
})

const toDinero = (value, padWithPrecisionZeros = false) => {
    /* Pad while respecting the precsison */
    const pad = (x, p) => Number.parseInt(String(x) + _.repeat('0', p))

    let opts = { amount: 0, currency: 'NGN', precision: 2 }

    if (typeof value === 'number') opts.amount = value
    else if (typeof value === 'object')
        opts = { opts, ..._.pick(value, ['amount', 'currency', 'precision']) }

    if (padWithPrecisionZeros) opts.amount = pad(opts.amount, opts.precision)

    return Dinero({ ...opts })
}

const stripPrecision = value => {
    const val = value.getAmount().toString()
    return Number.parseInt(val.substr(0, val.length - value.getPrecision()))
}

module.exports = {
    DineroSchema,
    toDinero,
    stripPrecision,
}
