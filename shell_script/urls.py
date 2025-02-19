import pandas as pd

# Load the CSV file
file_path = './panel_websites_status.csv'
df = pd.read_csv(file_path)

# Filter URLs that do not contain "mckodev.com.ng" or "attendout.com"
filtered_urls = df[~df['input_website_url'].str.contains('mckodev.com.ng|attendout.com|lnk.ng', case=False)]

# Generate SQL INSERT statements for each filtered URL
sql_queries = [
    f"INSERT INTO your_table_name (input_project_url) VALUES ('{url}');"
    for url in filtered_urls['input_website_url']
]

# Combine all SQL statements into a single string, separated by new lines
sql_script = "\n".join(sql_queries)

# Save to a file or print
with open('insert_urls.sql', 'w') as file:
    file.write(sql_script)

print("SQL script generated and saved as 'insert_urls.sql'")
