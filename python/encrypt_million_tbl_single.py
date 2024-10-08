
import pymysql
import subprocess
import time as sleeper
from datetime import timedelta, time, date
import sys

# Database connection details
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Pa$$w0rd',
    'db': 'mckodevc_demoM4G',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}

# OpenSSL encryption command
def encrypt_openssl(data, key):
    if not data:
        return None  # Return None if the data is empty or None
    
    process = subprocess.Popen(
        ['openssl', 'enc', '-aes-256-cbc', '-a', '-salt', '-pbkdf2', '-pass', f'pass:{key}'],
        stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE
    )
    encrypted_data, error = process.communicate(input=data.encode('utf-8'))
    
    if process.returncode != 0:
        print(f"OpenSSL encryption failed: {error.decode('utf-8')}")
        return None  # Return None if encryption fails
    
    return encrypted_data.strip()

# Function to create the encrypted table if it doesn't exist
def create_encrypted_table(cursor):
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS million_tbl_encrypted (
            id BIGINT UNSIGNED NOT NULL,
            hash_id CHAR(150) NOT NULL,
            full_name BLOB,
            age_range CHAR(20),
            gender CHAR(6),
            state VARCHAR(150),
            lga VARCHAR(225),
            email BLOB,
            phone_number BLOB,
            pledge_key CHAR(3),
            agent_email VARCHAR(225),
            reg_by_agent INT,
            is_uploaded_with_excel INT,
            is_kobocollect INT,
            certificate_status INT DEFAULT 0,
            amount_of_referrals INT DEFAULT 0,
            visibility CHAR(4) NOT NULL,
            next_of_kin_name BLOB,
            next_of_kin_number BLOB,
            time_created TIME NOT NULL,
            date_created DATE NOT NULL,
            PRIMARY KEY (id)
        );
    """)
    print("Table 'million_tbl_encrypted' created or already exists.")

# Encryption key
encryption_key = 'ENC_KEY'

# Helper function to handle None values and return None directly
def handle_none(value):
    return value if value is not None else None

# Helper function to convert seconds into a proper time format for MySQL (HH:MM:SS)
def handle_timedelta(value):
    if isinstance(value, timedelta):
        total_seconds = int(value.total_seconds())
        hours, remainder = divmod(total_seconds, 3600)
        minutes, seconds = divmod(remainder, 60)
        return time(hours, minutes, seconds).strftime('%H:%M:%S')
    return None

# Helper function to handle date conversion
def handle_date(value):
    return value.isoformat() if isinstance(value, date) else None

# Get the ID of the row to encrypt from the command line arguments
if len(sys.argv) != 2:
    print("Usage: python encrypt_million_tbl.py <id>")
    sys.exit(1)

row_id = sys.argv[1]

# Establishing a database connection
connection = pymysql.connect(**db_config)

try:
    with connection.cursor() as cursor:
        # Create the encrypted table if it doesn't exist
        create_encrypted_table(cursor)

        # Select the specific row with the given ID
        cursor.execute("""
            SELECT id, hash_id, full_name, email, phone_number, next_of_kin_name, next_of_kin_number, 
            age_range, gender, state, lga, pledge_key, agent_email, reg_by_agent, 
            is_uploaded_with_excel, is_kobocollect, certificate_status, 
            amount_of_referrals, visibility, time_created, date_created 
            FROM million_tbl
            WHERE id = %s
        """, (row_id,))
        row = cursor.fetchone()

        if not row:
            print(f"No data found for ID {row_id}")
            sys.exit(1)

        # Encrypt sensitive fields
        encrypted_full_name = encrypt_openssl(row['full_name'], encryption_key)
        encrypted_email = encrypt_openssl(row['email'], encryption_key)
        encrypted_phone_number = encrypt_openssl(row['phone_number'], encryption_key)
        encrypted_next_of_kin_name = encrypt_openssl(row['next_of_kin_name'], encryption_key)
        encrypted_next_of_kin_number = encrypt_openssl(row['next_of_kin_number'], encryption_key)

        time_created = handle_timedelta(row['time_created'])
        date_created = handle_date(row['date_created'])

        print(f"Inserting Row with ID: {row['id']}")
        print(f"Encrypted Full Name: {encrypted_full_name}")
        print(f"Encrypted Email: {encrypted_email}")
        print(f"Encrypted Phone Number: {encrypted_phone_number}")
        print(f"Encrypted Next of Kin Name: {encrypted_next_of_kin_name}")
        print(f"Encrypted Next of Kin Number: {encrypted_next_of_kin_number}")

        try:
            # Prepare the query with placeholders for encrypted data
            query = """
                INSERT INTO million_tbl_encrypted (
                    id, hash_id, full_name, email, phone_number, next_of_kin_name, next_of_kin_number, 
                    age_range, gender, state, lga, visibility, time_created, date_created
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            data_tuple = (
                row['id'], row['hash_id'], 
                encrypted_full_name if encrypted_full_name else None, 
                encrypted_email if encrypted_email else None, 
                encrypted_phone_number if encrypted_phone_number else None, 
                encrypted_next_of_kin_name if encrypted_next_of_kin_name else None, 
                encrypted_next_of_kin_number if encrypted_next_of_kin_number else None, 
                row['age_range'], row['gender'], row['state'], row['lga'], 
                row['visibility'], time_created, date_created
            )
            cursor.execute(query, data_tuple)
            connection.commit()
            print(f"Data for ID {row['id']} successfully inserted into million_tbl_encrypted.")
        
        except pymysql.MySQLError as e:
            print(f"Error while inserting row ID {row['id']}: {e}")

finally:
    connection.close()
