# Etapa 1: Construcción de la aplicación
FROM node:18-alpine AS builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos necesarios para instalar dependencias
COPY package.json package-lock.json ./

# Instala las dependencias ignorando los conflictos de dependencias "peer"
RUN npm install --legacy-peer-deps

# Copiar el resto de los archivos del proyecto
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa 2: Configuración del servidor para producción
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copiar los archivos construidos desde la etapa anterior
COPY --from=builder /app/build ./build

# Exponer el puerto
EXPOSE 3000

# Comando por defecto para iniciar la aplicación
CMD ["npm", "start"]
