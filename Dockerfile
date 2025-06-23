FROM node:20-bullseye AS development

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y tini
ENTRYPOINT ["/usr/bin/tini", "--"]

# Copy config and install dependencies
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

# Optional: remove and reinstall bcrypt if needed
RUN npm uninstall bcrypt
RUN npm install bcrypt

# Swagger & Dev tools
RUN npm install swagger-jsdoc swagger-ui-express
RUN npm install --save-dev @types/swagger-jsdoc @types/swagger-ui-express

# Add tsx runner
RUN npm install -D tsx
RUN npm config set script-shell /bin/sh


COPY ./src src

# Start with tsx in watch mode
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