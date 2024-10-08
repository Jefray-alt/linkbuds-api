import { type Link } from '../entity/Link.entity';
import { type User } from '../entity/User.entity';

export interface UserPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LinkListPayload {
  name: string;
  description: string;
  slug: string;
  user: User;
  links?: Link[];
}

export interface LinkPayload {
  url: string;
  name: string;
}
