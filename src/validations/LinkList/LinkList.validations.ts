import { type LinkListPayload } from '../../types/payload';
import { LinkPayloadSchema } from '../Link/Link.schema';
import Joi from 'joi';

const slugValidation = Joi.string().regex(/^(?!.*\/)[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const CreateLinkListValidation: Joi.ObjectSchema<LinkListPayload> =
  Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    slug: slugValidation.required(),
    links: Joi.array().items(LinkPayloadSchema)
  });

export const UpdateLinkListValidation: Joi.ObjectSchema<LinkListPayload> =
  Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    slug: slugValidation
  });
