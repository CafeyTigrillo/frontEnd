# Etapa 1: Construcción de la aplicación
FROM node:18-alpine AS builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de configuración y dependencias
COPY package.json package-lock.json ./

# Instala las dependencias necesarias
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Construye la aplicación para producción
RUN npm run build

# Etapa 2: Configuración del servidor para servir la aplicación
FROM node:18-alpine AS runner

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Establece la variable de entorno para producción
ENV NODE_ENV=production

# Copia las dependencias instaladas y el código construido desde la etapa anterior
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/package.json ./package.json

# Expone el puerto en el que la aplicación se ejecutará
EXPOSE 3000

# Comando por defecto para iniciar la aplicación
CMD ["npm", "start"]
