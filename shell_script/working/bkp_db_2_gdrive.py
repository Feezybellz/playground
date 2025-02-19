import os
import json
import time
import subprocess
import jwt
import requests
import urllib.parse
from datetime import datetime

# Google Drive Configuration

current_dir = os.path.dirname(os.path.abspath(__file__))  # Get current script directory
json_file_path = os.path.join(current_dir, "acct.json")  # Full path to acct.json
SERVICE_ACCOUNT_FILE = json_file_path

PARENT_GDRIVE_FOLDER_NAME = "mckodev/mckodev_server_db"
EMAILS_TO_SHARE = ["banjimayowa@gmail.com", "belloafeez7@gmail.com"]

# Database Configuration
DB_USER = "root"
DB_PASSWORD = "vagrant"
BACKUP_PATH = "/var/db_backup"

# Ensure the backup path exists
os.makedirs(BACKUP_PATH, exist_ok=True)

# Date-based Folder Structure
DATE_FOLDER = f"mckodev_db/{datetime.now().strftime('%Y/%m/%d')}"


def generate_jwt_assertion(key_file):
    with open(key_file, "r") as f:
        service_account_key = json.load(f)

    client_email = service_account_key["client_email"]
    private_key = service_account_key["private_key"]

    current_time = int(time.time())
    payload = {
        "iss": client_email,
        "sub": client_email,
        "aud": "https://oauth2.googleapis.com/token",
        "exp": current_time + 3600,
        "iat": current_time,
        "scope": "https://www.googleapis.com/auth/drive"
    }

    return jwt.encode(payload, private_key, algorithm="RS256")


def get_access_token(jwt_assertion):
    token_url = "https://oauth2.googleapis.com/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {
        "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
        "assertion": jwt_assertion
    }

    response = requests.post(token_url, headers=headers, data=data)

    if response.status_code == 200:
        return response.json().get("access_token")
    else:
        print("Error obtaining access token:", response.text)
        return None


def retry_request(func, *args, max_retries=5, base_delay=5):
    """Retries API requests with exponential backoff"""
    for attempt in range(max_retries):
        response = func(*args)
        if response.status_code == 200:
            return response.json()
        
        error = response.json().get("error", {})
        if error.get("errors") and error["errors"][0]["reason"] == "userRateLimitExceeded":
            wait_time = base_delay * (2 ** attempt)
            print(f"Rate limit exceeded. Retrying in {wait_time} seconds...")
            time.sleep(wait_time)
        else:
            break
    return None


def create_or_get_folder(folder_name, parent_folder_id, access_token):
    """Creates or retrieves a Google Drive folder."""
    query = f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder' and '{parent_folder_id}' in parents"
    query = urllib.parse.quote(query)

    def request_func():
        return requests.get(
            f"https://www.googleapis.com/drive/v3/files?q={query}&fields=files(id)",
            headers={"Authorization": f"Bearer {access_token}"}
        )

    folder_data = retry_request(request_func)

    if folder_data and folder_data.get("files"):
        return folder_data["files"][0]["id"]

    def create_func():
        return requests.post(
            "https://www.googleapis.com/drive/v3/files",
            headers={"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"},
            json={"name": folder_name, "mimeType": "application/vnd.google-apps.folder", "parents": [parent_folder_id]}
        )

    new_folder_data = retry_request(create_func)
    return new_folder_data.get("id") if new_folder_data else None


def get_or_create_nested_folder(folder_path, parent_folder_id, access_token):
    """Ensures a full nested folder structure exists in Google Drive."""
    folders = folder_path.split("/")
    for folder in folders:
        parent_folder_id = create_or_get_folder(folder, parent_folder_id, access_token)
    return parent_folder_id


def share_folder(folder_id, emails, access_token):
    """Shares a Google Drive folder with a list of emails, avoiding duplicate sharing."""
    
    def get_existing_permissions():
        return requests.get(
            f"https://www.googleapis.com/drive/v3/files/{folder_id}/permissions?fields=permissions(emailAddress)",
            headers={"Authorization": f"Bearer {access_token}"}
        )

    permissions_data = retry_request(get_existing_permissions)
    existing_emails = {perm["emailAddress"].lower() for perm in permissions_data.get("permissions", []) if "emailAddress" in perm}

    for email in emails:
        if email.lower() in existing_emails:
            print(f"Folder {folder_id} is already shared with {email}, skipping.")
            continue

        def share_request():
            return requests.post(
                f"https://www.googleapis.com/drive/v3/files/{folder_id}/permissions",
                headers={"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"},
                json={"role": "writer", "type": "user", "emailAddress": email}
            )

        retry_request(share_request)
        print(f"Folder {folder_id} successfully shared with {email}")


def upload_file(file_path, folder_id, access_token):
    """Uploads a file to Google Drive."""
    file_name = os.path.basename(file_path)

    def request_func():
        with open(file_path, "rb") as f:
            files = {
                "metadata": (None, json.dumps({"name": file_name, "parents": [folder_id]}), "application/json"),
                "file": f
            }
            return requests.post(
                "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
                headers={"Authorization": f"Bearer {access_token}"},
                files=files
            )

    file_data = retry_request(request_func)

    if file_data and "id" in file_data:
        print(f"File '{file_name}' uploaded successfully.")
    else:
        print(f"Error uploading '{file_name}': {file_data}")


def backup_and_upload():
    """Backs up MySQL databases and uploads them to Google Drive."""
    jwt_assertion = generate_jwt_assertion(SERVICE_ACCOUNT_FILE)
    access_token = get_access_token(jwt_assertion)

    if not access_token:
        print("Failed to authenticate with Google Drive.")
        return

    # parent_folder_id = create_or_get_folder(PARENT_GDRIVE_FOLDER_NAME, "root", access_token)
    parent_folder_id = get_or_create_nested_folder(PARENT_GDRIVE_FOLDER_NAME, "root", access_token)
    date_folder_id = get_or_create_nested_folder(DATE_FOLDER, parent_folder_id, access_token)

    # Share the top-most parent folder
    share_folder(parent_folder_id, EMAILS_TO_SHARE, access_token)

    # Fetch all MySQL databases
    databases = subprocess.run(
        ["mysql", "-u", DB_USER, f"-p{DB_PASSWORD}", "-e", "SHOW DATABASES;"],
        stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True
    )

    if databases.returncode != 0:
        print("Error fetching database list:", databases.stderr)
        return

    db_list = databases.stdout.split("\n")[1:]

    for db in db_list:
        db = db.strip()
        if db in ["", "information_schema", "performance_schema", "mysql"]:
            continue

        print(f"Creating backup for database: {db}...")

        backup_file = os.path.join(BACKUP_PATH, f"{db}-{datetime.now().strftime('%Y%m%d%H%M')}.sql.gz")

        with open(backup_file, "wb") as f:
            backup_process = subprocess.run(
                ["mysqldump", "-u", DB_USER, f"--password={DB_PASSWORD}", db],
                stdout=subprocess.PIPE, stderr=subprocess.PIPE
            )

            if backup_process.returncode != 0:
                print(f"Error backing up database {db}: {backup_process.stderr.decode()}")
                continue

            f.write(subprocess.run(["gzip"], input=backup_process.stdout, stdout=subprocess.PIPE).stdout)

        upload_file(backup_file, date_folder_id, access_token)

        os.remove(backup_file)

    print("Database backups completed and uploaded to Google Drive.")


backup_and_upload()
