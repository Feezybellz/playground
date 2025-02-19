#!/bin/bash

# Prompt user for PHP version
read -p "Enter the PHP version you want to install (e.g., 7.4 or 8.1): " PHP_VERSION

# Update package list
echo "Updating package list..."
apt-get update -y

# Install Nginx
echo "Installing Nginx..."
apt-get install nginx -y

# Install required packages for PHP and server configuration
echo "Installing dependencies..."
apt-get install libcurl3 -y
apt-get install software-properties-common -y

# Add PHP repository
echo "Adding PHP repository..."
add-apt-repository ppa:ondrej/php -y

# Update package list after adding repository
apt-get update -y

# Install selected PHP version and required extensions
echo "Installing PHP $PHP_VERSION and extensions..."
apt-get install php$PHP_VERSION php$PHP_VERSION-mysql php$PHP_VERSION-fpm php$PHP_VERSION-cli php$PHP_VERSION-common php$PHP_VERSION-mbstring php$PHP_VERSION-curl php$PHP_VERSION-gd -y

# Install build-essential for building additional packages
apt-get install build-essential -y

# Configure PHP-FPM pool to listen on port 9000
echo "Configuring PHP-FPM to listen on port 9000..."
sed -i 's/^listen =.*/; listen = \/run\/php\/php'"$PHP_VERSION"'-fpm.sock/' /etc/php/$PHP_VERSION/fpm/pool.d/www.conf
echo "listen = 127.0.0.1:9000" >> /etc/php/$PHP_VERSION/fpm/pool.d/www.conf

# Restart PHP-FPM service
echo "Restarting PHP-FPM service..."
service php$PHP_VERSION-fpm restart

# Install MySQL Server
echo "Installing MySQL Server..."
apt-get install mysql-server -y

# Prompt user for MySQL root password
read -sp "Enter the password you want to set for the MySQL root user: " MYSQL_ROOT_PASSWORD
echo

# Run MySQL commands to set the root password
echo "Configuring MySQL root user authentication..."
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$MYSQL_ROOT_PASSWORD';"

# Enable mbstring in PHP
echo "Enabling mbstring PHP module..."
phpenmod mbstring

# Restart PHP-FPM and Nginx
echo "Restarting services..."
service php$PHP_VERSION-fpm restart
service nginx restart

# Final message
echo "Server configuration is complete with PHP $PHP_VERSION and MySQL configured!"
