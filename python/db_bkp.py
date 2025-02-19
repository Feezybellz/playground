import os
import subprocess
from datetime import datetime

# MySQL credentials
MYSQL_USER = "root"  # Replace with your MySQL username
MYSQL_PASSWORD = "vagrant"  # Replace with your MySQL password
MYSQL_HOST = "localhost"  # Replace with your MySQL host if different

# Backup directory
BACKUP_DIR = "/vagrant/db_bkp/"  # Replace with your desired backup directory

# Get current date and time for the backup file name
current_time = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")

# Ensure the backup directory exists
if not os.path.exists(BACKUP_DIR):
    os.makedirs(BACKUP_DIR)

# Log file for errors
error_log_file = os.path.join(BACKUP_DIR, f"backup_errors_{current_time}.log")

# Get a list of all databases
try:
    # Run the MySQL command to list all databases
    result = subprocess.run(
        [
            "mysql",
            f"--user={MYSQL_USER}",
            f"--password={MYSQL_PASSWORD}",
            f"--host={MYSQL_HOST}",
            "-e",
            "SHOW DATABASES;",
        ],
        capture_output=True,
        text=True,
        check=True,
    )

    # Extract database names (skip the first line, which is the header)
    databases = result.stdout.splitlines()[1:]

    # Backup each database
    for db in databases:
        if db.strip() not in ["information_schema", "performance_schema", "mysql", "sys"]:  # Skip system databases
            backup_file = os.path.join(BACKUP_DIR, f"{db}_{current_time}.sql")
            print(f"Backing up database: {db} to {backup_file}")

            try:
                # Run mysqldump to backup the database
                with open(backup_file, "w") as f:
                    subprocess.run(
                        [
                            "mysqldump",
                            f"--user={MYSQL_USER}",
                            f"--password={MYSQL_PASSWORD}",
                            f"--host={MYSQL_HOST}",
                            "--databases",  # Include CREATE DATABASE and USE statements
                            "--single-transaction",
                            "--quick",
                            "--lock-tables=false",
                            db,
                        ],
                        stdout=f,
                        stderr=subprocess.PIPE,
                        text=True,
                        check=True,
                    )

                print(f"Backup completed for database: {db}")

            except subprocess.CalledProcessError as e:
                # Log the error and continue
                error_message = f"Error backing up database {db}: {e.stderr}"
                print(error_message)
                with open(error_log_file, "a") as log:
                    log.write(error_message + "\n")

    print("Backup process completed. Check the error log for any issues.")

except subprocess.CalledProcessError as e:
    print(f"Error listing databases: {e.stderr}")
except Exception as e:
    print(f"An error occurred: {e}")