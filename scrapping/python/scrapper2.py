from bs4 import BeautifulSoup
import requests
import os

# Load the HTML content
with open('webpage.html', 'r', encoding='utf-8') as file:
    html_content = file.read()

soup = BeautifulSoup(html_content, 'html.parser')

# Base directory to save assets
base_dir = 'webpage_assets'
os.makedirs(base_dir, exist_ok=True)

# Function to download and save a resource
def download_resource(url, local_path):
    response = requests.get(url)
    if response.status_code == 200:
        with open(local_path, 'wb') as file:
            file.write(response.content)

# Find and download all CSS files
for link in soup.find_all('link', {'rel': 'stylesheet'}):
    href = link.get('href')
    if href:
        filename = os.path.basename(href)
        local_path = os.path.join(base_dir, filename)
        download_resource(href, local_path)
        link['href'] = local_path  # Update the link in the HTML to point to the local copy

# Repeat similar processes for JS files, images, etc.
# ...

# Save the modified HTML content
with open('webpage_with_assets.html', 'w', encoding='utf-8') as file:
    file.write(str(soup))
