import requests
import smtplib
import time
import logging
import mysql.connector
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from concurrent.futures import ThreadPoolExecutor, as_completed

# Configure logging
logging.basicConfig(filename='website_status.log', level=logging.INFO,
                    format='%(asctime)s:%(levelname)s:%(message)s')

db_config = {
    'user': 'mck',
    'password': 'Mckodev@.02',
    'host': '4.227.162.237',
    'database': 'mckodevc_demoStatusChecker',
}


def fetch_urls():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("SELECT input_website_url FROM panel_websites_status WHERE visibility = 'show'")
        urls = [row[0] for row in cursor.fetchall()]
        cursor.close()
        conn.close()
        return urls
    except mysql.connector.Error as err:
        logging.error(f"Error: {err}")
        return []

# Function to check website status
def check_single_website(url, error_log, attempts=3):
    status = None
    for attempt in range(1, attempts + 1):
        try:
            response = requests.get(url)
            status = response.status_code
            if status == 200:
                break
        except requests.exceptions.RequestException as e:
            status = f"Error: {e}"
        logging.info(f"URL: {url} - Attempt: {attempt} - Status: {status}")
        time.sleep(2)  # Wait for 2 seconds before next attempt

    # Update statuses dictionary
    return url, {'status': status, 'attempts': attempt}

# Function to send email
def send_email(subject, body, to_email):
    from_email = "belloafeez7@gmail.com"
    password = "jfbcnjbiwxgkrpdl"

    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject

    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.login(from_email, password)
        text = msg.as_string()
        server.sendmail(from_email, to_email, text)
        server.quit()
        logging.info(f"Email sent successfully to {to_email} with subject: {subject}")
    except Exception as e:
        logging.error(f"Failed to send email to {to_email} with subject: {subject} - {e}")

# Main function
if __name__ == "__main__":
    urls = fetch_urls()  # Fetch URLs from the database
    print(urls)

    error_log = []

    while True:
        print("Running checks...")  # Indicate that checks are running
        with ThreadPoolExecutor() as executor:
            futures = {executor.submit(check_single_website, url, error_log): url for url in urls}

            for future in as_completed(futures):
                url, status_info = future.result()
                print(f"URL: {url} - Status: {status_info['status']} - Attempts: {status_info['attempts']}")

                # Update error log
                error_entry = next((item for item in error_log if item['url'] == url), None)
                if status_info['status'] != 200:
                    if error_entry:
                        error_entry['attempts'] = status_info['attempts']
                        error_entry['status'] = status_info['status']
                        error_entry['mail_sent'] = error_entry.get('mail_sent', False)
                    else:
                        error_log.append({'url': url, 'status': status_info['status'], 'attempts': status_info['attempts'], 'mail_sent': False})
                        subject = "Website Down Alert"
                        body = f"The website {url} is down with status: {status_info['status']} after {status_info['attempts']} attempts."
                        send_email(subject, body, "belloafeez7@gmail.com")
                else:
                    # Remove URL from error_log if it's now accessible
                    error_log[:] = [item for item in error_log if item['url'] != url]
        print("Sleeping...")  # Indicate that the script is sleeping
        time.sleep(60)  # Wait for 1 minute before next check
