FROM nginx:1.15.6

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' > /etc/timezone
RUN rm -f /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/pro/conf.d /etc/nginx/conf.d/
COPY dist /usr/share/nginx/file/
