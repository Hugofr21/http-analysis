FROM node:lts-alpine  

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY app.js .
COPY ./certs/ /app/certs/
COPY ./src/ /app/src/

EXPOSE 8443

CMD [ "node", "app.js" ]
