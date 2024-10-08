
import os
import pymysql
import csv

# Database connection details
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Pa$$w0rd',
    'db': 'db_name',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}

# Folder to store exported files
export_folder = '/var/exported_db'  # Replace with your target folder path

# Batch size for chunking
batch_size = 10000

# Ensure the export folder exists
if not os.path.exists(export_folder):
    os.makedirs(export_folder)

# Function to export records in chunks
def export_records_in_chunks(cursor, batch_size, export_folder):
    offset = 0
    batch_number = 1
    
    while True:
        # Fetch a batch of records
        cursor.execute(f"""
            SELECT * FROM million_tbl_encrypted
            LIMIT {batch_size} OFFSET {offset}
        """)
        rows = cursor.fetchall()

        if not rows:
            # Stop when no more rows are fetched
            break

        # Create a filename for the current batch
        export_file = os.path.join(export_folder, f'encrypted_records_batch_{batch_number}.csv')

        # Write the batch to a CSV file
        with open(export_file, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=rows[0].keys())
            writer.writeheader()
            writer.writerows(rows)
        
        print(f"Batch {batch_number} exported to {export_file}")
        
        # Move to the next batch
        offset += batch_size
        batch_number += 1

# Establishing a database connection
connection = pymysql.connect(**db_config)

try:
    with connection.cursor() as cursor:
        # Export records in chunks
        export_records_in_chunks(cursor, batch_size, export_folder)
        print("All records have been exported.")
finally:
    connection.close()