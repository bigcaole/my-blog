#
# Multi-stage build:
# 1) Build Astro static site with Node 20
# 2) Serve `dist/` using a tiny nginx image
#
# Note:
# - Default base images come from Docker Hub.
# - If your network cannot reach docker.io, override with build args:
#   NODE_IMAGE / NGINX_IMAGE (see README).
#

ARG NODE_IMAGE=node:20-alpine
ARG NGINX_IMAGE=nginx:alpine

FROM ${NODE_IMAGE} AS build

WORKDIR /app

# Install deps first (better Docker layer caching)
COPY package*.json ./
COPY npm-shrinkwrap.json* ./

RUN if [ -f package-lock.json ]; then npm ci --no-audit --fund=false; else npm install --no-audit --fund=false; fi

COPY . .

# Build static site
RUN npm run build


FROM ${NGINX_IMAGE} AS runner

# Serve on port 80
EXPOSE 80

# Custom nginx config for static Astro output + friendly 404
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Basic container health
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
