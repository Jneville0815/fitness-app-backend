const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv/config')
const { registerValidation, loginValidation } = require('../validation')

router.post('/register', async (req, res) => {
    // Validation
    const { error } = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // Check if user already exists
    const emailExists = await User.findOne({ email: req.body.email })
    if (emailExists) return res.status(400).send('Email already exists')

    // Hashing
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        email: req.body.email,
        password: hashPassword,
        name: req.body.name,
        nutrition: {
            targetProtein: req.body.targetProtein,
            targetCarbs: req.body.targetCarbs,
            targetFat: req.body.targetFat,
        },
    })

    try {
        const savedUser = await user.save() // Saves to database
        res.send({ user: user._id }) // The response received by user after sending post request
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post('/login', async (req, res) => {
    // Validation
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // Check if email exists
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('Email does not exist')

    // Check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(400).send('Invalid password')

    // Create json web token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
    // const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
    //     expiresIn: '1h',
    // })

    res.header('Authorization', token).send({ token: token, user_id: user._id })
})

module.exports = router
