FROM node:23.11.0-alpine  AS development

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .



RUN npm run build

FROM node:23.11.0-alpine  AS production

WORKDIR /usr/src/app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY package*.json .

RUN npm install --only=production

COPY --from=development /dist ./dist

CMD ["node", "dist/index.js"]