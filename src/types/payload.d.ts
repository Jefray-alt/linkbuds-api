export interface UserPayload {
  name: string;
  email: string;
  password: string;
}

export interface LinkListPayload {
  name: string;
  description: string;
  slug: string;
}

export interface LinkPayload {
  url: string;
  name: string;
}
