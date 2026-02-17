FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install --legacy-peer-deps

COPY . .

# To be passed during build time
ARG VITE_GEMINI_API_KEY=""
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

RUN npm run build

FROM nginx:alpine

# 1. Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# 2. Copy your custom nginx.conf (configured for port 80)
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 