import os

def split_large_sql(file_path, chunk_size, output_dir):
    """
    Splits a large SQL file with multiple INSERT statements into smaller chunks.
    Ensures each chunk starts with a valid INSERT INTO statement if it's a continuation and ends with a semicolon (;).

    :param file_path: Path to the large SQL file.
    :param chunk_size: Maximum size (in bytes) for each chunk.
    :param output_dir: Directory to save the chunked files.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    try:
        with open(file_path, 'r', encoding='utf-8') as sql_file:
            chunk_data = ""
            current_chunk_size = 0
            chunk_index = 1
            parent_query = ""
            is_continuing_insert = False  # Tracks if the chunk is continuing an INSERT INTO

            for line in sql_file:
                # Detect new INSERT INTO statements
                if line.strip().upper().startswith("INSERT INTO"):
                    parent_query = line.strip()
                    is_continuing_insert = False

                # If chunk exceeds size
                if current_chunk_size >= chunk_size:
                    # Ensure the chunk ends with a semicolon if it ends with a comma
                    if chunk_data.strip().endswith(","):
                        chunk_data = chunk_data.strip()[:-1] + ";"

                    # Write the chunk to a file
                    chunk_file_path = os.path.join(output_dir, f'chunk_{chunk_index}.sql')
                    with open(chunk_file_path, 'w', encoding='utf-8') as chunk_file:
                        chunk_file.write(chunk_data)
                    print(f"Created chunk: {chunk_file_path}")

                    # Reset for the next chunk
                    chunk_data = ""
                    current_chunk_size = 0
                    chunk_index += 1
                    is_continuing_insert = True

                # If starting a new chunk mid-INSERT, prepend the parent query
                if is_continuing_insert and not line.strip().upper().startswith("INSERT INTO"):
                    if not chunk_data.strip():
                        chunk_data += parent_query + "\n"  # Add the parent query to the new chunk
                        current_chunk_size += len(parent_query) + 1

                # Add the current line to the chunk
                chunk_data += line
                current_chunk_size += len(line)

            # Write any remaining data to the last chunk
            if chunk_data.strip():
                # Ensure the last chunk ends with a semicolon if it ends with a comma
                if chunk_data.strip().endswith(","):
                    chunk_data = chunk_data.strip()[:-1] + ";"

                chunk_file_path = os.path.join(output_dir, f'chunk_{chunk_index}.sql')
                with open(chunk_file_path, 'w', encoding='utf-8') as chunk_file:
                    chunk_file.write(chunk_data)
                print(f"Created chunk: {chunk_file_path}")

    except Exception as e:
        print(f"An error occurred: {e}")


# Usage
large_sql_file = "main.sql"
chunk_size_in_bytes = 1 * 1024 * 1024  # 1 MB chunks
output_directory = "./output"

split_large_sql(large_sql_file, chunk_size_in_bytes, output_directory)
