import asyncio
import aiohttp
import time
import random
import json


async def make_post_request(session, url, data):
    """
    Makes an asynchronous HTTP POST request to the given URL with the provided data.
    """
    try:
        async with session.post(url, json=data) as response:
            response.raise_for_status()  # Raise an exception for bad status codes
            return await response.text()
    except aiohttp.ClientError as e:
        print(f"Request failed: {e}")
        return None

def generate_form_data():
        """
        Generates random data similar to a form submission.
        """
        first_names = ["Alice", "Bob", "Charlie", "David", "Eve", "Grace", "Harry", "Ivy", "Jack", "Kate"]
        last_names = ["Smith", "Jones", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson"]
        domains = ["example.com", "test.org", "domain.net", "sample.co"]
        random_number = random.randint(1000, 9999)
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        domain = random.choice(domains)
        email = f"{first_name.lower()}{last_name.lower()}{random_number}@{domain}"
        password = f"Password{random_number}"

        return {
            "firstname": first_name,
            "lastname": last_name,
            "email": email,
            "pword": password,
            "cpword": password,
            "submit": 'submit',
        }

async def send_post_requests(url, num_requests, duration_seconds):
    """
    Sends multiple asynchronous POST requests to the specified URL
    within the given duration.
    """
    start_time = time.time()
    successful_requests = 0
    async with aiohttp.ClientSession() as session:
        tasks = []
        while (time.time() - start_time) < duration_seconds:
            data = generate_form_data()
            tasks.append(make_post_request(session, url, data))
            if len(tasks) >= num_requests:
               results = await asyncio.gather(*tasks)
               successful_requests += sum(1 for result in results if result)
               tasks = []
           # Add random delay to ensure we do not overload server
            await asyncio.sleep(random.uniform(0.01, 0.2))

        # Process remaining tasks
        if tasks:
          results = await asyncio.gather(*tasks)
          successful_requests += sum(1 for result in results if result)

    end_time = time.time()
    elapsed_time = end_time - start_time
    requests_per_second = successful_requests / elapsed_time if elapsed_time > 0 else 0


    print(f"Elapsed time: {elapsed_time:.2f} seconds")
    print(f"Successful requests: {successful_requests}")
    print(f"Requests per second: {requests_per_second:.2f}")


async def main():
    target_url = "https://finance.mckodev.com.ng/signup"  # Replace with your target URL
    num_requests_to_try = 200
    duration = 50

    await send_post_requests(target_url, num_requests_to_try, duration)

if __name__ == "__main__":
    asyncio.run(main())