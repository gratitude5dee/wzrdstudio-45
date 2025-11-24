
from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use a large viewport to ensure the sidebar is visible and not collapsed
        page = browser.new_page(viewport={'width': 1280, 'height': 1200})

        try:
            print("Navigating to Studio page...")
            # Increased timeout and changed wait_until to domcontentloaded for faster feedback
            page.goto("http://localhost:8080/studio", timeout=60000, wait_until="domcontentloaded")

            print("Waiting for Library panel...")
            # Wait for the 'Library' header which confirms the sidebar is loaded
            page.wait_for_selector("text=Library", timeout=30000)

            # Take a screenshot of the verified state
            page.screenshot(path="verification/studio_verified.png", full_page=True)
            print("Screenshot saved to verification/studio_verified.png")

            # Verification checks
            # We expect these categories and workflows to be present in the WorkflowLibrary sidebar
            checks = [
                "Image Generation",
                "Video Generation",
                "Audio & Music",
                "3D Assets",
                "Luma Dream Machine", # Video workflow
                "Stable Audio",       # Audio workflow
                "TripoSR"             # 3D workflow
            ]

            all_passed = True
            for text in checks:
                # Check if text is visible in the page
                count = page.get_by_text(text).count()
                if count > 0:
                    print(f"✅ Found: {text}")
                else:
                    print(f"❌ Missing: {text}")
                    all_passed = False

            if all_passed:
                print("VERIFICATION SUCCESS: All expected categories and workflows are present.")
            else:
                print("VERIFICATION FAILED: Some expected elements are missing.")

        except Exception as e:
            print(f"Error during verification: {e}")
            try:
                page.screenshot(path="verification/error_v2.png")
                print("Saved error state screenshot to verification/error_v2.png")
            except:
                pass
        finally:
            browser.close()

if __name__ == "__main__":
    run()
