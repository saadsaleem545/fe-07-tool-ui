import { test, expect } from "@playwright/test";

test("primary Generate flow works", async ({ page }) => {
  await page.goto("/");

  const button = page.getByRole("button", {
    name: "Generate",
  });

  await expect(button).toBeVisible();

  await button.click();

  await expect(
    page.getByRole("button", {
      name: "Generating...",
    })
  ).toBeDisabled();

  await expect(page.getByText("success").or(page.getByText("error"))).toBeVisible({
    timeout: 6000,
  });
});