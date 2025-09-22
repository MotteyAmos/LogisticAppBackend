FROM node:20-bullseye AS development

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y tini
ENTRYPOINT ["/usr/bin/tini", "--"]


COPY package*.json ./
COPY tsconfig.json ./
RUN npm install


RUN npm uninstall bcrypt
RUN npm install bcrypt

RUN npm install csv-parse

RUN npm install swagger-jsdoc swagger-ui-express
RUN npm install --save-dev @types/swagger-jsdoc @types/swagger-ui-express


RUN npm install -D tsx
RUN npm config set script-shell /bin/sh


COPY ./src src

EXPOSE 4000

CMD ["npx", "tsx", "watch", "src/index.ts"]


# CMD ["npx", "ts-node-dev", "--respawn", "--transpile-only", "--prefer-ts-exts", "src/index.ts"]

# FROM node:20-bullseye  AS production

# WORKDIR /usr/src/app

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# COPY package*.json .

# RUN npm install --only=production

# COPY --from=development /dist ./dist

# CMD ["node", "dist/index.js"]
