from playwright.sync_api import Page, expect, sync_playwright
import os

def verify_studio_composer(page: Page):
    # 1. Navigate to the Studio Page with a dummy project ID
    page.goto("http://localhost:8080/studio/test-project-id")

    # 2. Wait for the Workflow Library to be visible
    expect(page.get_by_role("heading", name="Workflow Library")).to_be_visible(timeout=10000)

    # 3. Wait for Execution Panel
    # Use strict selector to avoid ambiguity
    expect(page.get_by_role("heading", name="Execution")).to_be_visible()

    # 4. Take a screenshot of the initial state
    page.screenshot(path="verification/studio_composer_initial.png")

    # 5. Try to find drag items in the sidebar
    # Use button role for the accordion/category toggle
    expect(page.get_by_role("button", name="Image Generation")).to_be_visible()

    # 6. Verify FLUX Pro is visible
    expect(page.get_by_text("FLUX Pro")).to_be_visible()

    # 7. Trigger context menu on canvas
    # canvas is .react-flow__pane
    canvas_pane = page.locator(".react-flow__pane")
    canvas_pane.click(button="right", position={"x": 300, "y": 300})

    # Check if context menu appears
    expect(page.get_by_text("Add Input")).to_be_visible()

    # Take screenshot with context menu
    page.screenshot(path="verification/studio_composer_context_menu.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_studio_composer(page)
            print("Verification script finished successfully.")
        except Exception as e:
            print(f"Verification failed: {e}")
            # Take screenshot on failure
            try:
                page.screenshot(path="verification/failure.png")
            except:
                pass
        finally:
            browser.close()
