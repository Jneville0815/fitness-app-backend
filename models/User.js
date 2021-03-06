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
    nutrition: {
        currentProtein: {
            type: Number,
            required: false,
            default: 0,
        },
        currentCarbs: {
            type: Number,
            required: false,
            default: 0,
        },
        currentFat: {
            type: Number,
            required: false,
            default: 0,
        },
        targetProtein: {
            type: Number,
            required: true,
            max: 1000,
            min: 0,
        },
        targetCarbs: {
            type: Number,
            required: true,
            max: 1000,
            min: 0,
        },
        targetFat: {
            type: Number,
            required: true,
            max: 1000,
            min: 0,
        },
    },
    fitness: {
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
    },
    food: [
        {
            name: { type: String },
            protein: { type: Number },
            carbs: { type: Number },
            fat: { type: Number },
            information: { type: String },
        },
    ],
    currentFood: [
        {
            name: { type: String },
            protein: { type: Number },
            carbs: { type: Number },
            fat: { type: Number },
            information: { type: String },
        },
    ],
})

module.exports = mongoose.model('User', UserSchema)
