# Usa uma imagem base super leve do Nginx
FROM nginx:alpine

# Remove o conteúdo padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia o arquivo do frontend para o diretório do Nginx
COPY index.html /usr/share/nginx/html/

# Expõe a porta 80 (padrão do Nginx)
EXPOSE 80