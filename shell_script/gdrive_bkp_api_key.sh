#!/bin/bash
# generate_jwt_assertion_python(){
#   echo $(python3 gdrive.py)
# }

#!/bin/bash

# # Function to generate JWT assertion
# generate_jwt_assertion() {
#     local key_file_path="$1"
#
#     # Load the service account key JSON
#     local client_email=$(jq -r '.client_email' "$key_file_path")
#     local private_key=$(jq -r '.private_key' "$key_file_path")
#
#     # Create the payload with necessary claims
#     local current_time=$(date +%s)
#     local expiration_time=$((current_time + 3600))  # Expiration time: current time + 1 hour
#     local payload='{
#         "iss": "'"$client_email"'",
#         "sub": "'"$client_email"'",
#         "aud": "https://oauth2.googleapis.com/token",
#         "exp": '"$expiration_time"',
#         "iat": '"$current_time"',
#         "scope": "https://www.googleapis.com/auth/drive"
#     }'
#
#     # Sign the payload with the service account's private key
#     local jwt_assertion=$(echo -n "$payload" | openssl dgst -sha256 -sign <(echo "$private_key") -binary | base64 | tr -d '\n')
#
#     echo "$jwt_assertion"
# }
#
# # Replace 'acct.json' with the actual path to your service account key file
# jwt_assertion=$(generate_jwt_assertion "acct.json")
# echo "$jwt_assertion"
#
# get_access_token() {
#   local jwt_assertion="$1"
#   local token_url="https://oauth2.googleapis.com/token"
#
#   local access_token=$(curl -s -X POST "$token_url" \
#   -H "Content-Type: application/x-www-form-urlencoded" \
#   -d "grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer" \
#   -d "assertion=$jwt_assertion")
#
#   echo "$access_token"
# }


get_access_token_python(){
  local access_token=$(python3 gdrive.py)
  echo $access_token
}



# jwt_assertion=$(generate_jwt_assertion_python "acct.json")
# jwt_assertion=$(generate_jwt_assertion "acct.json")
# echo "JWT Assertion Key: $jwt_assertion"

access_token=$(get_access_token_python)
# echo $access_token
# if [ -n "$access_token" ]; then
#     echo "Access Token: $access_token"
# else
#     echo "Failed to obtain access token"
# fi


# Get or create folder in Google Drive
get_or_create_folder() {
  local folder_name=$1
  local access_token=$2
  local parent_folder_id=$3
  local param="%27$folder_name%27%20and%20%27$parent_folder_id%27%20in%20parents";

  local folder_id=$(curl -s -X GET \
    -H "Authorization: Bearer $access_token" \
    "https://www.googleapis.com/drive/v3/files?q=name=$param" | jq -r '.files[0].id')
    # "https://www.googleapis.com/drive/v3/files?q=name='$folder_name' and '$parent_folder_id' in parents" | jq -r '.files[0].id')
    # echo "$folder_id"

  if [ "$folder_id" == "null" ]; then
    # Folder doesn't exist, create it
    folder_id=$(curl -s -X POST \
      -H "Authorization: Bearer $access_token" \
      -H "Content-Type: application/json" \
      -d '{"name": "'$folder_name'", "mimeType": "application/vnd.google-apps.folder", "parents": ["'$parent_folder_id'"]}' \
      "https://www.googleapis.com/drive/v3/files" | jq -r '.id' )
      # -d '{"name": "'$folder_name'", "mimeType": "application/vnd.google-apps.folder"}' \
      # "https://www.googleapis.com/drive/v3/files" | jq -r '.id')
  fi

  echo "$folder_id"
  # echo "$folder_id"
}
upload_file_to_drive() {

  local local_file_path=$1
  # local access_token=$2
  local folder_structure=$2
  local file_name=$(basename $local_file_path)

  IFS='/' read -r -a folders <<< "$folder_structure"
  # current_folder_id="1wuETaDJdFXbzD0lGTZw_WMGxJGBq3iew"
  current_folder_id="root"

  for folder in "${folders[@]}"; do
    current_folder_id=$(get_or_create_folder "$folder" "$access_token" "$current_folder_id")
  done
  # echo $current_folder_id

  echo $current_folder_id
  # Upload the file to the final subfolder
  curl -X POST -L \
    -H "Authorization: Bearer $access_token" \
    -F "metadata={\"name\":\"$file_name\",\"parents\":[\"$current_folder_id\"]};type=application/json;charset=UTF-8" \
    -F "file=@$local_file_path;type=application/octet-stream" \
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart"
}

# upload_file_to_drive "setup.sh" "$ACCESS_TOKEN" "2024/02/14"
upload_file_to_drive "/vagrant/shell_script/test.sh" "2024/02/14"
