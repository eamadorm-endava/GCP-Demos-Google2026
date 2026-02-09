# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Receive API Key as build argument and set as ENV for Vite
ARG GEMINI_API_KEY=""
ENV GEMINI_API_KEY=$GEMINI_API_KEY

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Production Server
FROM nginx:stable-alpine

# Copy built assets from the 'build' stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]