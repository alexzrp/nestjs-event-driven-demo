FROM node:16-alpine as builder
WORKDIR /app
COPY .. .
RUN yarn install
CMD ["yarn", "start:dev"]
