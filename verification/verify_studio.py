
from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the studio page
        # Vite config says port 8080
        try:
            page.goto("http://localhost:8080/studio", timeout=60000)
        except Exception as e:
            print(f"Failed to navigate to studio page: {e}")
            browser.close()
            return

        # Wait for the page to load
        page.wait_for_timeout(5000)

        # Take a screenshot of the initial state
        page.screenshot(path="verification/studio_initial.png")

        # Try to interact with the library
        try:
             # Check if the new categories are present
             if page.get_by_text("Video Generation").is_visible():
                 print("Video Generation category found")
             else:
                 print("Video Generation category NOT found")

             if page.get_by_text("Audio & Music").is_visible():
                 print("Audio & Music category found")
             else:
                 print("Audio & Music category NOT found")
        except Exception as e:
            print(f"Error checking categories: {e}")

        browser.close()

if __name__ == "__main__":
    run()
