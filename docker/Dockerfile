FROM nginx:1.20.0-alpine

EXPOSE 80

COPY /unpackage/dist/build/h5 /app/antigen
COPY /unpackage/dist/build/h5 /app/antigen/h5
COPY /unpackage/dist/build/h5/index.html /app/index.html
COPY /unpackage/dist/build/h5/index.html /app/antigen/index.html

COPY ./docker/nginx-default.conf /etc/nginx/conf.d/default.conf

RUN sed -i -e "s/worker_processes  1/worker_processes 2/" /etc/nginx/nginx.conf


CMD ["nginx", "-g", "daemon off;"]