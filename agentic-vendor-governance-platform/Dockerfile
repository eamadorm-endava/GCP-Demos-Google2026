# ---------- Build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .

ARG GEMINI_API_KEY=""
ENV GEMINI-API-KEY=${GEMINI_API_KEY}


RUN npm run build


# ---------- Runtime stage ----------
FROM nginx:alpine

# Cloud Run expects the container to listen on $PORT (usually 8080)
RUN sed -i 's/listen\s\+80;/listen 8080;/' /etc/nginx/conf.d/default.conf

# Copy the built static files
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"] 