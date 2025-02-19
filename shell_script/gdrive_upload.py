import os
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

# Initialize Google Drive API
SCOPES = ['https://www.googleapis.com/auth/drive']
creds = Credentials.from_service_account_file('credentials.json', scopes=SCOPES)
drive_service = build('drive', 'v3', credentials=creds)

def create_drive_folder(name, parent_id=None):
    """Create a folder on Google Drive."""
    folder_metadata = {
        'name': name,
        'mimeType': 'application/vnd.google-apps.folder',
    }
    if parent_id:
        folder_metadata['parents'] = [parent_id]
    
    folder = drive_service.files().create(body=folder_metadata, fields='id').execute()
    return folder['id']

def upload_file(file_path, drive_folder_id):
    """Upload a single file to a specified Google Drive folder."""
    file_name = os.path.basename(file_path)
    file_metadata = {
        'name': file_name,
        'parents': [drive_folder_id]
    }
    media = MediaFileUpload(file_path, resumable=True)
    uploaded_file = drive_service.files().create(
        body=file_metadata,
        media_body=media,
        fields='id'
    ).execute()
    print(f'Uploaded "{file_name}" with ID: {uploaded_file.get("id")}')

def upload_folder(local_folder_path, drive_parent_id=None):
    """Recursively upload a folder and its contents to Google Drive."""
    folder_name = os.path.basename(local_folder_path)
    current_drive_folder_id = create_drive_folder(folder_name, drive_parent_id)
    
    for item in os.listdir(local_folder_path):
        item_path = os.path.join(local_folder_path, item)
        
        if os.path.isfile(item_path):
            upload_file(item_path, current_drive_folder_id)
        elif os.path.isdir(item_path):
            upload_folder(item_path, current_drive_folder_id)

# Define your local folder path and the parent Google Drive folder ID
local_folder_path = '/var/s3_files'  # Replace with your folder path
drive_parent_folder_id = 'your_drive_folder_id'  # Replace with your Google Drive folder ID

# Call the function to upload the folder and its subfolders
upload_folder(local_folder_path, drive_parent_folder_id)
