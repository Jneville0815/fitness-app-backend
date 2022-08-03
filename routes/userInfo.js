const router = require('express').Router()
const { Mongoose } = require('mongoose')
const User = require('../models/User')
const verify = require('./verifyToken')

router.get('/:email', verify, async (req, res) => {
    const user = await User.findOne(
        { email: req.params.email },
        { password: 0 } // don't retrieve password
    )
    res.send(user)
})

router.get('/:email/fitness', verify, async (req, res) => {
    const user = await User.findOne({ email: req.params.email })

    res.send(user.fitness)
})

router.post('/:email/fitness', async (req, res) => {
    const user = await User.findOne({ email: req.params.email })

    try {
        user.fitness.benchMax = req.body.benchMax
        user.fitness.deadliftMax = req.body.deadliftMax
        user.fitness.squatMax = req.body.squatMax
        user.fitness.pressMax = req.body.pressMax
        user.save()
        res.send({ sent: true })
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post('/:email/addFood', async (req, res) => {
    const food = {
        name: req.body.name,
        protein: req.body.protein,
        carbs: req.body.carbs,
        fat: req.body.fat,
        information: req.body.information,
    }

    const user = await User.findOne({ email: req.params.email })

    try {
        user.food.push(food)
        user.save()
        res.send({ sent: true })
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post('/:email/addCurrentFood', async (req, res) => {
    const food = {
        name: req.body.name,
        protein: req.body.protein,
        carbs: req.body.carbs,
        fat: req.body.fat,
        information: req.body.information,
    }

    const user = await User.findOne({ email: req.params.email })

    try {
        user.currentFood.push(food)
        user.nutrition['currentProtein'] = req.body.currentProtein
        user.nutrition['currentCarbs'] = req.body.currentCarbs
        user.nutrition['currentFat'] = req.body.currentFat
        user.save()
        res.send({ sent: true })
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post('/:email/removeCurrentFood', async (req, res) => {
    const user = await User.findOne({ email: req.params.email })
    try {
        let i = user.currentFood.findIndex((x) => x.name === req.body.name)
        user.currentFood.splice(i, 1)
        user.nutrition['currentProtein'] = req.body.currentProtein
        user.nutrition['currentCarbs'] = req.body.currentCarbs
        user.nutrition['currentFat'] = req.body.currentFat
        user.save()
        res.send({ sent: true })
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post('/:email/dailyReset', async (req, res) => {
    const user = await User.findOne({ email: req.params.email })
    try {
        user.currentFood = []
        user.nutrition['currentProtein'] = 0
        user.nutrition['currentCarbs'] = 0
        user.nutrition['currentFat'] = 0
        user.save()
        res.send({ sent: true })
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post('/:email/addQuote', async (req, res) => {
    const quote = {
        title: req.body.title,
        page: req.body.page,
        quote: req.body.quote,
    }

    const user = await User.findOne({ email: req.params.email })

    try {
        user.quotes.push(quote)
        user.save()
        res.send({ sent: true })
    } catch (err) {
        res.status(400).send(err)
    }
})

router.get('/:email/getAllQuotes', async (req, res) => {
    const user = await User.findOne({ email: req.params.email })

    res.send(user.quotes)
})

module.exports = router
