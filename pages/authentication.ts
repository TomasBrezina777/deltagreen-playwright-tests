import { Page, expect } from "@playwright/test";
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "..", "auth", "auth.env") });

const generatedUsername =
  "tester123" + Math.random().toString(36).substring(2, 14);
const generatedPassword =
  "Password123" + Math.random().toString(36).substring(2, 14);
const username = process.env.TEST_USERNAME || "";
const password = process.env.TEST_PASSWORD || "";

export const register = async (page: Page) => {
  await page
    .getByRole("link", { name: "No account? Create one here." })
    .click();
  await page.getByRole("textbox", { name: "Username" }).click();
  await page.getByRole("textbox", { name: "Username" }).fill(generatedUsername);
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill(generatedPassword);
  await page.getByRole("button", { name: "Sign up" }).click();
};

export const login = async (page: Page) => {
  await page.getByRole("textbox", { name: "Username" }).click();
  await page.getByRole("textbox", { name: "Username" }).fill(username);
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Login" }).click();
};
export const logout = async (page: Page) => {
  await page.getByRole("button", { name: "Logout" }).click();
};
export const assertDashboardPage = async (page: Page) => {
  await expect(page.getByText("Your Todo list")).toBeVisible();
};
export const assertLoginPage = async (page: Page) => {
  await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
};
