FROM nginx
ARG DEV
COPY ./default.conf /etc/nginx/conf.d/default.conf

RUN if [[ -z "$DEV"]] ; then COPY ./default.conf /etc/nginx/conf.d/default.conf ; COPY ./default.dev.conf /etc/nginx/conf.d/default.conf ; fi