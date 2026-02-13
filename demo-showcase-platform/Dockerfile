# ---------- Build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .

ARG GEMINI_API_KEY=""
ENV GEMINI_API_KEY=${GEMINI_API_KEY}


RUN npm run build


# ---------- Runtime stage ----------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Copy package.json to install only prod dependencies (Express, Auth, etc)
COPY package*.json ./

RUN npm install --only=production

# Copy the proxy server
COPY server.js .

# Copy static files built
COPY --from=build /app/dist ./dist

EXPOSE 8080

CMD ["node", "server.js"]