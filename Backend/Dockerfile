FROM node:18-alpine

WORKDIR /app

# Copiar los archivos de dependencias
COPY package*.json ./

# Instalar los módulos de Node
RUN npm install

# Copiar el resto del código del backend
COPY . .

# Exponer el puerto del servidor
EXPOSE 5000

# Comando para arrancar tu backend
CMD ["node", "server.js"]