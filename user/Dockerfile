FROM node:20-alpine as base

WORKDIR /usr/src/app
EXPOSE 3001

FROM base as dev
COPY package*.json ./

RUN npm ci -f

COPY . .

RUN npx prisma generate

CMD [ "npm", "run", "start:dev"]
