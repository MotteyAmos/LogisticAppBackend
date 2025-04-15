FROM node:20-slim  AS development

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

# RUN npm uninstall bcrypt
# I was having issue with the bcrypt in the container, so I decided to do this
RUN npm install bcrypt

RUN npm run build

FROM node:20-slim  AS production

WORKDIR /usr/src/app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY package*.json .

RUN npm install --only=production

COPY --from=development /dist ./dist

CMD ["node", "dist/index.js"]