#!/bin/bash
# export AWS_ACCESS_KEY_ID=
# export AWS_SECRET_ACCESS_KEY=
export AWS_DEFAULT_REGION=us-east-1

AWS_CLI="/usr/local/bin/aws"

# Database credentials
DB_USER="root"
DB_PASSWORD="vagrant"

# Other options
BACKUP_PATH="/vagrant/db_backup"
DATE=$(date +%Y%m%d%H%M)
DATE_FOLDER=$(date +%Y/%m)

# S3 bucket
S3_BUCKET="s3://bellztest"

# Fetch all databases
DB_LIST=$(mysql -u $DB_USER -p$DB_PASSWORD -e 'SHOW DATABASES;' | grep -Ev "(Database|information_schema|performance_schema|mysql)")

# Loop through each database and back it up
for DB in $DB_LIST; do
    echo "Creating backup of $DB..."

    # Backup file names
    BACKUP_FILE="$DB-$DATE.sql"
    COMPRESSED_BACKUP_FILE="$BACKUP_FILE.gz"

    # Create a backup
    mysqldump -u $DB_USER -p$DB_PASSWORD $DB > $BACKUP_PATH/$BACKUP_FILE

    # Compress the backup
    gzip -c $BACKUP_PATH/$BACKUP_FILE > $BACKUP_PATH/$COMPRESSED_BACKUP_FILE

    # Upload to S3
    $AWS_CLI s3 cp $BACKUP_PATH/$COMPRESSED_BACKUP_FILE $S3_BUCKET/$DATE_FOLDER/$COMPRESSED_BACKUP_FILE

    # Optional: Remove the backup file from local storage
    rm $BACKUP_PATH/$BACKUP_FILE
    rm $BACKUP_PATH/$COMPRESSED_BACKUP_FILE

    echo "Backup of $DB completed and uploaded to S3"
done
