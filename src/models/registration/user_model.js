import Joi from "joi";

export const userSchema = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  username: Joi.string().required(),
  referralCode: Joi.string().allow(null).default(null),
  referredBy: Joi.string().allow(null).default(null),
  password: Joi.string().required(),
});

export const validateUser = (user) => {
  const { error, value } = userSchema.validate(user);
  if (error) {
    const message = error.details ? error.details[0].message : "Validation error";
    console.error("Validation error:", message);
    return { value: null, error: message };
  }
  return { value, error: null };
};
