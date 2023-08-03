import Joi from "joi";

export const schemaUser = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
    confirmPassword: Joi.string().min(3).required()
});

export const schemaLogin = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required()
});