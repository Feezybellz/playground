import os
import subprocess

# MySQL credentials
MYSQL_USER = "root"  # Replace with your MySQL username
MYSQL_PASSWORD = "vagrant"  # Replace with your MySQL password
MYSQL_HOST = "localhost"  # Replace with your MySQL host if different

# Folder containing SQL backup files
BACKUP_FOLDER = "/vagrant/db_bkp/"  # Replace with the path to your backup folder

# Log file for errors
error_log_file = os.path.join(BACKUP_FOLDER, "import_errors.log")

# Ensure the backup folder exists
if not os.path.exists(BACKUP_FOLDER):
    print(f"Backup folder does not exist: {BACKUP_FOLDER}")
    exit(1)

# Get a list of all SQL files in the backup folder
sql_files = [f for f in os.listdir(BACKUP_FOLDER) if f.endswith(".sql")]

if not sql_files:
    print(f"No SQL files found in the backup folder: {BACKUP_FOLDER}")
    exit(1)

# Import each SQL file
for sql_file in sql_files:
    sql_file_path = os.path.join(BACKUP_FOLDER, sql_file)
    print(f"Importing database from file: {sql_file}")

    try:
        # Run the mysql command to import the SQL file
        subprocess.run(
            [
                "mysql",
                f"--user={MYSQL_USER}",
                f"--password={MYSQL_PASSWORD}",
                f"--host={MYSQL_HOST}",
            ],
            stdin=open(sql_file_path, "r"),
            stderr=subprocess.PIPE,
            universal_newlines=True,  # Use universal_newlines instead of text
            check=True,
        )

        print(f"Import completed for file: {sql_file}")

    except subprocess.CalledProcessError as e:
        # Log the error and continue
        error_message = f"Error importing database from file {sql_file}: {e.stderr}"
        print(error_message)
        with open(error_log_file, "a") as log:
            log.write(error_message + "\n")

print("Import process completed. Check the error log for any issues.")