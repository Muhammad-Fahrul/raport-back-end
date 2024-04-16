import Joi from 'joi';

export const UserPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  grade: Joi.number().required(),
});

export const AuthPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const UserUpdatePayloadSchema = Joi.object({
  phone: Joi.string().required(),
  oldPassword: Joi.string().empty(''),
  newPassword: Joi.string().empty(''),
});
