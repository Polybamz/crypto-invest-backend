
import Joi from 'joi';



const feedbackSchema = Joi.object({
    id: Joi.string().required(),
    user: Joi.string().required(),
    platform: Joi.string().valid("telegram", "facebook", "instagram", "whatsapp").required(),
    amount: Joi.number().required(),
    date: Joi.string().required(),
    message: Joi.string().required(),
    link: Joi.string().allow(null),
    avatar: Joi.string().allow(null).default('/placeholder.svg'),
});

const validateFeedback = (feedback) => {
    return feedbackSchema.validate(feedback);
}

export {
    feedbackSchema,
    validateFeedback
}