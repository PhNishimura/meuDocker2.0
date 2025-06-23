# Usa uma imagem base oficial do Node.js
FROM node:18-alpine

# Instala wget para o health check
RUN apk add --no-cache wget

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o package.json e o package-lock.json
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o resto dos arquivos do projeto
COPY . .

# Expõe a porta que o backend usa
EXPOSE 3001

# Comando para iniciar a aplicação
CMD [ "npm", "start" ]