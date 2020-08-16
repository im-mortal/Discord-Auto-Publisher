FROM node:12-stretch AS build

RUN mkdir -p /usr/src/node_modules \
    && chown -R node:node /usr/src
WORKDIR /usr/src
COPY package*.json ./
USER node
RUN npm install


FROM node:12-alpine

RUN mkdir /app \
    && chown -R node:node /app
WORKDIR /app
COPY --from=build /usr/src .
COPY --chown=node:node . .
USER node
ENV BOT_TOKEN='BOT_TOKEN'
CMD ["node", "bot.js"]
