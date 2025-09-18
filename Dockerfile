# Angular Builder
FROM node:20-alpine AS front-builder

WORKDIR /app/incubator-platform

COPY incubator-platform/package*.json ./
RUN npm install

COPY incubator-platform/ ./
RUN npm run build --prod

# Laravel Backend Builder
FROM php:8.2-fpm-alpine AS back-builder

RUN apk add --no-cache \
    bash \
    libzip-dev \
    zip \
    unzip \
    oniguruma-dev \
    autoconf \
    gcc \
    g++ \
    make \
    curl-dev \
    php8-opcache \
    php8-pdo_mysql \
    php8-mbstring \
    php8-tokenizer \
    php8-xml \
    php8-curl

WORKDIR /app/jeb-backend

COPY jeb-backend/composer.json jeb-backend/composer.lock ./
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer install --no-dev --optimize-autoloader

COPY jeb-backend/ ./

# Copier le build frontend dans le dossier public (ex: public/spa)
COPY --from=front-builder /app/incubator-platform/dist/incubator-platform /app/jeb-backend/public/spa

# PHP Builder
FROM php:8.2-fpm-alpine

RUN apk add --no-cache nginx bash

COPY docker/nginx.conf /etc/nginx/nginx.conf

WORKDIR /var/www/html

COPY --from=back-builder /app/jeb-backend /var/www/html

RUN docker-php-ext-install pdo pdo_mysql mbstring xml tokenizer curl zip

RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage

EXPOSE 80

CMD sh -c "php-fpm & nginx -g 'daemon off;'"