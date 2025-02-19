from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC



options = Options()
# Initialize the WebDriver
driver = webdriver.Chrome(options=options)


try:
    # Open the website
    driver.get('http://reformers.bellz/volunteer')
    # driver.get('https://reformersofafrica.org/volunteer')

    element = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.NAME, 'email'))
    )
    # Locate the form elements and fill them
    input_element = driver.find_element(By.CSS_SELECTOR, '[name="email"]')
    input_element.send_keys('Value')

    # Submit the form
    # input_element.send_keys(Keys.RETURN)
    submit_button = driver.find_element(By.CSS_SELECTOR, '.g-recaptcha')
    submit_button.click()
except Exception as e:
    print(f"An error occurred: {e}")
finally:
    # Do not close the browser
    pass

input("Press Enter to exit and close the browser...")
