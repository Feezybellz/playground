# #!/bin/bash
# export AWS_ACCESS_KEY_ID=aws-access-key-id
# export AWS_SECRET_ACCESS_KEY=aws-secret-key
# export AWS_DEFAULT_REGION=s3-bucket-region
#
# AWS_CLI="/usr/local/bin/aws"
# AWS_S3_BUCKET="bellztest"
#
# # Database credentials
# DB_USER="root"
# DB_PASSWORD="vagrant"
#
# # Other options
# BACKUP_PATH="/var/db_backup"
# DATE=$(date +%Y%m%d%H%M)
# DATE_FOLDER=$(date +%Y/%m)
#
# # S3 bucket
# S3_BUCKET="s3://$AWS_S3_BUCKET"
#
# # Fetch all databases
# DB_LIST=$(mysql -u $DB_USER -p$DB_PASSWORD -e 'SHOW DATABASES;' | grep -Ev "(Database|information_schema|performance_schema|mysql)")
#
# # Loop through each database and back it up
# for DB in $DB_LIST; do
#     echo "Creating backup of $DB..."
#
#     # Backup file names
#     BACKUP_FILE="$DB-$DATE.sql"
#     COMPRESSED_BACKUP_FILE="$BACKUP_FILE.gz"
#
#     # Create a backup
#     mysqldump -u $DB_USER -p$DB_PASSWORD $DB > $BACKUP_PATH/$BACKUP_FILE
#
#     # Compress the backup
#     gzip -c $BACKUP_PATH/$BACKUP_FILE > $BACKUP_PATH/$COMPRESSED_BACKUP_FILE
#
#     # Upload to S3
#     $AWS_CLI s3 cp $BACKUP_PATH/$COMPRESSED_BACKUP_FILE $S3_BUCKET/$DATE_FOLDER/$COMPRESSED_BACKUP_FILE
#
#     # Optional: Remove the backup file from local storage
#     rm $BACKUP_PATH/$BACKUP_FILE
#     rm $BACKUP_PATH/$COMPRESSED_BACKUP_FILE
#
#     echo "Backup of $DB completed and uploaded to S3"
# done



#!/bin/bash


# 0 0,9,18 * * * /var/all_db_backup.sh >> /var/mck_cronlog 2>&1


export AWS_ACCESS_KEY_ID=aws-access-key-id
export AWS_SECRET_ACCESS_KEY=aws-secret-key
export AWS_DEFAULT_REGION=s3-bucket-region

SERVER_FOLDER="new_marketplace"
AWS_CLI="/usr/local/bin/aws"

# Database credentials
DB_USER="root"
DB_PASSWORD=""

# Other options
BACKUP_PATH="/var/db_backup"
DATE=$(date +%Y%m%d%H%M)
DATE_FOLDER=$(date +%Y/%m/%d)


# S3 bucket
S3_BUCKET="s3://mckodev"

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
    #$AWS_CLI s3 cp $BACKUP_PATH/$COMPRESSED_BACKUP_FILE $S3_BUCKET/$COMPRESSED_BACKUP_FILE
    $AWS_CLI s3 cp $BACKUP_PATH/$COMPRESSED_BACKUP_FILE $S3_BUCKET/$SERVER_FOLDER/$DATE_FOLDER/$COMPRESSED_BACKUP_FILE

    # Optional: Remove the backup file from local storage
    rm $BACKUP_PATH/$BACKUP_FILE
    rm $BACKUP_PATH/$COMPRESSED_BACKUP_FILE

    echo "Backup of $DB completed and uploaded to S3"
done
