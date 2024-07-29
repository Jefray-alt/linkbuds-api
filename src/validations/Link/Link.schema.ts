import { type LinkPayload } from '../../types/payload';
import Joi from 'joi';

export const LinkPayloadSchema: Joi.ObjectSchema<LinkPayload> = Joi.object({
  name: Joi.string().required(),
  url: Joi.string().required()
});
