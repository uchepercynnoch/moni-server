const authJwt = require('express-jwt')
const UserAccount = require('../models/useraccount.model')

const parseObjectId = value => mongoose.Types.ObjectId.createFromHexString(value)

const uploadDestination = '/uploads'

const jwtAuthMiddleware = authJwt({
    secret: process.env.JWT_SECRET,
})

async function checkVerifiedStatus(req) {
    const result = await UserAccount.findOne({ id: req.body.userId })

    if (result && result.verified) return true
    return false
}

module.exports = {
    authJwt,
    jwtAuthMiddleware,
    checkVerifiedStatus,
    uploadDestination,
    parseObjectId,
}
