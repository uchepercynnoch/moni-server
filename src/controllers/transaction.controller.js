const router = require('express').Router()
const Transaction = require('../models/transactionRecord.model')
const {
    Transaction: { NewTransactionValidator, BreakdownValidator },
    validationResult
} = require('../validators')
const UserAccount = require('../models/useraccount.model')
const Merchant = require('../models/merchant.model')
const TransactionRecord = require('../models/transactionRecord.model')
const Vendor = require('../models/vendor.model')
const shortid = require('shortid')
const { parseObjectId } = require('../helpers/helper')
const { fetchTransactionFromDB } = require('../helpers/db-helper')
const { toDinero, stripPrecision } = require('../helpers/dinero-helper')
const mongoose = require("mongoose");

const computeTransactionBreakdown = ({
    currentGems,
    total,
    gemsToDeduct,
    membershipType,
    loyaltyPercentage
}) => {
    let amountToPay = total

    /* Todo: use a more complex algorithm, to detect if the user has enough points 
     taking into consideration free gems and claimables */
    if (currentGems < gemsToDeduct) {
        throw new Error(
            "User doesn't have enough points to process transaction"
        )
    }

    /* Apply a discount based on gems to deduct (if any) 
       NOTE: conversion of gems to cash assumes 1 GEM -> 1 NGA */
    const gemDiscount = toDinero(gemsToDeduct, true)
    amountToPay = amountToPay.subtract(gemDiscount)

    /* Apply a discount based on membership type */
    const membershipDiscountMap = {
        regular: 0,
        blue: 5,
        gold: 10,
        platinum: 30
    }
    const discountFactor = membershipDiscountMap[membershipType]
    const membershipDiscount = amountToPay.percentage(discountFactor)
    /* Payable is the un-used portion of the fixed membership discount  */
    const payable = amountToPay.percentage(loyaltyPercentage - discountFactor)
    amountToPay = amountToPay.subtract(membershipDiscount)

    /* Compute the number of gem points the user can gain from the transaction */
    const cashToGemFactor = 100
    const gemsToAward = stripPrecision(amountToPay.divide(cashToGemFactor))

    return {
        payable,
        gemsToAward,
        amountToPay,
        gemsToAward,
        discount: { membershipDiscount, gemDiscount }
    }
}

router.post('/breakdown', BreakdownValidator, async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error = { error: errors.array({ onlyFirstError: true })[0] }
        return res.status(400).json(error)
    }

    const { userId, iam, gemsToDeduct = 0, transactionTotal } = req.body

    const user = await UserAccount.findOne({ id: userId })
    if (!user) return res.status(400).send({ error: 'invalid user id' })

    const merchant = await Merchant.findOne({ iam })
    if (!merchant) return res.status(400).send({ error: 'invalid merchant id' })

    const vendor = await Vendor.findOne({ _id: merchant.vendor })
    if (!vendor)
        return res
            .status(400)
            .send({ error: "can't find parent vendor for merchant" })

    total = toDinero(Number.parseInt(transactionTotal.replace(/\./gi, '')))

    let breakdown

    try {
        const options = {
            total,
            gemsToDeduct,
            membershipType: user.membershipType,
            currentGems: user.gemPoints.currentGems,
            loyaltyPercentage: vendor.loyaltyPercentage
        }
        breakdown = computeTransactionBreakdown(options)
        delete breakdown.payable
        return res.send({ ...breakdown })
    } catch (error) {
        console.log(error)
        return res.status(403).send({ error: error.message })
    }
})

router.post('/add', NewTransactionValidator, async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error = { error: errors.array({ onlyFirstError: true })[0] }
        return res.status(400).json(error)
    }

    const { userId, iam, transactionId, gemsToDeduct = 0 } = req.body

    const user = await UserAccount.findOne({ id: userId })
    if (!user) return res.status(400).send({ error: 'invalid user id' })

    const merchant = await Merchant.findOne({ iam })
    if (!merchant) res.status(400).send({ error: 'invalid merchant id' })

    const vendor = await Vendor.findOne({ _id: merchant.vendor })
    if (!vendor)
        res.status(400).send({ error: "can't find parent vendor for merchant" })

    let transaction = { total: 0 }
    try {
        transaction = await fetchTransactionFromDB(vendor.config, transactionId)
        if (!transaction) res.status(400).send('Failed to fetch transaction')
    } catch (error) {
        console.log(error)
        res.status(400).send(error.message)
    }

    console.log(`mebership type: ${user.membershipType}`)

    const total = toDinero(
        Number.parseInt(transaction.total.replace(/\./gi, ''))
    )

    let breakdown

    try {
        const options = {
            total,
            gemsToDeduct,
            membershipType: user.membershipType,
            currentGems: user.gemPoints.currentGems,
            loyaltyPercentage: vendor.loyaltyPercentage
        }
        breakdown = computeTransactionBreakdown(options)
    } catch (error) {
        console.log(error)
        return res.status(403).send({ error: error.message })
    }

    const {
        payable,
        gemsToAward,
        amountToPay,
        discount: { membershipDiscount, gemDiscount }
    } = breakdown
    const totalSpend = toDinero(user.totalSpend).add(amountToPay)

    const ONE_HUNDRED_THOUSAND = toDinero(10000000)
    const ONE_MILLION = toDinero(100000000)
    const FIVE_MILLION = toDinero(500000000)

    // Check if user needs a membership upgrade
    if (
        totalSpend.greaterThanOrEqual(ONE_HUNDRED_THOUSAND) &&
        totalSpend.lessThan(ONE_MILLION)
    )
        user.membershipType = 'blue'
    else if (
        totalSpend.greaterThanOrEqual(ONE_MILLION) &&
        totalSpend.lessThan(FIVE_MILLION)
    )
        user.membershipType = 'gold'
    else if (totalSpend.greaterThanOrEqual(FIVE_MILLION))
        user.membershipType = 'platinum'

    user.totalSpend = totalSpend.toObject()
    user.decrementGems(gemsToDeduct)
    user.incrementGems(gemsToAward)

    /* Update cash fields on the vendor model */
    vendor.payable = toDinero(vendor.payable)
        .add(amountToPay)
        .toObject()
    vendor.revenue = toDinero(vendor.revenue)
        .add(payable)
        .toObject()
    vendor.total = toDinero(vendor.total)
        .add(total)
        .toObject()

    // Create a transaction record to represent the transaction
    const transactionRecord = new TransactionRecord({
        transactionId: shortid.generate(),
        user: user._id,
        vendor: vendor._id,
        discount: {
            gems: gemDiscount.toObject(),
            membership: membershipDiscount.toObject()
        },
        /* Todo: skip this field if we're on a 3rd party vendor */
        items: transaction.products,
        payable: payable.toObject(),
        servicedBy: merchant._id,
        total: total.toObject(),
        gemsAwarded: gemsToAward,
        gemsDeducted: gemsToDeduct
    })

    console.log(`gem discount: ${gemDiscount.toFormat()}`)
    console.log(`membership discount: ${membershipDiscount.toFormat()} `)
    console.log(`payable: ${payable.toFormat()} `)
    console.log(`user pays: ${amountToPay.toFormat()}`)
    console.log(`user awarded: ${gemsToAward} gems`)
    console.log(`deducted: ${gemsToDeduct} gems`)

    try {
        await Promise.all([
            user.save(),
            vendor.save(),
            merchant.save(),
            transactionRecord.save()
        ])
        return res.send(
            await TransactionRecord.findOne({
                transactionId: transactionRecord.transactionId
            }).lean()
        )
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

router.get('/', async (req, res) => {
    let query = {},
        findOne = false

    if (req.query.userId) query = { user: parseObjectId(req.query.userId) }
    if (req.query.vendorId)
        query = { vendor: parseObjectId(req.query.vendorId) }
    if (req.query.id) {
        query = { transactionId: req.query.id }
        findOne = true
    }

    let predicator = findOne ? Transaction.findOne : Transaction.find
    predicator = predicator.bind(Transaction)
    try {
        const result = await predicator({ ...query })
            .populate('servicedBy', 'iam')
            .populate('user', 'name')
            .select({ _id: 0 })
            .lean()

        return res.send(result)
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: error.message })
    }
})

module.exports = router
