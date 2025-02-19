import jwt
import json
import time
import subprocess

def generate_jwt_assertion(key_file_path):
    # Load the service account key JSON
    with open(key_file_path) as f:
        service_account_key = json.load(f)

    # Extract necessary information from the service account key JSON
    client_email = service_account_key["client_email"]
    private_key = service_account_key["private_key"]

    # Create the payload with necessary claims
    current_time = int(time.time())
    payload = {
        "iss": client_email,
        "sub": client_email,
        "aud": "https://oauth2.googleapis.com/token",
        "exp": current_time + 3600,  # Expiration time: current time + 1 hour
        "iat": current_time,         # Issued at: current time
        "scope": "https://www.googleapis.com/auth/drive"
    }

    # Sign the payload with the service account's private key
    jwt_assertion = jwt.encode(payload, private_key, algorithm="RS256")

    return jwt_assertion.decode()

def get_access_token(jwt_assertion):
    # Execute curl command to obtain access token
    curl_command = f'curl -X POST "https://oauth2.googleapis.com/token" \
                    -d "scope=https://www.googleapis.com/auth/drive" \
                    -d "grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer" \
                    -d "assertion={jwt_assertion}"'

    result = subprocess.run(curl_command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
    if result.returncode == 0:
        access_token = json.loads(result.stdout)["access_token"]
        # print(access_token)
        return access_token
    else:
        print("Error:", result.stderr)
        return None

def create_or_get_folder(folder_name, access_token):
    folder_id_array = []

    # if foldername contains "/" then split it and create the folder
    if "/" in folder_name:

        folder_name = folder_name.split("/")
        folder_id = "root"
        for folder in folder_name:
            query = f"name=%27{folder}%27%20and%20%27{folder_id}%27%20in%20parents"
            cmd = f"curl -s -H 'Authorization: Bearer {access_token}' 'https://www.googleapis.com/drive/v3/files?q={query}'"
            result = subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
            folder_data = json.loads(result.stdout)

            if 'files' in folder_data and folder_data['files']:
                folder_id = folder_data['files'][0]['id']
                folder_id_array.append(folder_id)
            else:
                cmd = f"curl -s -X POST -H 'Authorization: Bearer {access_token}' -H 'Content-Type: application/json' -d '{{\"name\": \"{folder}\", \"mimeType\": \"application/vnd.google-apps.folder\", \"parents\": [\"{folder_id}\"]}}' 'https://www.googleapis.com/drive/v3/files'"
                result = subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
                folder_data = json.loads(result.stdout)
                if 'id' in folder_data:
                    folder_id = folder_data['id']
                    folder_id_array.append(folder_id)

                else:
                    print("Error creating folder:", folder_data)
                    return None
        return [folder_id, folder_id_array]
    # # Check if the folder exists in the root directory
    # query = f"name=%27{folder_name}%27%20and%20%27root%27%20in%20parents"
    # cmd = f"curl -s -H 'Authorization: Bearer {access_token}' 'https://www.googleapis.com/drive/v3/files?q={query}'"
    # result = subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
    # # print(result)
    # folder_data = json.loads(result.stdout)

    # if 'files' in folder_data and folder_data['files']:
    #     # Folder exists, return its ID
    #     folder_id = folder_data['files'][0]['id']
    #     return folder_id
    # else:
    #     # Folder doesn't exist, create it
    #     cmd = f"curl -s -X POST -H 'Authorization: Bearer {access_token}' -H 'Content-Type: application/json' -d '{{\"name\": \"{folder_name}\", \"mimeType\": \"application/vnd.google-apps.folder\"}}' 'https://www.googleapis.com/drive/v3/files'"
    #     # result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    #     result = subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)

    #     folder_data = json.loads(result.stdout)
    #     if 'id' in folder_data:
    #         folder_id = folder_data['id']
    #         return folder_id
    #     else:
    #         print("Error creating folder:", folder_data)
    #         return None



def share_folder(folder_id, email, access_token):
    """Shares a Google Drive folder with a specified email."""
    permission_data = {
        "role": "writer",  # Change to "reader" if only view access is needed
        "type": "user",
        "emailAddress": email
    }

    cmd = f"curl -s -X POST -H 'Authorization: Bearer {access_token}' \
           -H 'Content-Type: application/json' \
           -d '{json.dumps(permission_data)}' \
           'https://www.googleapis.com/drive/v3/files/{folder_id}/permissions'"

    result = subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
    
    if result.returncode == 0:
        print(f"Folder {folder_id} successfully shared with {email}")
    else:
        print("Error sharing folder:", result.stderr)


def upload_file(file_path, folder_name, access_token):
    folder_id = create_or_get_folder(folder_name, access_token)
    folder_id = folder_id[0]
    folder_id_array = folder_id[1]

    if folder_id:
        # Upload the file to the specified folder
        # cmd = f"curl -s -X POST -H 'Authorization: Bearer {access_token}' -H 'Content-Type: application/json' -d '{{\"name\": \"{file_path}\", \"parents\": [\"{folder_id}\"]}}' --upload-file '{file_path}' 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart'"

        cmd = f"curl -X POST -H 'Authorization: Bearer {access_token}' \
       -F 'metadata={{\"name\": \"{file_path}\", \"parents\": [\"{folder_id}\"]}};type=application/json' \
       -F 'file=@{file_path};type=text/plain' \
       'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart'"

        print("Curl command:", cmd)
        result = subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
        print("Curl output:", result)
        file_data = json.loads(result.stdout)
        if 'id' in file_data:
            # Grant access to a specified email address
            email = "belloafeez7@gmail.com"  # Change this to the desired email address
            # cmd = f"curl -s -X POST -H 'Authorization: Bearer {access_token}' -H 'Content-Type: application/json' -d '{{\"role\": \"reader\", \"type\": \"user\", \"emailAddress\": \"{email}\"}}' 'https://www.googleapis.com/drive/v3/files/{file_data['id']}/permissions'"
            # subprocess.run(cmd, shell=True)

            # for folder_id in folder_id_array:
            share_folder(folder_id, email, access_token)

            print("File uploaded successfully.")
        else:
            print("Error uploading file:", file_data)
    else:
        print("Failed to create or retrieve folder.")

# Replace 'acct.json' with the actual path to your service account key file
jwt_assertion = generate_jwt_assertion("acct.json")
access_token = get_access_token(jwt_assertion)

if access_token:
    # Replace '/path/to/file.txt' with the actual path to the file you want to upload
    upload_file("./note.txt", "mckodev/2025", access_token)
else:
    print("Failed to obtain access token.")


# import jwt
# import json
# import time
# import subprocess
#
# def generate_jwt_assertion(key_file_path):
#     # Load the service account key JSON
#     with open(key_file_path) as f:
#         service_account_key = json.load(f)
#
#     # Extract necessary information from the service account key JSON
#     client_email = service_account_key["client_email"]
#     private_key = service_account_key["private_key"]
#
#     # Create the payload with necessary claims
#     current_time = int(time.time())
#     payload = {
#         "iss": client_email,
#         "sub": client_email,
#         "aud": "https://oauth2.googleapis.com/token",
#         "exp": current_time + 3600,  # Expiration time: current time + 1 hour
#         "iat": current_time,         # Issued at: current time
#         "scope": "https://www.googleapis.com/auth/drive"
#     }
#
#     # Sign the payload with the service account's private key
#     jwt_assertion = jwt.encode(payload, private_key, algorithm="RS256")
#
#     return jwt_assertion.decode()
#
# def get_access_token(jwt_assertion):
#     # Execute curl command to obtain access token
#     curl_command = f'curl -X POST "https://oauth2.googleapis.com/token" \
#                     -d "scope=https://www.googleapis.com/auth/drive" \
#                     -d "grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer" \
#                     -d "assertion={jwt_assertion}"'
#
#     result = subprocess.run(curl_command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
#     if result.returncode == 0:
#         access_token = json.loads(result.stdout)["access_token"]
#         return access_token
#     else:
#         print("Error:", result.stderr)
#         return None
#
# # Replace 'service_account_key.json' with the actual path to your service account key file
# jwt_assertion = generate_jwt_assertion("acct.json")
# # print(jwt_assertion)
# # print("JWT Assertion Key:", jwt_assertion)
# #
# access_token = get_access_token(jwt_assertion)
# if access_token:
#     # print("Access Token:", access_token)
#     print(access_token)
