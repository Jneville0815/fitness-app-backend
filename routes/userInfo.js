const router = require('express').Router()
const { Mongoose } = require('mongoose')
const User = require('../models/User')
const verify = require('./verifyToken')

router.get('/:id', verify, async (req, res) => {
    const user = await User.findOne(
        { _id: req.params.id },
        { password: 0 } // don't retrieve password
    )
    res.send(user)
})

router.get('/:id/fitness', verify, async (req, res) => {
    const user = await User.findOne({ _id: req.params.id })

    res.send(user.fitness)
})

router.post('/:id/fitness', verify, async (req, res) => {
    const user = await User.findOne({ _id: req.params.id })

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

router.post('/:id/addFood', verify, async (req, res) => {
    const food = {
        name: req.body.name,
        protein: req.body.protein,
        carbs: req.body.carbs,
        fat: req.body.fat,
        information: req.body.information,
    }

    const user = await User.findOne({ _id: req.params.id })

    try {
        user.food.push(food)
        user.save()
        res.send({ sent: true })
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post('/:id/addCurrentFood', verify, async (req, res) => {
    const food = {
        name: req.body.name,
        protein: req.body.protein,
        carbs: req.body.carbs,
        fat: req.body.fat,
        information: req.body.information,
    }

    const user = await User.findOne({ _id: req.params.id })

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

router.post('/:id/removeCurrentFood', verify, async (req, res) => {
    const user = await User.findOne({ _id: req.params.id })
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

router.post('/:id/dailyReset', verify, async (req, res) => {
    const user = await User.findOne({ _id: req.params.id })
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

router.post('/:id/addQuote', verify, async (req, res) => {
    const quote = {
        source: req.body.source,
        quote: req.body.quote,
    }

    const user = await User.findOne({ _id: req.params.id })

    try {
        user.quotes.push(quote)
        user.save()
        res.send({ sent: true })
    } catch (err) {
        res.status(400).send(err)
    }
})

router.get('/:id/getAllQuotes', async (req, res) => {
    const user = await User.findOne({ _id: req.params.id })

    res.send(user.quotes)
})

router.get('/:id/getQuote', async (req, res) => {
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            const temp = array[i]
            array[i] = array[j]
            array[j] = temp
        }
    }

    const user = await User.findOne({ _id: req.params.id })

    shuffleArray(user.quotes)

    let pointer = 0
    let foundOne = false

    while (pointer < user.quotes.length) {
        if (user.quotes[pointer].num_views === 0) {
            user.quotes[pointer].num_views = 1
            foundOne = true
            break
        }
        pointer += 1
    }

    if (foundOne === false) {
        for (let i = 0; i < user.quotes.length; i++) {
            user.quotes[i].num_views = 0
        }
    }

    try {
        user.save()
        res.send(user.quotes[pointer])
    } catch (err) {
        res.status(400).send(err)
    }
})

module.exports = router
