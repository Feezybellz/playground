import aiohttp
import asyncio
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging

# Set up logging
logging.basicConfig(
    filename='website_status.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
# Email configuration
SMTP_SERVER = 'smtp.gmail.com'  # Replace with your SMTP server
SMTP_PORT = 587  # Replace with your SMTP port
SENDER_EMAIL = 'belloafeez7@gmail.com'  # Replace with your email
SENDER_PASSWORD = 'jfbcnjbiwxgkrpdl'  # Replace with your email password
RECIPIENT_EMAIL = 'belloafeez7@gmail.com'  # Replace with the recipient email

async def check_website_status(session, url):
    try:
        async with session.get(url, timeout=5) as response:
            return url, response.status
    except Exception as e:
        return url, f"Error: {e}"

async def main(websites, interval, max_concurrent):
    semaphore = asyncio.Semaphore(max_concurrent)
    async with aiohttp.ClientSession() as session:
        while True:
            tasks = []
            for url in websites:
                tasks.append(check_with_semaphore(semaphore, session, url))
            results = await asyncio.gather(*tasks)
            for url, status in results:
                print(f"{url}: {status}")
                # Log the website status
                logging.info(f"{url}: {status}")

                # Check if the website is down (status code is not 200)
                if isinstance(status, int) and status != 200:
                    send_email(url, status)
                    logging.warning(f"Website DOWN: {url} - Status: {status}")
                elif isinstance(status, str) and "Error" in status:
                    send_email(url, status)
                    logging.warning(f"Website ERROR: {url} - Status: {status}")
            print("---- Waiting for next check ----")
            await asyncio.sleep(interval)

async def check_with_semaphore(semaphore, session, url):
    async with semaphore:
        return await check_website_status(session, url)

def send_email(url, status):
    # Create the email content
    subject = f"Website Down Alert: {url}"
    body = f"The website {url} is down. Status: {status}"
    
    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = RECIPIENT_EMAIL
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        # Send the email
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()  # Use TLS for security
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(msg)
            print(f"Email sent: {subject}")
    except Exception as e:
        print(f"Failed to send email: {e}")

if __name__ == "__main__":
    websites = [
        "https://mckodev.com.ngg",
        "https://google.com",
        # Add more websites (over 100) here
    ]
    interval = 5  # Time between checks in seconds
    max_concurrent = 10  # Limit to 10 concurrent requests
    asyncio.run(main(websites, interval, max_concurrent))
