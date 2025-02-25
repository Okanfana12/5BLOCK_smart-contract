FROM php:8.2-fpm-alpine

# Installation des dépendances système
RUN apk add --no-cache \
    nginx \
    git \
    curl \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    zip \
    unzip

# Installation des extensions PHP
RUN docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

# Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configuration de Nginx
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Copie des fichiers de l'application
WORKDIR /var/www
COPY . /var/www

# Installation des dépendances de l'application
RUN composer install --optimize-autoloader --no-dev

# Optimisation pour la production
RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache

# Permissions
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Exposition du port
EXPOSE 80

# Démarrage de Nginx et PHP-FPM
CMD ["sh", "-c", "nginx && php-fpm"]
