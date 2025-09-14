const Joi = require('joi');

const contactSchema = Joi.object({
    email: Joi.string().email().required(),
    fullName: Joi.string().required(),
    whatsappNumber: Joi.string().allow(null).default(null),
    subject: Joi.string().required(),
    message: Joi.string().required()
})

const validateContact = (contactDetails)=>{
    try {
      const {error, value} =  contactSchema.validate(contactDetails)
      console.log('value, error', value, error);
      return {value: value, error:error}
    } catch (er){
       return {error: er}
    }
}

module.exports = {
    contactSchema,
    validateContact
}