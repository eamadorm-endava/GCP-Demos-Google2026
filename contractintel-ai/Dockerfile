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

COPY --from=build /app/dist /usr/share/nginx/html

# Redirect all the routs to index.html, so React Router will work at loading the page
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
