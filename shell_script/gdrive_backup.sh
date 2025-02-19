CREDENTIALS_FILE="/vagrant/gdrive/oauth.json"

  # Generate code verifier and challenge
  code_verifier=$(openssl rand -hex 32)

# Function to obtain access token using OAuth2 credentials
get_auth_url() {
  local client_id=$(jq -r '.installed.client_id' "$CREDENTIALS_FILE")
  local redirect_uri="http://localhost"  # Adjust redirect URI as needed
  local scope="https://www.googleapis.com/auth/drive"

  local code_challenge=$(echo -n "$code_verifier" | openssl dgst -binary -sha256 | openssl base64 -e -A | tr '+/' '-_' | tr -d '=')

  # Build authorization URL
  AUTH_URL="https://accounts.google.com/o/oauth2/v2/auth"
  AUTH_URL+="?client_id=$client_id"
  AUTH_URL+="&redirect_uri=$redirect_uri"
  AUTH_URL+="&response_type=code"
  AUTH_URL+="&scope=$scope"
  AUTH_URL+="&code_challenge=$code_challenge"
  AUTH_URL+="&code_challenge_method=S256"
}

# Call function to generate authorization URL
get_auth_url

# Display authorization URL
echo "Please open the following URL in your browser to grant access:"
echo "$AUTH_URL"

# Wait for user authorization and obtain authorization code
echo "Once you've granted access, please enter the authorization code here:"
read -r authorization_code

get_access_token(){
  authorization_code=$1
  local client_id=$(jq -r '.installed.client_id' "$CREDENTIALS_FILE")
  local client_secret=$(jq -r '.installed.client_secret' "$CREDENTIALS_FILE")
  local redirect_uri="http://localhost"  # Adjust redirect URI as needed
  local scope="https://www.googleapis.com/auth/drive"

  # Exchange authorization code for access token
  local response=$(curl -s -X POST "https://oauth2.googleapis.com/token" \
  -d "client_id=$client_id" \
  -d "client_secret=$client_secret" \
  -d "redirect_uri=$redirect_uri" \
  -d "code=$authorization_code" \
  -d "code_verifier=$code_verifier" \
  -d "grant_type=authorization_code")
  # Extract access token from response
  # echo $response
  local access_token=$(echo "$response" | jq -r .access_token)
  echo "$access_token" > acc
  echo "$access_token"
}


# access_token=$(get_access_token "$authorization_code")
access_token="ya29.a0Ad52N38y-twt_pjtP6-atgv7oo3ugWdkHBDnwgLqTDFKMxfK8qNuHh35I0I-1ahDNoqqDkHiIk-f17qBQxxgcP2Qbv63dXO1rIzaA3VBDrxfRfhfQmvO-YVSSBl54nZkaEwrZCJdZ17BVrcj9W1nG3DdrNPHFzR-0r7faCgYKATkSARASFQHGX2MiPVlxB3jj78iRq6zpw_gyiQ0171"

# echo $access_token


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
  current_folder_id="1wuETaDJdFXbzD0lGTZw_WMGxJGBq3iew"

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
upload_file_to_drive "/vagrant/shell_script/setup.sh" "2024/02/14"


#
# # Function to get access token using OAuth2 credentials
# get_access_token() {
#   local client_id=$(jq -r '.installed.client_id' "$CREDENTIALS_FILE")
#   local client_secret=$(jq -r '.installed.client_secret' "$CREDENTIALS_FILE")
#   local refresh_token=$(jq -r '.installed.refresh_token' "$CREDENTIALS_FILE")
#
#   # Retrieve access token using client credentials
#   local response=$(curl -s -X POST "https://oauth2.googleapis.com/token" \
#     -d "client_id=$client_id" \
#     -d "client_secret=$client_secret" \
#     -d "grant_type=refresh_token" \
#     -d "refresh_token=$refresh_token")
# echo $response
#   # Extract access token from response
#   local access_token=$(echo "$response" | jq -r .access_token)
#   echo "$access_token"
# }
#
# # Example usage
# ACCESS_TOKEN=$(get_access_token)
# echo "Access Token: $ACCESS_TOKEN"

#
#
# # #!/bin/bash
# #
# #!/bin/bash
#
# # Define your API key
# API_KEY="AIzaSyDiu7nn_lK6YLt9Krm_tQ5j8qNBD0ved7c"
#
# # Function to upload a file to Google Drive
# upload_file_to_drive() {
#   local local_file_path=$1
#   local folder_structure=$2
#   local file_name=$(basename $local_file_path)
#
#   # Prepare folder structure
#   IFS='/' read -r -a folders <<< "$folder_structure"
#   parent_folder_id="root"
#
#   for folder in "${folders[@]}"; do
#     # Get or create folder in Google Drive
#     parent_folder_id=$(get_or_create_folder "$folder" "$API_KEY" "$parent_folder_id")
#   done
#
#   # Upload the file to the final subfolder
#   curl -X POST -L \
#     -F "metadata={\"name\":\"$file_name\",\"parents\":[\"$parent_folder_id\"]};type=application/json;charset=UTF-8" \
#     -F "file=@$local_file_path;type=application/octet-stream" \
#     "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&key=$API_KEY"
# }
#
# # Example usage
# upload_file_to_drive "setup.sh" "2024/02/14"
#
#
# # #run sudo apt-get update
# # #sudo apt-get install jq
# #
# # # Path to the credentials JSON file downloaded from Google Cloud Console
# # CREDENTIALS_FILE="/vagrant/gdrive/oauth.json"
# # # Get access token using credentials
# # get_access_token() {
# #   local client_id=$(jq -r .installed.client_id "$CREDENTIALS_FILE")
# #   local client_secret=$(jq -r .installed.client_secret "$CREDENTIALS_FILE")
# #   local refresh_token=$(jq -r .installed.refresh_token "$CREDENTIALS_FILE")
# #   # Retrieve access token using client credentials
# #   local response=$(curl -s -X POST "https://oauth2.googleapis.com/token" \
# #     -d "client_id=$client_id" \
# #     -d "client_secret=$client_secret" \
# #     -d "grant_type=refresh_token" \
# #     -d "refresh_token=$refresh_token")
# #
# #   # Extract access token from response
# #   local access_token=$(echo "$response" | jq -r .access_token)
# #   echo "$access_token"
# # }
# #
# #
# #
# # # Get or create folder in Google Drive
# # get_or_create_folder() {
# #   local folder_name=$1
# #   local access_token=$2
# #   local parent_folder_id=$3
# #
# #   local folder_id=$(curl -s -X GET \
# #     -H "Authorization: Bearer $access_token" \
# #     "https://www.googleapis.com/drive/v3/files?q=name='$folder_name' and '$parent_folder_id' in parents" | jq -r '.files[0].id')
# #
# #   if [ "$folder_id" == "null" ]; then
# #     # Folder doesn't exist, create it
# #     folder_id=$(curl -s -X POST \
# #       -H "Authorization: Bearer $access_token" \
# #       -H "Content-Type: application/json" \
# #       -d '{"name": "'$folder_name'", "mimeType": "application/vnd.google-apps.folder", "parents": ["'$parent_folder_id'"]}' \
# #       "https://www.googleapis.com/drive/v3/files" | jq -r '.id')
# #   fi
# #
# #   echo "$folder_id"
# # }
# #
# # # Upload file to Google Drive with manual folder structure
# # upload_file_to_drive() {
# #   local local_file_path=$1
# #   local access_token=$2
# #   local folder_structure=$3
# #   local file_name=$(basename $local_file_path)
# #
# #   IFS='/' read -r -a folders <<< "$folder_structure"
# #   current_folder_id="root"
# #
# #   for folder in "${folders[@]}"; do
# #     current_folder_id=$(get_or_create_folder "$folder" "$access_token" "$current_folder_id")
# #   done
# #
# #   # Upload the file to the final subfolder
# #   curl -X POST -L \
# #     -H "Authorization: Bearer $access_token" \
# #     -F "metadata={\"name\":\"$file_name\",\"parents\":[\"$current_folder_id\"]};type=application/json;charset=UTF-8" \
# #     -F "file=@$local_file_path;type=application/octet-stream" \
# #     "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart"
# # }
# #
# # # Example usage
# # ACCESS_TOKEN=$(get_access_token)
# # #echo $ACCESS_TOKEN
# # upload_file_to_drive "setup.sh" "$ACCESS_TOKEN" "2024/02/14"
