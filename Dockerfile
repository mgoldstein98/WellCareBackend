FROM node:latest

# Install bash
RUN apk add --update bash && rm -rf /var/cache/apk/*

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install
RUN npm install --save hapi

# Bundle app source
COPY . .
CMD [ "npm", "start" ]

