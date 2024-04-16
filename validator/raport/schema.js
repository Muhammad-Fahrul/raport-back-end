import Joi from 'joi';

export const RaportPayloadSchema = Joi.object({
  chapter: Joi.number().required(),
  verse: Joi.number().required(),
  status: Joi.boolean().required(),
  detail: Joi.string().required(),
  username: Joi.string().required(),
});
