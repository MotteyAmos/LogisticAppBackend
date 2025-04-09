FROM node:23.11.0-alpine  as development

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run dev

FROM node:23.11.0-alpine  as production

WORKDIR /usr/src/app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY package*.json .

RUN npm install --only=production

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/index.js"]