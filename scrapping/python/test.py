# import requests
# standings_url = "https://fbref.com/en/comps/9/Premier-League-Stats"
# data = requests.get(standings_url)
# from bs4 import BeautifulSoup
# soup = BeautifulSoup(data.text, 'html.parser')
#
# standings_table = soup.select('table.stats_table')[0]
# standings_table
#
#
# # Convert the table to a string
# table_html = str(standings_table)
#
# # Specify the filename
# filename = "premier_league_standings.html"
#
# # Open a file in write mode
# with open(filename, 'w') as file:
#     # Write the table HTML to the file
#     file.write(table_html)
#
# print(f"Table saved to {filename}")

import requests
from bs4 import BeautifulSoup

# URL of the Premier League Stats page
standings_url = "https://fbref.com/en/comps/9/Premier-League-Stats"

# Send a GET request to the URL
data = requests.get(standings_url)

# Parse the HTML content of the page
soup = BeautifulSoup(data.text, 'html.parser')

# Select the table by its unique ID
standings_table = soup.find('table', {'id': 'results2023-202491_overall'})

# Convert the table to a string
table_html = str(standings_table)

# Specify the filename
filename = "premier_league_standings.html"

# Open a file in write mode
with open(filename, 'w') as file:
    # Write the table HTML to the file
    file.write(table_html)

print(f"Table saved to {filename}")
