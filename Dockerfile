# --- Etapa 1: Base ---
FROM node:22-alpine AS base

WORKDIR /app
COPY package.json yarn.lock ./
ENV NODE_OPTIONS=--max_old_space_size=8096

# --- Etapa 2: Dependencias ---
FROM base AS deps
RUN yarn install --frozen-lockfile --network-timeout 300000

# --- Etapa 3: Builder ---
# Build único y genérico (build once, promote many): la app lee su configuración
# de runtime vía env-config.js/envService.ts, así que no hace falta hornear
# .env.dev/.env.qa/.env.prod en el build — la misma imagen sirve para los 3 ambientes.
FROM deps AS builder
COPY . .
RUN yarn build

# --- Etapa 4: Imagen final ---
# nginxinc/nginx-unprivileged: corre como usuario 'nginx' (uid 101), no root.
# Puerto 8080 en vez de 80 (puertos < 1024 requieren root).
FROM nginxinc/nginx-unprivileged:1.27-alpine AS runner

# Todas las operaciones de sistema se hacen como root
USER root

# Parchear CVEs del sistema base
RUN apk upgrade --no-cache \
    # curl no se usa en este contenedor (HEALTHCHECK usa wget) — se elimina para
    # reducir superficie de ataque; sus CVEs no tienen parche disponible aún.
    && apk del curl

# Copiar estáticos (Vite compila a "dist") y configuración
COPY --from=builder /app/dist /usr/share/nginx/html
COPY env.sh /usr/share/nginx/html/
COPY default.conf /etc/nginx/conf.d/default.conf

# Fix CRLF, permisos y ownership — todo como root para evitar restricciones de permisos
RUN sed -i 's/\r$//' /usr/share/nginx/html/env.sh \
    && chmod +x /usr/share/nginx/html/env.sh \
    && rm -f /usr/share/nginx/html/index.nginx-debian.html \
    && chown -R nginx:nginx /usr/share/nginx/html \
    && chmod 644 /etc/nginx/conf.d/default.conf

# Cambiar a usuario no-root para el proceso final
USER nginx

# Probe de salud
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/ | grep -q "<div" || exit 1

EXPOSE 8080

CMD ["/bin/sh", "-c", "/usr/share/nginx/html/env.sh && exec nginx -g 'daemon off;'"]
