FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

COPY DigiCertGlobalRootCA.crt.pem .

EXPOSE 3000

CMD ["node", "server.js"]