import { type LoginPayload, type UserPayload } from '../../types/payload';
import Joi from 'joi';

export const UserRegistrationPayload: Joi.ObjectSchema<UserPayload> =
  Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

export const UserLoginPayload: Joi.ObjectSchema<LoginPayload> = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required()
});
