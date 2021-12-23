const serverless = require('serverless-http')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv/config')
const app = express()

const localTesting = true

// Connect to DB:
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('connected')
)

app.use(cors())
app.use(express.json())

const authRoute = require('./routes/auth')
app.use('/api/user', authRoute)

const userInfoRoute = require('./routes/userInfo')
app.use('/api/userInfo', userInfoRoute)

app.get('/', (req, res) => {
    res.send('We are at home')
})

if (localTesting) {
    app.listen(2000)
} else {
    module.exports.handler = serverless(app)
}
