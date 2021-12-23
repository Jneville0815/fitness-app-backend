const jwt = require('jsonwebtoken')
require('dotenv/config')

// Middleware that can be added to any route
module.exports = (req, res, next) => {
    let token = req.header('Authorization')
    token = token.split(' ')[1]
    if (!token) return res.status(401).send('Access Denied')

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        next()
    } catch (err) {
        res.status(400).send('Invalid token')
    }
}
