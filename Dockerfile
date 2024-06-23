FROM node:18-alpine

ARG PORT=${PORT}
EXPOSE ${PORT}

WORKDIR /usr/local/app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci

COPY . .


CMD [ "npm", "run", "dev" ]

