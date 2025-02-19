#!/bin/bash

# Log all output to a file
exec 2>>/var/log/my_deploy.log
exec 1>>/var/log/my_deploy.log


if [ "$EUID" -ne 0 ]; then
    echo "Please run as root."
    exit
fi
# MySQL credentials (ensure these are secure and maybe pulled from a secure configuration file)
DB_USER="root"
DB_PASS="mckodev@tms01"

# Get the project name from the first argument passed to the script
project_name=$1

# Get the domain from the second argument
domain=$2

# Calculate the old domain
old_domain="${project_name}.mckodev.ng"

# Deduce the database name from the project name
DB_NAME="mckodevc_demo_${project_name}"

# Rename the old configuration file to the new domain name
mv "/etc/nginx/sites-available/${old_domain}" "/etc/nginx/sites-available/${domain}"

# Replace all occurrences of old_domain with domain in the new config file
sed -i "s/${old_domain}/${domain}/g" "/etc/nginx/sites-available/${domain}"

# Update symlink in sites-enabled
rm "/etc/nginx/sites-enabled/${old_domain}"
ln -s "/etc/nginx/sites-available/${domain}" "/etc/nginx/sites-enabled/"

# Update /etc/hosts file
sed -i "s/${old_domain}/${domain}/g" /etc/hosts

# Reload Nginx to apply changes

service nginx reload



# SQL update to modify image_1 column values (ensure you've granted enough permissions to your DB user to run these operations)
# Get a list of all tables in the database
tables=$(mysql -u"$DB_USER" -p"$DB_PASS" -D"$DB_NAME" -Bse "SHOW TABLES;")

# Loop through the tables and check if the column 'image_1' exists
#for table in $tables; do
#    column_exists=$(mysql -u"$DB_USER" -p"$DB_PASS" -D"$DB_NAME" -Bse "SHOW COLUMNS FROM $table LIKE 'image_1';")

#    if [ "$column_exists" == "image_1" ]; then
        # If the column exists, then perform the update
#        mysql -u"$DB_USER" -p"$DB_PASS" -D"$DB_NAME" -e "
#        UPDATE $table
#        SET image_1 = REPLACE(image_1, 'https://${old_domain}/', 'https://${domain}/')
#        WHERE image_1 LIKE 'https://${old_domain}/%';
#        "
#    fi
#done
for table in $tables; do
    column_info=$(mysql -u"$DB_USER" -p"$DB_PASS" -D"$DB_NAME" -Bse "SHOW COLUMNS FROM $table LIKE 'image_1';")

    # Debug prints
    echo "Columns in $table that match 'image_1': $column_info"

    if [[ $column_info == *"image_1"* ]]; then
        # If the column exists, then perform the update
        mysql -u"$DB_USER" -p"$DB_PASS" -D"$DB_NAME" -e "
        UPDATE $table
        SET image_1 = REPLACE(image_1, 'https://${old_domain}/', 'https://${domain}/')
        WHERE image_1 LIKE 'https://${old_domain}/%';
        "
    else
        echo "No 'image_1' column in table $table."
    fi
done

echo "Deployment tasks completed."

#sudo apt-get update
#sudo apt-get install -y certbot python-certbot-nginx


sudo apt update
sudo apt install -y snapd

# Install Certbot using snap
sudo snap install --classic certbot

# Create symbolic link
sudo ln -s /snap/bin/certbot /usr/bin/certbot


# Domain and email variables
DOMAIN=$domain
WWW_DOMAIN="www.${domain}"
EMAIL="banjimayowa@gmail.com"

# Automated certificate retrieval and configuration for Nginx
sudo certbot --nginx --agree-tos --no-eff-email --email $EMAIL -d $DOMAIN -d $WWW_DOMAIN

# Test automated renewal
sudo certbot renew --dry-run

service nginx restart

echo "Certbot installation and configuration completed."
