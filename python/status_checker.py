import requests
import smtplib
import time
import logging
import mysql.connector
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

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
        cursor.execute("SELECT input_website_url FROM panel_websites_status")
        urls = [row[0] for row in cursor.fetchall()]
        cursor.close()
        conn.close()
        return urls
    except mysql.connector.Error as err:
        logging.error(f"Error: {err}")
        return []

# Function to check website status
def check_website_status(urls, error_log, attempts=3):
    statuses = {}

    for url in urls:
        status = None
        for attempt in range(1, attempts + 3):
            try:
                response = requests.get(url)
                status = response.status_code
                print(response)
                if status == 200:
                    break
            except requests.exceptions.RequestException as e:
                print(e)
                status = f"Error: {e}"
            logging.info(f"URL: {url} - Attempt: {attempt} - Status: {status}")
            time.sleep(2)  # Wait for 2 seconds before next attempt

        # Update statuses dictionary
        statuses[url] = {'status': status, 'attempts': attempt}
        if status != 200:
            error_entry = next((item for item in error_log if item['url'] == url), None)
            if error_entry:
                error_entry['attempts'] = attempt
                error_entry['status'] = status
                error_entry['mail_sent'] = error_entry.get('mail_sent', False)
            else:
                error_log.append({'url': url, 'status': status, 'attempts': attempt, 'mail_sent': False})
                subject = "Website Down Alert"
                body = f"The website {error['url']} is down with status: {status} after {attempt} attempts."
                send_email(subject, body, "belloafeez7@gmail.com")
        else:
            # Remove URL from error_log if it's now accessible
            error_log[:] = [item for item in error_log if item['url'] != url]

    return statuses

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
        # server = smtplib.SMTP('smtp.gmail.com', 465)
        # server.starttls()
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        # server.set_debuglevel(1)  # Enable debug output
        server.login(from_email, password)
        text = msg.as_string()
        server.sendmail(from_email, to_email, text)
        server.quit()
        logging.info(f"Email sent successfully to {to_email} with subject: {subject}")
    except Exception as e:
        logging.error(f"Failed to send email to {to_email} with subject: {subject} - {e}")

# Main function
if __name__ == "__main__":
    # urls = [
    #     "https://mckodev.com.ng",
    #     "https://finance.mckodev.com.ng",
    #     "https://fawazadelaja.com",
    #     "https://notgoinghsdbueru.com"
    # ]

    urls = fetch_urls()  # Fetch URLs from the database
    print(urls);
    # quit(0)

    error_log = []

    while True:
        # urls = fetch_urls()  # Fetch URLs from the database
        statuses = check_website_status(urls, error_log)

        for url, status_info in statuses.items():
            print(f"URL: {url} - Status: {status_info['status']} - Attempts: {status_info['attempts']}")

        # for error in error_log:
        #     if error['attempts'] > 3 and not error['mail_sent']:
        #         subject = "Website Down Alert"
        #         body = f"The website {error['url']} is down with status: {error['status']} after {error['attempts']} attempts."
        #         send_email(subject, body, "belloafeez7@gmail.com")
        #         error['mail_sent'] = True

        time.sleep(60)  # Wait for 1 minute before next check
