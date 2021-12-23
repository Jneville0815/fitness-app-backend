const Joi = require('@hapi/joi')

const registerValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(8).required(),
        name: Joi.string(),
        targetProtein: Joi.number(),
        targetCarbs: Joi.number(),
        targetFat: Joi.number(),
    })
    return schema.validate(data)
}

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(8).required(),
    })
    return schema.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
