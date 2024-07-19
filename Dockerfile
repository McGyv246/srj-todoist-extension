ARG NODE_VERSION=18.0.0

# BUILDER STAGE
FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /usr/src/app

# Copy package.json and install packages
COPY package*.json .
RUN npm ci

# Adds source code in the container
ADD . /usr/src/app

# Generating prisma client
RUN npx prisma generate

# Compile TypeScript
RUN npm run tsc

# ------------------------------

# FINAL STAGE
FROM node:${NODE_VERSION}-alpine

# Updating system and installing dumb-init for optimal start
RUN apk update && apk add --no-cache dumb-init

# Use production node environment by default.
ENV NODE_ENV production

WORKDIR /usr/src/app

# Copy package.json and install packages
COPY --chown=node:node --from=builder usr/src/app/build ./build
COPY --chown=node:node package*.json .
RUN npm ci

COPY --chown=node:node --from=builder usr/src/app/node_modules/.prisma/client ./node_modules/.prisma/client

# Expose the port that the application listens on.
EXPOSE 3000

CMD ["dumb-init", "node", "build/app.js"]
