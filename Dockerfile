FROM node:18-alpine

ARG PORT=3000
EXPOSE ${PORT}

WORKDIR /usr/local/app

COPY package*.json ./

RUN npm ci

COPY . .


CMD [ "npm", "run", "dev" ]

