# Stage 1: Build
FROM node:20-slim AS builder
WORKDIR /app

# Copy the folders to the container
COPY /assets ./assets
COPY chat-client ./chat-client


WORKDIR /app/chat-client

RUN npm install

ARG VITE_BACKEND_URL="https://test-ucp-business-backend-956266717219.us-west4.run.app"
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# Set the backend URL for the frontend to connect. This will be replaced during build by the value of the VITE_API_URL build arg.
ARG VITE_API_URL="api"
ENV VITE_API_URL=$VITE_API_URL

# Frontend URL is used to build the UCP-Agent profile header.
# In Cloud Run you can pass this as a build arg or just leave it; the app also falls back to window.location.origin.
ARG VITE_FRONT_URL="https://test-ucp-business-frontend-956266717219.us-west4.run.app"
ENV VITE_FRONT_URL=$VITE_FRONT_URL

RUN npm run build

# Stage 2: Runtime (Node gateway + static files)
FROM node:20-slim

WORKDIR /app

# Install only production deps for the gateway server
COPY chat-client/package.json chat-client/package-lock.json ./
RUN npm ci --omit=dev

# Copy server and built static files
COPY chat-client/server.js ./server.js
COPY --from=builder /app/chat-client/dist ./dist

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "server.js"]