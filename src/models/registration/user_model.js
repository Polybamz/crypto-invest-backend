const Joi = require('joi');
const userSchema = Joi.object({
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required(),
    referralCode: Joi.string().allow(null).default(null),
    referredBy: Joi.array().items(Joi.string()).default([]),
});

const validateUser = (user) => {
    try {
        const value = userSchema.validate(user);
         console.log('value',value);
        return { value: value.value , error: null };
    } catch (error) {
        const message = error.details ? error.details[0].message : 'Validation error';
         console.log('error',message);
        return {value: null, error: message };
    }
}

module.exports = { userSchema, validateUser };