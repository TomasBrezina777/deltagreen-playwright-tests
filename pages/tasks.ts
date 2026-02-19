import { Page, expect } from "@playwright/test";
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "..", "auth", "auth.env") });

const description = "description123";
const editedDescription =
  "description" + Math.random().toString(36).substring(2, 14);
const editedTitle = "title" + Math.random().toString(36).substring(2, 14);

function getAuthPayload(): string {
  const username = process.env.TEST_USERNAME;
  const password = process.env.TEST_PASSWORD;
  return Buffer.from(`${username}:${password}`).toString("base64");
}

export const createTask = async (page: Page, title: string) => {
  await page.getByRole("link", { name: "New Task" }).click();
  await page.getByRole("textbox", { name: "Title" }).click();
  await page.getByRole("textbox", { name: "Title" }).fill(title);
  await page.getByRole("textbox", { name: "Description" }).click();
  await page.getByRole("textbox", { name: "Description" }).fill(description);
  await page.getByRole("button", { name: "Create" }).click();
  await page.waitForResponse(
    (response) =>
      response.url().includes("tasks/new") && response.status() === 303,
  );
};

export const editTask = async (page: Page, title: string) => {
  await page
    .getByText(title)
    .locator("../..")
    .getByRole("button", { name: "Edit task" })
    .click();
  await page.getByRole("textbox", { name: "Title" }).click();
  await page.getByRole("textbox", { name: "Title" }).fill(editedTitle);
  await page.getByRole("textbox", { name: "Description" }).click();
  await page
    .getByRole("textbox", { name: "Description" })
    .fill(editedDescription);
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.waitForResponse(
    (response) =>
      response.url().includes("task.update") && response.status() === 200,
  );
};

export const deleteTask = async (page: Page, title: string) => {
  await page
    .getByText(title)
    .locator("../..")
    .getByRole("button", { name: "Delete task" })
    .click();
  await page.waitForResponse(
    (response) =>
      response.url().includes("task.delete") && response.status() === 200,
  );
};

export const completeTask = async (page: Page, title: string) => {
  await page
    .getByText(title)
    .locator("../..")
    .getByRole("button", { name: "Mark task as completed" })
    .click();
  await page.waitForResponse(
    (response) =>
      response.url().includes("task.complete") && response.status() === 200,
  );
};

export const assertTaskCreated = async (page: Page, title: string) => {
  await expect(page.getByText(title)).toBeVisible();
  const today = new Date().toLocaleDateString("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const escapedDate = today.replace(/\./g, "\\.");
  await expect(
    page
      .getByText(title)
      .locator("..")
      .getByText(new RegExp(`Created at: ${escapedDate}.*`)),
  ).toBeVisible();
};

export const assertTaskEdited = async (page: Page) => {
  await expect(page.getByText(editedTitle)).toBeVisible();
  await expect(page.getByText(editedDescription)).toBeVisible();
};

export const assertTaskDeleted = async (page: Page) => {
  await expect(page.getByText("task123 description123")).not.toBeVisible();
};

export const assertTaskCompleted = async (page: Page, title: string) => {
  await expect(page.getByText(title)).toBeVisible();
  const today = new Date().toLocaleDateString("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const escapedDate = today.replace(/\./g, "\\.");
  await expect(
    page
      .getByText(title)
      .locator("..")
      .getByText(new RegExp(`Completed at: ${escapedDate}.*`)),
  ).toBeVisible();
};

export function generateTaskTitle(prefix: string = "Task") {
  return `${prefix} ${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export async function createTaskViaAPI(request: any, title: string) {
  const authPayload = getAuthPayload();
  const response = await request.post(
    "https://todos.dev.deltagreen.cz/api/tasks",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authPayload}`,
      },
      data: {
        name: title,
        description: "descriptioncreatedbyapi",
      },
    },
  );
  if (response.status() === 201 || response.status() === 200) {
    console.log("Task created successfully");
  } else {
    console.log(`Unexpected status code: ${response.status()}`);
  }
  const body = await response.json();
  return body.id;
}

export async function editTaskViaAPI(
  request: any,
  taskId: string,
  editedTitle: string,
) {
  const authPayload = getAuthPayload();
  const updateTask = await request.patch(
    `https://todos.dev.deltagreen.cz/api/tasks/${taskId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authPayload}`,
      },
      data: {
        name: editedTitle,
      },
    },
  );
  if (updateTask.status() === 200) {
    console.log("Task updated successfully by id");
    return updateTask;
  }
  if (updateTask.status() !== 404) {
    console.log(`Direct patch returned status ${updateTask.status()}`);
  }
  return;
}

export async function deleteTaskViaAPI(request: any, taskId: string) {
  const authPayload = getAuthPayload();
  const deleteTask = await request.delete(
    `https://todos.dev.deltagreen.cz/api/tasks/${taskId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authPayload}`,
      },
    },
  );
  if (deleteTask.status() === 204) {
    return deleteTask;
  }
  if (deleteTask.status() !== 204) {
    console.log(`Direct patch returned status ${deleteTask.status()}`);
  }
}

export async function completeTaskViaAPI(request: any, taskId: string) {
  const authPayload = getAuthPayload();
  const completeTask = await request.patch(
    `https://todos.dev.deltagreen.cz/api/tasks/${taskId}/complete`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authPayload}`,
      },
      data: {},
    },
  );
  if (completeTask.status() === 200) {
    console.log("Task updated successfully by id");
    return completeTask;
  }
  if (completeTask.status() !== 404) {
    console.log(`Direct patch returned status ${completeTask.status()}`);
  }
  return;
}
