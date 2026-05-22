
# Dev/build stage: Use latest Bun image
FROM oven/bun:latest AS dev

WORKDIR /app
COPY package.json ./
COPY bun.lock ./
RUN bun install --frozen-lockfile
COPY docs ./docs
ENTRYPOINT [ "bun", "run", "dev" ]



# Build stage
FROM dev AS build
RUN bun run build




# Hardened NGINX production image (latest version, non-root, security best practices)
FROM docker.io/nginxinc/nginx-unprivileged:1.30-alpine AS prod

# Use root only for file operations, then drop privileges
USER 0
WORKDIR /usr/share/nginx/html

# Copy static site
COPY --chown=1001:0 --chmod=770 --from=build /app/docs/.vitepress/dist /usr/share/nginx/html/

# Copy hardened nginx config from nginx/ directory
COPY --chown=1001:0 --chmod=660 ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
RUN chmod 660 /etc/nginx/conf.d/default.conf

# Drop privileges
USER 1001

EXPOSE 8080

# Use base image default entrypoint (nginx) instead of a custom script
