FROM node:lts-alpine

WORKDIR /app

# 1. Copie o package.json (e package-lock.json, se existir)
COPY package*.json ./

# 2. Instale as dependências (ESTE É O PASSO QUE FALTA)
#    Usar --production garante que apenas as 'dependencies' são instaladas
RUN npm install --production

# 3. Copie o resto da sua aplicação
#    (Assumindo que o seu script se chama app.js, como no package.json)
COPY app.js .
COPY ./certs/ /app/certs/
COPY ./src/ /app/src/

# 4. Exponha a porta
EXPOSE 8044

# 5. Execute o comando de arranque do seu package.json
CMD [ "node", "app.js" ]