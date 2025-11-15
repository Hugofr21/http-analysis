# Usar a imagem oficial do Caddy com Alpine Linux
FROM caddy:alpine

# Copiar o nosso Caddyfile para a configuração do Caddy
COPY Caddyfile /etc/caddy/Caddyfile

# Copiar os certificados (os mesmos que usou para o NGINX)
# para o local que referenciamos no Caddyfile
COPY ./certs/ /etc/ssl/