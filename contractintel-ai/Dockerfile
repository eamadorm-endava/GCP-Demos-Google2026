FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

# Vite needs the API KEY at building time
ARG GEMINI_API_KEY=""
ENV GEMINI_API_KEY=$GEMINI_API_KEY

# Execute the Vite build
RUN npm run build

# Production (Nginx) ---
FROM nginx:alpine

# 1. Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# 2. Copy your custom nginx.conf (configured for port 80)
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
