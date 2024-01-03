const router = require('express').Router()
const { Mongoose } = require('mongoose')
const User = require('../models/User')
const verify = require('./verifyToken')
const { OpenAI } = require('openai')

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

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

router.post('/:id/removeFood/:food_name', verify, async (req, res) => {
    const user = await User.findOne({ _id: req.params.id })

    try {
        let i = user.food.findIndex((x) => x.name === req.params.food_name)
        user.food.splice(i, 1)
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
    const user = await User.findOne({ _id: req.params.id })

    const views = user.quotes.map(quote => quote.num_views)

    const quote = {
        source: req.body.source,
        quote: req.body.quote,
        num_views: Math.max(...views)
    }

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
    function getRandomObject(arr) {
        if (arr.length === 0) {
            return null
        }
        return Math.floor(Math.random() * arr.length);
    }

    function getMedianOfViews(quotes) {
        if (quotes.length === 0) {
            return null
        }
        const views = quotes.map(quote => quote.num_views);

        const sortedViews = views.sort((a, b) => a - b);

        const middleIndex = Math.floor(sortedViews.length / 2);
        if (sortedViews.length % 2 === 0) {
            return (sortedViews[middleIndex - 1] + sortedViews[middleIndex]) / 2;
        } else {
            return sortedViews[middleIndex];
        }
    }

    async function chatgptQuote() {
        const quotes = user.quotes.map(quote => `${quote.source}: ${quote.quote}`)

        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "Given this string of quotes where the format is `SOURCE: QUOTE\n`, give me an original quote that's related to all of the other quotes. There is no need to add a SOURCE. Max of 80 characters" }, {role: "user", content: quotes.join("\n")}],
            model: "gpt-4",
        });

        return completion.choices[0].message.content
    }

    const user = await User.findOne({ _id: req.params.id })

    if(Math.random() > 0.25) {
        const median = getMedianOfViews(user.quotes)
        let i = 0
        while(true) {
            i = getRandomObject(user.quotes)
            if(user.quotes[i].num_views <= median) {
                break
            }
        }

        try {
            user.quotes[i].num_views += 1
            user.save()
            res.send(user.quotes[i])
        } catch (err) {
            res.status(400).send(err)
        }
    } else {
        try {
            chatgptQuote().then(data => res.send({source: "ChatGPT", quote: data}))
        } catch (err) {
            res.status(400).send(err)
        }
    }
})

module.exports = router
