#!/bin/bash

# Database credentials
DB_USER="root"
DB_PASSWORD="vagrant"
DB_NAME="mckodevc_demoAmabride"

# Other options
BACKUP_PATH="/vagrant/db_backup"
DATE=$(date +%Y%m%d%H%M)
BACKUP_FILE="$DB_NAME-$DATE.sql"
COMPRESSED_BACKUP_FILE="$BACKUP_FILE.gz"

# S3 bucket
S3_BUCKET="s3://bellztest"

# Create a backup
mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_PATH/$BACKUP_FILE

# Compress the backup
gzip -c $BACKUP_PATH/$BACKUP_FILE > $BACKUP_PATH/$COMPRESSED_BACKUP_FILE

# Upload to S3
aws s3 cp $BACKUP_PATH/$COMPRESSED_BACKUP_FILE $S3_BUCKET

# Optional: Remove the backup file from local storage
rm $BACKUP_PATH/$BACKUP_FILE
rm $BACKUP_PATH/$COMPRESSED_BACKUP_FILE

echo "Backup completed and uploaded to S3"

