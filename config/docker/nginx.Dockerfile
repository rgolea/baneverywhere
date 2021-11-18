FROM nginx:1.21.4

COPY --from=builder ./dist/apps/baneverywhere /app
COPY --from=builder ./config/nginx/proxy.conf /etc/nginx/conf.d/default.conf
