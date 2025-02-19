
import mysql.connector
import time
import sys

def execute_insert_queries(file_path, batch_size=3, delay=1):
    """
    Execute each batch of INSERT queries from a large SQL file directly into a MySQL database
    with a delay between each batch.

    :param file_path: Path to the large SQL file
    :param batch_size: Number of INSERT queries to join together into a single batch (default is 3)
    :param delay: Time delay in seconds between each batch (default is 1 second)
    """
    # MySQL connection settings
    mysql_config = {
        'host': 'localhost',
        'user': '',
        'password': '',
        'database': ''
    }

    # Connect to MySQL database
    connection = mysql.connector.connect(**mysql_config)

    # Check if connection is successful
    if connection.is_connected():
        print("Connected to MySQL database successfully")
    else:
        print("Failed to connect to MySQL database")
        return  # Exit the function if connection fails

    cursor = connection.cursor()

    with open(file_path, 'r') as file:
        batch_insert_queries = []
        query_started = False

        for line in file:
            if not query_started and line.strip().startswith('INSERT'):
                query_started = True

            if query_started:
                batch_insert_queries.append(line)

                if line.strip().endswith(';') and len(batch_insert_queries) % batch_size == 0:
                    batch_query = ''.join(batch_insert_queries)
                    try:
                        #cursor.execute(batch_query)
                        #cursor.execute(batch_query)
                        for result in cursor.execute(batch_query, multi=True):
                            if result.with_rows:
                                result.fetchall()
                        connection.commit()
                        print("Batch executed")
                    except mysql.connector.Error as err:
                        print(f"Error executing batch query: {err}")

                    batch_insert_queries = []

    # If there are remaining queries not executed in a complete batch
    if batch_insert_queries:
        batch_query = ''.join(batch_insert_queries)
        try:
            cursor.execute(batch_query)
            connection.commit()
            print("Final batch executed")
        except mysql.connector.Error as err:
            print(f"Error executing final batch query: {err}")

    cursor.close()
    connection.close()

    print("Finally Done")

# Usage
large_sql_file_path = 'sql-file.sql'
execute_insert_queries(large_sql_file_path, batch_size=3, delay=0.15)  # Adjust the batch size and delay as needed
