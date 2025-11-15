FROM node:lts-alpine  

WORKDIR /app

COPY ./certs/ /app/certs/

COPY app.js .

EXPOSE 8443

CMD [ "node", "app.js" ]