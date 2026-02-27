# Stage 1: Build
FROM node:20-slim AS builder
WORKDIR /app

# Copy the folders to the container
COPY /assets ./assets
COPY chat-client ./chat-client


WORKDIR /app/chat-client

RUN npm install

# Set the backend URL for the frontend to connect. This will be replaced during build by the value of the VITE_API_URL build arg.
ARG VITE_API_URL="https://ucp-business-backend-956266717219.us-west4.run.app"
ENV VITE_API_URL=$VITE_API_URL

# Set the frontend URL, required due to the front send its own URL, so the backend
# could also retrieve data from the front itself.
ARG VITE_FRONT_URL="https://ucp-business-frontend-956266717219.us-west4.run.app"
ENV VITE_FRONT_URL=$VITE_FRONT_URL

RUN npm run build

# Stage 2: Web server (Nginx)
FROM nginx:alpine

# Copiamos la configuración de Nginx que creamos
COPY chat-client/nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos los archivos construidos desde la etapa anterior
COPY --from=builder /app/chat-client/dist /usr/share/nginx/html

# Cloud Run espera que escuchemos en el puerto 8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]