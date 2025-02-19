#!/bin/bash

# Install jq 
# sudo apt-get install jq -y
# mkdir -p /var/db_backup


# Google Drive API credentials
SERVICE_ACCOUNT_JSON="acct.json"
ACCESS_TOKEN_FILE="/tmp/gdrive_access_token.txt"

# Database credentials
DB_USER="root"
DB_PASSWORD="vagrant"
# DB_PASSWORD="NewMckodevTechLab@.02"
DB_HOST="localhost"

# Backup options
BACKUP_PATH="/var/db_backup"
DATE=$(date +%Y%m%d%H%M)
DATE_FOLDER=$(date +%Y/%m/%d)

# Google Drive parent folder (Now accepts a folder name instead of ID)
PARENT_GDRIVE_FOLDER_NAME="mckodev_backups"
SHARE_WITH_EMAILS=("banjimayowa@gmail.com" "belloafeez7@gmail.com")



# Function to generate JWT assertion
generate_jwt_assertion() {
    local now=$(date +%s)
    local exp=$((now + 3600))

    # Read client email and private key from JSON
    local client_email=$(jq -r '.client_email' "$SERVICE_ACCOUNT_JSON")
    local private_key=$(jq -r '.private_key' "$SERVICE_ACCOUNT_JSON" | sed 's/\\n/\n/g')

    # Generate JWT header & payload
    local header=$(echo -n '{"alg":"RS256","typ":"JWT"}' | base64 | tr -d '=' | tr '/+' '_-')
    local payload=$(echo -n "{\"iss\":\"$client_email\",\"sub\":\"$client_email\",\"aud\":\"https://oauth2.googleapis.com/token\",\"exp\":$exp,\"iat\":$now,\"scope\":\"https://www.googleapis.com/auth/drive\"}" | base64 | tr -d '=' | tr '/+' '_-')

    # Store private key in a temp file for OpenSSL to read
    local key_file=$(mktemp)
    echo -e "$private_key" > "$key_file"

    # Sign JWT using OpenSSL and remove temp file
    local signature=$(echo -n "$header.$payload" | openssl dgst -sha256 -sign "$key_file" | base64 | tr -d '=' | tr '/+' '_-' | tr -d '\n')
    rm "$key_file"

    echo "$header.$payload.$signature"
}

# Function to get access token
get_access_token() {
    local jwt_assertion=$(generate_jwt_assertion)

    local response=$(curl -s -X POST "https://oauth2.googleapis.com/token" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer" \
        -d "assertion=$jwt_assertion")

    local access_token=$(echo "$response" | jq -r '.access_token')

    if [[ "$access_token" == "null" || -z "$access_token" ]]; then
        echo "❌ Failed to obtain access token!"
        exit 1
    fi

    echo "$access_token"
}


# Function to check if a folder exists in Google Drive
get_folder_id() {
    local folder_name="$1"
    local parent_folder_id="$2"

    query="name='${folder_name}' and mimeType='application/vnd.google-apps.folder' and '${parent_folder_id}' in parents"
    query=$(jq -rn --arg q "$query" '$q|@uri')

    response=$(curl -s -X GET -H "Authorization: Bearer $ACCESS_TOKEN" \
        "https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id)")

    folder_id=$(echo "$response" | jq -r '.files[0].id')

    if [ "$folder_id" == "null" ]; then
        echo ""
    else
        echo "$folder_id"
    fi
}

# Function to create a folder in Google Drive
create_folder() {
    local folder_name="$1"
    local parent_folder_id="$2"

    response=$(curl -s -X POST -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"name\": \"$folder_name\", \"mimeType\": \"application/vnd.google-apps.folder\", \"parents\": [\"$parent_folder_id\"]}" \
        "https://www.googleapis.com/drive/v3/files?fields=id")

    folder_id=$(echo "$response" | jq -r '.id')

    echo "$folder_name"
    echo "$folder_id"
    if [ "$folder_id" == "null" ]; then
        echo "Error creating folder: $folder_name"
        exit 1
    fi

    echo "$folder_id"
}

# Function to get or create nested folders
get_or_create_folder() {
    local folder_path="$1"
    local parent_folder_id="$2"

    IFS='/' read -ra FOLDERS <<< "$folder_path"
    for folder in "${FOLDERS[@]}"; do
        folder_id=$(get_folder_id "$folder" "$parent_folder_id")

        echo "$folder"
        echo "$folder_id"

        if [ -z "$folder_id" ]; then
            echo "Creating folder: $folder"
            folder_id=$(create_folder "$folder" "$parent_folder_id")
        fi

        parent_folder_id="$folder_id"
    done

    echo "$folder_id"
}

# Function to find or create the parent folder by name
get_parent_folder_id() {
    local folder_name="$1"
    parent_folder_id=$(get_folder_id "$folder_name" "root")

    if [ -z "$parent_folder_id" ]; then
        echo "Parent folder '$folder_name' not found. Creating it..."
        parent_folder_id=$(create_folder "$folder_name" "root")
    fi

    echo "$parent_folder_id"
}

# Function to get current permissions for a folder
get_folder_permissions() {
    local folder_id="$1"

    response=$(curl -s -X GET -H "Authorization: Bearer $ACCESS_TOKEN" \
        "https://www.googleapis.com/drive/v3/files/$folder_id/permissions?fields=permissions(emailAddress)")

    echo "$response" | jq -r '.permissions[].emailAddress'
}

# Function to share a folder with a list of emails
share_folder() {
    local folder_id="$1"
    local emails=("${!2}")

    existing_emails=($(get_folder_permissions "$folder_id"))

    for email in "${emails[@]}"; do
        if [[ " ${existing_emails[@]} " =~ " $email " ]]; then
            echo "Folder $folder_id is already shared with $email, skipping."
        else
            echo "Sharing folder $folder_id with $email"
            curl -s -X POST -H "Authorization: Bearer $ACCESS_TOKEN" \
                -H "Content-Type: application/json" \
                -d "{\"role\": \"writer\", \"type\": \"user\", \"emailAddress\": \"$email\"}" \
                "https://www.googleapis.com/drive/v3/files/$folder_id/permissions"
        fi
    done
}

# Function to upload a file to Google Drive
upload_file() {
    local file_path="$1"
    local folder_path="$2"
    local parent_folder_id="$3"
    local share_with_emails=("${!4}")

    ACCESS_TOKEN=$(get_access_token)
    echo "Access Token: $ACCESS_TOKEN"

    folder_id=$(get_or_create_folder "$folder_path" "$parent_folder_id")

    share_folder "$parent_folder_id" share_with_emails[@]

    echo "Uploading file: $file_path to folder $folder_id..."
    response=$(curl -s -X POST -H "Authorization: Bearer $ACCESS_TOKEN" \
        -F "metadata={\"name\": \"$(basename "$file_path")\", \"parents\": [\"$folder_id\"]};type=application/json" \
        -F "file=@$file_path;type=application/gzip" \
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart")

    file_id=$(echo "$response" | jq -r '.id')

    if [ "$file_id" == "null" ]; then
        echo "Error uploading file: $file_path"
        exit 1
    fi

    echo "File uploaded successfully: $file_path (ID: $file_id)"
}

# Function to upload all files from a folder to Google Drive
upload_folder() {
    local folder_path="$1"
    local drive_folder_path="$2"
    local parent_folder_id="$3"
    local share_with_emails=("${!4}")

    drive_folder_id=$(get_or_create_folder "$drive_folder_path" "$parent_folder_id")

    share_folder "$parent_folder_id" share_with_emails[@]

    for file in "$folder_path"/*; do
        if [ -f "$file" ]; then
            upload_file "$file" "$drive_folder_path" "$parent_folder_id" share_with_emails[@]
        fi
    done
}

# Get or create the Google Drive parent folder
PARENT_GDRIVE_FOLDER_ID=$(get_parent_folder_id "$PARENT_GDRIVE_FOLDER_NAME")

# Fetch all databases and back them up
DB_LIST=$(mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" -e 'SHOW DATABASES;' | grep -Ev "(Database|information_schema|performance_schema|mysql)")

for DB in $DB_LIST; do
    BACKUP_FILE="$BACKUP_PATH/$DB-$DATE.sql.gz"
    mysqldump -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" $DB | gzip > "$BACKUP_FILE"

    upload_file "$BACKUP_FILE" "backups/$DATE_FOLDER" "$PARENT_GDRIVE_FOLDER_ID" SHARE_WITH_EMAILS[@]

    rm "$BACKUP_FILE"
done

# Upload the entire backup folder if it exists
if [ -d "$BACKUP_PATH" ]; then
    upload_folder "$BACKUP_PATH" "afeez_backups/$DATE_FOLDER" "$PARENT_GDRIVE_FOLDER_ID" SHARE_WITH_EMAILS[@]
fi
