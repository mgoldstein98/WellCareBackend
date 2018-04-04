FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install
RUN npm install --save hapi
RUN npm install --save inert

# Bundle app source
COPY . .

EXPOSE 4000

CMD [ "npm", "start" ]

