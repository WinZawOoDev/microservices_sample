FROM node:20-alpine as development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci -f

COPY . .

EXPOSE 3000

RUN npm run build

ENTRYPOINT ["/bin/sh", "-c", "npm run start:dev"]