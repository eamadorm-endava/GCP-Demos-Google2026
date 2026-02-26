# Dockerfile para el Backend
FROM python:3.13-slim

# Instalar uv para gestionar el proyecto
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# Copy the folders to the container
COPY /assets ./assets
COPY business_agent ./business_agent

# Move to business_agent folder to install dependencies
WORKDIR /app/business_agent

# Instalar dependencias (usando el caché de uv)
RUN uv sync --frozen

# Exponer el puerto que usa el backend (definido en main.py)
EXPOSE 10999

# Ejecutar el backend usando uv
# Se usa host 0.0.0.0 para que sea accesible fuera del contenedor
CMD ["uv", "run", "business_agent", "--host", "0.0.0.0", "--port", "10999"]
