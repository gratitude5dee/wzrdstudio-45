
from playwright.sync_api import sync_playwright

def verify_studio_categories():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            # Navigate to the Studio page
            print("Navigating to Studio page...")
            page.goto("http://localhost:8080/studio")

            # Wait for the page to load
            page.wait_for_load_state("networkidle")

            # Take a screenshot of the initial state
            page.screenshot(path="verification/studio_categories_initial.png")
            print("Took initial screenshot: verification/studio_categories_initial.png")

            # Check for "Video Generation" text
            video_gen_count = page.get_by_text("Video Generation").count()
            if video_gen_count > 0:
                print("SUCCESS: 'Video Generation' category found!")
            else:
                print("FAILURE: 'Video Generation' category NOT found.")

            # Check for "Audio & Music" text
            audio_music_count = page.get_by_text("Audio & Music").count()
            if audio_music_count > 0:
                print("SUCCESS: 'Audio & Music' category found!")
            else:
                print("FAILURE: 'Audio & Music' category NOT found.")

            # Check for "Image Generation" text (sanity check)
            image_gen_count = page.get_by_text("Image Generation").count()
            if image_gen_count > 0:
                print("SUCCESS: 'Image Generation' category found!")
            else:
                print("FAILURE: 'Image Generation' category NOT found.")

            # Try to click on Video Generation tab if it exists to see content
            if video_gen_count > 0:
                print("Clicking on Video Generation category...")
                page.get_by_text("Video Generation").first.click()
                page.wait_for_timeout(1000) # Wait for animation/render
                page.screenshot(path="verification/studio_video_category_selected.png")
                print("Took screenshot after clicking Video Generation: verification/studio_video_category_selected.png")

        except Exception as e:
            print(f"An error occurred: {e}")
            page.screenshot(path="verification/error_state.png")
            print("Took error screenshot: verification/error_state.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_studio_categories()
