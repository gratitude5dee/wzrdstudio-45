
from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_library_models(page: Page):
    try:
        # 1. Navigate to the Studio page (Composer)
        # Use port 8080 for Vite (as per server.log)
        print("Navigating to /studio...")
        page.goto("http://localhost:8080/studio")

        # Wait for the page to load
        time.sleep(5)

        print(f"Current URL: {page.url}")

        # 2. Check for "Library" header
        print("Waiting for Library panel...")
        # Wait for the 'Library' header which confirms the sidebar is loaded
        try:
            page.wait_for_selector("text=Library", timeout=30000)
        except:
            print("Library header not found immediately. Checking for collapsed state or login.")
            if "/login" in page.url:
                print("Redirected to login. Attempting to proceed anyway.")
            else:
                print("Not on login page. Taking screenshot to debug.")
                page.screenshot(path="/home/jules/verification/debug_studio.png")


        # 3. Check for new categories and models
        print("Checking for new models...")

        # We expect these categories and workflows to be present in the WorkflowLibrary sidebar
        expected_texts = [
            "Image Editing",
            "FLUX.1 [redux]",
            "FLUX.1 [fill]",
            "FLUX.1 [canny]",
            "FLUX.1 [depth]",
            "Face Swap",
            "FLUX LoRA",
            "Video Gen",
            "Audio Isolation"
        ]

        found_count = 0
        for text in expected_texts:
            try:
                # Use a flexible locator
                if page.get_by_text(text).first.is_visible():
                    print(f"✅ Found: {text}")
                    found_count += 1
                else:
                    print(f"❓ Text '{text}' not visible.")

            except Exception as e:
                print(f"❌ Error looking for: {text}")

        if found_count == 0:
             print("No expected elements found. Verification likely failed.")
             page.screenshot(path="/home/jules/verification/library_failed.png")
        else:
             print(f"Found {found_count}/{len(expected_texts)} items.")

        # 4. Screenshot
        print("Taking screenshot...")
        page.screenshot(path="/home/jules/verification/library_verification.png", full_page=True)
        print("Screenshot saved.")

    except Exception as e:
        print(f"Verification failed: {e}")
        page.screenshot(path="/home/jules/verification/error_screenshot.png")
        raise e

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_library_models(page)
        except Exception as e:
            print(f"Script failed: {e}")
            import sys
            sys.exit(1)
        finally:
            browser.close()
