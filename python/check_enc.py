
import mysql.connector
import time

# Function to fetch IDs in batches with sleep and progress output
def fetch_ids_in_batches(cursor, table_name, batch_size=10000, sleep_time=1, log_file="/var/check_enc.log"):
    offset = 0
    ids = set()
    batch_number = 1
    with open(log_file, "a") as log:
        while True:
            cursor.execute(f"SELECT id FROM {table_name} LIMIT {batch_size} OFFSET {offset}")
            batch = cursor.fetchall()
            if not batch:
                break
            ids.update([row[0] for row in batch])
            log_message = f"Processed batch {batch_number} from {table_name} with {len(batch)} records."
            print(log_message)  # Print to console (optional)
            log.write(log_message + "\n")  # Write to log file
            batch_number += 1
            offset += batch_size
            time.sleep(sleep_time)  # Sleep for the specified time (in seconds)
    return ids

# Establish database connection
db_connection = mysql.connector.connect(
    host='localhost',
    user='root',
    password='Pa$$w0rd',
    db='mckodevc_demoM4G'
#    'charset': 'utf8mb4',
#    'cursorclass': pymysql.cursors.DictCursor
)


log_file = "/var/check_enc.log"

cursor = db_connection.cursor()

# Fetch all ids from million_tbl in batches with sleep and progress print
print("Fetching ids from million_tbl...")
million_tbl_ids = fetch_ids_in_batches(cursor, "million_tbl", batch_size=100000, sleep_time=1, log_file=log_file)

# Fetch all ids from million_tbl_encrypted in batches with sleep and progress print
print("Fetching ids from million_tbl_encrypted...")
million_tbl_encrypted_ids = fetch_ids_in_batches(cursor, "million_tbl_encrypted", batch_size=100000, sleep_time=1, log_file=log_file)

# Find ids that are in million_tbl but not in million_tbl_encrypted
ids_not_in_encrypted = million_tbl_ids - million_tbl_encrypted_ids

# Output the ids not in million_tbl_encrypted
with open(log_file, "a") as log:
    if ids_not_in_encrypted:
        log_message = f"IDs not in million_tbl_encrypted: {ids_not_in_encrypted}"
        print(log_message)  # Print to console (optional)
        log.write(log_message + "\n")  # Write to log file
    else:
        log_message = "All IDs from million_tbl are present in million_tbl_encrypted."
        print(log_message)  # Print to console (optional)
        log.write(log_message + "\n")  # Write to log file


# Close connection
cursor.close()
db_connection.close()
