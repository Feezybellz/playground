#!/bin/bash

# Function to create MySQL user and grant privileges
create_mysql_user() {
    local db_name="$1"
    local db_password="$2"
    local db_user="$3"

    # Create the user
    mysql -u root -p'NewMckodevTechLab@.02' -e "CREATE USER IF NOT EXISTS '$db_user'@'localhost' IDENTIFIED BY '$db_password';"

    # Grant privileges to the user
    mysql -u root -p'NewMckodevTechLab@.02' -e "GRANT ALL PRIVILEGES ON $db_name.* TO '$db_user'@'localhost';"

    # Flush privileges
    mysql -u root -p'NewMckodevTechLab@.02' -e "FLUSH PRIVILEGES;"

    # Create the user
    mysql -u root -p'NewMckodevTechLab@.02' -e "CREATE USER IF NOT EXISTS '$db_user'@'18.216.70.37' IDENTIFIED BY '$db_password';"

    # Grant privileges to the user
    mysql -u root -p'NewMckodevTechLab@.02' -e "GRANT ALL PRIVILEGES ON $db_name.* TO '$db_user'@'18.216.70.37';"

    # Flush privileges
    mysql -u root -p'NewMckodevTechLab@.02' -e "FLUSH PRIVILEGES;"
}

for config_file in /var/*/.env/config.php; do
    if [ -f "$config_file" ]; then
        db_name=$(grep -oP "putenv\('DB_NAME=\K[^')]*" "$config_file")
        db_password=$(grep -oP "putenv\('DB_PASSWORD=\K[^')]*" "$config_file")
        db_user=$(grep -oP "putenv\('DB_USER=\K[^')]*" "$config_file")

        if [ -n "$db_name" ] || [ -n "$db_password" ] || [ -n "$db_user" ]; then
            echo "File: $config_file"
            echo "DB_NAME: $db_name"
            echo "DB_PASSWORD: $db_password"
            echo "DB_USER: $db_user"
            echo

            # Call the function to create user and grant privileges
            create_mysql_user "$db_name" "$db_password" "$db_user"

            # Sleep for some seconds
            # sleep 15
        fi
    fi
done
