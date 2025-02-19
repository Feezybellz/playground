import pandas as pd
from whois import whois  # Import specifically the whois function

# Load the CSV file
file_path = './panel_websites_status.csv'
df = pd.read_csv(file_path)

# Filter URLs that do not contain "mckodev.com.ng", "attendout.com", or "lnk.ng"
filtered_urls = df[~df['input_website_url'].str.contains('mckodev.com.ng|attendout.com|lnk.ng', case=False)]

# Function to get the expiration date of a domain
def get_expiration_date(domain):
    try:
        domain_info = whois(domain)  # Use the whois function here
        return domain_info.expiration_date
    except Exception as e:
        print(f"Could not fetch data for {domain}: {e}")
        return None

# List to hold domain names and expiration dates
domain_expiry_data = []

# Perform WHOIS lookup for each filtered URL
for url in filtered_urls['input_website_url']:
    domain_name = url.split('//')[-1].split('/')[0]  # Extract domain from URL
    expiry_date = get_expiration_date(domain_name)
    domain_expiry_data.append({"domain": domain_name, "expiry_date": expiry_date})

# Create a DataFrame with the expiry dates
expiry_df = pd.DataFrame(domain_expiry_data)

# Display the data
print(expiry_df)

# Optionally, save the expiration data to a CSV file
expiry_df.to_csv('domain_expiry_dates.csv', index=False)
print("Domain expiration dates saved to 'domain_expiry_dates.csv'")
