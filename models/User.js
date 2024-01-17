const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 8,
    },
    name: {
        type: String,
        required: true,
        max: 100,
        min: 1,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    fitness: {
        currentDay: {
            type: Number,
            required: false,
            default: 0,
        },
        benchMax: {
            type: Number,
            required: false,
            default: 0,
        },
        deadliftMax: {
            type: Number,
            required: false,
            default: 0,
        },
        squatMax: {
            type: Number,
            required: false,
            default: 0,
        },
        pressMax: {
            type: Number,
            required: false,
            default: 0,
        },
        note: {
            type: String,
            required: false,
            default: "",
        }
    },
    quotes: [
        {
            source: {
                type: String,
                required: true,
                max: 100,
                min: 1,
            },
            quote: {
                type: String,
                required: true,
                max: 1000,
                min: 1,
            },
            num_views: {
                type: Number,
                required: false,
                default: 0,
            },
            date: {
                type: Date,
                default: Date.now,
            },
        },
    ],
})

module.exports = mongoose.model('User', UserSchema)
