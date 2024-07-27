import { type LinkListPayload } from '../../types/payload';
import Joi from 'joi';

export const CreateLinkListValidation: Joi.ObjectSchema<LinkListPayload> =
  Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    slug: Joi.string()
      .regex(/^(?!.*\/)[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .required()
  });
