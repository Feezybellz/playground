from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

options = Options()
options.headless = True
driver = webdriver.Chrome(options=options, executable_path='/vagrant/www/scrapping/python/chromedriver')

try:
    driver.get(input("Input URL: "))

    # Wait for a specific element that indicates the page has loaded or JS has executed
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, 'body'))  # Update the locator as needed
    )

    # Extract and print the content of all <style> tags
    style_tags = driver.find_elements(By.TAG_NAME, "style")
    for tag in style_tags:
        print(tag.get_attribute('innerHTML'))

finally:
    driver.quit()
