import { test } from "@playwright/test";
import * as auth from "../../pages/authentication";
import * as tasks from "../../pages/tasks";

let title: string;

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await auth.login(page);
  title = tasks.generateTaskTitle();
});

test("should create a new task successfully", async ({ page }) => {
  await tasks.createTask(page, title);
  await tasks.assertTaskCreated(page, title);
});

test("should edit a task successfully", async ({ page }) => {
  await tasks.createTask(page, title);
  await tasks.editTask(page, title);
  await tasks.assertTaskEdited(page);
});

test("should delete a task successfully", async ({ page }) => {
  await tasks.createTask(page, title);
  await tasks.deleteTask(page, title);
  await tasks.assertTaskDeleted(page);
});

test("should complete task successfully", async ({ page }) => {
  await tasks.createTask(page, title);
  await tasks.completeTask(page, title);
  await tasks.assertTaskCompleted(page, title);
});
