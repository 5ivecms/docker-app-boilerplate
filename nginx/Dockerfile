ARG NGINX_IMAGE
FROM $NGINX_IMAGE

ARG DOMAIN_NAME
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
RUN sed -i -r "s/localhost/${DOMAIN_NAME}/g" /etc/nginx/conf.d/default.conf