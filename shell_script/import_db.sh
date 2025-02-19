
cd database_dumps

# Get a list of SQL files
sql_files=$(ls *.sql)

# Delay time in seconds between imports
delay_time=5

# Loop through each SQL file and import it
for sql_file in $sql_files; do
    # Extract the database name from the SQL file name
    db_name=$(echo $sql_file | cut -d'.' -f1)

    # Check if the database exists
    if mysql -u root -p'password@.02' -e "USE $db_name;" 2>/dev/null; then
        echo "Database $db_name already exists."
    else
        # Create the database if it doesn't exist
        echo "Creating database $db_name..."
        mysql -u root -p'password@.02' -e "CREATE DATABASE $db_name;"
    fi

    # Import the SQL file into the database
    echo "Importing $sql_file into $db_name..."
    mysql -u root -p'password@.02' $db_name < $sql_file

    # Pause for a fixed delay before proceeding to the next database
    sleep $delay_time
done
