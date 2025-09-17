import Joi from 'joi';  
const loanSchema = Joi.object({  
  loan_id: Joi.string().required(),  
  user_id: Joi.string().required(),  
  amount: Joi.number().required(),  
  interest_rate: Joi.number().required(),  
  duration: Joi.number().required(),  
  status: Joi.string().valid('pending', 'approved', 'declined').default('pending'),  

});  
export default loanSchema;