FROM nginx:1.21.4

COPY dist/apps/baneverywhere /app
COPY config/nginx/proxy.conf /etc/nginx/conf.d/default.conf
