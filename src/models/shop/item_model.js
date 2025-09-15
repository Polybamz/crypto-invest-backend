// {
//   id: 1,
//   name: "AntMiner S19 Pro",
//   price: 2499,
//   hashRate: "110 TH/s",
//   powerConsumption: "3250W",
//   efficiency: "29.5 J/TH",
//   roi: "12-18 months",
//   inStock: true,
//   image: "/placeholder.svg"
// }


import Joi from 'joi';
const shopItemSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().positive().required(),
    hashRate: Joi.string().optional(),
    powerConsumption: Joi.string().required(),
    efficiency: Joi.string().optional(),
    roi: Joi.string().allow(null).default(null),
    inStock: Joi.boolean().default(true),
    image: Joi.string().required(),
});

const validateShopItemSchema = (item) => {
    try {
        const { error, value } = shopItemSchema.validate(item);
        if (error) {
            const message = error.details[0].message;
            console.log('Validation error:', message);
            return { value: null, error: message };
        }
        return { value, error: null };
    } catch (error) {
        const message = 'Validation error';
        console.log('error', message);
        return { value: null, error: message };
    }
}

export {
    shopItemSchema,
    validateShopItemSchema
}