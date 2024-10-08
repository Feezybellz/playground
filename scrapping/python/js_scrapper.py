import os
import requests
import hashlib
from urllib.parse import urlparse, urljoin
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

def is_valid_url(url):
    return url and not url.startswith(('#', 'javascript:', 'mailto:', 'tel:'))

def download_file(url, base_directory):
    parsed_url = urlparse(url)
    path = parsed_url.netloc + parsed_url.path
    directory = os.path.join(base_directory, os.path.dirname(path))
    os.makedirs(directory, exist_ok=True)
    local_filename = os.path.join(directory, os.path.basename(path))

    if not os.path.exists(local_filename):
        try:
            with requests.get(url, stream=True) as r:
                r.raise_for_status()
                with open(local_filename, 'wb') as f:
                    for chunk in r.iter_content(chunk_size=8192):
                        f.write(chunk)
        except Exception as e:
            print(f"Failed to download {url}: {e}")
            return None
    return local_filename

def update_src_in_html(soup, tag_name, src_attr, base_directory, base_url):
    tags = soup.find_all(tag_name)
    for tag in tags:
        src = tag.get(src_attr)
        if src and is_valid_url(src):
            abs_url = urljoin(base_url, src)
            new_path = download_file(abs_url, base_directory)
            if new_path:
                tag[src_attr] = os.path.relpath(new_path, base_directory)

def sanitize_filename(url):
    url_hash = hashlib.md5(url.encode('utf-8')).hexdigest()
    # url_hash = url
    return f"{url_hash}.html"

def process_page(url, output_folder, resources_dir):
    try:
        driver.get(url)
        content = driver.page_source
        soup = BeautifulSoup(content, 'html.parser')
        filename = sanitize_filename(url)
        update_src_in_html(soup, 'link', 'href', resources_dir, url)
        update_src_in_html(soup, 'script', 'src', resources_dir, url)
        update_src_in_html(soup, 'img', 'src', resources_dir, url)
        with open(os.path.join(output_folder, filename), 'w', encoding='utf-8') as file:
            file.write(soup.prettify())
    except Exception as e:
        print(f"Failed to process {url}: {e}")

# Setup WebDriver options
options = Options()
options.headless = True
options.add_argument("--window-size=1920,1200")
driver = webdriver.Chrome(options=options, executable_path='/vagrant/www/scrapping/python/chromedriver')

try:
    base_url = input("Input URL: ")
    output_folder = input("Output folder: ")
    # resources_dir = os.path.join(output_folder, 'resources')
    resources_dir = os.path.join(output_folder, '')
    os.makedirs(resources_dir, exist_ok=True)
    driver.get(base_url)
    process_page(base_url, output_folder, resources_dir)
    base_content = driver.page_source
    base_soup = BeautifulSoup(base_content, 'html.parser')
    for link in base_soup.find_all('a', href=is_valid_url):
        href = link.get('href')
        full_url = urljoin(base_url, href)
        if urlparse(full_url).netloc == urlparse(base_url).netloc:
            process_page(full_url, output_folder, resources_dir)
finally:
    driver.quit()
