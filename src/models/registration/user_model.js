const Joi = require('joi');
const userSchema = Joi.object({
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required(),
    referralCode: Joi.string().allow(null).default(null),
    referredBy: Joi.string().allow(null).default(null),
});

const validateUser = (user) => {
    try {
        return { value: value.value, error: null };
    } catch (error) {
        const message = error.details ? error.details[0].message : 'Validation error';
         console.log('error',message);
        return {value: null, error: message };
    }
}

module.exports = { userSchema, validateUser };