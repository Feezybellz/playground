import os
import json
import subprocess
import jwt
import time


def generate_jwt_assertion(key_file_path):
    """Generates a JWT assertion for Google API authentication."""
    with open(key_file_path) as f:
        service_account_key = json.load(f)

    client_email = service_account_key["client_email"]
    private_key = service_account_key["private_key"]

    current_time = int(time.time())
    payload = {
        "iss": client_email,
        "sub": client_email,
        "aud": "https://oauth2.googleapis.com/token",
        "exp": current_time + 3600,  # Expiration: 1 hour
        "iat": current_time,
        "scope": "https://www.googleapis.com/auth/drive"
    }

    jwt_assertion = jwt.encode(payload, private_key, algorithm="RS256")
    return jwt_assertion.decode()


def get_access_token(jwt_assertion):
    """Obtains an access token from Google OAuth2 API."""
    curl_command = f'curl -s -X POST "https://oauth2.googleapis.com/token" \
                    -d "scope=https://www.googleapis.com/auth/drive" \
                    -d "grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer" \
                    -d "assertion={jwt_assertion}"'

    result = subprocess.run(curl_command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
    
    if result.returncode == 0:
        return json.loads(result.stdout)["access_token"]
    else:
        print("Error obtaining access token:", result.stderr)
        return None




import json
import subprocess
import urllib.parse



def create_or_get_folder(folder_name, access_token):
    """
    Creates or retrieves a Google Drive folder and returns:
    - The folder ID
    - The top-most parent folder (to be shared)
    """
    folder_id = "root"
    top_parent_id = None
    folder_id_array = []

    if "/" in folder_name:
        folders = folder_name.split("/")
        for index, folder in enumerate(folders):
            query = f"name='{folder}' and '{folder_id}' in parents"
            query = urllib.parse.quote(query)  # 🔹 URL encoding fix

            cmd = f"curl -s -H 'Authorization: Bearer {access_token}' 'https://www.googleapis.com/drive/v3/files?q={query}'"
            print(f"📢 Running Query: {cmd}")  # Debugging

            result = subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)

            if result.stderr:
                print(f"❌ API Error: {result.stderr}")

            if not result.stdout.strip():
                print(f"❌ Empty API Response for '{folder}'. Check authentication.")
                return None, None

            try:
                folder_data = json.loads(result.stdout)
                print(f"📢 Query Result: {folder_data}")  # Debugging
            except json.JSONDecodeError:
                print(f"❌ JSON Decode Error:\n{result.stdout}")
                return None, None

            if 'files' in folder_data and folder_data['files']:
                folder_id = folder_data['files'][0]['id']
                if index == 0:
                    top_parent_id = folder_id  # Capture the **top-most** parent folder
                folder_id_array.append(folder_id)
            else:
                print(f"ℹ️ Folder '{folder}' not found. Creating new folder...")

                cmd = f"curl -s -X POST -H 'Authorization: Bearer {access_token}' -H 'Content-Type: application/json' -d '{{\"name\": \"{folder}\", \"mimeType\": \"application/vnd.google-apps.folder\", \"parents\": [\"{folder_id}\"]}}' 'https://www.googleapis.com/drive/v3/files'"
                print(f"📢 Creating Folder: {cmd}")  # Debugging

                result = subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)

                if result.stderr:
                    print(f"❌ Error creating folder '{folder}': {result.stderr}")

                if not result.stdout.strip():
                    print(f"❌ Empty response while creating folder '{folder}'.")
                    return None, None

                try:
                    folder_data = json.loads(result.stdout)
                    print(f"📢 Folder Creation Response: {folder_data}")  # Debugging
                except json.JSONDecodeError:
                    print(f"❌ JSON Decode Error (Folder Creation):\n{result.stdout}")
                    return None, None

                if 'id' in folder_data:
                    folder_id = folder_data['id']
                    if index == 0:
                        top_parent_id = folder_id  # Capture the **top-most** parent folder
                    folder_id_array.append(folder_id)
                    print(f"✅ Created folder '{folder}' with ID: {folder_id}")
                else:
                    print(f"❌ Error creating folder '{folder}': {folder_data}")
                    return None, None

        return folder_id, top_parent_id  # Return both the last folder ID and the top-most parent folder ID
    else:
        return folder_id, None
    


def get_existing_permissions(folder_id, access_token):
    """Fetches the existing permissions for a Google Drive folder."""
    cmd = f"curl -s -X GET -H 'Authorization: Bearer {access_token}' \
           'https://www.googleapis.com/drive/v3/files/{folder_id}/permissions?fields=permissions(id,emailAddress,role)'"
    
    result = subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)

    if result.returncode == 0:
        try:
            permissions_data = json.loads(result.stdout)
            print(f"📢 Permissions Data: {permissions_data}")  # Debugging
            return permissions_data.get("permissions", [])  # Return list of permissions
        except json.JSONDecodeError:
            print(f"❌ Error decoding permissions response: {result.stdout}")
            return []
    else:
        print(f"❌ Error fetching permissions: {result.stderr}")
        return []

def share_folder(folder_id, emails, access_token):
    """Shares a Google Drive folder with a list of emails, avoiding duplicate sharing."""
    
    # Fetch current permissions
    existing_permissions = get_existing_permissions(folder_id, access_token)

    # Extract already shared emails
    # convert email and shared emails to small letter 
    shared_emails = {perm.get("emailAddress").lower() for perm in existing_permissions if "emailAddress" in perm}
    emails = [email.lower() for email in emails]
    # shared_emails = {perm.get("emailAddress") for perm in existing_permissions if "emailAddress" in perm}

    for email in emails:
        if email in shared_emails:
            print(f"⚠️ Folder {folder_id} is already shared with {email}, skipping.")
            continue  # Skip sharing again

        permission_data = {
            "role": "writer",
            "type": "user",
            "emailAddress": email
        }

        cmd = f"curl -s -X POST -H 'Authorization: Bearer {access_token}' \
               -H 'Content-Type: application/json' \
               -d '{json.dumps(permission_data)}' \
               'https://www.googleapis.com/drive/v3/files/{folder_id}/permissions'"

        result = subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)

        if result.returncode == 0:
            print(f"✅ Folder {folder_id} successfully shared with {email}")
        else:
            print(f"❌ Error sharing folder with {email}: {result.stderr}")



def upload_single_file(file_path, folder_id, access_token):
    print(folder_id)
    """Uploads a single file to Google Drive inside the specified folder."""
    file_name = os.path.basename(file_path)

    cmd = f"""curl -X POST -H 'Authorization: Bearer {access_token}' \
       -F 'metadata={{"name": "{file_name}", "parents": ["{folder_id}"]}};type=application/json' \
       -F 'file=@{file_path};type=text/plain' \
       'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart'"""

    print(f"Uploading: {file_path} to folder ID: {folder_id}")
    result = subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
    
    try:
        file_data = json.loads(result.stdout)
        if 'id' in file_data:
            print(f"✅ File {file_name} uploaded successfully.")
        else:
            print("❌ Error uploading file:", file_data)
    except json.JSONDecodeError:
        print("❌ Error parsing response:", result.stdout)




def upload_file(path, folder_name, access_token, create_subfolders=False, share_with=None):
    """
    Uploads a file or folder to Google Drive.
    - Ensures that the parent folder (folder_name) is shared first.
    - Supports nested folder creation.
    - Prevents the creation of a `.` folder.
    """
    
    if os.path.isdir(path):
        print(f"📁 Uploading folder: {path}")

        # Ensure the base parent folder is created and shared
        top_folder_id, _ = create_or_get_folder(folder_name, access_token)

        if share_with and top_folder_id:
            share_folder(top_folder_id, share_with, access_token)

        for root, _, files in os.walk(path):
            relative_path = os.path.relpath(root, path)
            
            # 🔹 Fix: Ensure '.' is completely skipped
            if relative_path in [".", ""]:
                continue  # Skip processing the root folder itself

            # 🔹 Fix: Ensure proper folder hierarchy
            drive_folder_path = os.path.join(folder_name, relative_path).replace("\\", "/")  # Fix for Windows paths
            drive_folder_id, _ = create_or_get_folder(drive_folder_path, access_token)

            for file in files:
                file_path = os.path.join(root, file)
                upload_single_file(file_path, drive_folder_id, access_token)

    elif os.path.isfile(path):
        # 🔹 Fix: Correct parent folder retrieval
        parent_path = os.path.dirname(path) if create_subfolders else ""
        parent_path = "" if parent_path in [".", ""] else parent_path  # 🔹 Fix empty or "." folder creation

        drive_folder_path = os.path.join(folder_name, parent_path).replace("\\", "/") if parent_path else folder_name

        # Ensure the folder is created
        drive_folder_id, top_parent_id = create_or_get_folder(drive_folder_path, access_token)

        # Share the **top-most** parent folder first
        if share_with and top_parent_id and top_parent_id != "root":  # 🔹 Prevent sharing 'root'
            share_folder(top_parent_id, share_with, access_token)

        # Upload file to the correct folder
        upload_single_file(path, drive_folder_id, access_token)

    else:
        print("❌ Invalid path provided.")



# 🔹 Example Usage:
emails_to_share = ["banjimayowa@gmail.com", "belloafeez7@gmail.com"]

# Authenticate with Google Drive
jwt_assertion = generate_jwt_assertion("acct.json")
access_token = get_access_token(jwt_assertion)

if access_token:
    # Upload a file
    # upload_file("./note.txt", "mckodev", access_token, share_with=emails_to_share)

    # Upload a folder
    # upload_file("./my_folder", "mckodev", access_token, share_with=emails_to_share)

    # Upload a file with subfolders
    upload_file("2025/note2.txt", "mckodev", access_token, create_subfolders=True, share_with=emails_to_share)
else:
    print("❌ Failed to obtain access token.")
