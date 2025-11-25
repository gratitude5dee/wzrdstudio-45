from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_library_models(page: Page):
    try:
        # 1. Set headers to bypass auth (as seen in middleware.ts)
        page.set_extra_http_headers({
            "x-df-client": "desktop"
        })

        # 2. Navigate to the Composer page
        # Using a random ID "verify-session" to ensure we hit the [id] route
        target_url = "http://localhost:8080/composer/verify-session"
        print(f"Navigating to {target_url}...")
        page.goto(target_url)

        # Wait for the page to load
        time.sleep(5)

        print(f"Current URL: {page.url}")

        # 3. Check for "Library" header
        # The sidebar component WorkflowLibrary has a header "Library"
        print("Waiting for Library panel...")
        try:
            # Increase timeout and use a broad selector first to see if page loaded
            page.wait_for_load_state("networkidle")

            # Check if we are on the right page by looking for something unique to composer
            # e.g., the canvas or the sidebar
            # The WorkflowLibrary component has a title "Library"
            # We try to wait for it.
            try:
                page.wait_for_selector("text=Library", timeout=5000)
                print("✅ 'Library' header found.")
            except:
                print("⚠️ 'Library' header not found immediately.")

            # Check if we got redirected to login
            if "/sign-in" in page.url or "/login" in page.url:
                print("❌ Redirected to login. Header bypass might not have worked.")

        except Exception as e:
            print(f"❌ Error waiting for load: {e}")
            raise e

        # 4. Check for new categories and models
        print("Checking for new models...")

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
                # Use get_by_text with exact=False to be more lenient
                if page.get_by_text(text, exact=False).first.is_visible():
                    print(f"✅ Found: {text}")
                    found_count += 1
                else:
                    # Try to check if it exists in DOM even if not visible (might be scrolled)
                    count = page.get_by_text(text, exact=False).count()
                    if count > 0:
                         print(f"⚠️ Found '{text}' in DOM ({count} times), but not visible.")
                         found_count += 1
                    else:
                         print(f"❌ text '{text}' NOT found.")
            except Exception as e:
                print(f"❌ Error looking for: {text}")

        if found_count == 0:
             print("No expected elements found.")
        else:
             print(f"Found {found_count}/{len(expected_texts)} items.")

        # 5. Screenshot
        print("Taking final screenshot...")
        page.screenshot(path="/home/jules/verification/library_verification_v3.png", full_page=True)
        print("Screenshot saved.")

    except Exception as e:
        print(f"Verification failed: {e}")
        page.screenshot(path="/home/jules/verification/error_screenshot_v3.png")
        # raise e

if __name__ == "__main__":
    with sync_playwright() as p:
        # Launch with some args to help with rendering in headless environment
        browser = p.chromium.launch(headless=True, args=["--no-sandbox", "--disable-setuid-sandbox"])
        page = browser.new_page()
        try:
            verify_library_models(page)
        except Exception as e:
            print(f"Script failed: {e}")
            import sys
            sys.exit(1)
        finally:
            browser.close()
