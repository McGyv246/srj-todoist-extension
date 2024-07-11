ARG NODE_VERSION=18.0.0

# BUILDER STAGE
FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /usr/src/app

# Copy package.json and install packages
COPY package*.json .
RUN npm ci

# Adds source code in the container
ADD . /usr/src/app

# Compile TypeScript
RUN npm run tsc

# ------------------------------

# FINAL STAGE
FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production

WORKDIR /usr/src/app

# Copy package.json and install packages
COPY --from=builder usr/src/app/build ./build
COPY package*.json .
RUN npm ci

# Expose the port that the application listens on.
EXPOSE 3000

CMD ["npm", "run", "start:prod"]
