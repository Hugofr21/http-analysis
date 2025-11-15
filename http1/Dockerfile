FROM node:lts-alpine 

# Define o diretório de trabalho
WORKDIR /app

# Copia o package.json primeiro para otimizar o cache
COPY package*.json ./
RUN npm install --production

# Copia TODO o resto do código-fonte (incluindo server.js e a pasta 'certs')
COPY . .

# Expõe a porta que o seu servidor usa
EXPOSE 8045

# O comando para iniciar o servidor
CMD [ "node", "server.js" ]