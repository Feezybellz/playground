import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
# import pandas as pd

search_term = input("Please enter the search term: ")
# Initialize ChromeDriver
options = Options()
driver = webdriver.Chrome(options=options)

# Open the target website
driver.get("https://search.cac.gov.ng/")

# JavaScript code to make a POST request using fetch and return the response
js_code = f"""
var callback = arguments[arguments.length - 1];
const url = 'https://searchapp.cac.gov.ng/searchapp/api/public-search/company-business-name-it';
const payload = {{ searchTerm: '{search_term}' }};

fetch(url, {{
    method: 'POST',
    headers: {{ 'Content-Type': 'application/json' }},
    body: JSON.stringify(payload)
}})
.then(response => response.json())
.then(data => {{ callback(data); }})
.catch((error) => {{ callback({{ error: error.toString() }}); }});
"""

# Execute the JavaScript code and get the response
response = driver.execute_async_script(js_code)

# Close the browser
driver.quit()

# Check if the response contains data
if 'data' in response:
    # Convert the data to a pandas DataFrame
    print(response['data'])
    # df = pd.DataFrame(response['data'])
else:
    print("No data found in the response.")

# df
