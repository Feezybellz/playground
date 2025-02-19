import boto3
from googleapiclient.discovery import build
from google.oauth2.service_account import Credentials
from googleapiclient.http import MediaIoBaseUpload
import io

def download_file_from_s3(bucket_name, key, local_filename, aws_access_key_id, aws_secret_access_key):
    s3 = boto3.client('s3', aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key)
    try:
        s3.download_file(bucket_name, key, local_filename)
        return True
    except Exception as e:
        print(f"Error downloading file {key} from S3: {str(e)}")
        return False

def upload_file_to_google_drive(credentials_path, folder_id, file_path, file_name):
    creds = Credentials.from_service_account_file(credentials_path)
    service = build('drive', 'v3', credentials=creds)

    file_metadata = {
        'name': file_name,
        'parents': [folder_id]
    }
    media = MediaIoBaseUpload(io.FileIO(file_path, 'rb'), mimetype='application/octet-stream', resumable=True)

    try:
        file = service.files().create(body=file_metadata, media_body=media, fields='id').execute()
        print(f"File '{file_name}' uploaded successfully with ID: {file.get('id')}")
        return file.get('id')
    except Exception as e:
        print(f"Error uploading file '{file_name}' to Google Drive: {str(e)}")
        return None

def main():
    # S3 bucket details
    aws_access_key_id = ''
    aws_secret_access_key = ''

    # S3 bucket details
    s3_bucket_name = 'bellztest'
    s3_object_key = '2024/03/30/ekiti_dashboard-202403300000.sql.gz'

    # Google Drive details
    folder_id = '1wuETaDJdFXbzD0lGTZw_WMGxJGBq3iew'
    credentials_path = "acct.json"

    # Download file from S3
    local_filename = 'temp_file_to_upload.ext'
    if download_file_from_s3(s3_bucket_name, s3_object_key, local_filename, aws_access_key_id, aws_secret_access_key):
        # Upload file to Google Drive
        uploaded_file_id = upload_file_to_google_drive(credentials_path, folder_id, local_filename, s3_object_key.split('/')[-1])
        if uploaded_file_id:
            print("File uploaded successfully to Google Drive.")
        else:
            print("Failed to upload file to Google Drive.")
    else:
        print("Failed to download file from S3.")

if __name__ == "__main__":
    main()
