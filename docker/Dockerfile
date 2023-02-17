FROM node:16-alpine as builder
WORKDIR /app
COPY ./package.json .
COPY ./yarn.lock .
CMD ["yarn", "start:prod"]
