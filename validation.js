
const Joi = require('@hapi/joi');

//register validation
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
  });
  return schema.validate(data);
};
//login validation
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
  });
  return schema.validate(data);
};

//create ride validation
const createRideValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(6).max(40).required(),
    departure: Joi.date().required(),
    arrival: Joi.date().required().greater(Joi.ref('departure')),
    space: Joi.number().required().min(1),
    companyName: Joi.string().required()
  });
  return schema.validate(data);
};

//buy ticket validation
const buyTicketValidation = (data) => {
  const schema = Joi.object({
    cardNumber: Joi.string().min(10)
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.createRideValidation = createRideValidation;
module.exports.buyTicketValidation = buyTicketValidation;