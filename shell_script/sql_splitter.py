#1
# import os
#
# def split_sql_file(file_path, output_dir, lines_per_file):
#     """
#     Split a large SQL file into smaller files with a specified number of lines per file.
#
#     :param file_path: Path to the large SQL file
#     :param output_dir: Directory where the split files will be saved
#     :param lines_per_file: Number of lines per split file
#     """
#     if not os.path.exists(output_dir):
#         os.makedirs(output_dir)
#
#     with open(file_path, 'r') as file:
#         file_index = 1
#         lines = []
#
#         for line in file:
#             lines.append(line)
#             if line.strip().startswith('INSERT') and len(lines) >= lines_per_file:
#                 with open(os.path.join(output_dir, f'split_file_{file_index}.sql'), 'w') as split_file:
#                     split_file.writelines(lines)
#                 file_index += 1
#                 lines = []
#
#         # Write remaining lines to the last file
#         if lines:
#             with open(os.path.join(output_dir, f'split_file_{file_index}.sql'), 'w') as split_file:
#                 split_file.writelines(lines)

#2
# import os
#
# def split_sql_file(file_path, output_dir, inserts_per_file):
#     """
#     Split a large SQL file into smaller files with a specified number of INSERT statements per file.
#
#     :param file_path: Path to the large SQL file
#     :param output_dir: Directory where the split files will be saved
#     :param inserts_per_file: Number of INSERT statements per split file
#     """
#     if not os.path.exists(output_dir):
#         os.makedirs(output_dir)
#
#     with open(file_path, 'r') as file:
#         file_index = 1
#         insert_count = 0
#         lines = []
#
#         for line in file:
#             lines.append(line)
#             if line.strip().startswith('INSERT'):
#                 insert_count += 1
#
#             if insert_count >= inserts_per_file:
#                 with open(os.path.join(output_dir, f'split_file_{file_index}.sql'), 'w') as split_file:
#                     split_file.writelines(lines)
#                 file_index += 1
#                 insert_count = 0
#                 lines = []
#
#         # Write remaining lines to the last file
#         if lines:
#             with open(os.path.join(output_dir, f'split_file_{file_index}.sql'), 'w') as split_file:
#                 split_file.writelines(lines)


#3
# import os
#
# def split_sql_file(file_path, output_dir, inserts_per_file):
#     """
#     Split a large SQL file into smaller files with a specified number of INSERT statements per file.
#
#     :param file_path: Path to the large SQL file
#     :param output_dir: Directory where the split files will be saved
#     :param inserts_per_file: Number of INSERT statements per split file
#     """
#     if not os.path.exists(output_dir):
#         os.makedirs(output_dir)
#
#     with open(file_path, 'r') as file:
#         file_index = 1
#         insert_count = 0
#         lines = []
#         batch_lines = []
#
#         for line in file:
#             if line.strip().startswith('INSERT'):
#                 insert_count += 1
#                 if insert_count > inserts_per_file:
#                     with open(os.path.join(output_dir, f'split_file_{file_index}.sql'), 'w') as split_file:
#                         split_file.writelines(lines)
#                     file_index += 1
#                     insert_count = 1
#                     lines = batch_lines.copy()
#                     batch_lines = []
#
#             lines.append(line)
#             if line.strip().startswith('INSERT'):
#                 batch_lines = [line]
#             else:
#                 batch_lines.append(line)
#
#         # Write remaining lines to the last file
#         if lines:
#             with open(os.path.join(output_dir, f'split_file_{file_index}.sql'), 'w') as split_file:
#                 split_file.writelines(lines)


#4  Split By insert query
import os

def split_sql_file(file_path, output_dir):
    """
    Split a large SQL file into smaller files, each containing one INSERT query.

    :param file_path: Path to the large SQL file
    :param output_dir: Directory where the split files will be saved
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    with open(file_path, 'r') as file:
        insert_queries = []
        query_started = False
        query_ended = False

        for line in file:
            if not query_started and line.strip().startswith('INSERT'):
                query_started = True
            if query_started:
                insert_queries.append(line)
                if line.strip().endswith(';'):
                    query_ended = True

            if query_ended:
                # Write the INSERT query to a new file
                with open(os.path.join(output_dir, f'insert_query_{len(insert_queries)}.sql'), 'w') as split_file:
                    split_file.writelines(insert_queries)
                # Reset variables for the next INSERT query
                insert_queries = []
                query_started = False
                query_ended = False

# Usage
large_sql_file_path = 'million_tbl Feb 24 2024.sql'
output_directory = 'm4g3'
lines_per_split_file = 100  # Adjust based on your needs

# split_sql_file(large_sql_file_path, output_directory, lines_per_split_file)
split_sql_file(large_sql_file_path, output_directory)
