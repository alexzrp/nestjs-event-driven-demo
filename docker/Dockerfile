FROM node:16-alpine as builder
WORKDIR /app
COPY ./package.json .
COPY ./yarn.lock .
#RUN yarn install
CMD ["yarn", "start:dev"]
